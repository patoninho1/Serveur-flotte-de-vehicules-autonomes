var http = require('http');
var url = require('url');
var querystring = require('querystring');
var chai = require('chai');


//Add our class object witch manage the account
var accountManager = require("./account.js");

//Global setting
var franceLoc = {lat: 46.8516177, lng: 1.2393998};
var homeSpawn = {lat: 48.8142251, lng: 2.3950068};

//Add the test user
var aManager = new accountManager();
aManager.addUser("bob","mdpbob");


//Move Timer, this manage the travel of all the vehicule and actualise they position every second
setInterval(function(){	
	aManager.UpdateAllPosition();
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
	
	//Il you are not loged
	if (aManager.isConnected(ip)){
		//CRUD Create Read Update Delete
		switch(page){

			//Disconnect
			//Test it with http://localhost:8080/disconnect
			case "/disconnect":	
				aManager.disconnect();
				data = { succes : true };  
			break;
			
			//Create Vehicule
			//Test it with http://localhost:8080/newVehicule
			case "/newVehicule":				    
				if(aManager.addVehicule(homeSpawn)){
					console.log("Creat a new vehicule");
					data = { succes : true };   	
				} else {
					data = { succes : false,  error : "You have rush the max limit of drone" };   
				}
			break;
			
			//Create Group
			//Test it with http://localhost:8080/newGroup
			case "/newGroup":	
				if(aManager.addGroup()){
					console.log("Creat a new group");
					data = { succes : true };   	
				} else {
					data = { succes : false,  error : "You have to mutch group compare to your number of vehicule" };   
				}
			break;
			
			//Read Vehicule Data
			//Test it with http://localhost:8080/getVehiculeData
			case "/getVehiculeData":	
				console.log("Send vehicule data");			
				data = { succes : true, vehicule : aManager.getVehiculeData() };   				
			break;
			
			//Read Group Data
			//Test it with http://localhost:8080/getGroupData
			case "/getGroupData":		
				console.log("Send groups data");
				data = { succes : true, group : aManager.getGroupData() };   				
			break;
			
			//Update Vehicule Dest
			//Test it with http://localhost:8080/changeVehiculeDest?id=0&lat=42.42&lng=42.42
			case "/changeVehiculeDest":			
				if(aManager.changeVehiculeDest(params)){
					console.log("move vehicule: " + params['id'] + " to: " +  params['lat'] + ";" + params['lng'] );
					data = { succes : true };
				}else{
					data = { succes : false, error : "wrong params" };
				}	
			break;
			
			//Update Group Dest
			//Test it with http://localhost:8080/changeGroupDest?id=0&lat=42.42&lng=42.42
			case "/changeGroupDest":
				if(aManager.changeGroupDest(params)){
					console.log("move groupe: " + params['id'] + " to: " +  params['lat'] + ";" + params['lng'] );	
					data = { succes : true };
				}else{
					data = { succes : false, error : "wrong params" };
				}			
			break;			
			
			//Update Group member (add)
			//Test it with http://localhost:8080/deletVehicule?id=0
			case "/addToGroup":
			    if(aManager.deletVehicule(params)){
					console.log("Vehicule: " + params['vid'] + " add to group: " + params['gid']);
					data = { succes : true }; 				
				}else{
					data = { succes : false, error : "wrong params" };
				}
			break;
			
			//Update Group member (remove)
			//Test it with http://localhost:8080/deletVehicule?id=0
			case "/rmToGroup":			
				if(aManager.rmToGroup(params)){
					console.log("Vehicule: " + params['vid'] + " remove of group: " + params['gid']);
					data = { succes : true }; 
				}else{
					data = { succes : false, error : "wrong params" };
				}
			break;
			
			//Delete Vehicule
			//Test it with http://localhost:8080/deletVehicule?id=0
			case "/deletVehicule":	
				if(aManager.deletVehicule(params)){
					console.log("Vehicule: " + params['id'] + " deleted");
					data = { succes : true }; 
				}else{
					data = { succes : false, error : "wrong params" };
				}
			break;
			
			//Delete Group
			//Test it with http://localhost:8080/deletGroup?id=0
			case "/deletGroup":	
				if(aManager.deletGroup(params)){
					console.log("Group: " + params['id'] + " deleted");
					data = { succes : true }; 
				}else{
					data = { succes : false, error : "wrong params" };
				}
			break;
			
		}
	
	}else{
	    //Il you are not already loged	
		//Test it with http://localhost:8080/login?user=bob&pass=mdpbob
		if (page == "/login"){		
			if(aManager.connect(params,ip)){
				data = { succes : true };  
			}else{
				data = { succes : false, error : "Wrong login or password"};
			}
		}else{			
			data = { succes : false, error : "You have to login for acces to this"};
		}
	}
	
	//Convert the data to JSON
	var json = JSON.stringify(data); 
	//Send the JSON to the client
	res.end(json);		
		  
});

//Specify on witch port the server is listening
server.listen(8080);