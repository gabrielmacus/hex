
app
    .directive('top', function counter() {
        return {
            restrict:"E",
            scope: {
                title:"=",
                titleObject:"="
            },

            link: function (scope, element, attrs) {


            },
            controller: function ($scope) {

            },

            templateUrl:"/views/directives/top-template.html"
        };
    });