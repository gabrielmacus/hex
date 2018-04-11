var express = require('express');
var router = express.Router();
 var DevelopmentService = require('../services/DevelopmentService');
router.get(['/template/:folder/:template','/template/:template'], function(req, res, next) {
     
var templatePath = (req.params.folder)?req.params.folder+"/"+req.params.template:req.params.template;
var data = JSON.parse(req.query.data)  ;
res.render(templatePath,data);
});


router.get('/grid-generator',function (req,res,next) {

    res.send(DevelopmentService.generateGrid(req.query.cols,req.query.breakpoints,req.query.gutter));

})

module.exports = router;