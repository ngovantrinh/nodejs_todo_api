var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Users = require(__path_schemas + "users");

const controllerName = "users";
const MainModel = require(__path_models + controllerName);

router.post("/change-password", async (req, res, next) => {
  try {
    const { token, newPassword: plainTextPassword } = req.body;
    if (!plainTextPassword || typeof plainTextPassword !== "string") {
      return res.status(404).json({
        success: false,
        message: "Invalid password",
      });
    }

    if (plainTextPassword.length < 5) {
      return res.status(404).json({
        success: false,
        message: "Password too small, Should be atleast 6 characters",
      });
    }
    const user = jwt.verify(token, process.env.JWT_SECRET);

    const _id = user.id;

    const password = await bcrypt.hash(plainTextPassword, 10);

    await Users.updateOne({ _id }, { $set: { password } });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "error",
    });
  }
});

router.post("/register", async (req, res, next) => {
  // res.send('Get all  items')

  const { username, password: plainTextPassword } = req.body;

  if (!username || typeof username !== "string") {
    return res.status(404).json({
      success: false,
      message: "Invalid username",
    });
  }

  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.status(404).json({
      success: false,
      message: "Invalid password",
    });
  }

  if (plainTextPassword.length < 5) {
    return res.status(404).json({
      success: false,
      message: "Password too small, Should be atleast 6 characters",
    });
  }

  const password = await bcrypt.hash(plainTextPassword, 10);
  try {
    const response = await MainModel.create({ username, password });
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    if ((error.code = 11000)) {
      return res.status(400).json({
        success: false,
        message: "Username already in use",
      });
    }
    throw error;
  }
});

router.post("/login", async (req, res, next) => {
  // res.send('Get all  items')

  try {
    const { username, password } = req.body;

    const user = await Users.findOne({ username });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User doesn't exist",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    return res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

module.exports = router;
