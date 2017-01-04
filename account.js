var distance = require('google-distance');
distance.apiKey = 'AIzaSyCQcbdCHq1yqWbrTymrJXL9AJyFxKuowa0';

var method = account.prototype;

//Methode for manage account
var maxUser = 5;
var ListOfUser = [];

function account() {
	ListOfUser = [];
}

method.addUser = function(username,passw) {
	if (ListOfUser.length<maxUser){
		ListOfUser.push({user: username,pass: passw,ip: 'ip',isConnected: false,vehicule: [],last_v_id: 0,group: [],last_g_id:0});
		return true;
	}else{
		return false;
	}	
};

method.isConnected = function(ip) {
	for (i = 0; i < ListOfUser.length; i++) {	
		if(ListOfUser[i].ip == ip ){
			 return ListOfUser[i].isConnected;
		}
	}	
    return false;
};

method.connect = function(params,ip) {
	if ('user' in params && 'pass' in params) {
		for (i = 0; i < ListOfUser.length; i++) {	
			if(ListOfUser[i].user == params['user'] &&  ListOfUser[i].pass == params['pass']){
				ListOfUser[i].isConnected = true;
				ListOfUser[i].ip = ip;
				return ListOfUser[i].isConnected;
			}
		}	
	}
    return false;
};


method.disconnect = function() {
	for (i = 0; i < ListOfUser.length; i++) {	
		if(ListOfUser[i].ip == ip ){
			ListOfUser[i].isConnected = false;			
			return;
		}
	}	
};


function getCurrentUserID() {
	for (i = 0; i < ListOfUser.length; i++) {	
		if(ListOfUser[i].isConnected){					
			return i;
		}
	}	
}



//Methode for manage Vehicules
var maxVehicule = 15;
var vehiculeSpeed = 100;

//Function that return a unused V ID
function getFreeVID(user){	
	ListOfUser[user].last_v_id += 1;
	return ListOfUser[user].last_v_id - 1;
}

//Function that build a new V
method.addVehicule = function(spawn) {	
	var user = getCurrentUserID();
	
	if (ListOfUser[user].vehicule.length < maxVehicule) {
		var newId = getFreeVID(user);
		var rayonOfSpawn = 2.0;
		var newlat = spawn.lat + rayonOfSpawn * Math.cos( (2 * Math.PI/180) * newId*12);
		var newlng = spawn.lng + rayonOfSpawn * Math.sin( (2 * Math.PI/180) * newId*12);	
					
		var dd = { index: newId,
			distance: '1 m',
			distanceValue: 0,
			duration: '1 min',
			durationValue: 0,
			origin: {lat: newlat, lng: newlng},
			destination: {lat: newlat, lng: newlng},
			mode: 'driving',
			units: 'metric',
			language: 'en',
			avoid: null,
			sensor: false };
					
		ListOfUser[user].vehicule.push({id: newId, loc: {lat: newlat, lng: newlng}, dest: {lat: newlat, lng: newlng}, distanceData: dd});			
		return true;
	}
		
	return false;				
}

//Function that return the V array
method.getVehiculeData = function() {	
	var user = getCurrentUserID();
	return ListOfUser[user].vehicule;
}


//Function that return a vehicule index coorespond to is ID 
function getVehiculeById(id,user){
	for (i = 0; i < ListOfUser[user].vehicule.length; i++) {	
		if (ListOfUser[user].vehicule[i].id == id){
			return i;
		}
	}
	return -1;
}

//Function that change the destination of a V
method.changeVehiculeDest = function(params) {	
	var user = getCurrentUserID();
	
	if ('id' in params && 'lat' in params && 'lng' in params) {	
		var index  = getVehiculeById(params['id'],user);							
		if (index  > -1){
			ListOfUser[user].vehicule[index].dest.lat = parseFloat(params['lat']);	
			ListOfUser[user].vehicule[index].dest.lng = parseFloat(params['lng']);									
			return true;			
		}	
	}			
	return false;
}

//Function that delete a V
method.deletVehicule = function(params) {
	var user = getCurrentUserID();

	if ('id' in params) {							
		var index  = getVehiculeById(params['id'],user);			
		if (index  > -1){
			ListOfUser[user].vehicule.splice(index , 1);
			return true;
		}					
	}
	
	return false;
}	



//Methode for manage Groups

//Function that return a unused G ID
function getFreeGID(user){	
	ListOfUser[user].last_g_id += 1;
	return ListOfUser[user].last_g_id - 1;
}

//Function that build a new G
method.addGroup = function() {
	var user = getCurrentUserID();
	
	if (ListOfUser[user].group.length < ListOfUser[user].vehicule.length) {
		var newId = getFreeGID(user);
		ListOfUser[user].group.push({id: newId, memberID: []});		
		return true;		
	} 
	return false;
}

//Function that return the G array
method.getGroupData = function() {	
	var user = getCurrentUserID();
	return ListOfUser[user].group;
}

//Function that return a group index coorespond to is ID 
function getGroupById(id,user){
	for (i = 0; i < ListOfUser[user].group.length; i++) {	
		if (ListOfUser[user].group[i].id == id){
			return i;
		}
	}
	return -1;
}


//Function that change the destination of a G
method.changeGroupDest = function(params) {	
	var user = getCurrentUserID();
	
	if ('id' in params && 'lat' in params && 'lng' in params) {	
		var index = getGroupById(params['id'],user);							
		if (index  > -1){			
			for (i = 0; i < ListOfUser[user].group[index].memberID.length; i++) {
				var indexV = getVehiculeById(i,user);
				if (indexV  > -1){
					ListOfUser[user].vehicule[indexV].dest.lat = parseFloat(params['lat']);
					ListOfUser[user].vehicule[indexV].dest.lng = parseFloat(params['lng']);	
				}
			}							
			return true;			
		}	
	}			
	return false;
}


//Function that add a vehicule to a group
method.addToGroup = function(params) {	
	var user = getCurrentUserID();
	
	if ('gid' in params && 'vid' in params) {	
		var indexG = getGroupById(params['gid'],user);
		var indexV = getVehiculeById(params['vid'],user);
		if (indexG > -1 && indexV > -1){
			ListOfUser[user].group[indexG].vehicule.push(vid);
			return true				
		}
	}
	
	return false;
}

//Function that remove a vehicule of a group
method.rmToGroup = function(params) {	
	var user = getCurrentUserID();	
	
	if ('gid' in params && 'vid' in params) {	
		var indexG = getGroupById(params['gid'],user);
		var indexV = getVehiculeById(params['vid'],user);
		if (indexG > -1 && indexV > -1){
			ListOfUser[user].group[indexG].vehicule.splice(indexV , 1);
			return true;
		}					
	}
	
	return false;
}


//Function that delete a V
method.deletGroup = function(params) {	
	var user = getCurrentUserID();
	
	if ('id' in params) {	
		var index = getGroupById(params['id'],user);	
		if (index  > -1){
			ListOfUser[user].group.splice(index , 1);	
			return true;			
		}
	}

	return false;
}




//This manage to make all the vehicule of the "world" to move to they destination over the time and depending of them speed
var lastdistdata = ''
method.UpdateAllPosition = function(params) {	

	for (user = 0; user < ListOfUser.length; user++) {
		for (i = 0; i < ListOfUser[user].vehicule.length; i++) {	
			
			//Update Google distance Data
			var id = ListOfUser[user].vehicule[i].id;
			var ori = ListOfUser[user].vehicule[i].loc.lat+','+ListOfUser[user].vehicule[i].loc.lng;
			var dest = ListOfUser[user].vehicule[i].dest.lat+','+ListOfUser[user].vehicule[i].dest.lng;
			
			distance.get({
				index: id,
				origin: ori,
				destination: dest
			},function(err, data) {			  
				if (err) return console.log(err);			
					lastdistdata = data;	
				});			
				
			if (lastdistdata.index == ListOfUser[user].vehicule[i].id){
				ListOfUser[user].vehicule[i].distanceData = lastdistdata;
				//console.log(lastdistdata.destination)
			}	
			
			//Move the vehicule depending of is speed
			var pas = vehiculeSpeed/10000;
			
			if (ListOfUser[user].vehicule[i].loc != ListOfUser[user].vehicule[i].dest){				
				//Lat
				if (ListOfUser[user].vehicule[i].loc.lat < ListOfUser[user].vehicule[i].dest.lat){
					ListOfUser[user].vehicule[i].loc.lat = ListOfUser[user].vehicule[i].loc.lat + pas;
				}else if (ListOfUser[user].vehicule[i].loc.lat > ListOfUser[user].vehicule[i].dest.lat){
					ListOfUser[user].vehicule[i].loc.lat = ListOfUser[user].vehicule[i].loc.lat - pas;
				}else{
					ListOfUser[user].vehicule[i].loc.lat = ListOfUser[user].vehicule[i].dest.lat;
				}				
				//Lng
				if (ListOfUser[user].vehicule[i].loc.lng < ListOfUser[user].vehicule[i].dest.lng){
					ListOfUser[user].vehicule[i].loc.lng = ListOfUser[user].vehicule[i].loc.lng + pas;
				}else if (ListOfUser[user].vehicule[i].loc.lng > ListOfUser[user].vehicule[i].dest.lng){
					ListOfUser[user].vehicule[i].loc.lng = ListOfUser[user].vehicule[i].loc.lng - pas;
				}else{
					ListOfUser[user].vehicule[i].loc.lng = ListOfUser[user].vehicule[i].dest.lng;
				}
			}	
			
		}
	}
	
}








module.exports = account;