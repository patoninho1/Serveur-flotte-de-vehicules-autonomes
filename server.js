var express     = require('express');
var app         = express();
var apiRoutes   = express.Router(); 
var API         = require('json-api');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser');
var jwt         = require('jsonwebtoken'); 

var user        = require('./models/user.js'); 
var vehicule    = require('./models/vehicule.js'); 
var group       = require('./models/group.js'); 

var port        = 8080;
var dBadress    = 'mongodb://localhost/vroum';
var tokenPass   = 'secretpass';


//Connect to the mongo data base
mongoose.connect(dBadress, function(error, db) {
    if (error) {
        console.log("Impossible de ce connecté à la base de données, avez-vous lancé mongo ?");
        process.exit(1);
    }
    console.log("Connecté à la base de données !");
});
 
 
//Load models and registry
var models = {
    User: user,
    Vehicule: vehicule,
    Group: group
};
var adapter = new API.dbAdapters.Mongoose(models);
var registry = new API.ResourceTypeRegistry({

    user: {
      urlTemplates: {"self": "/user/{id}"}
    },
    vehicule: {
      urlTemplates: {"self": "/vehicule/{id}"}
    },
    group: {
      urlTemplates: {"self": "/group/{id}"}
    },
  
}, { dbAdapter: adapter }); 
 

var DocsController = new API.controllers.Documentation(registry, {name: 'vehicule API'}); 
var APIController = new API.controllers.API(registry);
var Front = new API.httpStrategies.Express(APIController, DocsController);
var requestHandler = Front.apiRequest.bind(Front);
app.set('tokenSecret', tokenPass); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(morgan('dev'));


//At every request
app.use(function (req, res, next) {	
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
}); 

// Routes
/*
app.use('/', function(req, res) {
    res.send('The API is here: http://localhost:' + port + '/api');
});*/

//Create the bob user http://localhost:8080/setup
app.get('/setup', function(req, res) {

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


//API Routes
app.use('/api', apiRoutes);


//Connect, POST http://localhost:8080/api/login {usename: "bob", password: "mdpbob"}
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
 

// Add routes for basic list, read, create, update, delete operations 
apiRoutes.get("/:type(user|vehicule|group)", requestHandler);
apiRoutes.get("/:type(user|vehicule|group)/:id", requestHandler);
apiRoutes.post("/:type(user|vehicule|group)", requestHandler);
apiRoutes.patch("/:type(user|vehicule|group)/:id", requestHandler);
apiRoutes.delete("/:type(user|vehicule|group)/:id", requestHandler);


app.listen(port);


