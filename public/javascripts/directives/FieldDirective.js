
app
    .directive('field', function counter() {
        return {
            restrict:"E",
            scope: {
                type:"@",
                label:"@",
                model:"=",
                validationErrors:"=",
                options:"@"
            },

            transclude: true,
            link: function (scope, element, attrs, ctrl,transclude) {

                if(attrs.model)
                {
                    scope.modelName = attrs.model;
                }
            },
            controller: function ($scope,$rootScope,$element ,$transclude,$timeout) {
              if(!$scope.type)
              {
                  $scope.type="text";
              }




                if($scope.type == 'custom')
                {
                    $timeout(function () {
                    //DOM has finished rendering
                        var transcludeElements = $transclude();

                        for(var i = 0;i<transcludeElements.length;i++)
                        {
                            $element.find('div')[0].prepend(transcludeElements[i]);
                        }

                      });

                }

                $scope.processTagInput=function (e,tagsArray) {
                  var tags = e.target.value;
                  var commaIdx =tags.indexOf(",");
                  if(commaIdx >-1)
                  {
                      var tag = tags.replace(",","");
                      if(tagsArray.indexOf(tag)==-1)
                      {
                          tagsArray.push( tag);
                      }

                      e.target.value="";


                  }

                }

            },

            templateUrl:"/views/directives/field-template.html"
        };
    });