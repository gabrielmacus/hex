app.controller('file-list-controller', function ($scope,$rootScope,$controller,$routeParams,$location) {

    $routeParams.model="file";

    $scope.saveUrl='/gallery/'+$routeParams.id+'/upload';

    $scope.goToSave=function () {

        $scope.saveUrl = (! $scope.saveUrl )?'/gallery/'+$scope.query.gallery+'/upload': $scope.saveUrl;


        if($location.search() && $location.search().model)
        {
            return  $location.path($scope.saveUrl).search($location.search());
        }

        $location.path($scope.saveUrl);
    }
    $controller('list-controller',{$scope:$scope,$routeParams:$routeParams});


    $rootScope.bodyClass ={"file-list":true,"list":true};
    $scope.query.gallery = $routeParams.id;


    $scope.currentGallery ='...';
    $scope.loadCurrentGallery=function () {
        axios.get('/api/gallery/'+$scope.query.gallery,{headers:$rootScope.headers})
            .then(function (response) {
                $scope.currentGallery =response.data.name;
                $scope.$apply();
            })
            .catch($rootScope.errorHandler);
    }
    $scope.loadCurrentGallery();

});