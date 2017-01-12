'use strict';
var mongoose   = require('mongoose')
  , ObjectId   = mongoose.Schema.Types.ObjectId;

var schema = mongoose.Schema({
	owner: String,
	location: {
		lat: Number, 
		lng: Number
	},
	destination: {
		lat: Number, 
		lng: Number
	},
	distance: Number,
	busy: Boolean
});

module.exports = mongoose.model('Vehicule', schema);



