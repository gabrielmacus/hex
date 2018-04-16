
const UtilsService = require('../services/UtilsService');
module.exports=
    {

        date:function (req,res,next) {


            if(req.method != 'GET')
            {
             return   res.status(404).json({});
            }

            if(!(req.query.from || req.query.to))
            {
                return res.status(400).json({});
            }

            console.log(req.query);
            var query = false;

            if(req.query.from && !req.query.to)
            {
                query = {date:{'$gte':new Date(req.query.from)}};
            }
            else if(!req.query.from && req.query.to)
            {
                query = {date:{'$lte':new Date(req.query.to)}};
            }
            else if(req.query.from && req.query.to)
            {
                query = {date:{'$gte':new Date(req.query.from),'$lte':new Date(req.query.to)}};
            }


 


            //query.date = {'$gte':date,'$lte':endDate};


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