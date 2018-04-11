

const path = require('path');
process.env.ROLES_PATH = path.join(require('app-root-dir').get(),"test/roles-rest.json");
process.env.NODE_ENV="test";
var dotenv = require('dotenv').config({path:path.join(require('app-root-dir').get(),'/env/test.env')});

const app = require('../app.js');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const User = require('../models/User');
const Person = require('../models/Person');
chai.use(chaiHttp);
const async = require('async');

//const mongoose  =require('mongoose');



describe('REST test', function() {

    var token = "";
    var token2 ="";
    var token3="";
    var id2 ="";
    var person2 ="";
    var idToUpdate = "";
    var personToUpdate="";
    var idPostDemo ="";

    before(function (done) {


        async.series([
            function (callback) {

                db.dropDatabase();
                callback();
            /*mongoose.connect(process.env.DB_STRING, function () {

                    mongoose.connection.db.dropDatabase();
                    callback();

                });*/

            },
            function (callback) {

                User.create({
                    "name": "James",
                    "surname": "Johnson",
                    "password": "demodemo",
                    "email": "jamesjohnson@gmail.com",
                    "username": "jamesjohnson",
                    "role": "User",
                    "status": "active",
                    "__v": 0
                }, function (err, user) {

                    chai.request(app)
                        .post('/auth/token')
                        .send({
                            password: "demodemo",
                            username: "jamesjohnson"
                        })
                        .end(function (error, response) {
                            // Now let's check our response

                            expect(response.body).to.have.property('access_token');
                            expect(response).to.have.status(200);
                            token2 = response.body.access_token;

                            callback();

                        });



                });


            },
            function (callback) {

                User.create({
                    "name": "Gabriel",
                    "surname": "Macus",
                    "password": "demodemo",
                    "email": "gabrielmacus2@gmail.com",
                    "username": "gabrielmacus2",
                    "role": "User",
                    "status": "active",
                    "__v": 0
                }, function (err, user) {


                    chai.request(app)
                        .post('/auth/token')
                        .send({
                            password: "demodemo",
                            username: "gabrielmacus2"
                        })
                        .end(function (error, response) {
                            // Now let's check our response

                            expect(response.body).to.have.property('access_token');
                            expect(response).to.have.status(200);
                            token = response.body.access_token;

                            callback();

                        });


                });


            },
            function (callback) {

                User.create({
                    "name": "Jim",
                    "surname": "Smith",
                    "password": "demodemo",
                    "email": "jimsmith@gmail.com",
                    "username": "jimsmith",
                    "role": "Premium User",
                    "status": "active",
                    "__v": 0
                }, function (err, user) {


                    chai.request(app)
                        .post('/auth/token')
                        .send({
                            password: "demodemo",
                            username: "jimsmith"
                        })
                        .end(function (error, response) {
                            // Now let's check our response

                            expect(response.body).to.have.property('access_token');
                            expect(response).to.have.status(200);
                            token3 = response.body.access_token;
                            done();

                        });


                });

            }
        ]);


    });
    after(function () {
        db.close()
    })
    it("POST a person", function (done) {

        var person = {
            name: "Juan",
            surname: "De Los Palotes"
        };
        chai.request(app)
            .post('/api/person')
            .set('Authorization', 'JWT ' + token)
            .send(person)
            .end(function (error, response) {

                // Now let's check our response
                expect(response).to.have.status(200);
                expect(response.body).to.have.property('_id');
                idToUpdate = response.body._id;
                personToUpdate = response.body;
                done();

            });

    });

    it("POST another person", function (done) {

        var person = {
            name: "Roberto",
            surname: "Diaz"
        };
        chai.request(app)
            .post('/api/person')
            .set('Authorization', 'JWT ' + token)
            .send(person)
            .end(function (error, response) {

                // Now let's check our response
                expect(response).to.have.status(200);
                expect(response.body).to.have.property('_id');
                id2 = response.body._id;
                person2  =response.body;
                Person.find({}).exec(function (err,persons) {
                    expect(persons).to.have.lengthOf(2);
                    done();
                })


            });

    });

    it("User 2 POST a postDemo", function (done) {

        var demo = {
            title: "Lo que el viento se llevó",
            text: "Blah foo bar"
        };
        chai.request(app)
            .post('/api/post-demo')
            .set('Authorization', 'JWT ' + token2)
            .send(demo)
            .end(function (error, response) {

                // Now let's check our response
                expect(response).to.have.status(200);
                expect(response.body).to.have.property('_id');
                idPostDemo = response.body._id;
                done();


            });

    });

    it("Reads a person",function (done) {

        chai.request(app)
            .get('/api/person/' + idToUpdate + '')
            .set('Authorization', 'JWT ' + token)
            .end(function (error, response) {

                expect(response.body).to.have.property('name','Juan');
                expect(response.body).to.have.property('surname','De Los Palotes');
                // Now let's check our response
                expect(response).to.have.status(200);
                done();

            });
    });

    it("Reads many persons",function (done) {

        chai.request(app)
            .get('/api/person/')
            .set('Authorization', 'JWT ' + token)
            .end(function (error, response) {

                expect(response.body).to.have.property('docs');

                expect(response.body.docs).to.have.lengthOf(2);

                // Now let's check our response
                expect(response).to.have.status(200);
                done();

            });
    });

    it("Updates a person", function (done) {

        personToUpdate.name = 'John';
        chai.request(app)
            .put('/api/person/' + idToUpdate + '')
            .set('Authorization', 'JWT ' + token)
            .send(personToUpdate)
            .end(function (error, response) {


                // Now let's check our response
                expect(response).to.have.status(200);
                done();

            });

    })

    it("Deletes a person", function (done) {


        chai.request(app)
            .delete('/api/person/'+idToUpdate+'')
            .set('Authorization', 'JWT ' + token)
            .end(function (error, response) {


                // Now let's check our response
                expect(response).to.have.status(200);
                done();

            });

    });

    it("GET  person assignments", function (done) {


        chai.request(app)
            .get('/api/person/45cbc4a0e4123f6920000002/assignments')
            .set('Authorization', 'JWT ' + token)
            .end(function (error, response) {


                // Now let's check our response
                expect(response).to.have.status(200);
                done();

            });

    });

    it("POST  person demo", function (done) {


        chai.request(app)
            .post('/api/person/demo')
            .set('Authorization', 'JWT ' + token)
            .end(function (error, response) {


                // Now let's check our response
                expect(response).to.have.status(200);
                done();

            });

    });

    it("tries to GET  person demo", function (done) {


        chai.request(app)
            .get('/api/person/demo')
            .set('Authorization', 'JWT ' + token)
            .end(function (error, response) {


                // Now let's check our response
                expect(response).to.have.status(403);
                done();

            });

    });


    it("User 2 tries to GET person created by User 1", function (done) {


        chai.request(app)
            .get('/api/person/'+id2+'')
            .set('Authorization', 'JWT ' + token2)
            .end(function (error, response) {


                // Now let's check our response
                expect(response).to.have.status(403);
                done();

            });

    });

    it("User 2 tries to PUT person created by User 1", function (done) {


        chai.request(app)
            .put('/api/person/'+id2+'')
            .send(person2)
            .set('Authorization', 'JWT ' + token2)
            .end(function (error, response) {


                // Now let's check our response
                expect(response).to.have.status(403);
                done();

            });

    });

    it("User 2 tries to DELETE person created by User 1", function (done) {


        chai.request(app)
            .delete('/api/person/'+id2+'')
            .set('Authorization', 'JWT ' + token2)
            .end(function (error, response) {


                // Now let's check our response
                expect(response).to.have.status(403);
                done();

            });

    });

    it("User PUT postDemo created by User 2,from the same permission group", function (done) {

        var demo = {
            title:"EDITED TITLE"
        };

        chai.request(app)
            .put('/api/post-demo/'+idPostDemo+'')
            .set('Authorization', 'JWT ' + token)
            .send(demo)
            .end(function (error, response) {


                // Now let's check our response
                expect(response).to.have.status(200);
                done();

            });

    });

    it("User 3 tries to PUT postDemo created by User 2,from different permission group", function (done) {

        var demo = {
            title:"EDITED TITLE 2"
        };

        chai.request(app)
            .put('/api/post-demo/'+idPostDemo+'')
            .set('Authorization', 'JWT ' + token3)
            .send(demo)
            .end(function (error, response) {


                // Now let's check our response
                expect(response).to.have.status(403);
                done();

            });

    });

    it("User 3 tries to DELETE postDemo created by User 2,from different permission group", function (done) {


        chai.request(app)
            .delete('/api/post-demo/'+idPostDemo+'')
            .set('Authorization', 'JWT ' + token3)
            .end(function (error, response) {


                // Now let's check our response
                expect(response).to.have.status(403);
                done();

            });

    });

    it("User DELETE postDemo created by User 2,from the same permission group", function (done) {


        chai.request(app)
            .delete('/api/post-demo/'+idPostDemo+'')
            .set('Authorization', 'JWT ' + token)
            .end(function (error, response) {


                // Now let's check our response
                expect(response).to.have.status(200);
                done();

            });

    });



});