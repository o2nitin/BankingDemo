var mongoose =require('mongoose');

/// Account Schema

var accountSchema = mongoose.Schema({
   
    name:{
        type:String,
        require :true
    },
    accountnumber:{
        type:Number
    },
    ammount:{
        type:String
    },
    createdAt:{
        type:Date,
        default: Date.now
    }
});

var Account =module.exports=mongoose.model('Account', accountSchema);

//Add Account

module.exports.addAccount = function (acc, callback) {
    
    var add = {
        
       name : acc.name,
       accountnumber : acc.accountnumber,
       ammount : acc.ammount
        }
    Account.create(add, callback);
}

//find Account by id
module.exports.getAccountById = function (id, callback) {
    
    Account.findById(id, callback);
    
}