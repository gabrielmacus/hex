
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

                $scope.associatedLoadedOnce =false;

                $scope.onLoadAssociated=function () {



                    if(!$scope.associatedLoadedOnce)
                    {
                        var model = angular.copy($scope.model);

                        $scope.model = [];

                        console.log("CALLED SET MODEL ON LOAD");
                        $scope.associatedLoadedOnce = true;
                        $scope.setModel(model,true);
                    }



                }



                $scope.setModel=function (i,firstLoad) {

                    console.log("CALLED SET MODEL");
                    if(!$scope.associatedPreviews)
                    {
                        $scope.associatedPreviews = {};
                    }
                    if(!$scope.associatedPreviews[$scope.modelName])
                    {
                        $scope.associatedPreviews[$scope.modelName] = {};
                    }

                    var model =angular.copy(i);


                    if(!Array.isArray(model))
                    {
                        model = [model];
                    }


                    model.forEach(function (f) {


                        var data = {} ;
                        if($scope.ref)
                        {

                            //If it's first load, not only gets the id, but the rest of the properties too
                            if(firstLoad)
                            {

                                data  = angular.copy(f);
                                f = f[$scope.ref];
                                delete data._id;
                            }



                            data[$scope.ref] = f._id;



                        }
                        else
                        {
                            data  = f._id;
                        }
                        //If is first load, gets the object from the reference (in case the reference exists)
                        $scope.associatedPreviews[$scope.modelName][f._id] = f;//(firstLoad && $scope.ref)?f[$scope.ref]:f;


                        if($scope.max && $scope.max == 1)
                        {
                            $scope.model = data;
                        }
                        else
                        {
                            if(!Array.isArray($scope.model))
                            {
                                $scope.model=[];
                            }

                            $scope.model.push(data);
                        }


                    });

                }

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


                    iframe.onload=function () {
                        $timeout(function () {

                            iframe.contentWindow.postMessage({data:{model:$scope.modelName},type:'popup-data'},window.location.origin);
                            $scope.iframeLoaded=true;

                        },200);
                    }


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



                $window.addEventListener('message', function(event){

                    if (typeof(event.data) !== 'undefined' && event.data.model == $scope.modelName && event.origin == window.location.origin){

                        // handle message
                        $scope.associatedLoadedOnce = true;
                        console.log("CALLED SET MODEL ON MESSAGE");

                        $scope.setModel(event.data.items);
                        if($scope.lightboxOptions)
                        {
                            $scope.lightboxOptions.open=false;

                        }
                        $scope.iframeLoaded=false;
                        $scope.$apply();


                    }
                });

                //

            },

            templateUrl:"/views/directives/associated-item-template.html"
        };
    });