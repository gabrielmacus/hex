const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const urljoin = require('url-join');

var FileService = require('../services/FileService');
var schema = new Schema({
    filename: {type:String, required:true},
    contentType : {type:String,required:true},
    size:{type:Number,required:true},
    path:{type:String},
    description:{type:String},
    gallery:{type:Schema.Types.ObjectId,ref:'Gallery'}
}, {
    timestamps: true
});
schema.pre('init',function (doc) {

   doc.path = urljoin(process.env.APP_URL,doc.path);

});
schema.post('validate', function(doc,next) {
    
    FileService.ftpUpload(doc,function (err,result) {

        if(!err) {

            console.log(result);
            doc.path = result.path;


            next();

        }
        else {
            next(err);
        }


    })

    
});
schema.pre('remove',function(next) {

    FileService.ftpDelete(this,function (err) {

        next(err);


    })
});
module.exports= db.model('File',schema);