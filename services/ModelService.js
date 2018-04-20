
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
    },
    ClearDeletedReferences: function (doc,key,subkey) {

        if(doc[key])
        {
            for(var k in doc[key])
            {

                if(!doc[key][k] || (subkey && !doc[key][k][subkey]))
                {

                    doc[key].splice(k,1);
                }


            }
        }

        return doc;
    }

}