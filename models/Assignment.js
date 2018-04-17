
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const  AssignmentType = require('./AssignmentType');
const AssignmentService = require('../services/AssignmentService');
const Person = require('./Person');
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
    this.populate('attachments.attachment');
    next();
};





schema
    .pre('find', autoPopulate)
    .pre('findOne', autoPopulate)
    .post('validate',function (doc,next) {

        console.log(doc);
        var Assignment = require('./Assignment');
        //doc
        Assignment.find({_id:doc._id})
            .exec(function (err,result) {

               if(err)
               {
                   return next(err);
               }

               console.log(result);


                next();

            });




        /*
        AssignmentService.setPersonLastAssignment(this.persons,this.date.toISOString(),function (err) {
            next(err);
        })*/

    });

module.exports=db.model('Assignment',schema);