
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const File =require('./File');


var schema = new Schema({

    destination_address:String,
    destination_city:String,
    destination_zip:Number,
    status:{ type: String, enum: ['Pending', 'Delivered','Cancelled'],default:'Pending'},
    attachments:[{text:String,attachment:{type:Schema.Types.ObjectId,ref:'File'}}],
    createdBy:{type:Schema.Types.ObjectId,ref:'User',required:true}


}, {
    timestamps: true
});

module.exports= db.model('Package',schema);