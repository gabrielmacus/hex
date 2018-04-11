
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Episode = require('./Episode');
const File =require('./File');


var schema = new Schema({
    name: String,
    description:String,
    year:Number,
    episodes:[{episode:{type:Schema.Types.ObjectId,ref:'Episode'}}],
    cover:{type:Schema.Types.ObjectId,ref:'File'},
    createdBy:{type:Schema.Types.ObjectId,ref:'User',required:true},


}, {
    timestamps: true
});

module.exports= db.model('Serie',schema);