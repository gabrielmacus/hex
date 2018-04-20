app.controller('list-controller', function ($scope,$rootScope,$routeParams,$window,$location,$controller) {



    if(!$routeParams.model)
    {
        $routeParams.model = $scope.model;
    }
    else
    {
        $scope.model=$routeParams.model;
    }

    $scope.modelConfig = $rootScope.config[$routeParams.model];

    $scope.url = ( $scope.url)? $scope.url:"/api/".concat($routeParams.model);


    $scope.goToSave=function () {


        $scope.saveUrl = ($scope.saveUrl)? $scope.saveUrl:'/'+$scope.model+'/save';

        if($location.search() && $location.search().model)
        {
            return  $location.path($scope.saveUrl).search($location.search());
        }

        $location.path($scope.saveUrl);

    }

    $rootScope.bodyClass ={"list":true};
    $rootScope.bodyClass[$scope.model] = true;

    $scope.query = {page:1,sort:'-createdAt'};

    //If model has default query parameteres
    if($scope.modelConfig.query)
    {
        angular.extend($scope.query,$scope.modelConfig.query);
    }


    //Order by
    if($scope.sort || ($location.search() && $location.search().sort))
    {
        $scope.query.sort = ($scope.sort)?$scope.sort:$location.search().sort;
    }




    //List title
    if($location.search() && $location.search().title)
    {
        $scope.title = $location.search().title;
    }
    if($location.search() && $location.search().titleObject)
    {
        $scope.titleObject = $location.search().titleObject;
    }

    //Advanced filter
    if($location.search() && $location.search().filter)
    {
        //$scope.url += "?filter="+JSON.stringify($location.search().filter)
         //angular.extend($scope.query,$location.search().query);
        $scope.query.filter =$location.search().filter;
    }



    $scope.items = [];


    
    $scope.actions = ($scope.modelConfig.actions)?$scope.modelConfig.actions:$rootScope.defaultActions;

    $scope.footer = ($scope.modelConfig.footer)?$scope.modelConfig.footer:false;


    if ($scope.modelConfig.saveUrl)
    {
        $scope.saveUrl=$scope.modelConfig.saveUrl;
    }
    else if(!$rootScope.saveUrl)
    {
        $rootScope.saveUrl = false;
    }

    $scope.pagination = {};
    $scope.fields = $scope.config[$routeParams.model].fields;


    $scope.status='loading';

    $scope.goTo=function(pag)
    {
        $scope.query.page = pag;
        $scope.loadList();
    }

    $scope.loadList=function () {

        $scope.status='loading';

        axios({url:$scope.url,params:$scope.query,method:"get",headers:$scope.headers})

            .then(function (response) {

                if(response.data.docs.length == 0 && $scope.pagination.page > 1)
                {
                    $scope.goTo($scope.pagination.page - 1);
                }
                else
                {
                    $scope.items = response.data.docs;
                    $scope.pagination = response.data.pagination;
                    $scope.status='loaded';
                }
                $scope.$apply();


            })
            .catch(function (error) {
                $scope.status='loaded';

                $rootScope.errorHandler(error);

            });

    }

    $rootScope.deleteElement=function (id) {

        axios.delete('/api/'+$routeParams.model+'/'+id,{headers:$rootScope.headers})
            .then(function (response) {

                $scope.loadList();
                $scope.$apply();
            })
            .catch($rootScope.errorHandler);

    }

    $scope.acceptSelected=function () {




        var selected =$scope.items.filter(function (t) { return t.selected; });

        if($rootScope.popupData && $rootScope.popupData.model)
        {

            $window.parent.postMessage({items:selected,model:$rootScope.popupData.model},window.location.origin);
        }

    }

    $scope.loadList();

    if($scope.modelConfig.listController)
    {
        $controller($scope.modelConfig.listController,{$scope:$scope,$routeParams:$routeParams});
    }


});