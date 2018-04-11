var chai = require('chai');
var expect = chai.expect;
var RoleService = require('../services/RoleService');
var path = require('path');

describe('RoleService', function() {

    it('IsAuthorized should return either the permission level if the user is authorized, or false', function(done) {


        var user = {role:'User'};
        var req = {method:"GET",baseUrl:"/api",path:"/user/"};

        var rolesPath =path.join(require('app-root-dir').get(),"test/roles.json");

        expect(RoleService.IsAuthorized(user,req,rolesPath)).to.equal(1);


        req.method ="DELETE";
        req.path = "/user/12313";
        expect(RoleService.IsAuthorized(user,req,rolesPath)).to.equal(2);

        req.method="PUT";
        expect(RoleService.IsAuthorized(user,req,rolesPath)).to.equal(3);


        req.method="POST";
        expect(RoleService.IsAuthorized(user,req,rolesPath)).to.equal(false);


        req = {method:"GET",baseUrl:"/api",path:"/user/find-friends/1234"};

        expect(RoleService.IsAuthorized(user,req,rolesPath)).to.equal(2);


        req = {method:"GET",baseUrl:"/api",path:"/user/find-friends"};
        expect(RoleService.IsAuthorized(user,req,rolesPath)).to.equal(false);


        user = {role:'Api Manager'};
        req = {method:"GET",baseUrl:"/api",path:"/user/find-friends/1234"};
        expect(RoleService.IsAuthorized(user,req,rolesPath)).to.equal(3);


        req.path ="/streaming/1231231/play";
        expect(RoleService.IsAuthorized(user,req,rolesPath)).to.equal(1);

        req.path ="/streaming/1231231";
        req.method ="PUT";
        expect(RoleService.IsAuthorized(user,req,rolesPath)).to.equal(2);

        user = {role:'Publisher'};
        expect(RoleService.IsAuthorized(user,req,rolesPath)).to.equal(false);


        req = {method:"DELETE",baseUrl:"/api",path:"/user/delete-friend/1234"};

        expect(RoleService.IsAuthorized(user,req,rolesPath)).to.equal(1);

        req.method ="DELETE";
        user.role='User';
        expect(RoleService.IsAuthorized(user,req,rolesPath)).to.equal(3);


        req.method ="POST";
        user.role='User';
        req.path="/person";
        expect(RoleService.IsAuthorized(user,req,rolesPath)).to.equal(1);


        req.method="PUT";
        req.path="/person/123123";
        expect(RoleService.IsAuthorized(user,req,rolesPath)).to.equal(3);


        req.method="GET";
        user.role ="Root";
        req.path="/pet/211111";
        expect(RoleService.IsAuthorized(user,req,rolesPath)).to.equal(3);


        req.method="GET";
        user.role ="Root";
        req.path="/pet";
        expect(RoleService.IsAuthorized(user,req,rolesPath)).to.equal(3);



        req.method="POST";
        user.role ="Root";
        req.path="/pet";
        expect(RoleService.IsAuthorized(user,req,rolesPath)).to.equal(3);


        req.method="PUT";
        user.role ="Root";
        req.path="/pet/123123";
        expect(RoleService.IsAuthorized(user,req,rolesPath)).to.equal(3);


        req.method="DELETE";
        user.role ="Root";
        req.path="/pet/11111";
        expect(RoleService.IsAuthorized(user,req,rolesPath)).to.equal(3);





        done();




    });

    it('LoadMenu should return an object with menu items according to user role',function (done) {

        expect(RoleService.GetMenu({role:"User"},path.join(require('app-root-dir').get(),'test/roles-menu.json'))).to.deep.equal([
            {
                "text":"menu.products",
                "href":"/products"
            },
            {
                "text":"Demo",
                "href":"/demo"
            },
            {
                "text":"Demo 1",
                "href":"/demo1"
            }
        ]);

        expect(RoleService.GetMenu({role:"Publisher"},path.join(require('app-root-dir').get(),'test/roles-menu.json'))).to.equal(false);



        expect(RoleService.GetMenu({role:process.env.APP_SU_ROLE},path.join(require('app-root-dir').get(),'test/roles-menu.json'))).to.deep.equal([{
            "text":"menu.products",
            "href":"/products"
        },
            {
                "text":"Demo",
                "href":"/demo"
            },{
                "text":"Demo 1",
                "href":"/demo1"
            }]);


        done();




    });




});