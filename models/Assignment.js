
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const  AssignmentType = require('./AssignmentType');
const Person = require('./Person');

var schema = new Schema({
    title: {type:String},
    date:{type:Date},
    type:{ref:'AssignmentType',type:Schema.Types.ObjectId},
    persons:[{ref:'Person',type:Schema.Types.ObjectId}],
    createdBy:{type:Schema.Types.ObjectId,ref:'User',required:true},
    place:{type:Number,required:true,default:1},
    description:{type:String}


}, {
    timestamps: true
});





var autoPopulate= function(next) {
    this.populate('persons');
    this.populate('type');
    next();
};





schema
    .pre('find', autoPopulate)
    .pre('findOne', autoPopulate);

module.exports= db.model('Assignment',schema);