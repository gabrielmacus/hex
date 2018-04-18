const PersonService = require('../services/PersonService');
const UtilsService = require('../services/UtilsService');
const async = require('async');
const Person = require('../models/Person');
module.exports=
    {

        date:function (req,res,next) {


            if(req.method != 'GET')
            {
             return   res.status(404).json({});
            }

            if(!(req.query.from || req.query.to))
            {
                return res.status(400).json({});
            }

            var query = false;

            if(req.query.from && !req.query.to)
            {
                query = {date:{'$gte':new Date(req.query.from)}};
            }
            else if(!req.query.from && req.query.to)
            {
                query = {date:{'$lte':new Date(req.query.to)}};
            }
            else if(req.query.from && req.query.to)
            {
                query = {date:{'$gte':new Date(req.query.from),'$lte':new Date(req.query.to)}};
            }

            //query.date = {'$gte':date,'$lte':endDate};

            /*
            *             req.model.find(query).paginate(req.page,req.limit,function (err,results,total) {

                    if(err)
                    {
                        return UtilsService.ErrorHandler(err,req,res,next);
                    }

                    var totalPages = (results.length > 0)? Math.ceil(total/req.limit):0;
                    res.json({docs:results,pagination:{total:total,results:results.length,page:req.page,pages:totalPages}});


                });*/

            req.model.find(query)
                .exec(function (err,results) {

                    if(err)
                    {
                        return UtilsService.ErrorHandler(err,req,res,next);
                    }

                    res.json({docs:results});


                })
        },
        middleware:
            {
                post:
                    {
                        update:function (req,res,next) {

                            PersonService.setPersonsLastAssignment((req.body.persons)?req.body.persons:[],function (err) {

                                if(err)
                                {
                                    return UtilsService.ErrorHandler(err,req,res,next);
                                }

                                next();

                            });


                        },
                        create:function (req,res,next) {


                            PersonService.setPersonsLastAssignment((req.body.persons)?req.body.persons:[],function (err) {

                                if(err)
                                {
                                    return UtilsService.ErrorHandler(err,req,res,next);
                                }

                                next();

                            });


                        }
                    }
            }

    }