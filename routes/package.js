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

                            next();
                            /*

                            var client = req.body.client;

                            client.createdBy = req.user._id;

                            Client.find({'$or':[{'email': client.email},{'phone':client.phone}] }, function (err, clients) {


                                if(clients.length)
                                {
                                    if(err)
                                    {
                                        return UtilsService.ErrorHandler(err,req,res,next);
                                    }

                                    req.body.client = clients[0]._id;

                                    next();
                                }
                                else
                                {
                                    Client.create(client,function (err,client) {

                                        console.log(err);
                                        if(err)
                                        {
                                            return UtilsService.ErrorHandler(err,req,res,next);
                                        }

                                        req.body.client = client._id;
                                        next();
                                    })
                                }

                            });
*/

                            /*
                            Client.update(data, client, {upsert: true, setDefaultsOnInsert: true}, function (err,result) {


                                if(err)
                                {

                                    return UtilsService.ErrorHandler(err,req,res,next);
                                }




                            });*/


                        }
                    }
            }
    }