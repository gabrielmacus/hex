
app
    .directive('uploadField', function counter() {
        return {
            restrict:"E",
            scope: {
                label:"=",
                uploadUrl:"@",
                saveUrl:"@",
                gallery:"=",
                onProcess:"=",
                onUpload:"=",
                //galeriesUrl:"@",
                model:"="
            } ,
            link: function (scope, element, attrs) {

                var fileUploadElement = element[0].querySelector("[type='file']");


                fileUploadElement.addEventListener('change',function (e) {

                    var data = new FormData();

                    var files = fileUploadElement.files;

                    for(var i =0 ;i<files.length;i++)
                    {
                        data.append(files[i].name,files[i]);
                    }
                    if(!scope.onProcess)
                    {
                        scope.upload(data);
                    }
                    else
                    {
                        scope.onProcess(data);
                    }


                });

            },
            controller:function ($scope,$rootScope,$location,$window) {



                $scope.model = [];


                $scope.upload=function (data) {
                    $scope.uploading = {uploadPercent:0};
                    axios.put($scope.uploadUrl, data,
                        {
                            headers:$rootScope.headers,
                            onUploadProgress: function(progressEvent) {
                                var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total )
                                $scope.uploading.uploadPercent=percentCompleted;
                                $scope.$apply();
                            }
                        })
                        .then(function (res) {

                            res.data.forEach(function (file) {

                                file.gallery = $scope.gallery;
                                $scope.model.push(file);

                            })
                            $scope.uploading = false;
                            $scope.$apply();


                        })
                        .catch(function (error) {

                            $scope.model.splice(i,1);

                            $rootScope.errorHandler(error);

                        });
                }

                /*
                $scope.saveFiles=function () {

                    asyncForEach($scope.model,function () {



                    },function (item,index,next) {

                        axios.post($scope.saveUrl,item,{headers:$rootScope.headers})
                            .then(function (response) {

                                console.log(response);
                                next();

                            })
                            .catch($rootScope.errorHandler);
                    })



                }*/

            },

            templateUrl:"/views/directives/upload-template.html"
        };
    });