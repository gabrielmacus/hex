
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const File = require('../models/File');

var schema = new Schema({
    name: {type:String},
    surname: {type:String},
    createdBy:{type:Schema.Types.ObjectId,ref:'User',required:true},
    phone:String,
    //phones:[String],
    description:String,
    /*
    images:[{image:{type:Schema.Types.ObjectId,ref:'File'},text:String}],
    documents:[{document:{type:Schema.Types.ObjectId,ref:'File'},text:String}],*/
    email:String
}, {
    timestamps: true
});
var autoPopulate= function(next) {
    this.populate('images.image');
    this.populate('documents.document');

    next();
};
var clearDeletedReferences = function (key,subkey,doc) {

    if(doc[key])
    {
        for(var k in doc[key])
        {

            if(!doc[key][k][subkey])
            {

                doc[key].splice(k,1);
            }
        }
    }
}
schema
    .pre('find', autoPopulate)
    .pre('findOne', autoPopulate)
    .pre('init',function (doc) {

        clearDeletedReferences(doc,'images','image');

        clearDeletedReferences(doc, 'documents','document');
    });


module.exports= db.model('Client',schema);