var RoleService = require('../services/RoleService');
module.exports=
    {
        menu:function (req,res,next) {

            res.json(RoleService.GetMenu(req.user));

        }
    }