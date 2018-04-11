app.controller('save-controller', function ($scope,$rootScope,$routeParams,$location,$controller,$window) {


    $rootScope.bodyClass ={"save":true};
    $scope.item = {};
    var url ="/api/".concat($routeParams.model);
    $scope.model=$routeParams.model;

    $controller('api-controller',{$scope:$scope,$routeParams:$routeParams});


    $scope.loadItem=function () {

        console.log($routeParams);
        axios.get(url,{headers:$rootScope.headers})
            .then(function (response) {
                $scope.item = response.data;
                $scope.$apply();
            })
            .catch($rootScope.errorHandler);

    }


    if($routeParams.id)
    {
        $scope.id= $routeParams.id;
        url+="/"+$routeParams.id;


        $scope.loadItem();
    }



    $scope.saveItem=function (callback) {

        $scope.validationErrors = {};
        axios({
            url:url,
            method:($routeParams.id)?"PUT":"POST",
            headers:$rootScope.headers,
            data:$scope.item
        })
            .then(function (response) {

                if(callback)
                {
                    return callback(response);
                }

                $location.path("/"+$scope.model);
                $scope.$apply();


                var qs= $location.search();

                if(qs.model)
                {
                    $window.parent.postMessage({items:(typeof response.data != 'Array')?[response.data]:response.data,model:qs.model},'*');
                }

            })
            .catch(function(error){

                console.log(error.response);

                if(error.response && error.response.data.type && error.response.data.type == 'ValidationError')
                {

                    $scope.validationErrors = error.response.data.details;


                    $scope.$apply();



                }
                else
                {
                    $rootScope.errorHandler(error);
                }



            });

    }



});