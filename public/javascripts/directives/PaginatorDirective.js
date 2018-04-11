
    app
        .directive('paginator', function counter() {
            return {
                restrict:"E",
                scope: {
                    pagination:"=",
                    offset:"=",
                    goto:"="
                },
                link:function (scope,element,attrs) {

                },
                controller: function ($scope) {

                    $scope.loadPaginator=function () {
                        $scope.paginator ={pages:[]};
                        $scope.pagination.page = parseInt($scope.pagination.page);

                        if($scope.pagination.page > 1)
                        {
                            for(var i=$scope.pagination.page - $scope.offset;i<$scope.pagination.page;i++)
                            {

                                if(i > 0)
                                {
                                    $scope.paginator.pages.push(i);
                                }
                            }
                            $scope.paginator.prev = $scope.pagination.page -1 ;
                        }

                        if($scope.pagination.page <= $scope.pagination.pages)
                        {

                            for(var i=$scope.pagination.page;i<= ($scope.pagination.page + $scope.offset);i++)
                            {

                                if(i <= $scope.pagination.pages)
                                {
                                    $scope.paginator.pages.push(i);
                                }
                            }


                        }
                        if($scope.pagination.page < $scope.pagination.pages)
                        {
                            $scope.paginator.next = $scope.pagination.page +1;
                        }
                        return $scope.paginator;
                    }

                    $scope.$watchCollection('pagination',function (newVal,oldVal) {
                        $scope.paginator = $scope.loadPaginator();
                    });




                },

                templateUrl:"/views/directives/paginator-template.html"
            };
        });