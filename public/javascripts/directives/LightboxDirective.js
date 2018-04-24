
app
    .directive('lightbox', function counter() {
        return {
            restrict:"E",
            scope: {
                options:"="
            },
            transclude: true,
            link: function (scope, element, attrs) {


            },
            controller: function ($scope,$element,$timeout,$transclude,$compile) {

                $scope.closeLightbox=function () {
                    $scope.options.open=false;
                    if($scope.options.onClose)
                    {
                        $scope.options.onClose($scope);
                    }
                }
            },

            templateUrl:"/views/directives/lightbox-template.html"
        };
    });