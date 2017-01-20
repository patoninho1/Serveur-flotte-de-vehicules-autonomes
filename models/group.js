'use strict';
var mongoose   = require('mongoose')
  , ObjectId   = mongoose.Schema.Types.ObjectId;

var schema = mongoose.Schema({
	owner: ObjectId,
	member: Array
});

module.exports = mongoose.model('Group', schema);
