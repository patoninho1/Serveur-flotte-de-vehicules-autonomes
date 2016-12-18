var http = require('http');
var url = require('url');
var querystring = require('querystring');


var server = http.createServer(function(req, res) {
	
	var params = querystring.parse(url.parse(req.url).query);
	var page = url.parse(req.url).pathname;
	console.log(page);
	
	res.writeHead(200, {"Content-Type": "application/json"});  
	
	var otherArray = ["item1", "item2"];
    var otherObject = { item1: "item1val", item2: "item2val" };
    	
	var json = JSON.stringify({ 
		anObject: otherObject, 
		anArray: otherArray, 
		another: "item"
    });
  
    res.end(json);
	
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
  
});

server.listen(8080);