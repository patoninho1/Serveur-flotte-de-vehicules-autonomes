'use strict';
var mongoose   = require('mongoose')
  , ObjectId   = mongoose.Schema.Types.ObjectId;

var schema = mongoose.Schema({
    username: String, 
    password: String,
});

module.exports = mongoose.model('User', schema);

