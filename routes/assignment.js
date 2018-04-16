
const UtilsService = require('../services/UtilsService');
module.exports=
    {

        date:function (req,res,next) {

            return res.json(new Date());
            if(req.method != 'GET')
            {
             return   res.status(404).json({});
            }

            if(!req.query.q || !req.query.operator)
            {
                return res.status(400).json({});
            }
            var query = {date:{}};

            var date =new Date(req.query.q);
             query.date[req.query.operator] = date;

            req.model.find(query)
                .exec(function (err,results) {

                    if(err)
                    {
                        return UtilsService.ErrorHandler(err,req,res,next);
                    }

                    res.json(results);


                })
        }

    }