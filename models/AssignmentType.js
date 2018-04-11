
const mongoose = require('mongoose');
const Schema = mongoose.Schema;



var schema = new Schema({
    name: {type:String, required:true},
    createdBy:{type:Schema.Types.ObjectId,ref:'User',required:true}


}, {
    timestamps: true
});

module.exports= db.model('AssignmentType',schema);