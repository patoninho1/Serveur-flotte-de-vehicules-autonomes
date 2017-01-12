var express     = require('express');
var app         = express();
var apiRoutes   = express.Router(); 
var API			= require('json-api');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var port 		= 8080;
var dBadress 	= 'mongodb://localhost/vroum';

//Connect to the mongo data base
mongoose.connect(dBadress, function(error, db) {
    if (error) {
		console.log("Impossible de ce connecté à la base de données, avez vous lancer mongo ?");
		process.exit(1);
	}
    console.log("Connecté à la base de données :)");
});
 
//Load models
var models = {
    User: require('./models/user'),
    Vehicule: require('./models/vehicule')
};
 
var adapter = new API.dbAdapters.Mongoose(models);
var registry = new API.ResourceTypeRegistry({
  
   user: {
      urlTemplates: {
        "self": "/user/{id}"
      },
      beforeRender: function(resource, req, res) {
        if(!userIsAdmin(req)) resource.removeAttr("password");
        return resource;
      }
    },
    vehicule: {
      urlTemplates: {"self": "/vehicule/{id}"}
    },
  
}, { dbAdapter: adapter });
 
// Initialize the automatic documentation. 
var DocsController = new API.controllers.Documentation(registry, {name: 'Example API'});
 
// Set up our controllers 
var APIController = new API.controllers.API(registry);
var Front = new API.httpStrategies.Express(APIController, DocsController);
var requestHandler = Front.apiRequest.bind(Front);
 
//For log request
app.use(morgan('dev'));

//For every request
app.use(function (req, res, next) {	
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype');
	res.setHeader('Access-Control-Allow-Credentials', true);	
	next();
}); 

// Routes
/*app.use('/', function(req, res) {
    res.send('The API is here: http://localhost:' + port + '/api');
});*/

//API Routes
app.use('/api', apiRoutes);
 
// Add routes for basic list, read, create, update, delete operations 
apiRoutes.get("/:type(user|vehicule)", requestHandler);
apiRoutes.get("/:type(user|vehicule)/:id", requestHandler);
apiRoutes.post("/:type(user|vehicule)", requestHandler);
apiRoutes.patch("/:type(user|vehicule)/:id", requestHandler);
apiRoutes.delete("/:type(user|vehicule)/:id", requestHandler);

app.listen(port);


