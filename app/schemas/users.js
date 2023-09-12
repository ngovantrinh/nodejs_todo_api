const mongoose = require("mongoose");
const databaseConfig = require(__path_configs + "database");

var schema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { collection: databaseConfig.col_user }
);

module.exports = mongoose.model(databaseConfig.col_user, schema);
