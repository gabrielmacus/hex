
module.exports=
    {

        demo:function (req,res,next) {

            res.json({"demo":true});

        },
        assignments:function (req,res,next) {

            var id = req.param.id;

            req.model.find({_id:id}).populate('assignment')
            res.json({"assignments":true});

        }

    }