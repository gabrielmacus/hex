var RoleService = require('../services/RoleService');
var fs = require('fs');
const UtilsService = require('../services/UtilsService');
const path  =require('path');
module.exports=
    {
        menu:function (req,res,next) {

            res.json(RoleService.GetMenu(req.user));

        },
        roles:function (req,res,next) {

            fs.readFile(path.join(require('app-root-dir').get(),'roles.json'),function (err,data) {

                if(err)
                {
                    return UtilsService.ErrorHandler(err,req,res,next);
                }

                var dataJSON = JSON.parse(data.toString());

                var myRoleLevel = (dataJSON[req.user.role])?dataJSON[req.user.role].level : false;

                if(!myRoleLevel)
                {
                    return res.json({});
                }

                var result = [];

                for(var k in dataJSON)
                {
                    if(dataJSON[k].level <= myRoleLevel)
                    {
                        result.push(k);
                    }
                }
                res.json(result);

            });
        }
    }