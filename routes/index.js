var express = require('express');
var router = express.Router();
var passport = require('passport');
/* GET home page. */
router.get('/',passport.authenticate(['jwt'], { failureRedirect: '/login' }),function(req, res, next) {

    res.cookie('_id',req.user._id.toString(), { maxAge: 900000 });
    var user = req.user;
    delete user.password;
    res.render('index', {media_url:process.env.MEDIA_URL,lang:req.params.language,user:user,popup:(req.query.popup)?req.query.popup:false});
});

router.get('/login',function(req,res,next){

  if(req.user)
  {
    return res.redirect('/');
  }

  next();

},function (req,res,next) {

  res.render('login', {lang:req.params.language,expiration_days:process.env.APP_JWT_EXPIRATION_DAYS});
})



module.exports = router;
