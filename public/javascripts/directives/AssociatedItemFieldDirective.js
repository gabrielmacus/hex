
app
    .directive('associatedItemField', function counter() {
        return {
            restrict:"E",
            scope: {
                model:'=',
                ref:'@',
                label:'@',
                addUrl:'@',
                selectUrl:'@',
                template:'=',
                max:'@',
                validationErrors:'='
            },
            transclude:true,

            link: function (scope, element, attrs) {

                scope.modelName = attrs.model;
            },
            controller: function ($scope,$rootScope,$location,$cookies,$window,$timeout) {

                $scope.sortableConf = {
                    animation: 350,
                    chosenClass: 'sortable-chosen',
                    handle: '.grab-handle',
                    forceFallback: true,
                };

                $scope.$watch('model',function (newValue,oldValue) {


                    if(!$scope.associatedPreviews)
                    {
                        $scope.associatedPreviews = {};
                    }
                    if(!$scope.associatedPreviews[$scope.modelName])
                    {
                        $scope.associatedPreviews[$scope.modelName] = {};
                    }



                    if(newValue instanceof Array)
                    {

                    }
                    else if(newValue instanceof  Object)
                    {

                    }

                });


                /*
                if(!$scope.ref)
                {
                    $scope.ref = 'file';
                }*/

                if(!$scope.model  && (!$scope.max || $scope.max>1))
                {
                    $scope.model = [];
                }
                $scope.deleteAssociatedItem=function (k) {


                    if($scope.model instanceof Array)
                    {
                        if($scope.ref)
                        {
                            delete $scope.associatedPreviews[$scope.model[k][$scope.ref]._id];
                        }
                        else
                        {
                            delete $scope.associatedPreviews[$scope.model[k]._id];
                        }

                        $scope.model.splice(k,1);
                    }
                    else
                    {
                        if($scope.ref)
                        {
                            delete $scope.associatedPreviews[$scope.model[$scope.ref]];
                        }
                        else
                        {
                            delete $scope.associatedPreviews[$scope.model];
                        }

                        $scope.model =  "";
                    }


                }
                $scope.setIframe=function () {
                    var iframe = document.querySelector("[data-id='"+$scope.modelName+"']");
                    /*
                    var parentAngular = window.parent.angular;
                    var iframeScope = parentAngular.element($window.frameElement).scope();
                    */
                    //var iframeScope = iframe.contentWindow.angular.element(iframe.contentWindow.document.body).scope();


                    iframe.onload=function () {
                        $timeout(function () {

                            iframe.contentWindow.postMessage({data:{model:$scope.modelName},type:'popup-data'},window.location.origin);

                        },100);
                    }


                    //iframe.contentWindow.postMessage() =  {model:$scope.modelName};
                    //$scope.iframe.contentWindow.app.popup = {model:$scope.modelName}

                }
                $scope.openSelectExistant=function () {

                    $scope.lightboxOptions={
                        open:true,
                        src:$scope.selectUrl//window.location.origin+'/?popup=true&access_token='+$cookies.get('access_token')+'#!/'+$scope.modelName+'/?model='+$scope.modelName
                    }


                    $scope.setIframe();


                }
                $scope.openAddNew=function () {
                    $scope.lightboxOptions={
                        open:true,
                        src:$scope.addUrl//window.location.origin+'/?popup=true&access_token='+$cookies.get('access_token')+'#!/'+$scope.modelName+'/?model='+$scope.modelName+'&exclude='
                    }
                    $scope.setIframe();

                }

    /*
    *             var qs = $location.search();
                if(qs.model)*/



                $window.addEventListener('message', function(event){

                    if (typeof(event.data) !== 'undefined' && event.data.model == $scope.modelName && event.origin == window.location.origin){

                        // handle message
                        event.data.items.forEach(function (data) {

                            if($scope.max && $scope.max == 1)
                            {
                                $scope.model = data;
                            }
                            else
                            {
                                $scope.model.push(data);
                            }


                        });

                            /*
                            if(!$scope.associatedPreviews)
                            {
                                $scope.associatedPreviews = {};
                            }
                            if(!$scope.associatedPreviews[$scope.modelName])
                            {
                                $scope.associatedPreviews[$scope.modelName] = {};
                            }

                            // handle message
                            event.data.items.forEach(function (f) {

                                var data = {} ;
                                if($scope.ref)
                                {
                                    data[$scope.ref] = f._id;
                                }
                                else
                                {
                                    data  = f._id;
                                }
                                $scope.associatedPreviews[$scope.modelName][f._id] = f;

                                if($scope.max && $scope.max == 1)
                                {
                                    $scope.model = data;
                                }
                                else
                                {
                                    $scope.model.push(data);
                                }


                            });

                            */

                        $scope.lightboxOptions.open=false;


                        $scope.$apply();
                    }
                });

                //

            },

            templateUrl:"/views/directives/associated-item-template.html"
        };
    });