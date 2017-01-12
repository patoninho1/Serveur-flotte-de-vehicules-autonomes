var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('user', new Schema({
	
    username: String, 
    password: String, 
    /*admin: Boolean,*/
	vehicule: [{
		id: Number, 
		loc: {
			lat: Number, 
			lng: Number
		},
		dest: {
			lat: Number, 
			lng: Number
		}
		/*distanceData: dd*/
	}],
	last_v_id: Number,
	group: [{
		id: Number, 
		memberID: []
	}],
	last_g_id: Number	
	
}));