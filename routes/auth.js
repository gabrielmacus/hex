var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/User');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const UtilsService = require('../services/UtilsService');
const ValidationService = require('../services/ValidationService');
//https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize
passport.serializeUser(function(user, done) {

    var usr= {"_id":user._id,name:user.name,surname:user.surname};

    done(null, usr);
    // if you use Model.id as your idAttribute maybe you'd want
    // done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        delete user.password;
        done(err, user);
    });
});

/**
 * Passport jwt
 */

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}

//Custom extractor
var FromCookie = function(req) {
    var token = null;
    if (req && req.cookies)
    {
        token = req.cookies['access_token'];
    }
    return token;
};

opts.jwtFromRequest = ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderWithScheme("JWT"),ExtractJwt.fromUrlQueryParameter("access_token"),FromCookie]);
opts.secretOrKey = process.env.APP_JWT_SECRET;
//opts.issuer = process.env.APP_URL; //TODO: which should be the issuer?
//opts.audience = process.env.APP_URL;

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {

    //TODO: handle errors
    //mongoose.connect(process.env.DB_STRING);

    User.findOne({_id: jwt_payload.data._id}).exec(function(err, user) {

        if (err) {
            //TODO: handle errors
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));

/**
 * Facebook token
 */

var FacebookTokenStrategy = require('passport-facebook-token');

passport.use(new FacebookTokenStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret:  process.env.FACEBOOK_APP_SECRET
    }, function(accessToken, refreshToken, profile, done) {


        User.findOrCreate({"facebook.id": profile.id}, function (error, user) {


            return done(error, user);
        });
    }
));
//Routes
router.post('/register',
    function (req,res,next) {
        //Delete role to be set to default
        delete req.body.role;
        delete req.body.facebook;
        req.body.status = "pending-verification";

        ValidationService.User(req,res,next);
    }

    ,function (req,res,next) {


    User.create(req.body,function (err,result) {

        if(err)
        {
           return UtilsService.ErrorHandler(err,req,res,next);
        }


        return res.json(result);

    });

})
router.post('/token',function (req,res,next) {

    var userOrEmail = (req.body.username)?req.body.username:"";
    var password  = (req.body.password)?req.body.password:"";


    User.findOne({'$or':[{username:userOrEmail},{email:userOrEmail}]}).exec(function (err,result) {

        if(err)
        {
            return UtilsService.ErrorHandler(err,req,res,next);
        }
        if(!result)
        {
            //TODO: set errors with i18n
            return res.status(400).json({});
        }

        //If user is suspended or not verified
        if(result.status != "active")
        {
            //TODO: set errors with i18n
            return res.status(401).json({});
        }

        bcrypt.compare(password, result.password, function(err, matches) {

            if(err)
            {
                return UtilsService.ErrorHandler(err,req,res,next);
            }

            if(!matches)
            {
                //TODO: set errors with i18n
                return res.status(400).json({});
            }

            jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * parseInt(process.env.APP_JWT_EXPIRATION_DAYS)),
                data: {_id:result._id}
            }, process.env.APP_JWT_SECRET,function (err,token) {

                if(err)
                {
                    return UtilsService.ErrorHandler(err,req,res,next);
                }



                return res.json({"access_token":token});




            });

        });



    });




})


module.exports = router;