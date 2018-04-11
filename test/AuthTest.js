const path = require('path');
process.env.ROLES_PATH = path.join(require('app-root-dir').get(),"test/roles-rest.json");
process.env.NODE_ENV="test";
var dotenv = require('dotenv').config({path:path.join(require('app-root-dir').get(),'/env/test.env')});

const app = require('../app.js');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');

const User = require('../models/User');

chai.use(chaiHttp);

const mongoose  =require('mongoose');


describe('Auth test', function(){

    before(function (done) {

       db.dropDatabase();
        done();
        /*
        mongoose.connect(process.env.DB_STRING,function () {

            mongoose.connection.db.dropDatabase();
            done();
        });*/

    })
    
    after(function () {
        db.close();
    })

    it('Tries to GET user endpoint without logging in',function(done) {
        chai.request(app)
            .get('/api/user')
            .end(function(error, response) {

                /*if (error) done(error);*/
                // Now let's check our response
                expect(response).to.have.status(401);
                done();

            });
    });

    it('Tries to POST user endpoint without logging in',function(done) {
        chai.request(app)
            .post('/api/user')
            .send({
                name:"Gabriel",
                surname:"Macus",
                password:"demodemo",
                email:"gabrielmacus@gmail.com"
            })
            .end(function(error, response) {

                /*if (error) done(error);*/
                // Now let's check our response
                expect(response).to.have.status(401);
                done();

            });
    });

    it('Register an user',function(done) {
        chai.request(app)
            .post('/auth/register')
            .send({
                name:"Gabriel",
                surname:"Macus",
                password:"demodemo",
                email:"gabrielmacus@gmail.com",
                username:"gabrielmacus"
            })
            .end(function(error, response) {

                expect(response.body).to.have.property('status','pending-verification');
                //  expect(response.body.status).to.equal('pending-verification');
                // Now let's check our response
                expect(response).to.have.status(200);
                done();

            });
    });

    it('Register an user (2)',function(done) {
        chai.request(app)
            .post('/auth/register')
            .send({
                name:"Gabriel",
                surname:"Macus",
                password:"demodemo",
                email:"gabrielmacus2@gmail.com",
                username:"gabrielmacus2"
            })
            .end(function(error, response) {

                expect(response.body).to.have.property('status','pending-verification');
                //  expect(response.body.status).to.equal('pending-verification');
                // Now let's check our response
                expect(response).to.have.status(200);

                //mongoose.connect(process.env.DB_STRING);

                User.update({_id:response.body._id},{'$set':{status:'active'}},function (err,result) {

                    expect(result).to.have.property('nModified',1);

                    expect(err).to.be.null;

                    done();

                });


            });
    });

    it('Logs in with email to a non validated user',function(done) {
        chai.request(app)
            .post('/auth/token')
            .send({
                password:"demodemo",
                username:"gabrielmacus@gmail.com"
            })
            .end(function(error, response) {
                // Now let's check our response

                //expect(response.body).to.have.property('access_token');
                expect(response).to.have.status(401);
                done();

            });
    });

    it('Logs in with email to a validated user',function(done) {
        chai.request(app)
            .post('/auth/token')
            .send({
                password:"demodemo",
                username:"gabrielmacus2@gmail.com"
            })
            .end(function(error, response) {

                // Now let's check our response

                expect(response.body).to.have.property('access_token');
                console.log(response.body);
                expect(response).to.have.status(200);
                done();

            });
    });

    it('Logs in with username to a validated user',function(done) {
        chai.request(app)
            .post('/auth/token')
            .send({
                password:"demodemo",
                username:"gabrielmacus2"
            })
            .end(function(error, response) {

                // Now let's check our response

                expect(response.body).to.have.property('access_token');
                expect(response).to.have.status(200);
                done();

            });
    });

    it('Logs in with wrong password to a validated user',function(done) {
        chai.request(app)
            .post('/auth/token')
            .send({
                password:"demodemo2",
                username:"gabrielmacus2"
            })
            .end(function(error, response) {

                // Now let's check our response

                expect(response).to.have.status(400);
                done();

            });
    });

    var token ="";
    it('Logs in with username to a validated user',function(done) {
        chai.request(app)
            .post('/auth/token')
            .send({
                password:"demodemo",
                username:"gabrielmacus2"
            })
            .end(function(error, response) {
                // Now let's check our response

                expect(response.body).to.have.property('access_token');
                expect(response).to.have.status(200);
                token = response.body.access_token;
                done();

            });
    });






});