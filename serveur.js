var http = require('http');
var url = require('url');
var querystring = require('querystring');
var chai = require('chai');
var distance = require('google-distance');
distance.apiKey = 'AIzaSyCQcbdCHq1yqWbrTymrJXL9AJyFxKuowa0';


var account = require("./login.js");
var bob = new account("bob","mdpbob");

var franceLoc = {lat: 46.8516177, lng: 1.2393998};
var home = {lat: 48.8142251, lng: 2.3950068};

var maxVehicule = 15;
var vehiculeSpeed = 100;
var vehiculeArray = [];
var groupArray = [];

function travel_to(params){
	if ('user' in params && 'pass' in params) {
		
		distance.get(
		  {
			origin: 'San Francisco, CA',
			destination: 'San Diego, CA'
		  },
		  function(err, data) {
			if (err) return console.log(err);
			console.log(data);
		});
		
	}
}


//Function that return a unused ID
var last_id = 0;
function getFreeID(){	
	last_id+=1;
	return (last_id-1);
}

//Function that return a vehicule index coorespond to is ID 
function getVehiculeById(id){
	for (i = 0; i < vehiculeArray.length; i++) {	
		if (vehiculeArray[i].id == id){
			return i;
		}
	}
	return -1;
}


//Move Timer, this manage the travel of all the vehicule and actualise they position every second
var lastdistdata = ''
setInterval(function(){	

	for (i = 0; i < vehiculeArray.length; i++) {
	
		//Update Google distance Data
		var id = vehiculeArray[i].id;
		var ori = vehiculeArray[i].loc.lat+','+vehiculeArray[i].loc.lng;
		var dest = vehiculeArray[i].dest.lat+','+vehiculeArray[i].dest.lng;
		
		distance.get({
			index: id,
			origin: ori,
			destination: dest
		},function(err, data) {			  
			if (err) return console.log(err);			
				lastdistdata = data;	
			});			
			
		if (lastdistdata.index == vehiculeArray[i].id){
			vehiculeArray[i].distanceData = lastdistdata;
			//console.log(lastdistdata.destination)
		}	
		
		//Move the vehicule depending of is speed
		var pas = vehiculeSpeed/10000;
		
		//Lat
		if (vehiculeArray[i].loc.lat < vehiculeArray[i].dest.lat){
			vehiculeArray[i].loc.lat = vehiculeArray[i].loc.lat + pas;
		}else if (vehiculeArray[i].loc.lat > vehiculeArray[i].dest.lat){
			vehiculeArray[i].loc.lat = vehiculeArray[i].loc.lat - pas;
		}else{
			vehiculeArray[i].loc.lat = vehiculeArray[i].dest.lat;
		}
		
		//Lng
		if (vehiculeArray[i].loc.lng < vehiculeArray[i].dest.lng){
			vehiculeArray[i].loc.lng = vehiculeArray[i].loc.lng + pas;
		}else if (vehiculeArray[i].loc.lng > vehiculeArray[i].dest.lng){
			vehiculeArray[i].loc.lng = vehiculeArray[i].loc.lng - pas;
		}else{
			vehiculeArray[i].loc.lng = vehiculeArray[i].dest.lng;
		}
		
		
	}  	
}, 1000); 


//Main function that handel the client request
var server = http.createServer(function(req, res) {
	
	//Get and parse client data (page, argument, IP)
	var params = querystring.parse(url.parse(req.url).query);
	var page = url.parse(req.url).pathname;
	var ip = req.connection.remoteAddress;
		
	console.log(ip + " ask for page :" + page);	
	
	//Needed for accept request from localhost
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype');
	res.setHeader('Access-Control-Allow-Credentials', true);
	  
	//Specifie that the server answer will be a JSON
	res.writeHead(200, {"Content-Type": "application/json"});  
		
	//Prepare the futur data to be send
	var data;	
	
		//CRUD Create Read Update Delete
		switch(page){

			//Disconnect
			case "/disconnect":	
			
			break;
			
			//Create Vehicule
			case "/newVehicule":				
				if (vehiculeArray.length < maxVehicule) {
					var newId = getFreeID();
					var rayonOfSpawn = 2.0;
					var newlat = home.lat + rayonOfSpawn * Math.cos( (2 * Math.PI/180) * newId*12);
					var newlng = home.lng + rayonOfSpawn * Math.sin( (2 * Math.PI/180) * newId*12);	
					
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
					
					vehiculeArray.push({id: newId, loc: {lat: newlat, lng: newlng}, dest: {lat: newlat, lng: newlng}, distanceData: dd});	
					
					
					
					data = { succes : true };   					
				} else {
					data = { succes : false,  error : "You have rush the max limit of 15 drone" };   
				}
			break;
			
			//Create Group
			case "/newGroup":	
			
			break;
			
			//Read Vehicule Data
			case "/getVehiculeData":				
				data = { vehicule : vehiculeArray };   				
			break;
			
			//Read Group Data
			case "/getGroupData":				
				data = { vehicule : vehiculeArray };   				
			break;
			
			//Update Vehicule Dest
			case "/changeVehiculeDest":
				if ('id' in params && 'lat' in params && 'lng' in params) {	
					var index  = getVehiculeById(params['id']);
					console.log("move: " + params['id'] + "to: " +  params['lat'] + ";" + params['lng'] );					
					if (index  > -1){
						vehiculeArray[index].dest.lat = parseFloat(params['lat']);	
						vehiculeArray[index].dest.lng = parseFloat(params['lng']);									
						data = { succes : true };  
					}else{
						data = { succes : false,  error : "ID not found" };
					}		
				}else{
					data = { succes : false, error : "wrong params" };
				}				
			break;
			
			//Update Group Dest
			case "/changeGroupDest":
			
			break;
			
			//Delete Vehicule
			case "/deletVehicule":			
				if ('id' in params) {							
					var index  = getVehiculeById(params['id']);
					console.log("delet: " + params['id'] + " at index: " + index);					
					if (index  > -1){
						vehiculeArray.splice(index , 1);						
						data = { succes : true };  
					}else{
						data = { succes : false,  error : "ID not found" };
					}					
				}else{
					data = { succes : false, error : "wrong params" };
				}
			break;
			
			//Delete Group
			case "/deletGroup":	
			
			break;
			
		}
		
	//Convert the data to JSON
	var json = JSON.stringify(data); 
	//Send the JSON to the client
	res.end(json);		
		  
});

//Specify on witch port the server is listening
server.listen(8080);