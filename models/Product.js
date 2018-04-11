const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const File =require('./File');
var schema = new Schema({
    title: {type:String, required:true},
    images: [ {image:{type:Schema.Types.ObjectId,ref:'File'},text:String}],
    createdBy:{type:Schema.Types.ObjectId,ref:'User',required:true}
}, {
    timestamps: true
});
var autoPopulate= function(next) {
    this.populate('images.image');

    next();
};
var clearDeletedReferences = function (doc) {

    if(doc.images)
    {
        for(var k in doc.images)
        {

            if(!doc.images[k].image)
            {

                doc.images.splice(k,1);
            }
        }
    }
}
schema
    .pre('find', autoPopulate)
    .pre('findOne', autoPopulate)
    .pre('init',clearDeletedReferences);


    module.exports= db.model('Product',schema);