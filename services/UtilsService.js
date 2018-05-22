
const nodemailer = require('nodemailer');
const tengine = require('pug');
const path = require('path');
var rootPath = require('app-root-dir').get();
var fs = require('fs');
module.exports=
    {

        /**
         * An asynchronous for-each loop
         *
         * @param   {array}     array       The array to loop through
         *
         * @param   {function}  done        Callback function (when the loop is finished or an error occurs)
         *
         * @param   {function}  iterator
         * The logic for each iteration.  Signature is `function(item, index, next)`.
         * Call `next()` to continue to the next item.  Call `next(Error)` to throw an error and cancel the loop.
         * Or don't call `next` at all to break out of the loop.
         */
         asyncForEach:function (array, done, iterator) {
                    var i = 0;
                    next();

                    function next(err) {
                        if (err) {
                            done(err);
                        }
                        else if (i >= array.length) {
                            done();
                        }
                        else if (i < array.length) {
                            var item = array[i++];
                            setTimeout(function() {
                                iterator(item, i - 1, next);
                            }, 0);
                        }
                    }
         },


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
        Log:function(level,data)
        {
            var p = path.join(rootPath,"logs/"+level+".log");
            fs.readFile(p, function(err, data) {

                if(!err)
                {

                }
                console.log("LOG");
                console.log(err);
                console.log(data.toString());
                console.log("LOG");


            });


        },
        ErrorHandler:function (err,req,res,next) {


            //module.exports.Log('error',err);

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