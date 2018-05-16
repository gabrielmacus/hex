const Assigment = require('../models/Assignment');
const UtilsService = require('../services/UtilsService');
module.exports=
    {

        demo:function (req,res,next) {

            var Package = require('../models/Package');

            Package.aggregate([
                {
                    $lookup:
                        {

                            from: "client",
                            pipeline: [
                                { $match:
                                    { $expr:
                                        {
                                            $eq: [ "$client",  "$_id" ]
                                        }
                                    }
                                }

                            ],
                            as: "clients"

                        }
                }
            ]).exec(function (err,results) {

                console.log(err);
                res.json(results);
            });

            /*
            Package.aggregate([
                {
                    $lookup:
                        {

                            from: "clients",
                            pipeline: [
                                { $match:
                                    { $expr:
                                        {
                                            $eq: [ "$client",  "$_id" ]
                                        }
                                    }
                                },

                            ],
                            as: "clients"

                        }
                }
            ]).exec(function (err,results) {

                console.log(err);
                res.json(results);
            });
            */

        },
        assignments:function (req,res,next) {

            var id = req.params.id;

            console.log({ persons: { $all: [id] } });

            Assigment.find({ persons: { $all: [id] } })
                .exec(function (err,assignments) {

                    if(err)
                    {
                        return UtilsService.ErrorHandler(err,req,res,next);
                    }

                    res.json(assignments);

                })


        }

    }