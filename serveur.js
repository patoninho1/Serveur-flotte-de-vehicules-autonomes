var http = require('http');
var url = require('url');
var querystring = require('querystring');
var distance = require('google-distance');


//localhost:8080/login?user=bob&pass=mdpbob
//localhost:8080/travel_to?user=bob&pass=mdpbob

var vehicule = require("./vehicule.js");
var vA = new vehicule();



var account = require("./login.js");
var bob = new account("bob","mdpbob");




function login(params){
	if ('user' in params && 'pass' in params) {
		if(params['user'] == username && params['pass'] == password){
			isloged = true;
			return "Login succes";
		}
	}
	isloged = false;
	return "Wrong username or password";
}


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
	
	var params = querystring.parse(url.parse(req.url).query);
	var page = url.parse(req.url).pathname;
	console.log(page);	
	
	if (!bob.isConnected){
	
	}else{
		
	}
	
	switch(page){		
		case "/login":
			res.writeHead(200, {"Content-Type": "text/plain"}); 	
			res.end(login(params));
		break;
		case "/travel_to":
			//TODO
		break;
	}
	
	
	
	
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