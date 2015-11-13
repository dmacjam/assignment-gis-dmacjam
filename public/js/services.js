var services = angular.module('services', []);

services.factory('apiServices', ['$http', '$q', '$log', function($http, $q, $log){

   var service = {
       searchByProximity: searchByProximity,
       getSchool: getSchool
   };

   return service;

    function searchByProximity(lat, long){
        var deferred = $q.defer();
        var request = {
            method: 'GET',
            url: '/api/identify',
            params: {
                lat: lat,
                lon: long
            }
        };
        $http(request).success(function(response){
            console.debug("Search by proximity OK");
            deferred.resolve(response);
        }).error(function(data, status){
           deferred.reject("Search by proximity failed", data, status);
        });

        return deferred.promise;
    }

    function getSchool(id){
        var deferred = $q.defer();
        var request = {
            method: 'GET',
            url: '/schools/'+id
        };

        $http(request).success(function(response){
            console.debug("Get school OK");
            deferred.resolve(response);
        }).error(function(data, status){
            deferred.reject("Get school failed", data, status);
        });

        return deferred.promise;
    }

}]);