const Assignment = require('../models/Assignment');
const Person = require('../models/Person');
const async = require('async');
module.exports=
    {

        setPersonsLastAssignment:function (personsIds,cb) {


            Person.find({_id:{'$in':personsIds}})
                .exec(function (err,persons) {

                    if(err)
                    {
                        return cb(err);
                    }


                    async.each(persons,function (person,callback) {


                        Assignment.find({'persons':{'$all':[person._id]}})
                            .exec(function (err,assignments) {

                                if(err)
                                {
                                    return callback(err);
                                }

                                var lastAssignment = null;

                                assignments.forEach(function (assignment) {



                                    if(!lastAssignment || new Date(assignment.date) > lastAssignment)
                                    {
                                        lastAssignment = new Date(assignment.date);
                                    }

                                })


                                Person.update({_id:person._id},{'$set':{lastAssignment:lastAssignment}})
                                    .exec(function (err,result) {

                                        if(err)
                                        {
                                            return callback(err);
                                        }

                                        callback();

                                    })



                            })




                    }, function (err) {

                        if(err)
                        {
                            cb(err);
                        }
                        else
                        {
                            cb();
                        }

                    });

                })


        }

    }