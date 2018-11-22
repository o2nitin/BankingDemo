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

