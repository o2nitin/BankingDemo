var express 	= require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./app/models/user'); // get our mongoose model
var Account  = require('./app/models/accounts'); // accounts model
var Transaction  = require('./app/models/transaction');
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
  console.log("connected");
});
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

app.post('/setup', function(req, res) {
	var username = req.body.username;
	var name = req.body.name;
	var pass = req.body.password;
	if(!req.body.username){
		res.json({message:"username can't be blank"})
	}
	if(!req.body.name){
		res.json({message:"Name can't be blank"})
	}
	if(!req.body.password){
		res.json({message:"Password can't be blank"})
	}

	// create a sample user with genrated acc number
	
    var acc = Service.genrateAccountNumber(100000);
    
    var account = {
        name: name, 
        accountnumber : acc,
		ammount: 1000,
		transaction:[],
		beneficiary:[]
    }
	 Account.addAccount(account,function (err, ac) {
        
        if(err){
            res.send(err);
		}
		var nick = {
			username: username, 
			accountid: ac._id,
			password: pass,
			status: 'active' 
		};
		User.addUser(nick,function(err, user){
			if(err){
				res.send(err);
			}
			res.json({
				username:user.username,
				message: "Registred Successfull"
			});
		})
        
        
    });
	
});

app.post('/auth', function(req, res) {

	// find the user
	User.findOne({
		username: req.body.username
	}, function(err, user) {

		if (err) throw err;

		if (!user) {
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {

			// check if password matches
			if (user.password != req.body.password) {
				res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {

				// if user is found and password is right
				// create a token
				var payload = {
					id: user._id	
				}
				var token = jwt.sign(payload, app.get('superSecret'), {
					expiresIn: 86400 // expires in 24 hours
				});

				res.json({
					success: true,
					message: 'Use this token for acess other information',
					token: token
				});
			}		

		}

	});
});

app.use(function(req, res, next) {

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {			
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });		
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;	
				next();
			}
		});

	} else {

		// if there is no token
		// return an error
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.'
		});
		
	}
	
});



app.get('/info', function(req, res) {

	User.findById(req.decoded.id,function(err, user){
		if(err){
			res.send("Some error occured Please try after some time"+ err);
		}
		Account.findById(user.account,function(err, acc){
			user.account = acc;
			var info = {
				username : user.username,
				name: user. account.name,
				accountNumber: user.account.accountnumber,
				balance: user.account.ammount,
				transaction: user.account.transaction
			}
				Transaction.find({_id: {$in: info.transaction}}, function (err, array) {
					
					info.transaction = array.map(e=>{
						return {
						ammount: e.ammount,
						type: e.type,
						mode: e.mode
					}
					});
				res.json(info);
			})
			
		})

		
	})
});


app.post('/transfer', function(req, res) {

	var toAccount = req.body.account;
	var ammontToTransfer = req.body.ammount;
	User.findById(req.decoded.id,function(err, user){
		if(err){
			res.send("Some error occured Please try after some time"+ err);
		}
		Account.findById(user.account,function(err, fromacc){
			user.account = fromacc;
			var info = {
				username : user.username,
				name: user. account.name,
				accountNumber: user.account.accountnumber,
				balance: user.account.ammount,
				transaction: user.account.transaction
			}
			if(ammontToTransfer > user.account.ammount){
				res.json({message : "Insufficient Fund, You have only INR: "+user.account.ammount})
			}
			else{
				Account.getAccountByAccNumber(toAccount,function(err, toAcc){
					if(err){
						res.send("Invalid Account");
					}
					if(!toAcc){
						res.send("Invalid Account number.");
					}
					else{
						toAcc.ammount = toAcc.ammount + ammontToTransfer;

						var t1 = {
							ammount: ammontToTransfer,
							type:"Credit",
							mode:"Online transfer fro acc "+fromacc.accountnumber
						}
						Transaction.addTransaction(t1,function(err, t1res){
							toAcc.transaction.push(t1res._id);
	
							Account.updateAccount(toAcc.accountnumber, toAcc, function(err, returndata){
								if(err){
									res.send(err);
								}
								var t2 = {
									ammount: ammontToTransfer,
									type:"Debit",
									mode:"Online transfer to acc "+toAcc.accountnumber
								}
								fromacc.ammount = fromacc.ammount - ammontToTransfer;
								Transaction.addTransaction(t2,function(err, t2res){
									console.log(t2res._id)
									fromacc.transaction.push(t2res._id);
									Account.update({accountnumber:fromacc.accountnumber}, 
										{ ammount: fromacc.ammount,
											transaction: fromacc.transaction
										}, function(err, returndata2){
										if(err){
											res.send(err);
										}
										res.json({message:"Transfer done. Your current acc balance INR :"+ fromacc.ammount
								
									});
									})
								})
								
							} )
						})

					}
				
					
				
				})
			}
		})

		
	})
});

app.post('/addbeneficiary', function(req, res) {
	

	User.findById(req.decoded.id,function(err, user){
		if(err){
			res.send("Some error occured Please try after some time"+ err);
		}
		Account.findById(user.account,function(err, acc){
	
			if(acc.beneficiary.indexOf(req.body.account) > -1){
				console.log("h0000------00000h")
				res.json({message:"Payee Already added"});
			}
			
			Account.getAccountByAccNumber(req.body.account, function(err, payeeAcc){


				if(!payeeAcc){
					res.json({message:"Account not found"});

				}
				else{
					if(acc.beneficiary.indexOf(payeeAcc.accountnumber) > -1){
						console.log("h0000------00000h")
						res.json({message:"Payee Already added"});
					}
					
					else{

						updateData = {
							beneficiary : acc.beneficiary.push(payeeAcc._id)
						}

						console.log(acc.beneficiary.indexOf(payeeAcc._id));
						console.log(acc.beneficiary);
						console.log(payeeAcc.accountnumber);
						console.log(updateData);
						Account.updateAccount(acc.accountnumber, updateData, function(err, updateRes){
	
							var resAccot = {
								name: acc.name,
								ammont : acc.ammont,
								beneficiary: acc.beneficiary
							}
							res.json(resAccot);
						})
					}
					
				}
				
				
			})
			
			
		})

		
	})

});

app.get('/calculateintrest', function(req, res) {
	res.send('Hello! The API is at http://localhost:' + port + '/api');
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