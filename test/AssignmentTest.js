const chai = require('chai');
const expect = chai.expect;
const path = require('path');
process.env.NODE_ENV="test";
var dotenv = require('dotenv').config({path:path.join(require('app-root-dir').get(),'/env/test.env')});

const app = require('../app.js');
const FileService = require('../services/FileService');

const AssignmentService = require('../services/AssignmentService');
const Assignment = require('../models/Assignment');
var Person  =require('../models/Person');

const async = require('async');



describe('Assignment test', function(){

    var person1=null;
    var person2=null;

    var assignmentDate1 ='2018-05-03T03:00:00.000Z';
    var assignmentDate2 ='2015-10-03T03:00:00.000Z';
    var assignmentDate3 ='2019-05-03T03:00:00.000Z';

    before(function (done) {

        async.series([
            function (callback) {

                db.dropDatabase();
                Person.create({name:"Roberto",surname:"Rodriguez",createdBy:"507f1f77bcf86cd799439011"},function (err,result) {

                        person1 = result;
                        callback();

                    });

            },
        function () {


            Person.create({name:"Juan",surname:"Gómez"},function (err,result) {

                    person2 = result;
                    done();

                });


        }]);


    });
    after(function () {
        db.close();
    });

    it('Sets persons last assignment (1)',function(done) {

        AssignmentService.setPersonLastAssignment([person1._id,person2._id],assignmentDate1,function (err) {

            Person.find({"_id":{"$in":[person1._id,person2._id]}})
                .exec(function (err,results) {

                    results.forEach(function (t) {

                        expect(t.lastAssignment.toISOString()).to.equal(assignmentDate1);
                    })

                    done();
                });

        })

    });
    it('Tries to set persons last assignment, but its previous than the current last assignment (2)',function(done) {

        AssignmentService.setPersonLastAssignment([person1._id,person2._id],assignmentDate2,function (e) {

            Person.find({"_id":{"$in":[person1._id,person2._id]}})
                .exec(function (err,results) {

                    results.forEach(function (t) {

                        expect(t.lastAssignment.toISOString()).to.equal(assignmentDate1);
                    });

                    done();
                });
        })

    });

    it('Sets persons last assignment (3)',function(done) {

        AssignmentService.setPersonLastAssignment([person1._id,person2._id],assignmentDate3,function (e) {

            Person.find({"_id":{"$in":[person1._id,person2._id]}})
                .exec(function (err,results) {

                    results.forEach(function (t) {

                        expect(t.lastAssignment.toISOString()).to.equal(assignmentDate3);
                    });

                    done();
                });
        })

    });
});