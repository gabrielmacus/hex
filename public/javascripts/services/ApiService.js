
app.factory('api',function($rootScope) {

    return {

        load:function (url,array) {

            axios.get(url,{headers:$rootScope.headers})
                .then(function (response) {
                    array = response.data.docs;
                    $rootScope.$apply();
                })
                .catch($rootScope.errorHandler)
        }

    };
});