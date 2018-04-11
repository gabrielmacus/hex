
const UtilsService = require('../services/UtilsService');
const mongoose = require('mongoose');


module.exports={


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