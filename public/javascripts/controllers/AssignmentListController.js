app.controller('assignment-list-controller', function ($scope,$rootScope,$routeParams,$window,$location,$controller) {


    var today=new Date();

    $scope.model='assignment';
    $scope.sort='-date';

    $scope.from  = new Date(today.getFullYear(),today.getMonth(),today.getDate(),0,0,0,0);
    $scope.to = new Date(today.getFullYear(),today.getMonth(),today.getDate(),23,59,0,0);
    $scope.url='/api/assignment/date?from='+$scope.from.toISOString()+'&to='+$scope.to.toISOString();

    $controller('list-controller',{$scope:$scope,$routeParams:$routeParams});


});