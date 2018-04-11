app.controller('client-controller', function ($sce,$scope,$rootScope,$routeParams,$cookies,$location,$compile,$interval,$http,$controller) {

    $scope.loadFromExcel=function (files) {

       axios({url:'/api/file/parse-excel',data:files,headers:$rootScope.headers,method:'PUT'})
           .then(function (response) {
               var parsedExcel = response.data;
               var clients=[];

               console.log(parsedExcel);

               var clientsExcel =parsedExcel[0]['data'];

               for(var k in clientsExcel)
               {
                   var data = parsedExcel[0]['data'][k];

                   if(k!=0)
                   {
                       if(data[1] || data[2] || data[3] || data[4])
                       {
                           clients.push({name:data[1],surname:data[2],emails:[data[3]],phones:[data[4]]})
                       }

                   }
               }

               asyncForEach(clients,function (err) {

                   $scope.loadList();

               },function (item,index,next) {

                   $scope.item = item;
                   $scope.saveItem(function (response) {
                       next();
                   });

               });


           })
           .catch($rootScope.errorHandler);
    }
    $controller('save-controller',{$scope:$scope,$routeParams:$routeParams});
});