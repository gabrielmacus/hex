
const UtilsService = require('../services/UtilsService');
const mongoose = require('mongoose');
const ACCESS_LEVEL_ME = 1;
const ACCESS_LEVEL_GROUP = 2;
const ACCESS_LEVEL_ALL = 3;
module.exports={


    checkAuthorization:function (authorization,user,result,callback) {


        var User = require('../models/User');

        switch (authorization)
        {
            case ACCESS_LEVEL_ME:



                if(result.createdBy._id.toString() !=  user._id.toString())
                {
                    return callback(403);
                    //status = 403;
                }

               return  callback();

                break;
            case ACCESS_LEVEL_GROUP:

                User.find({}).exec(function (err,users) {


                    if(users.findIndex(function (el) {
                            return el.role == result.createdBy.role;
                        }) == -1)
                    {

                        return callback(403);
                        //status = 403;
                    }

                    return  callback();

                })


                break;
            case  ACCESS_LEVEL_ALL:

                callback();

                break;
        }

    },

    findFriends:function (req,res,next) {

        if(req.rest)
        {
            res.json({});
        }
    },
    sendConfirmationEmail:function (user,callback) {


        UtilsService.SendEmail(false,user.email,false,{user:user},"email/register-confirmation",function (err,info) {


            if(callback){

                callback(err,info);
            }


        });
    }


}