
app
    .directive('associatedFileField', function counter() {
        return {
            restrict:"E",
            scope: {
                gallery:"=",
                model:'=',
                ref:'@',
                label:'@'
            },
            transclude:true,

            link: function (scope, element, attrs) {

                scope.modelName = attrs.model;

            },
            controller: function ($scope,$rootScope,$location,$cookies,$window) {

                $scope.sortableConf = {
                    animation: 350,
                    chosenClass: 'sortable-chosen',
                    handle: '.grab-handle',
                    forceFallback: true,
                };
                if(!$scope.ref)
                {
                    $scope.ref = 'file';
                }

                if(!$scope.model)
                {
                    $scope.model = [];
                }
                $scope.deleteAssociatedFile=function (k) {

                    $scope.model.splice(k,1);

                }
                $scope.openUploadFromDevice=function () {

                    $scope.lightboxOptions={
                        open:true,
                        src:window.location.origin+'/?popup=true&access_token='+$cookies.get('access_token')+'#!/gallery/'+$scope.gallery+'/upload?model='+$scope.modelName
                    }

                }
                $scope.openUploadFromGallery=function () {
                    $scope.lightboxOptions={
                        open:true,
                        src:window.location.origin+'/?popup=true&access_token='+$cookies.get('access_token')+'#!/gallery/'+$scope.gallery+'/files?model='+$scope.modelName+'&exclude='
                    }
                }

    /*
    *             var qs = $location.search();
                if(qs.model)*/



                $window.addEventListener('message', function(event){

                    if (typeof(event.data) !== 'undefined' && event.data.model == $scope.modelName){

                        // handle message
                        event.data.items.forEach(function (f) {

                            var data = {} ;
                            data[$scope.ref] = f;
                            $scope.model.push(data);
                        });

                        $scope.lightboxOptions.open=false;

                        $scope.$apply();
                    }
                });

                //

            },

            templateUrl:"/views/directives/associated-file-template.html"
        };
    });