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
		  
	/*if (!bob.isConnected() && page != "/login"){
		res.writeHead(200, {"Content-Type": "text/plain"}); 	
		res.end("Auth fail");
	}else{	*/
	
	var json;
	
		switch(page){		
			case "/login":
				var data = { auth: bob.auth(params,ip)};   
				json = JSON.stringify(data);  
			break;
			case "/getVehiculeData":
				var floteArray = [
					{id: 0, loc: {lat: 47.5516177, lng: 0.8393998}, dest: {lat: 41.8516177, lng: 5.2393998} },
					{id: 1, loc: {lat: 45.4516177, lng: 1.7393998}, dest: {lat: 42.8516177, lng: 4.2393998} },
					{id: 2, loc: {lat: 48.8516177, lng: 2.4393998}, dest: {lat: 43.8516177, lng: 3.2393998} },
					{id: 3, loc: {lat: 44.5516177, lng: -1.1393998}, dest: {lat: 44.8516177, lng: 2.2393998} },
					{id: 4, loc: {lat: 43.4516177, lng: -2.6393998}, dest: {lat: 45.8516177, lng: 1.2393998} }
				];
				var data = { vehicule : floteArray };   
				json = JSON.stringify(data);  
			case "/travel_to":
				
				//TODO
			break;
		}
		
		
		
		res.end(json);
		
		
	//}
	
	
	
	
	/*
	
	
	if (!isloged){
		
	}else{
		
	}
		
	res.writeHead(200, {"Content-Type": "application/json"});  
	
	var otherArray = ["item1", "item2"];
    var otherObject = { item1: "item1val", item2: "item2val" };
    	
	var json = JSON.stringify({ 
		anObject: otherObject, 
		anArray: otherArray, 
		another: "item"
    });
  
    res.end(json);
	*/
    /*if (page == '/') {
        res.write('Vous êtes à l\'accueil, que puis-je pour vous ?');
    }
    else if (page == '/sous-sol') {
        res.write('Vous êtes dans la cave à vins, ces bouteilles sont à moi !');
    }
    else if (page == '/etage/1/chambre') {
        res.write('Hé ho, c\'est privé ici !');
    }
    res.end();*/
	
/*	
	req.on("close", function() {
	  isloged = false;
	  console.log("Client disconnected");
	});

	req.on("end", function() {
	  isloged = false;
	  console.log("Client disconnected");
	});
  */
  
});

server.listen(8080);