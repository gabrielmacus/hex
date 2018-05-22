const Product = require('../models/Product');
const async = require('async');
const UtilsService = require('../services/UtilsService');
module.exports=
    {

        middleware:
            {
                post:
                    {
                        update:function (req,res,next) {

                            
                            if(req.body.products)
                            {
                                async.each(req.body.products, function(item, callback) {

                                    Product.update({_id:item.product},{'$set':{}},function (err,result) {
                                        if(err){
                                            return UtilsService.ErrorHandler(err,req,res,next);
                                        }
                                        callback();
                                    })


                                }, function(err) {

                                    next();
                                });
                            
                            }
                            


                        }
                    }
            }
    }