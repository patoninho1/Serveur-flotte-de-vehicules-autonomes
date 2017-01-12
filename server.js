var express     = require('express');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var app         = express();
var Schema 		= mongoose.Schema;
var jwt    		= require('jsonwebtoken'); 
var user   		= require('./models/user.js'); 
//var accountM	= require("./models/account.js");
var apiRoutes   = express.Router(); 
var port 		= 8080;
var dBadress 	= 'mongodb://localhost/vroum';
var tokenPass	= 'secretpass';

//Connect to the mongo data base
mongoose.connect(dBadress, function(error, db) {
    if (error) {
		console.log("Impossible de ce connecté à la base de données, avez vous lancer mongo ?");
		process.exit(1);
	}
    console.log("Connecté à la base de données :)");
});


app.set('tokenSecret', tokenPass); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/api', apiRoutes);


//For every request
app.use(function (req, res, next) {	
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype');
	res.setHeader('Access-Control-Allow-Credentials', true);	
	next();
});

app.get('/', function(req, res) {
    res.send('Go here for use the API: http://localhost:' + port + '/api');
});


//Create the bob user if needed, with http://localhost:8080/setup
app.get('/setup', function(req, res) {

	var bob = new user({ 
		username: 'bob', 
		password: 'mdpbob',		
		vehicule: [],
		last_v_id: 0,
		group: [],
		last_g_id: 0	
	});

	bob.save(function(err) {
	if (err) throw err;
		console.log('User saved successfully');
		res.json({ success: true });
	});
	
});


// API ROUTES

//Connect
//Test it with POST http://localhost:8080/api/authenticate {usename: "bob", password: "mdpbob"}
apiRoutes.post('/login', function(req, res) {
	user.findOne({ username: req.body.username }, function(err, user) {		
		console.log(req.body.username + " " +  req.body.password);
		
		if (err){
			res.json({ success: false, message: 'Authentication failed. Error.' });
			
		}else if (!user) {
			res.json({ success: false, message: 'Authentication failed. User not found.' });
			
		}else if (user.password != req.body.password) {
			res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			
		}else if (user.password == req.body.password) {		
			var token = jwt.sign(user, app.get('tokenSecret'), {
			  expiresIn : '1440m'
			});			
			res.json({ success: true, message: 'You are now log as ' + user.username, token: token });	
		}			
    });
});


//check the token for earch apiRoutes
apiRoutes.use(function(req, res, next) {

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	// decode token
	if (token) {
		// verifies secret and checks exp
		jwt.verify(token, app.get('tokenSecret'), function(err, decoded) {      
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });    
			} else {
				req.decoded = decoded;    
				next();
			}
		});
	} else {
		return res.status(403).send({ success: false, message: 'No token provided.' });    
	}
	
});

//Disconnect
//Test it with http://localhost:8080/api/disconnect
apiRoutes.get('/disconnect', function (req, res) {
	//aManager.disconnect();
	res.json({ success: true,  message: 'You are now disconnected' });		
});

	
//Create Vehicule
//Test it with http://localhost:8080/api/newVehicule
apiRoutes.get('/newVehicule', function (req, res) {
	if(/*aManager.addVehicule(homeSpawn*/1){
		res.json({ success: true,  message: 'New vehicule added' });			
	} else {
		res.json({ success: false,  message: 'You have rush the max number of vehicule' });		 
	}	
});


//Create Group
//Test it with http://localhost:8080/api/newGroup
apiRoutes.get('/newGroup', function (req, res) {	
	if(/*aManager.addGroup()*/1){
		res.json({ success: true,  message: 'New group added' });				
	} else {
		res.json({ success: false,  message: 'You have rush the max number of group' });		 		
	}		
});


//Read Vehicule Data
//Test it with http://localhost:8080/api/getVehiculeData
apiRoutes.get('/getVehiculeData', function (req, res) {			 				
	res.json({ success: true, vehicule : 1/*aManager.getVehiculeData()*/ });  		
});


//Read Group Data
//Test it with http://localhost:8080/api/getGroupData
apiRoutes.get('/getGroupData', function (req, res) {			
	res.json({ success: true, group : 1/*aManager.getGroupData()*/ });   				
});


//Update Vehicule Dest
//Test it with http://localhost:8080/api/changeVehiculeDest?id=0&lat=42.42&lng=42.42
apiRoutes.get('/changeVehiculeDest', function (req, res) {
	if(/*aManager.changeVehiculeDest(req.query)*/1){
		res.json({ success: true, message: "move vehicule: " + req.query.id + " to: " +  req.query.lat + ";" + req.query.lng });
	}else{
		res.json({ succes : false, message : "wrong parameters" });
	}		
});


//Update Group Dest
//Test it with http://localhost:8080/api/changeGroupDest?id=0&lat=42.42&lng=42.42
apiRoutes.get('/changeGroupDest', function (req, res) {
	if(/*aManager.changeGroupDest(req.query)*/1){
		res.json({ success: true, message: "move groupe: " + req.query.id + " to: " +  req.query.lat + ";" + req.query.lng });
	}else{
		res.json({ succes : false, message : "wrong params" });
	}	
});	
		

//Update Group member (add)
//Test it with http://localhost:8080/api/deletVehicule?id=0
apiRoutes.get('/addToGroup', function (req, res) {
	if(/*aManager.deletVehicule(req.query)*/1){
		res.json({ success: true, message: "Vehicule: " + req.query.vid + " add to group: " + req.query.gid }); 				
	}else{
		res.json({ succes : false, message : "wrong params" });
	}
});	


//Update Group member (remove)
//Test it with http://localhost:8080/api/deletVehicule?id=0
apiRoutes.get('/rmToGroup', function (req, res) {		
	if(/*aManager.rmToGroup(req.query)*/1){
		res.json({ success: true, message: "Vehicule: " + req.query.vid + " remove of group: " + req.query.gid });
	}else{
		res.json({ succes : false, message : "wrong params" });
	}	
});	


//Delete Vehicule
//Test it with http://localhost:8080/api/deletVehicule?id=0
apiRoutes.get('/deletVehicule', function (req, res) {
	if(/*aManager.deletVehicule(req.query)*/1){
		res.json({ success: true, message: "Vehicule: " + req.query.id + " deleted" });
	}else{
		res.json({ succes : false, message : "wrong params" });
	}		
});	


//Delete Group
//Test it with http://localhost:8080/api/deletGroup?id=0
apiRoutes.get('/deletGroup', function (req, res) {
	if(/*aManager.deletGroup(req.query)*/1){
		res.json({ success: true, message: "Group: " + req.query.id + " deleted" });
	}else{
		res.json({ succes : false, message : "wrong params" });
	}	
});	

// start the server
app.listen(port, function () {
	console.log('Server listening on port ' + port);
});




































/*


//Global setting
var franceLoc = {lat: 46.8516177, lng: 1.2393998};
var homeSpawn = {lat: 48.8142251, lng: 2.3950068};

//Add the test user
var aManager = new accountM();
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
	


*/