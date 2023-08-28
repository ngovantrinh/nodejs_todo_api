var createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(cors());

const pathConfig = require("./path");
global.__base = __dirname + "/";
global.__path_app = __base + pathConfig.folder_app + "/";

global.__path_schemas = __path_app + pathConfig.folder_schemas + "/";
global.__path_models = __path_app + pathConfig.folder_models + "/";
global.__path_routers = __path_app + pathConfig.folder_routers + "/";
global.__path_configs = __path_app + pathConfig.folder_configs + "/";

const systemConfig = require(__path_configs + "system");
const databaseConfig = require(__path_configs + "database");

// local validates
app.locals.systemConfig = systemConfig;
// mongodb+srv://vantrinh:<password>@cluster0.i1qqmit.mongodb.net/?retryWrites=true&w=majority
mongoose
  .connect(
    `mongodb+srv://${databaseConfig.usename}:${databaseConfig.password}@cluster0.i1qqmit.mongodb.net/${databaseConfig.database}?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log("Error connecting to database");
  });

// setup router
app.use("/api/v1", require(__path_routers));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// err handler
app.use(function (err, req, res, next) {
  // next(createError(404))

  //set local, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  //render the error page
  res.status(err.status || 500);
  res.end("Error App");
});

module.exports = app;
