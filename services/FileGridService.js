var FileGridfs=null;
var gridfs =null;
const mongoose = require('mongoose');
module.exports=
    {
        load:function (connection) {
            gridfs = require('mongoose-gridfs')({
                collection:'files',
                model:'Attachment',
                mongooseConnection:connection
            });
            FileGridfs = gridfs.model;
        },

        model:function () {
            return FileGridfs;
        },
        remove:function (id,callback) {

            FileGridfs.unlinkById(id, function(error, unlinkedAttachment){

                callback(error,unlinkedAttachment);
            });

        },
        read:function (id) {

            var stream  = FileGridfs.readById(id);
            return stream;

        },
        write:function (f,readStream,callback) {

            //create or save a file
            FileGridfs.write(f,
                readStream,
                function(error, createdFile){



                    callback(error,createdFile);

                });

        }
    }



