
const mongoose = require('mongoose');
const Schema = mongoose.Schema;



var schema = new Schema({
    id:String,
    path:String,
    args:Schema.Types.Mixed,
    views:{type:Number,default:0}

}, {
    timestamps: true
});

module.exports= db.model('Streaming',schema);