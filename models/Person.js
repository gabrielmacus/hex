
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var Assignment = require('./Assignment');
const UtilsService= require('../services/UtilsService');
var schema = new Schema({
    name: {type:String, required:true},
    surname: {type:String, required:true},
    createdBy:{type:Schema.Types.ObjectId,ref:'User',required:true},
    lastAssignment:Date
    //assignments:[{type:Schema.Types.ObjectId,ref:'Assignment'}],


}, {
        timestamps: true
    });



/*
*         var ids = docs.map(function (t) { return t._id });

        Assignment.find({persons:{$all:ids}})
            .exec(function (err,assignments) {

                if(err)
                {
                    return done(err,null)
                }


                for(var i =0;i<assignments.length;i++)
                {
                    var a = assignments[i];

                    for(var j=0;j<a.persons.length;j++)
                    {
                        var p=  a.persons[j];

                        var idx = docs.findIndex(function (doc) {

                            return doc._id.toString() == p.toString();
                        });


                        docs[idx]['assignment']=a;
                        console.log(docs)

                    }



                }


                return done(null,docs);


            })*/



module.exports= db.model('Person',schema);