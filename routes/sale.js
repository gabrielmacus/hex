const Product = require('../models/Product');
const async = require('async');
const UtilsService = require('../services/UtilsService');
module.exports=
    {

        middleware:
            {
                post:
                    {
                        delete:function (req,res,next) {

                            if(req.itemToDelete.products)
                            {
                                async.each(req.itemToDelete.products,function (item,cb) {

                                    Product.update({_id:item.product._id},{'$inc':{stock: item.quantity}},function (err,result) {
                                        if(err){
                                            return UtilsService.ErrorHandler(err,req,res,next);
                                        }

                                        cb();
                                    })

                                },function (err) {
                                    next();
                                });

                            }
                            else
                            {
                                next();
                            }



                        },
                        update:function (req,res,next) {


                                async.waterfall([

                                    function (callback) {

                                        //Restocks deleted products from this sale
                                        if(req.itemToUpdate && req.itemToUpdate.products)
                                        {
                                            async.each(req.itemToUpdate.products,function (item,cb) {

                                                var filter = req.body.products.filter(function (t) { return t.product == item.product._id });


                                                if(!filter || filter.length == 0)
                                                {


                                                    var quantity = item.quantity;

                                                        Product.update({_id:item.product},{'$inc':{stock: quantity}},function (err,result) {
                                                        if(err){
                                                            return UtilsService.ErrorHandler(err,req,res,next);
                                                        }

                                                        cb();
                                                    });
                                                }
                                                else
                                                {
                                                    cb();
                                                }


                                            },function (err) {

                                                callback();
                                            })

                                        }
                                        else
                                        {
                                            callback();
                                        }



                                    },
                                    function (callback) {

                                        if(req.body.products)
                                        {
                                            async.each(req.body.products, function(item, cb) {

                                                var quantity = item.quantity;
                                                var oldQuantity = 0;
                                                if(req.itemToUpdate)
                                                {
                                                    var filter = req.itemToUpdate.products.filter(function (t) { return t.product._id == item.product });
                                                    if(filter && filter.length)
                                                    {
                                                        oldQuantity = filter[0].quantity;
                                                    }
                                                }

                                                quantity = oldQuantity - quantity;


                                                Product.update({_id:item.product},{'$inc':{stock: quantity}},function (err,result) {
                                                    if(err){
                                                        return UtilsService.ErrorHandler(err,req,res,next);
                                                    }

                                                    cb();
                                                })


                                            }, function(err) {

                                                next();
                                            });
                                        }
                                        else
                                        {
                                            next();
                                        }


                                    }

                                ]);









                        },
                        create:function (req,res,next) {

                            module.exports.middleware.post.update(req,res,next);

                        }
                    }
            }
    }