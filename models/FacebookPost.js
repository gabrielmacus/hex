
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var publishOption = new Schema({

    days:[{type:Number,enum:[1,2,3,4,5,6,7]}],
    time:{number:Number,unit:{type:String,enum:["m","h"]}}


});


var schema = new Schema({
    title: {type:String},
    description:{type:String},
    price:{type:Number},
    frecuency:publishOption,
    groups:[String],
    type:{type:String,enum:['sale'],required:true,default:'sale'},
    last_publish:{type:Date},
    createdBy:{type:Schema.Types.ObjectId,ref:'User',required:true}

}, {
    timestamps: true
});

module.exports= db.model('FacebookPost',schema);