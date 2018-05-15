const Client = require('../models/Client');
const UtilsService = require('../services/UtilsService');
module.exports=
    {
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