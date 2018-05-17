
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const File =require('./File');
const Client  =require('./Client');
var ModelService  = require('../services/ModelService');

var schema = new Schema({

    destination_address:String,
    destination_city:String,
    destination_zip:Number,
    external_id:String,
    client:{type:Schema.Types.ObjectId,ref:'Client'},
    status:{ type: String, enum: ['Pending', 'Delivered','Cancelled'],default:'Pending'},
    //attachments:[{text:String,attachment:{type:Schema.Types.ObjectId,ref:'File'}}],
    createdBy:{type:Schema.Types.ObjectId,ref:'User',required:true}


}, {
    timestamps: true
});

var autoPopulate= function(next) {
    this.populate('client');
    next();
};





schema
    .pre('find', autoPopulate)
    .pre('findOne', autoPopulate)
    .pre('init',function (doc) {

       // ModelService.ClearDeletedReferences(doc,'client');

    });



module.exports= db.model('Package',schema);