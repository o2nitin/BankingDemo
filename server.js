var express 	= require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./app/models/user'); // get our mongoose model
var Account  = require('./app/models/accounts'); // accounts model
var Service = require('./app/service/service') //service


// =================================================================
// configuration ===================================================
// =================================================================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
//mongoose.createConnection(config.database);

mongoose.connect(config.database); // connect to database
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("h");
});
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

app.get('/setup', function(req, res) {

	// create a sample user with genrated acc number
	
    var acc = Service.genrateAccountNumber(100000);
    
    var account = {
        name: 'Nitin Singh', 
        accountnumber : acc,
        ammount: 1000
    }
	 Account.addAccount(account,function (err, ac) {
        
        if(err){
            res.send(err);
		}
		var nick = {
			username: 'nitin', 
			accountid: ac._id,
			password: 'password',
			status: 'active' 
		};
		User.addUser(nick,function(err, user){
			if(err){
				res.send(err);
			}
			res.json({
				username:user.username,
				message: "Resgtred Successfull"
			});
		})
        
        
    });
	
});

// basic route (http://localhost:8080)
app.get('/', function(req, res) {
	res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var apiRoutes = express.Router(); 

// =================================================================
// start the server ================================================
// =================================================================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);