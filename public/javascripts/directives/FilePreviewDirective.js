
app
    .directive('filePreview', function counter() {
        return {
            restrict:"E",
            scope: {
                file:"="
            },
            transclude:true,

            link: function (scope, element, attrs) {


            },
            controller: function ($scope,filetype) {



                $scope.getType=function (mime) {
 
                    return filetype.get(mime);

                }

            },

            templateUrl:"/views/directives/file-preview-template.html"
        };
    });