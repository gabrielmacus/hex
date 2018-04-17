
app
    .directive('assignmentList', function counter() {
        return {
            restrict:"E",
            scope: {
                items:"=",
                emptyText:"@"
            },
            transclude:true,

            link: function (scope, element, attrs) {


            },
            controller: function ($scope,$rootScope,$location,$cookies,$window) {
                if(!$scope.emptyText)
                {
                    $scope.emptyText = 'assignments.empty';
                }

                $scope.loadPersons = function (p) {

                    var persons = p.persons.map(function (t) { return t.name+" "+t.surname });

                    return persons.join(", ");

                }
                $scope.isToday=function (date) {

                    var d = new Date(date);
                    var today = new Date();
                     if(d.getFullYear() == today.getFullYear() && d.getMonth() == today.getMonth() && d.getDate() == today.getDate())
                    {
                        return true;
                    }
                    return false;

                }
                $scope.loadDate=function (date) {
                    return new Date(date).toLocaleDateString();
                }
                $scope.$watch('items',function () {

                   if($scope.items && $scope.items.length)
                   {
                       $scope.assignments = {};
                       $scope.items.forEach(function (t) {

                           if(!$scope.assignments[t.date])
                           {
                               $scope.assignments[t.date] = [];
                           }

                           $scope.assignments[t.date].push(t);


                       });

                   }
                });


            },

            templateUrl:"/views/directives/assignment-list-template.html"
        };
    });