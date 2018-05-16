const Client = require('../models/Client');
const UtilsService = require('../services/UtilsService');
module.exports=
    {

        email:function (req,res,next) {

            if(req.params.id)
            {

                req.model.findOne({'_id':req.params.id})
                    .exec(function (error,package) {

                        if(error)
                        {
                            return UtilsService.ErrorHandler(err,req,res,next);
                        }

                        UtilsService.SendEmail(process.env.APP_EMAIL_ADDRESS,package.client.email,req.__('shippingNoticeSubject'),{package:package},'shipping-notice',function (err,info) {

                            if(err){
                                return UtilsService.ErrorHandler(err,req,res,next);
                            }

                            res.json(info);
                        })


                    })

            }
            else
            {
                next();
            }



        },

        middleware:
            {
                pre:
                    {
                        create:function (req,res,next) {


                            var client = req.body.client;
                            Client.update({email: client.email}, client, {upsert: true, setDefaultsOnInsert: true}, function (err,result) {


                                if(err)
                                {

                                    return UtilsService.ErrorHandler(err,req,res,next);
                                }

                                Client.findOne({ 'email': client.email }, function (err, client) {

                                    if(err)
                                    {
                                        return UtilsService.ErrorHandler(err,req,res,next);
                                    }

                                    req.body.client = client._id;

                                    next();
                                });


                            });

                            return false;

                        }
                    }
            }
    }