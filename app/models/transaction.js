var mongoose = require('mongoose');

var transactionSchema = mongoose.Schema({
   
    credit:{
        type:Number
        
    },
    debit:{
        type:Number
    },
    
    toorfromaccount:{
        type:Number,
        require :true
    },
    createdAt:{
        type:Date,
        default: Date.now
    }
});

var Transaction = module.exports=mongoose.model('Transaction', transactionSchema);