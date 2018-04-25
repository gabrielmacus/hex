app.controller('assignment-list-controller', function ($scope,$rootScope,$routeParams,$window,$location,$controller) {

    var today=new Date();
    var from = new Date();
    from.setHours(0,0,0,0);

    var to = new Date();
    to.setHours(23,59,0,0);

    /*
    var from  = new Date(today.getFullYear(),today.getMonth(),today.getDate(),0,0,0,0);
    var to = new Date(today.getFullYear(),today.getMonth(),today.getDate(),23,59,0,0);*/
    $scope.todayAssignmentsUrl = '/api/assignment?filter='+JSON.stringify({date:{'$gte':from.toISOString(),'$lte':to.toISOString()}});


    from  = new Date();
    from.setDate(from.getDate() + 1);
    from.setHours(0,0,0,0);
    console.log(from);
    $scope.futureAssignmentsUrl = '/api/assignment?filter='+JSON.stringify({date:{'$gte':from.toISOString()}});

    to  = new Date();
    to.setDate(to.getDate() - 1);
    from.setHours(0,0,0,0);
    $scope.pastAssignmentsUrl = '/api/assignment?filter='+JSON.stringify({date:{'$lte':to.toISOString()}});

    //$controller('list-controller',{$scope:$scope,$routeParams:$routeParams});

    /*
    *    $scope.model='assignment';
    $scope.sort='-updatedAt';
    var today=new Date();
    $scope.loadAssignmentsByDate = function (callback,from,to) {

        if(!from && !to)
        {
            from  = new Date(today.getFullYear(),today.getMonth(),today.getDate(),0,0,0,0);
            to = new Date(today.getFullYear(),today.getMonth(),today.getDate(),23,59,0,0);
            var url = '/api/assignment/date?from='+from.toISOString()+'&to='+to.toISOString();

        }
        else if (from && !to)
        {
            var url = '/api/assignment/date?from='+from.toISOString();

        }
        else if(!from && to)
        {
            var url = '/api/assignment/date?to='+to.toISOString();

        }

        axios.get(url,{headers:$rootScope.headers})
            .then(function (response) {

                callback(response);

            })
            .catch($rootScope.errorHandler);

    }

    //Today assignments
    $scope.loadAssignmentsByDate(function (response) {
        $scope.todayAssignments = response.data.docs;
        $scope.$apply();
    });


    //Future assignments
    var from  = new Date();
    from.setDate(from.getDate() + 1);

    $scope.loadAssignmentsByDate(function (response) {
        $scope.futureAssignments =response.data.docs;
        $scope.futurePagination = response.data.pagination;
        $scope.$apply();
    },from);

    //Past assignments
    var to  = new Date();
    to.setDate(to.getDate() - 1);

    $scope.loadAssignmentsByDate(function (response) {
        $scope.pastAssignments = response.data.docs;
        $scope.pastPagination = response.data.pagination;
        $scope.$apply();
    },false,to);


    //$controller('list-controller',{$scope:$scope,$routeParams:$routeParams});

    * */

});