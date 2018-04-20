
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const  AssignmentType = require('./AssignmentType');
const AssignmentService = require('../services/AssignmentService');
const Person = require('./Person');

const ModelService = require('../services/ModelService');
const File = require('./File');
var schema = new Schema({
    title: {type:String},
    date:{type:Date},
    type:{ref:'AssignmentType',type:Schema.Types.ObjectId},
    persons:[{ref:'Person',type:Schema.Types.ObjectId}],
    attachments:[{attachment:{type:Schema.Types.ObjectId,ref:'File'},text:String}],
    createdBy:{type:Schema.Types.ObjectId,ref:'User',required:true},
    place:{type:Number,required:true,default:1},
    description:{type:String},
    link:String


}, {
    timestamps: true
});





var autoPopulate= function(next) {
    this.populate('persons');
    this.populate('type');
    this.populate('attachments.attachment')
    next();
};





schema
    .pre('find', autoPopulate)
    .pre('findOne', autoPopulate)
    .pre('init',function (doc) {

        ModelService.ClearDeletedReferences(doc,'attachments','attachment');

    });

                

module.exports=db.model('Assignment',schema);