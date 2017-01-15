var express     = require('express');
var app         = express();
var routes      = express.Router(); 
var jwt         = require('jsonwebtoken'); 
var tokenPass   = 'secretpass';
var user  = require('./models/user.js')

app.set('tokenSecret', tokenPass); 

routes.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

/*
routes.get('/setup', function(req, res) {
	var bob = new user({ 
		username: 'bob', 
		password: 'mdpbob',
	});

	bob.save(function(err) {
	if (err) throw err;
		console.log('User saved successfully');
		res.json({ success: true });
	});
});
*/

//Connect, POST http://localhost:8080/api/login {usename: "bob", password: "mdpbob"}
routes.post('/api/login', function(req, res) {
	user.findOne({ username: req.body.username }, function(err, user) {
		console.log(req.body.username + " " +  req.body.password);
		if (err){
			res.json({ success: false, message: 'Authentication failed. Error.' });
		}else if (!user) {
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		}else if (user.password != req.body.password) {
			res.json({ success: false, message: 'Authentication failed. Wrong password.' });
		}else if (user.password == req.body.password) {
			var token = jwt.sign(user, app.get('tokenSecret'), {expiresIn : '1440m'});
			res.json({ success: true, message: 'You are now log as ' + user.username, token: token });
		}
	});
});

//check the token for earch apiRoutes
routes.use('/api',function(req, res, next) {

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
	}  else {
		return res.status(403).send({ success: false, message: 'No token provided.' });    
	}

}); 

module.exports = routes;