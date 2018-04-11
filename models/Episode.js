

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const File =require('./File');


var schema = new Schema({
    name: String,
    season:Number,
    number:Number,
    cover:{type:Schema.Types.ObjectId,ref:'File'},
    createdBy:{type:Schema.Types.ObjectId,ref:'User',required:true},


}, {
    timestamps: true
});

module.exports= db.model('Serie',schema);