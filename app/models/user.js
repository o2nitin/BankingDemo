var mongoose = require('mongoose');

/// User Schema

var userSchema = mongoose.Schema({
	username:{
        type:String,
        require :true
	},
	
    password:{
        type:String
	},
	
	account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Account'
    },
    
	transaction:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
	
    status:{
        type:String,
        require :true
	},
	
    createdAt:{
        type:Date,
        default: Date.now
    }
});

var User = module.exports = mongoose.model('User',userSchema);


// Get User by Id
module.exports.getUserById =function (id,callback) {
    
    User.findById(id, callback);
    
}

// Add USER

module.exports.addUser = function (user,callback) {
    
    var add = {
        
       username:user.username,
       password:user.password,
       account :user.accountid,
        status:user.status
        }
    User.create(add, callback);
}





