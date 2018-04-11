const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var schema = new Schema({
    name: {type:String, required:true},
    extensions:[{type:String}]

}, {
    timestamps: true
});

module.exports= db.model('Gallery',schema);