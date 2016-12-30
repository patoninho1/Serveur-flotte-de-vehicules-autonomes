var http = require('http');
var url = require('url');
var querystring = require('querystring');
var chai = require('chai');
var distance = require('google-distance');

//localhost:8080/login?user=bob&pass=mdpbob
//localhost:8080/travel_to?user=bob&pass=mdpbob

var vehicule = require("./vehicule.js");
var vA = new vehicule();


var account = require("./login.js");
var bob = new account("bob","mdpbob");


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


var franceLoc = {lat: 46.8516177, lng: 1.2393998};
var home = {lat: 48.8142251, lng: 2.3950068};


var last_id = 0;
function getFreeID(){
	last_id+=1;
	return (last_id-1);
}

function getVehiculeById(id){
	for (i = 0; i < floteArray.length; i++) {	
		if (floteArray[i].id == id){
			return i;
		}
	}
	return -1;
}

var floteArray = [];


var server = http.createServer(function(req, res) {
	
	//Get and parse argument and client IP
	var params = querystring.parse(url.parse(req.url).query);
	var page = url.parse(req.url).pathname;
	var ip = req.connection.remoteAddress;
		
	console.log(ip + " ask for page :" + page);	
	
	//Accept request from localhost
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype');
	res.setHeader('Access-Control-Allow-Credentials', true);
	  
	//Specifie that the server answer is a JSON
	res.writeHead(200, {"Content-Type": "application/json"});  
		
		
	var data;	
	
		//CRUD Create Read Update Delete
		switch(page){				
		
			//Create
			case "/newVehicule":				
				if (floteArray.length < 15) {
					var newId = getFreeID();
					var rayonOfSpawn = 2.0;
					var newlat = home.lat + rayonOfSpawn * Math.cos( (2 * Math.PI/180) * newId*12);
					var newlng = home.lng + rayonOfSpawn * Math.sin( (2 * Math.PI/180) * newId*12);		
						
					floteArray.push({id: newId, loc: {lat: newlat, lng: newlng}, dest: {lat: newlat, lng: newlng} });					
					data = { succes : true };   					
				} else {
					data = { succes : false,  error : "You have rush the max limit of 15 drone" };   
				}
			break;
			
			//Read
			case "/getVehiculeData":				
				data = { vehicule : floteArray };   				
			break;
			
			//Update
			case "/changeVehiculeDest":
			
			break;
			
			//Delet
			case "/deletVehicule":			
				if ('id' in params) {							
					var index  = getVehiculeById(params['id']);
					console.log("delet: " + params['id'] + " at index: " + index);					
					if (index  > -1){
						floteArray.splice(index , 1);						
						data = { succes : true };  
					}else{
						data = { succes : false,  error : "ID not found" };
					}					
				}else{
					data = { succes : false, error : "wrong params" };
				}
			break;
			
		}
		
		
	var json = JSON.stringify(data); 
	res.end(json);
		
		  
});

server.listen(8080);