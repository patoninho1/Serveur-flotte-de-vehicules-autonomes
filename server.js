var express     = require('express');
var app         = express();
var API         = require('json-api');
//var morgan      = require('morgan');
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser');

var routes      = require('./routes.js');
var apiRoutes   = express();
var port        = 8080;
var dBadress    = 'mongodb://localhost/vroum';


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
    User: require('./models/user.js'),
    Vehicule: require('./models/vehicule.js'),
    Group: require('./models/group.js')
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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
//app.use(morgan('dev'));

// Routes
app.use('/', routes);
app.use('/api', apiRoutes);
apiRoutes.get("/:type(user|vehicule|group)", requestHandler);
apiRoutes.get("/:type(user|vehicule|group)/:id", requestHandler);
apiRoutes.post("/:type(user|vehicule|group)", requestHandler);
apiRoutes.patch("/:type(user|vehicule|group)/:id", requestHandler);
apiRoutes.delete("/:type(user|vehicule|group)/:id", requestHandler);

app.listen(port);


