
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserService = require('../services/UserService');
const bcrypt = require('bcrypt');
const findOrCreate = require('mongoose-findorcreate')

var schema = new Schema({

    createdBy:{type:Schema.Types.ObjectId,ref:'User'},
    facebook : {id:{type:String},picture:{type:String}},
    name: {type:String, required:true},
    surname: {type:String, required:true},
    password: {type:String},
    username: {type:String},
    email: {type:String, required:true},
    role: {type:String, required:true, default:"User"},
    status:{enum: ["pending-verification","active","suspended"],default:"active",type:String}

},
    {
        timestamps: true
    });

schema.plugin(findOrCreate);

schema.post('validate', function(doc,next) {

    if(doc.password)
    {
        bcrypt.hash(doc.password, parseInt(process.env.APP_SALT_ROUNDS), function(err, hash) {
            // Store hash in your password DB.

            if(err)
            {
               return next(err);
            }

            doc.password = hash;
            next();

        });

    }
    else
    {
        next();
    }


});


schema.post('save', function(doc,next) {


    if (this.status == 'pending-verification') {
        //If password is set, means that is a basic user
        if(this.password)
        {
            UserService.sendConfirmationEmail(this);
        }
    }
    next();
});

module.exports= db.model('User',schema);