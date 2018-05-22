var validator = require('validator');
const Gallery = require('../models/Gallery');
const Product = require('../models/Product');
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
        Sale:function (req,res,next) {
            var errors ={};


            if(req.body.products && req.body.products.length)
            {
                for(var k in req.body.products)
                {
                    var product= req.body.products[k].product;
                    var quantity =  req.body.products[k].quantity;

                    Product.findOne({_id:product})
                        .exec(function (err,product) {

                           if(err)
                           {
                               return UtilsService.ErrorHandler(err,req,res,next);
                           }

                           if(product.stock && product.stock < quantity)
                           {
                               console.log("Sobrepasa la cantidad");
                               var key = 'product_'+k;
                               console.log(key);
                               if(! errors[key])
                               {

                                   errors[key] = [];
                               }
                               errors[key].push({message:'lengthBetween'});

                           }



                            module.exports.process(errors,req,res,next);

                        });

                }
            }




        },
        Product:function (req,res,next) {

            var errors ={};

            var length = {min:3,max:100};
            var lengthMessage = {message:'lengthBetween',data:length};
            var key = 'title';
            if(!validator.isLength(UtilsService.get(key,req.body),length))
            {
                errors[key] = [];
                errors[key].push(lengthMessage);
            }



            var length = {min:0,max:100};
            var lengthMessage = {message:'lengthBetween',data:length};
            var key = 'description';
            if(!validator.isLength(UtilsService.get(key,req.body),length))
            {
                errors[key] = [];
                errors[key].push(lengthMessage);
            }

            var imagesMessage = {message:'minSelected',data:{min:0,max:5}};
            var length  = UtilsService.get('images',req.body).length || 0;

            if(length < imagesMessage.data.min || length > imagesMessage.data.max)
            {
                errors['images'] = [];
                errors['images'].push(imagesMessage);

            }

            var placeMessage = {message:"numberBetween",data:{min:0,max:100000000}};
            var key = 'cost';
            if(!validator.isInt(UtilsService.get(key,req.body),placeMessage.data))
            {
                errors[key] = [];
                errors[key].push(placeMessage);

            }



            var message = {message:"selectAnOption"};
            var key = 'currency';
            var value= UtilsService.get(key,req.body);
            if((!value._id || !validator.isMongoId(value._id)) && !validator.isMongoId(value))
            {
                errors[key] = [];
                errors[key].push(message);

            }

            /*
            var message = {message:"selectAnOption"};
            var key = 'currency';
            var value= UtilsService.get(key,req.body);
            console.log(value);
            if(!validator.isMongoId(value))
            {
                errors[key] = [];
                errors[key].push(message);

            }*/

            module.exports.process(errors,req,res,next);




        },
        User:function (req,res,next) {

            var errors ={};

            var length = {min:3,max:100};
            var lengthMessage = {message:'lengthBetween',data:length};
            var key = 'username';
            if(!validator.isLength(UtilsService.get(key,req.body),length))
            {
                errors[key] = [];
                errors[key].push(lengthMessage);
            }


            var length = {min:3,max:100};
            var lengthMessage = {message:'lengthBetween',data:length};
            var key = 'name';
            if(!validator.isLength(UtilsService.get(key,req.body),length))
            {
                errors[key] = [];
                errors[key].push(lengthMessage);
            }

            var length = {min:3,max:100};
            var lengthMessage = {message:'lengthBetween',data:length};
            var key = 'surname';
            if(!validator.isLength(UtilsService.get(key,req.body),length))
            {
                errors[key] = [];
                errors[key].push(lengthMessage);
            }


            var message = {message:'invalidEmail'};
            var key = 'email';
            if(!validator.isEmail(UtilsService.get(key,req.body)))
            {
                errors[key] = [];
                errors[key].push(message);
            }


            var length = {min:3,max:100};
            var lengthMessage = {message:'lengthBetween',data:length};
            var key = 'password';
            if(!validator.isLength(UtilsService.get(key,req.body),length))
            {
                errors[key] = [];
                errors[key].push(lengthMessage);
            }



            var message = {message:'passwordsDoesntMatch'};
            var key = 'confirmPassword';
            if(!validator.equals(UtilsService.get(key,req.body),UtilsService.get('password',req.body)))
            {
                errors[key] = [];
                errors[key].push(message);
                if(!errors['password'])
                {
                    errors['password'] = [];
                }
                errors['password'].push(message)


            }





            module.exports.process(errors,req,res,next);



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

            var length = {min:0,max:150};
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

            if(UtilsService.get('place',req.body)!='' && !validator.isInt(UtilsService.get('place',req.body),placeMessage.data))
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
            var linkMessage = {message:"shouldBeUrl"};

            if(UtilsService.get('link',req.body)!=''&&!validator.isURL(UtilsService.get('link',req.body),linkMessage.data))
            {
                errors['link'] = [];
                errors['link'].push(linkMessage);

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