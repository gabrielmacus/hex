
app
    .directive('assignmentList', function counter() {
        return {
            restrict:"E",
            scope: {
                items:"="
            },
            transclude:true,

            link: function (scope, element, attrs) {


            },
            controller: function ($scope,$rootScope,$location,$cookies,$window) {

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

                    $scope.assignments = {};
                    $scope.items.forEach(function (t) {

                        if(!$scope.assignments[t.date])
                        {
                            $scope.assignments[t.date] = [];
                        }

                        $scope.assignments[t.date].push(t);


                    });

                });


            },

            templateUrl:"/views/directives/assignment-list-template.html"
        };
    });