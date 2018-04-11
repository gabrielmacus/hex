var actionRoute = {
    templateUrl:function (params) {
        return '/views/'+params.action+'.html';
    },
    controller:function ($scope,$routeParams) {
        $scope.action = $routeParams.action;
        $scope.model  = $routeParams.model;
    }
};

app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "views/main.html",
            controller:"main-controller"
        })
        .when("/:model", {
            templateUrl: '/views/list.html',
            controller:"list-controller"
        })
        .when('/:model/save',
            {
                templateUrl:'/views/save.html',
                controller:'save-controller'
            })
        .when("/:model/:id/save",{
            templateUrl:'/views/save.html',
            controller:'save-controller'
        })
        .when("/:model/:action",actionRoute)
        .when("/:model/:id/:action",actionRoute)

});
