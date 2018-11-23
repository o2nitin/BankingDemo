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
        type:Number
    },

    transaction:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
    
    beneficiary:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],

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
       ammount : acc.ammount,
       transaction: acc.transaction,
       beneficiary: acc.beneficiary
       
    }
    Account.create(add, callback);
}

//find Account by id
module.exports.getAccountById = function (id, callback) {
    
    Account.findById(id, callback);
    
}

//find by account number
module.exports.getAccountByAccNumber = function (accNumber, callback) {
    
    Account.findOne({ accountnumber: accNumber }, callback);
    
}


//find and update account
module.exports.updateAccount = function (accNumber, acc,  callback) {
    var query = {accountnumber: accNumber};
   
    Account.findOneAndUpdate(query, acc, callback);
}


