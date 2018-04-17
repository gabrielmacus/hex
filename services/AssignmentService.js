const Person  = require('../models/Person');

module.exports=
    {
        /**
         * Sets person last  assignment
         * @param persons
         * @param assignmentDate
         * @param callback
         */
        setPersonLastAssignment:function (persons,assignmentDate,callback) {

            var personsToUpdate = [];
            //Loads persons
            Person.find({'_id':{'$in':persons}})
                .exec(function (err,persons) {

                    if(err)
                    {
                        return callback(err);
                    }
                    var today = new Date();
                    persons.forEach(function (person) {

                        if(!person.lastAssignment || new Date(assignmentDate) > new Date(person.lastAssignment))
                        {
                            personsToUpdate.push(person._id);

                        }

                    });

                    if(personsToUpdate.length > 0)
                    {
                        Person.update({'_id':{'$in':personsToUpdate}},{'$set':{lastAssignment:new Date(assignmentDate)}})
                            .exec(function (err,result) {

                                if(err)
                                {
                                    return callback(err);
                                }
                                callback();
                            })
                    }
                    else
                    {
                        callback();
                    }


                })


        }
    }