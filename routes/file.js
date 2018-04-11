var xlsx = require('node-xlsx').default;
var formidable = require('formidable');
var mv = require('mv');
var root = require('app-root-dir').get();
var path = require('path');
var async = require('async');
var fs = require('fs');

var excel = require('excel');
var formidable = require('formidable');
module.exports=
    {
        parseExcel:function (req,res,next) {
            var form = new formidable.IncomingForm();
            form.maxFileSize =   process.env.MAX_UPLOAD_SIZE * 1024 * 1024;
            form.parse(req,function (err,fields,files) {

                for(var k in files)
                {
                   var parsedExcel= xlsx.parse(files[k].path);

                   res.json(parsedExcel);

                    break;
                }




            });

        },
        stream:function (req,res,next) {

            res.status(202).end(Math.random().toString());
            /*
            const p = path.join(require('app-root-dir').get(),'public/video/dummy.mp4')
            const stat = fs.statSync(p)
            const fileSize = stat.size
            const range = req.headers.range

            if (range) {
                const parts = range.replace(/bytes=/, "").split("-")
                const start = parseInt(parts[0], 10)
                const end = parts[1]
                    ? parseInt(parts[1], 10)
                    : fileSize-1

                const chunksize = (end-start)+1
                const file = fs.createReadStream(p, {start, end})
                const head = {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'video/webm',
                }

                res.writeHead(206, head)
                file.pipe(res)
            } else {
                const head = {
                    'Content-Length': fileSize,
                    'Content-Type': 'video/webm',
                }
                res.writeHead(200, head)
                fs.createReadStream(p).pipe(res)
            }*/

            /*
            var readableStream = fs.createReadStream(path.join(require('app-root-dir').get(),'public/video/dummy.mp4'));

            readableStream.on('data', function(chunk) {
                console.log('casdsd');
                res.status(206).write(chunk)
            });

            readableStream.on('end', function() {

                res.end();
            });
            */

            /*
            if(req.method == 'GET')
            {

            }

            next();
            */

        },
        upload:function (req,res,next ) {
            var form = new formidable.IncomingForm();
            form.maxFileSize =   process.env.MAX_UPLOAD_SIZE * 1024 * 1024;
            form.parse(req,function (err,fields,files) {

                if(err)
                {
                    //TODO: handle errors
                    console.error(err);
                }


                var uploadedFiles  = [];
                async.each(files, function(file, callback) {

                    var basename =path.basename(file.path);
                    var extension = path.extname(file.name);
                    mv(file.path,path.join(root,'/public/.tmp/'+basename+extension), function(err) {

                        uploadedFiles.push({path:'/.tmp/'+basename+extension,size:file.size,contentType:file.type,filename:file.name});
                        callback(err);

                    });

                },function (err) {

                    if(err)
                    {
                        //TODO: handle errors
                        console.error(err);
                    }


                    res.json(uploadedFiles);
                });





            })

        }
    }