const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var schema = new Schema({
    name:String,
    iso_code:String,
    simbol:String,
    createdBy:{type:Schema.Types.ObjectId,ref:'User',required:true}
}, {
    timestamps: true
});



module.exports= db.model('Currency',schema);