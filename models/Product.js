const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const File =require('./File');
const Currency = require('./Currency');
const ModelService = require('../services/ModelService');
var schema = new Schema({
    title: String,
    description:String,
    images: [ {image:{type:Schema.Types.ObjectId,ref:'File'},text:String}],
    cost:Number,
    currency:{type:Schema.Types.ObjectId,ref:'Currency'},
    createdBy:{type:Schema.Types.ObjectId,ref:'User',required:true}
}, {
    timestamps: true
});
var autoPopulate= function(next) {
    this.populate('images.image');
    this.populate('currency');
    next();
};

schema
    .pre('find', autoPopulate)
    .pre('findOne', autoPopulate)
    .pre('init',function (doc) {

        ModelService.ClearDeletedReferences(doc,'images','image');

    });


    module.exports= db.model('Product',schema);