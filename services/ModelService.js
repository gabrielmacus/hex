
var StringService = require('../services/StringService');
var ObjectID = require('mongodb').ObjectID;


module.exports={
    LoadModel:function (req) {

        var modelName = (req.params.model)?StringService.UcFirst(StringService.SnakeToCamel(req.params.model)):false;

        try {

            return require('../models/'+modelName);

        }
        catch (e)
        {
            return false;
        }
    },
    LoadAction:function (req) {
        return (req.params.action)?req.params.action:false;
    },
    LoadID:function (req) {
        return (req.params.id)?req.params.id:false;
    }

}