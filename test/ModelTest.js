var chai = require('chai');
var expect = chai.expect;
var app = require('../app');
var ModelService = require('../services/ModelService')
describe('Model Test', function() {



    it('Clears deleted references without subkey', function(done) {

        var doc = {images:[{_id:'123123123',filename:'demo.jpg'},null,{_id:'34534534',filename:'demo2.jpg'}]};

        var doc2  =ModelService.ClearDeletedReferences(doc,'images');

        expect(doc2).to.deep.equal({images:[{_id:'123123123',filename:'demo.jpg'},{_id:'34534534',filename:'demo2.jpg'}]});

        done();
    });
    it('Clears deleted references with subkey', function(done) {

        var doc = {images:[{"image":{_id:'123123123',filename:'demo.jpg'},"text":"edmasddas"},{image:null,text:"asadads"},{image:{_id:'34534534',filename:'demo2.jpg'},text:"asdads"}]};

        expect(ModelService.ClearDeletedReferences(doc,'images','image'))
            .to.deep.equal({images:[{"image":{_id:'123123123',filename:'demo.jpg'},"text":"edmasddas"},{image:{_id:'34534534',filename:'demo2.jpg'},text:"asdads"}]});
        done();
    });


});