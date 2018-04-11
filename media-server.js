
//Media server
var mongoose = require('mongoose');
var path = require('path');
var dotenv = require('dotenv').config({path:path.join(__dirname,"env/"+process.env.NODE_ENV+".env")});
global.db = (global.db ? global.db : mongoose.createConnection(process.env.DB_STRING));

var NodeMediaServer = require('node-media-server');
var path = require('path');

var config = {
    rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 60,
        ping_timeout: 30
    },
    http: {
        port: 8000,
        mediaroot:path.join(require('app-root-dir').get(),"media"),
        allow_origin: '*'
    },
    trans: {
        ffmpeg: '/usr/bin/ffmpeg',
        tasks: [
            {
                app: 'live',
                ac: 'aac',
                hls: true,
                hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
                dash: true,
                dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
            }
        ]
    }

    /*auth: {
        play: true,
        publish: true,
        secret: process.env.MEDIA_KEY
    }*/
};

var nms = new NodeMediaServer(config);
var Streaming = require('./models/Streaming');
nms.on('prePublish', (id, StreamPath, args) => {
    Streaming.create({id:id,path:StreamPath,args:args},function (err,result) {})
});
nms.on('donePublish', (id, StreamPath, args) => {
    Streaming.remove({id:id},function (err,result) {})
});
nms.on('doneConnect', (id, args) => {
    Streaming.remove({id:id},function (err,result) {})
});

nms.on('prePlay', (id, StreamPath, args) => {
    Streaming.update({path: StreamPath}, { $inc: { views: 1 }},function (err,result) {console.log(err);console.log(result);})

});

nms.on('donePlay', (id, StreamPath, args) => {

    Streaming.update({path: StreamPath,views:{ $gt:0 }}, { $inc: { views: -1 }},function (err,result) {})
});


nms.run();

