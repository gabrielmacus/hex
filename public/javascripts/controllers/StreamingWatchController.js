app.controller('streaming-watch-controller', function ($sce,$scope,$rootScope,$routeParams,$cookies,$location,$compile,$interval,$http,$controller) {


    $controller('save-controller',{$scope:$scope,$routeParams:$routeParams});
    var flvPlayer = null;
    $scope.$watch('item',function (newItem,oldItem) {

        if(newItem.path)
        {
            if (flvjs.isSupported()) {
                var videoElement = document.getElementById('videoElement');
                 flvPlayer = flvjs.createPlayer({
                    type: 'flv',
                    url: 'http://'+media_url+$scope.item.path+".flv",
                     "isLive": true,
                });

                flvPlayer.attachMediaElement(videoElement);
                flvPlayer.load();
                flvPlayer.play();
            }

        }
    })

    $scope.$on('$destroy',function(){
        flvPlayer.pause();
        flvPlayer.unload();
        flvPlayer.detachMediaElement();
        flvPlayer.destroy();
        flvPlayer = null;
    });





});