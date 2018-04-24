
var app = angular.module("app", ['toastr','ng-sortable','ngSanitize','ngAnimate',"checklist-model","ngRoute","pascalprecht.translate",'ngCookies','ngTagsInput']);
app.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);
app.filter('isArray', function() {
    return function(obj) {
        return obj instanceof Array;
    };
});
app.filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});
app.filter('trust', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);

app.directive('iframeOnLoad', [function(){
    return {
        scope: {
            iframeOnLoad: '='
        },
        link: function(scope, element, attrs){
            element.on('load', function(){
                return scope.iframeOnLoad(element[0]);
            })
        }
    }}])

app.config(function(toastrConfig) {
    angular.extend(toastrConfig, {
        maxOpened: 5,
        newestOnTop: true,
        positionClass: 'toast-bottom-right',
        preventOpenDuplicates:true
    });
});
app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "views/main-login.html",
            controller: "login-controller"
        })

});
app.config(['$translateProvider', function ($translateProvider, $translatePartialLoaderProvider) {
    $translateProvider.useStaticFilesLoader({
        files: [
            {
                prefix: '/locales/',
                suffix: '.json'
            }]
    });
    $translateProvider.preferredLanguage('es');
}]);


