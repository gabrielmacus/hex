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

                                    console.log(quantity);

                                    Product.update({_id:item.product},{'$inc':{stock: quantity}},function (err,result) {
                                        if(err){
                                            return UtilsService.ErrorHandler(err,req,res,next);
                                        }
                                        console.log(result);
                                        callback();
                                    })


                                }, function(err) {

                                    next();
                                });
                            
                            }
                            else
                            {
                                next();
                            }
                            


                        },
                        create:function (req,res,next) {

                            module.exports.middleware.post.update(req,res,next);

                        }
                    }
            }
    }