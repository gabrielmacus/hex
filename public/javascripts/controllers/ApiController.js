app.controller('api-controller', function ($scope,$rootScope,$routeParams,$window,$location) {

    $scope.load = function (url,key) {
        if(!$scope[key])
        {
            $scope[key] = [];
        }

        axios.get(url,{headers:$rootScope.headers})
            .then(function (response) {

                $scope[key] = (response.data.docs)?response.data.docs:response.data;
                $scope.$apply();

            })
            .catch($rootScope.errorHandler);
    };

});