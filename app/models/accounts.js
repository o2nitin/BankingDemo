var mongoose =require('mongoose');

/// Account Schema

var accountSchema = mongoose.Schema({
   
    name:{
        type:String,
        require :true
    },
    accountnumber:{
        type:String
    },
    ammount:{
        type:String
    },
    status:{
        type:String,
        require :true
    },
    createdAt:{
        type:Date,
        default: Date.now
    }
});

var Account =module.exports=mongoose.model('Account',accountSchema);