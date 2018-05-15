app.controller('package-controller', function (toastr ,$sce,$scope,$rootScope,$routeParams,$cookies,$location,$compile,$interval,$http,$controller) {

    $scope.loadFromExcel=function (files) {
        toastr.info("", $scope.$eval('"package.loadingExcel" | translate'));

       axios({url:'/api/file/parse-excel',data:files,headers:$rootScope.headers,method:'PUT'})
           .then(function (response) {


               var data = response.data;

               var sheet = false;


               data.forEach(function (t) {

                   if(t.data && t.data[0]  && t.data[0].indexOf("Destino_Nombre") > -1  && t.data[0].indexOf("Destino_Comentarios") > -1  && t.data[0].indexOf("Mail_Destinatario") > -1 )
                   {
                       sheet = t.data;
                   }

               })

               var parsedValues = [];

               if(sheet)
               {
                   for(var k in sheet)
                   {
                       if(k!=0)
                       {
                           var parsedObject = {};

                           for(var j in sheet[0])
                           {
                               parsedObject[sheet[0][j]] =sheet[k][j];
                           }
                           parsedValues.push(parsedObject);

                       }
                   }
               }
               else
               {

                   toastr.error("", $scope.$eval('"package.error.excelWrongFormat" | translate'));

                   return false;
               }


               asyncForEach(parsedValues,function (err) {

                   $scope.loadList();
               },function (item,index,next) {

                   if(item.Destino_Nombre && item.Destino_Comentarios)
                   {
                       $scope.item = {client:{name:item.Destino_Nombre,email:item.Mail_Destinatario,phone:item.Destino_Comentarios},external_id:item.Nro_Externo,destination_address:item.Destino_Dir,destination_city:item.Destino_w3w,destination_zip:item.Destino_Dir_Comentarios};

                       $scope.saveItem(function (response) {
                           next();});
                   }
                   else {
                       next();
                   }



               });




               console.log(parsedValues);



               return false;

               /*
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

               });*/


           })
           .catch($rootScope.errorHandler);
    }
    $controller('save-controller',{$scope:$scope,$routeParams:$routeParams});
});