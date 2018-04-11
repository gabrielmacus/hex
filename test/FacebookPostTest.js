var chai = require('chai');
var expect = chai.expect;
var app = require('../app');
var FacebookPostService = require('../services/FacebookPostService')
describe('FacebookPosttest', function() {


    it('Mondays and tuesdays every 2 minutes, publish not previously executed', function(done) {

        var date = new Date(2018,2,19,22,53,0);

        var post = {frecuency:[{time: {
            number:2,
            unit:"m"
        }, days:[1,2]}]};

        //expect(FacebookPostService.checkTime(post,date)).to.equal(true);
        console.log(FacebookPostService.checkTime(post,date));
        done();

    });



    it('Mondays,tuesdays and saturdays, every 2 hours ,  previously executed', function (done) {
        var last_publish = new Date(2018, 2, 19, 20, 0, 0);
        date = new Date(2018, 2, 19, 22, 0, 0);
        post = {
            last_publish: last_publish,
            frecuency: [{
                time: {
                    number: 2,
                    unit: "h"
                },
                days: [1, 2, 6]
            }]
        };
        expect(FacebookPostService.checkTime(post, date)).to.equal(true);
        done();

    });


    it('tuesdays  and sundays, every 8 hours , previously executed', function (done) {
        var last_publish = new Date(2018, 2, 19, 10, 0, 0);
        date = new Date(2018, 2, 19, 17, 0, 0);
        post = {
            last_publish: last_publish,
            frecuency: [{
                time: {
                    number: 8,
                    unit: "h"
                },
                days: [1, 2, 6]
            }]
        };
        expect(FacebookPostService.checkTime(post, date)).to.equal(false);
        done();

    });

    it('tuesdays  and sundays, every 12 hours , previously executed', function (done) {
        var last_publish = new Date(2018, 2, 19, 10, 0, 0);
        date = new Date(2018, 2, 19, 22, 0, 0);
        post = {
            last_publish: last_publish,
            frecuency: [{
                time: {
                    number: 12,
                    unit: "h"
                },
                days: [1, 2, 6]
            }]
        };
        expect(FacebookPostService.checkTime(post, date)).to.equal(true);
        done();

    });

    it('tuesdays  and sundays, every 1 hour , previously executed', function (done) {
        var last_publish = new Date(2018, 2, 19, 10, 0, 0);
        date = new Date(2018, 2, 19, 11, 0, 0);
        post = {
            last_publish: last_publish,
            frecuency: [{
                time: {
                    number: 60,
                    unit: "m"
                },
                days: [1, 2, 6]
            }]
        };
        expect(FacebookPostService.checkTime(post, date)).to.equal(true);
        done();

    });


});