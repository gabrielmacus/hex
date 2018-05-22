app.controller('save-controller', function (toastr,$scope,$rootScope,$routeParams,$location,$controller,$window) {


    $rootScope.bodyClass ={"save":true};
    $scope.item = {};
    var url ="/api/".concat($routeParams.model);
    $scope.model=$routeParams.model;

    $controller('api-controller',{$scope:$scope,$routeParams:$routeParams});


    $scope.loadItem=function () {

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

    $scope.status = 'ready';

    $scope.saveItem=function (callback,customUrl) {

        $scope.status  = 'sending';

        $scope.validationErrors = {};
        axios({
            url:(customUrl)?customUrl:url,
            method:($routeParams.id || $scope.item._id)?"PUT":"POST",
            headers:$rootScope.headers,
            data:angular.copy($scope.item)
        })
            .then(function (response) {
                $scope.status = 'ready';
                if(callback)
                {
                    return callback(response);
                }

                $location.path("/"+$scope.model);
                $scope.$apply();


                var qs= $location.search();

                if(qs.model)
                {
                    axios({
                        url:'/api/'+$scope.model+'/'+response.data._id,
                        method:"GET",
                        headers:$rootScope.headers
                    })
                        .then(function (response) {

                            $window.parent.postMessage({items:(typeof response.data != 'Array')?[response.data]:response.data,model:qs.model},'*');
                            $scope.$apply();

                        })
                        .catch($rootScope.errorHandler);

                }

            })
            .catch(function(error){
                $scope.status = 'ready';
                console.log(error.response);

                if(error.response && error.response.data.type && error.response.data.type == 'ValidationError')
                {

                    toastr.error($scope.$eval('"validation.error" | translate'))
                    $scope.validationErrors = error.response.data.details;


                    $scope.$apply();



                }
                else
                {
                    $rootScope.errorHandler(error);
                }

                if(callback)
                {

                    return callback(null,error);
                }


            });

    }



});