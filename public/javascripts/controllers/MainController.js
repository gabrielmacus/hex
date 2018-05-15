app.controller('main-controller', function (toastr,$sce,$scope,$rootScope,$routeParams,$cookies,$location,$compile,$window) {


    $rootScope.Date = Date;

    $rootScope.currentUser = user;
    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    }
    $rootScope.accessToken = $cookies.get("access_token");
    $rootScope.headers = {'Authorization':'JWT '+$rootScope.accessToken};


    
    $rootScope.errorHandler=function (error) {
        //alert("Error");
        console.log(error);

        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);

            switch (error.response.status)
            {
                default:
                    toastr.error("", $scope.$eval('"error.500" | translate'));
                    break;
                case 404:
                    toastr.warning("", $scope.$eval('"error.404" | translate'));
                    break;
                case 401:
                    toastr.warning("", $scope.$eval('"error.401" | translate'));

                    break;
                case 403:
                    if(error.response.config.method == 'get')
                    {

                        toastr.warning("", $scope.$eval('"error.403.GET" | translate'));
                    }
                    else
                    {

                        toastr.warning("", $scope.$eval('"error.403" | translate'));
                    }

                    break;
            }

        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js

            toastr.error("", $scope.$eval('"error.network" | translate'));

        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
        //toastr.error('Hello world!', 'Toastr fun!');


    }
    $window.addEventListener('message', function(event) {

        if(event.data && event.data.type && event.origin == window.location.origin)
        {
            switch (event.data.type)
            {
                case 'popup-data':

                    $rootScope.popupData = event.data.data;

                    break;
            }
        }

    });


    var defaultActions=
        [
            {
                "text":"edit", "action": function (i) {

                $location.path('/'+$routeParams.model+'/'+i._id+'/save')
            }
            },
            {
                "text":"delete", "action":
                function (i) {

                    $rootScope.confirmDialog=
                        {
                            yes:function () {

                                $rootScope.deleteElement(i._id);
                                $rootScope.confirmDialog.open=false;

                            },
                            class:{"hide-close":true},
                            title:"confirm.delete",
                            titleData:{name:(i.title || i.name || i.filename || i._id)},
                            open:true
                        };


                }
            },
            {
                "class":{"show-on-popup":true,"select":true},"text":"select","action":function (i) {

                i.selected = true;
            }
            },
            {
                "class":{"show-on-popup":true,"unselect":true},"text":"unselect","action":function (i) {
                i.selected = false;
            }
            }
        ];
    $rootScope.defaultActions = function (i) {

        return defaultActions;

    };

    var galleryActions =defaultActions.concat(
            [{"text":"viewFiles","action":function (g) {

            $location.path('/gallery/'+g._id+'/files/');

            }},
            {"text":"uploadFiles","action":function (g) {

            $location.path("/gallery/"+g._id+"/upload");

            }}

         ]);
    var streamingActions = [{text:'streaming.watch',action:function (i) {

            $location.path('/streaming/'+i._id+'/watch');

        }}];
    var personActions = defaultActions.concat([{
        "text":"person.getAssignments",
        "action":function (p) {

            return $location.path('/assignment').search({titleObject:JSON.stringify(p),title:'person.assignments.title',filter:JSON.stringify({"persons":{"$all":[p._id]}})});
// {"persons":{"$all":["5acd8961c1c02a4e7aadc5e5"]}}
           // $location.path('');

        }
    }]);;
    $rootScope.config={
        product:{fields:["title",{label:'image',field:'images',render:function(item){

            if(item.images.length)
            {
                return "<img src='"+item.images[0].image.path+"'>";

            }
        }}]},
        user:{fields:['name']},
        "facebook-post":{fields:['title','description','price',{label:'type',field:'type',render:function (item) {

                return $scope.$eval("'facebook.post.type."+item.type+"' | translate ");
        }}]},
        gallery:{

            fields:['name'],
            actions:function () {

                return  galleryActions;
            }

        },
        file:
            {

                fields:[
                    {label:'preview',field:'path',file:true},
                    'filename',
                    'description'
                ]
            },
        person:
            {
                query:{sort:"+lastAssignment,-surname,-name"},
                fields:['name','surname',{field:'lastAssignment',render:function (p) {

                    if( p.lastAssignment)
                    {
                        return new Date( p.lastAssignment).toLocaleDateString();
                    }
                    else {

                        return  $scope.$eval("'person.notAssignments' | translate ");
                    }

                }}],
                actions:function(){return personActions;}
            },
        assignment:
            {
              query:{sort:'-date'},
             fields:['title',{field:'date',render:function (i) {
                 return new Date(i.date).toLocaleDateString()
             }},{field:'persons',label:'person/s',render:function (i) {

                 var persons = i.persons.map(function (t) { return t.name+" "+t.surname });

                 return persons.join(", ");

             }},{field:'type',label:'type',render:function (i) {

                 return i.type.name;

             }}
             ,
                 {label:'assignmentPlace',field:'place',render:function (i) {

                     return i.place;

                 }}
             ]
            },
        "assignment-type":
            {
                fields:['name']
            },
            streaming:
                {
                 listController:'dynamic-list-controller',
                 fields:['path','views'], actions:function () {return streamingActions;}
            },
        client:{
            //footer:'/views/client-footer.html',
            fields:['name','surname','phone','email']
        },
        user:
            {
                fields:["username","name","surname","role"]
            },
        package:{
            footer:'/views/package-footer.html',
            fields:['external_id','destination_zip','destination_city','destination_address',{field:'status',label:'package.status',render:function (i) {

                return  $scope.$eval("'package.status."+i.status+"' | translate ");
            }},{field:'client',render:function (i) {


                return i.client.name;

            }}],
            listController:'package-controller'
        }


    };
});