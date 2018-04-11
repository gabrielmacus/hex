var validator = require('validator');
const Gallery = require('../models/Gallery');
const UtilsService = require('../services/UtilsService');
const path = require('path');
module.exports=
    {

        process:function (errors,req,res,next) {

            if(!errors || Object.keys(errors).length == 0)
            {
                return next();
            }
            var error = {name:'ValidationError',details:errors};

            UtilsService.ErrorHandler(error,req,res,next);
        },
        Gallery:function (req,res,next) {

            var errors ={};

            var length = {min:3,max:100};
            var lengthMessage = {message:'lengthBetween',data:length};

            if(!validator.isLength(UtilsService.get('name',req.body),length))
            {
                errors['name'] = [];
                errors['name'].push(lengthMessage);
            }
            module.exports.process(errors,req,res,next);


        },
        File:function (req,res,next) {

            Gallery.findOne({_id:req.body.gallery})
                .exec(function (error,gal) {

                    if(error)
                    {
                        return UtilsService.ErrorHandler(error,req,res,next);
                    }

                    var errors ={};

                    if(gal.extensions && gal.extensions.length > 0)
                    {
                        var ext = path.extname(UtilsService.get('path',req.body)).replace(".","");


                        if(gal.extensions.indexOf(ext.toLowerCase()) == -1)
                        {
                            errors['files'] = {};
                            errors['files'][UtilsService.get('path',req.body)]= ({message:"extensionNotAllowed",data:{filename:UtilsService.get('filename',req.body)}});
                        }

                    }

                    module.exports.process(errors,req,res,next);

                })

        },
        Assignment:function(req,res,next)
        {
            var errors = {};

            var length = {min:3,max:150};
            var lengthMessage = {message:'lengthBetween',data:length};

            if(!validator.isLength(UtilsService.get('title',req.body),length))
            {
                errors['title'] = [];
                errors['title'].push(lengthMessage);
            }


            var dateMessage= {message:'shouldBeValidDate'};

            if(!validator.toDate(UtilsService.get('date',req.body),dateMessage))
            {
                errors['date'] = [];
                errors['date'].push(dateMessage);
            }

            var personsMessage = {message:'minSelected',data:{min:1,max:5}};

            if(!UtilsService.get('persons',req.body).length)
            {
                errors['persons'] = [];
                errors['persons'].push(personsMessage);

            }

            var typeMessage = {message:"selectAnOption"};
            var type= UtilsService.get('type',req.body);
            if((!type._id || !validator.isMongoId(type._id)) && !validator.isMongoId(type))
            {
                errors['type'] = [];
                errors['type'].push(typeMessage);

            }

            var placeMessage = {message:"numberBetween",data:{min:1,max:5}};

            if(!validator.isInt(UtilsService.get('place',req.body),placeMessage.data))
            {
                errors['place'] = [];
                errors['place'].push(placeMessage);

            }
            var descriptionMessage = {message:"lengthBetween",data:{min:0,max:200}};

            if(!validator.isLength(UtilsService.get('description',req.body),descriptionMessage.data))
            {
                errors['description'] = [];
                errors['description'].push(descriptionMessage);

            }





            module.exports.process(errors,req,res,next);
        },
        AssignmentType:function (req,res,next) {

            var errors = {};

            var length = {min:3,max:100};
            var lengthMessage = {message:'lengthBetween',data:length}


            if(!validator.isLength(UtilsService.get('name',req.body),length))
            {
                errors['name'] = [];
                errors['name'].push(lengthMessage);
            }



            module.exports.process(errors,req,res,next);
        },
        Person:function (req,res,next) {

            var errors = {};

            var length = {min:2,max:100};
            var lengthMessage = {message:'lengthBetween',data:length}


             if(!validator.isLength(UtilsService.get('name',req.body),length))
             {
                 errors['name'] = [];
                 errors['name'].push(lengthMessage);
             }

            if(!validator.isLength(UtilsService.get('surname',req.body),length))
            {   errors['surname'] = [];
                errors['surname'].push(lengthMessage);
            }


            module.exports.process(errors,req,res,next);
        }

    }