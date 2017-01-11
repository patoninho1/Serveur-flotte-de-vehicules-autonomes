//var http = require('http');
var url = require('url');
var querystring = require('querystring');
var chai = require('chai');

var express = require('express');
var app = express();

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


function setHeader(res){
	//Needed for accept request from localhost
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype');
	res.setHeader('Access-Control-Allow-Credentials', true);
}


//Call every time 
app.use(function (req, res, next) {
	setHeader(res);
	var ip = req.connection.remoteAddress;
	//Il you are not loged
	console.log(ip + " Try to acces to " + url.parse(req.url).pathname + ' at time:', Date.now());
	if (url.parse(req.url).pathname!='/login' && !aManager.isConnected(ip)){
		var data = {succes : false, error : "You have to login for acces to this"};
		res.end(JSON.stringify(data));	
	}else{	
		next();
	}
});


//login	
//Test it with http://localhost:8080/login?user=bob&pass=mdpbob
app.get('/login', function (req, res) {	
	var data;
	var ip = req.connection.remoteAddress;	
	if(aManager.connect(req.query,ip)){
		data = { succes : true };  
	}else{
		data = { succes : false, error : "Wrong login or password"};
	}
	res.end(JSON.stringify(data));	
});


//Disconnect
//Test it with http://localhost:8080/disconnect
app.get('/disconnect', function (req, res) {
	var data;	
	aManager.disconnect();
	data = { succes : true };	
	res.end(JSON.stringify(data));		
});

	
//Create Vehicule
//Test it with http://localhost:8080/newVehicule
app.get('/newVehicule', function (req, res) {
	var data;
	if(aManager.addVehicule(homeSpawn)){
		console.log("Creat a new vehicule");
		data = { succes : true };   	
	} else {
		data = { succes : false,  error : "You have rush the max limit of drone" };   
	}
	data = { succes : true };	
	res.end(JSON.stringify(data));		
});


//Create Group
//Test it with http://localhost:8080/newGroup
app.get('/newGroup', function (req, res) {
	var data;
	if(aManager.addGroup()){
		console.log("Creat a new group");
		data = { succes : true };   	
	} else {
		data = { succes : false,  error : "You have to mutch group compare to your number of vehicule" };   
	}
	res.end(JSON.stringify(data));		
});


//Read Vehicule Data
//Test it with http://localhost:8080/getVehiculeData
app.get('/getVehiculeData', function (req, res) {
	var data;
	console.log("Send vehicule data");			
	data = { succes : true, vehicule : aManager.getVehiculeData() };   				
	res.end(JSON.stringify(data));		
});


//Read Group Data
//Test it with http://localhost:8080/getGroupData
app.get('/getGroupData', function (req, res) {
	var data;					
	console.log("Send groups data");
	data = { succes : true, group : aManager.getGroupData() };   				
	res.end(JSON.stringify(data));		
});


//Update Vehicule Dest
//Test it with http://localhost:8080/changeVehiculeDest?id=0&lat=42.42&lng=42.42
app.get('/changeVehiculeDest', function (req, res) {
	var data;			
	if(aManager.changeVehiculeDest(req.query)){
		console.log("move vehicule: " + req.query.id + " to: " +  req.query.lat + ";" + req.query.lng );
		data = { succes : true };
	}else{
		data = { succes : false, error : "wrong params" };
	}	
	res.end(JSON.stringify(data));		
});


//Update Group Dest
//Test it with http://localhost:8080/changeGroupDest?id=0&lat=42.42&lng=42.42
app.get('/changeGroupDest', function (req, res) {
	var data;	
	if(aManager.changeGroupDest(req.query)){
		console.log("move groupe: " + req.query.id + " to: " +  req.query.lat + ";" + req.query.lng );	
		data = { succes : true };
	}else{
		data = { succes : false, error : "wrong params" };
	}	
	res.end(JSON.stringify(data));		
});	
		

//Update Group member (add)
//Test it with http://localhost:8080/deletVehicule?id=0
app.get('/addToGroup', function (req, res) {
	var data;
	if(aManager.deletVehicule(req.query)){
		console.log("Vehicule: " + req.query.vid + " add to group: " + req.query.gid);
		data = { succes : true }; 				
	}else{
		data = { succes : false, error : "wrong params" };
	}
	res.end(JSON.stringify(data));		
});	


//Update Group member (remove)
//Test it with http://localhost:8080/deletVehicule?id=0
app.get('/rmToGroup', function (req, res) {
	var data;		
	if(aManager.rmToGroup(req.query)){
		console.log("Vehicule: " + req.query.vid + " remove of group: " + req.query.gid);
		data = { succes : true }; 
	}else{
		data = { succes : false, error : "wrong params" };
	}
	res.end(JSON.stringify(data));		
});	


//Delete Vehicule
//Test it with http://localhost:8080/deletVehicule?id=0
app.get('/deletVehicule', function (req, res) {
	var data;	
	if(aManager.deletVehicule(req.query)){
		console.log("Vehicule: " + req.query.id + " deleted");
		data = { succes : true }; 
	}else{
		data = { succes : false, error : "wrong params" };
	}
	res.end(JSON.stringify(data));		
});	


//Delete Group
//Test it with http://localhost:8080/deletGroup?id=0
app.get('/deletGroup', function (req, res) {
	var data;
	if(aManager.deletGroup(req.query)){
		console.log("Group: " + req.query.id + " deleted");
		data = { succes : true }; 
	}else{
		data = { succes : false, error : "wrong params" };
	}
	res.end(JSON.stringify(data));		
});	
	

app.listen(8080, function () {
  console.log('Server listening on port 8080');
});