const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({
 id: String,
 name: String,
 status: String
})

module.exports = mongoose.model(databaseConfig.col_items, schema);