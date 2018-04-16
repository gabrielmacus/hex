var express = require('express');
var router = express.Router();
var ModelService = require('../services/ModelService');
var ObjectID = require('mongodb').ObjectID;
//https://www.npmjs.com/package/api-query-params
var apq  = require('api-query-params');
//var mongoose = require('mongoose');
var StringService = require('../services/StringService');
require('mongoose-pagination');
var RoleService = require('../services/RoleService');
var passport = require('passport');
var User = require('../models/User');
var async = require('async');
var UtilsService = require('../services/UtilsService');
var ValidationService = require('../services/ValidationService');


const ACCESS_LEVEL_ME = 1;
const ACCESS_LEVEL_GROUP = 2;
const ACCESS_LEVEL_ALL = 3;
//Action
router.all(['/:model' ,'/:model/:id([a-fA-F\\d]{24})','/:model/:id([a-fA-F\\d]{24})/:action','/:model/:action'],
    passport.authenticate(['jwt']),function(req, res, next){


    req.model= ModelService.LoadModel(req);

    req.action = ModelService.LoadAction(req);


    req.id = ModelService.LoadID(req);


    req.rest = true;

    req.authorization = RoleService.IsAuthorized(req.user,req,(process.env.ROLES_PATH)?process.env.ROLES_PATH:null);

     if(!req.authorization)
    {

        return res.status(403).json({"error":"Forbidden"});
    }


    try
    {

        var Route = require('../routes/'+req.model.modelName.toLowerCase());

        var Action = StringService.SnakeToCamel(req.action);

        Route[Action](req,res,next);

    }
    catch (e)
    {
        if(req.app.get('env') !== 'production')
        {
            //console.error(e);
        }

        if(!req.model)
        {
            //TODO: render 404
            return res.status(404).end('Not Found');
        }

        req.page = (req.query.page)?req.query.page:1;

        req.limit = (!process.env["PAGINATION_LIMIT_"+req.model.modelName.toUpperCase()])?parseInt(process.env.PAGINATION_LIMIT_DEFAULT):parseInt(process.env["PAGINATION_LIMIT_"+req.model.modelName.toUpperCase()]);



        next();
    }


});


//Read all
router.get('/:model/all',function (req,res,next) {

    req.model.find({}).exec(function (err,results) {

        res.json(results);

    });

});

//Read one
router.get('/:model/:id',function (req,res,next) {

    if(!ObjectID.isValid(req.id))
    {
     return  next();
    }
    
    var query = {_id:req.id};
    req.model.findOne(query).populate("createdBy").exec(function (err,result) {

        if(err)
        {
            //TODO: Handle errors
            console.log(err);
        }
        var status = 200;
        async.series([
            function (callback) {



                if(!result || result.length == 0)
                {
                    result = {};
                    status = 404;
                    callback();
                }
                else
                {
                    switch (req.authorization)
                    {
                        case ACCESS_LEVEL_ME:



                            if(result.createdBy._id.toString() !=  req.user._id.toString())
                            {
                                result = {};
                                status = 403;
                            }
                            callback();

                            break;
                        case ACCESS_LEVEL_GROUP:

                            User.find({}).exec(function (err,users) {

                                if(users.findIndex(function (el) {
                                        return el.role == result.createdBy.role;
                                    }) == -1)
                                {
                                    status = 403;
                                    result = {};
                                }

                                return  callback();

                            })


                            break;
                        case  ACCESS_LEVEL_ALL:

                            callback();

                            break;
                    }
                }



            },
            function () {
                return res.status(status).json(result);
            }
        ]);

    });



    
    



})
//Update one
router.put('/:model/:id',function(req,res,next){

    if(ValidationService[req.model.modelName])
    {
        ValidationService[req.model.modelName](req,res,next);
    }
    else
    {
        next();
    }

},
    function (req,res,next) {


    if(!ObjectID.isValid(req.id))
    {
        return  next();
    }

    var status = 200;

    var query = {_id:req.id};

    req.model.findOne(query).populate('createdBy').exec(function (err,result) {
        if(err)
        {
            console.error(err);
            //TODO: handle errors
        }

        async.series([
            function (callback) {
                switch (req.authorization)
                {
                    case ACCESS_LEVEL_ME:



                        if(result.createdBy._id.toString() !=  req.user._id.toString())
                        {
                            status = 403;
                        }

                        callback();

                        break;
                    case ACCESS_LEVEL_GROUP:

                        User.find({}).exec(function (err,users) {


                            if(users.findIndex(function (el) {
                                    return el.role == result.createdBy.role;
                                }) == -1)
                            {
                                status = 403;
                            }

                            return  callback();

                        })


                        break;
                    case  ACCESS_LEVEL_ALL:

                        callback();

                        break;
                }


            },function () {


                if(status!=200)
                {
                    return res.status(status).json(result);
                }

                req.model.update(query,{'$set':req.body}).exec(function (err,result) {



                    if(err)
                    {
                        //TODO: Handle errors
                        console.log(err);
                    }

                    return res.json(result);
                });
            }
        ]);

    })





});
//Delete  one
router.delete('/:model/:id',function (req,res,next) {


    if(!ObjectID.isValid(req.id))
    {
        return  next();
    }
    var query= {_id:req.id};



    req.model.findOne(query).populate('createdBy').exec(function (err,result) {

        if(err)
        {
            console.error(err);
        }

        var status =200;
        async.series([
            function (callback) {
                switch (req.authorization)
                {
                    case ACCESS_LEVEL_ME:

                        if(result.createdBy._id.toString() !=  req.user._id.toString())
                        {
                            status = 403;
                        }

                        callback();
                        break;
                    case ACCESS_LEVEL_GROUP:

                        User.find({}).exec(function (err,users) {

                            if(users.findIndex(function (el) {
                                    return el.role == result.createdBy.role;
                                }) == -1)
                            {
                                status = 403;
                            }

                            return  callback();

                        })

                        break;
                    case  ACCESS_LEVEL_ALL:

                        callback();

                        break;
                }


            },
            function () {


                if(status!=200)
                {
                    return res.status(status).json(result);
                }



                result.remove(function (err) {
                    if(err)
                    {
                        //TODO: Handle errors
                        console.log(err);
                    }

                    return res.json({});
                })
                /*
                req.model.remove(query).exec(function (err) {
                    if(err)
                    {
                        //TODO: Handle errors
                        console.log(err);
                    }

                    return res.json({});
                });*/

            }
        ]);






    });




});
//Read many
router.get('/:model', function(req, res, next) {

    //Deletes all non related to query fields
    delete req.query.page;
    delete req.query.access_token;

    var query = apq(req.query);
    var filter = query.filter;

    delete query.filter;
    var projection = query.projection;
    delete query.projection;

    async.series([
        function (callback) {
            switch (req.authorization)
            {
                case ACCESS_LEVEL_ME:

                    filter.createdBy = req.user._id;

                    callback();

                    break;
                case ACCESS_LEVEL_GROUP:

                    User.find({}).exec(function (err,users) {

                        filter.createdBy = {'$in':users.map(function (el) {
                            return el["_id"];
                        })};

                        return  callback();

                    })


                    break;
                case  ACCESS_LEVEL_ALL:

                    callback();

                    break;
            }


        },function () {

            req.model.find(filter,projection,query).paginate(req.page,req.limit,function (err,results,total) {


                //TODO: Handle errors
                if(err)
                {
                    console.log(err);
                }

                if(results)
                {

                    var totalPages = (results.length > 0)? Math.ceil(total/req.limit):0;
                    res.json({docs:results,pagination:{total:total,results:results.length,page:req.page,pages:totalPages}});
                }

            });


        }
    ]);






});
//Create one
router.post('/:model',function(req,res,next){

    if(ValidationService[req.model.modelName])
    {
        ValidationService[req.model.modelName](req,res,next);
    }
    else
    {
        next();
    }

},
    function(req, res, next){

    req.body.createdBy = req.user._id;


     req.model.create(req.body,function (err,result) {
         if(err)
         {
             return UtilsService.ErrorHandler(err,req,res,next);
         }
        res.json(result);
    });


});


module.exports = router;
