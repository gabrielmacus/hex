const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const File =require('./File');
const Client = require('./Client');
const Product = require('./Product');
const ModelService = require('../services/ModelService');
var schema = new Schema({

    products: [ {quantity:Number,product:{type:Schema.Types.ObjectId,ref:'Product'},text:String}],
    client:{type:Schema.Types.ObjectId,ref:'Client'},
    notes:String,
    createdBy:{type:Schema.Types.ObjectId,ref:'User',required:true}
}, {
    timestamps: true
});
var autoPopulate= function(next) {

    this.populate('client');
    this.populate('products.product');
    next();
};

schema
    .pre('find', autoPopulate)
    .pre('findOne', autoPopulate)
    .pre('init',function (doc) {


        ModelService.ClearDeletedReferences(doc,'products','product');

    });


module.exports= db.model('Sale',schema);