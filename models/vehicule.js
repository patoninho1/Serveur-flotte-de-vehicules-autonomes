'use strict';
var mongoose   = require('mongoose')
  , ObjectId   = mongoose.Schema.Types.ObjectId;

var schema = mongoose.Schema({
    id: Number, 
	loc: {
		lat: Number, 
		lng: Number
	},
	dest: {
		lat: Number, 
		lng: Number
	}
});

module.exports = mongoose.model('Vehicule', schema);



