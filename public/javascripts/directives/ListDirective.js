
    app
        .directive('list', function counter() {
            return {
                restrict:"E",
                scope: {
                    items:"=",
                    fields:"=",
                    getActions:"=",
                    listStatus:"="
                },

                controller: function ($scope) {
                    if(!$scope.listStatus)
                    {
                        $scope.listStatus='loading';
                    }

                    $scope.toggleDropdown=function (i) {

                        if(!$scope.dropdown)
                        {
                            $scope.dropdown = {};
                        }

                        if( $scope.dropdown[i._id])
                        {
                            $scope.dropdown[i._id]=false;
                        }
                        else
                        {  for(var k in $scope.dropdown)
                        {
                            $scope.dropdown[k]= false;
                        }

                            $scope.dropdown[i._id]=true;
                        }

                    }
                },

                templateUrl:"/views/directives/list-template.html"
            };
        });