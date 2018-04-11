
var cmd=require('node-cmd');
var path = require('path');
var root = require('app-root-dir').get();
var FacebookPost = require('../models/FacebookPost');
module.exports=
    {
        checkTime:function (post,time) {
            time = (time)?time:new Date();
            var frecuencias = post.frecuency.filter(function (t) {
                //minutes or hours

                var isInDay  =  t.days.indexOf(time.getDay()) > -1;

                if(post.last_publish)
                {
                    var eachTime = (t.time.unit == 'h')?t.time.number * 60 * 60  * 1000:t.time.number * 60 * 1000;
                    var isInTime =  (post.last_publish && (time.getTime() - post.last_publish.getTime())>=eachTime);

                    return (isInDay && isInTime);
                }
                else
                {
                    return isInDay;
                }

            });

            return (frecuencias && frecuencias.length > 0);

        },
        phantomPost:function (post) {
            var command = 'phantomjs '+path.join(root,'shell/facebook.js')+' '+JSON.stringify(post.groups).trim()+' '+process.env.FACEBOOK_BOT_ACCOUNT_USER+' '+process.env.FACEBOOK_BOT_ACCOUNT_PASS+' "'+post.title+'" "'+post.price+'" "'+post.description+'"';

            console.log("Executing command "+command);

            cmd.get(command,function (err,data,stderr) {

                /*
                console.log(err);
                console.log(data);
                console.log(stderr);*/


            });
        },
        cron:function () {
            var now = new Date();
            var idsToUpdate = [];
            FacebookPost.find({}).exec(function (err,posts) {

                if(err)
                {
                    console.error(err);
                }


                posts.forEach(function (p) {

                    if(module.exports.checkTime(p,now))
                    {
                        idsToUpdate.push(p._id);

                        console.log("Executing "+p._id);

                        module.exports.phantomPost(p);
                    }

                });

                if(idsToUpdate.length > 0)
                {
                    FacebookPost.update({_id:{'$in':idsToUpdate}},{'$set':{'last_publish':now}}).exec(function (err,r) {

                        if(err)
                        {
                            console.error(err);
                        }
                        console.log(r);
                    });

                }
            });
        }
    }