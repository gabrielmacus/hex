const Assigment = require('../models/Assignment');
const UtilsService = require('../services/UtilsService');
module.exports=
    {

        demo:function (req,res,next) {

            res.json({"demo":true});

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