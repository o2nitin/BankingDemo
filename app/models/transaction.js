var mongoose = require('mongoose');

var transactionSchema = mongoose.Schema({
   
    ammount:{
        type:Number
    },
    type:{
        type:String
    },
    
    mode:{
        type:String,
        require :true
    },
    createdAt:{
        type:Date,
        default: Date.now
    }
});

var Transaction = module.exports=mongoose.model('Transaction', transactionSchema);

//Add Transaction

module.exports.addTransaction = function (tr, callback) {
    
    var add = {
        
       ammount: tr.ammount,
       type : tr.type,
       mode : tr.mode
        }
    Transaction.create(add, callback);
}

//find Account by id
module.exports.getTransactionById = function (id, callback) {
    
    Transaction.findById(id, callback);
    
}
