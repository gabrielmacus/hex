
const nodemailer = require('nodemailer');
const tengine = require('pug');
const path = require('path');

module.exports=
    {
        CallMiddleware:function (req,res,next,instance,type) {

            try
            {
                var Route = require('../routes/'+req.model.modelName.toLowerCase());

                if(Route && Route.middleware && Route.middleware[instance] && Route.middleware[instance][type])
                {
                    Route.middleware[instance][type](req,res,next);
                }
                else
                {
                    next();
                }
            }
            catch(e)
            {

                if(e.code == "MODULE_NOT_FOUND")
                {
                    next();
                }
                else
                {
                    module.exports.ErrorHandler(e,req,res,next);
                }

            }

        },
        SendEmail:function (from,to,subject,data,template,callback) {


            if(!from){
                from = process.env.APP_EMAIL_ADDRESS;
            }


            tengine.renderFile(path.join(require('app-root-dir').get(),"/views/"+template+".pug"),data,function (err,html) {

                if(err)
                {
                    //TODO: Handle err
                }




            var transporter = nodemailer.createTransport({
                host:process.env.APP_EMAIL_HOST,
                port:parseInt(process.env.APP_EMAIL_PORT),
                secure:(process.env.APP_EMAIL_SECURE == 'true')?true:false,
                auth:
                    {
                        user:process.env.APP_EMAIL_AUTH_USER,
                        pass:process.env.APP_EMAIL_AUTH_PASS
                    }
            });

            var mailOptions = {
                from:from,
                to:to,
                subject:(subject)?subject:"",
                html:html
            };


            transporter.sendMail(mailOptions,function (err,info) {


                if(process.env.APP_STATUS != 'production' && err)
                {
                    console.error(err);
                }

                if(callback)
                {
                    if(err )
                    {
                        callback(err,null);
                    }

                    return callback(null,info);
                }


            })


        });


        },
        ErrorHandler:function (err,req,res,next) {


            if(err.name == 'ValidationError')
            {

                res.status(400).json({details:err.details,type:"ValidationError"});
            }
            else
            {
                res.status(500).json({});
            }
        },
        get:function (key,object) {

            if(!object || !object[key])
            {
                return "";
            }

            return (typeof object[key] == "object" || typeof object[key] == "array")?object[key]:object[key].toString();
        }
        
    }