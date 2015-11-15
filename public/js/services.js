var services = angular.module('services', []);

services.factory('apiServices', ['$http', '$q', '$log', function($http, $q, $log){

   var service = {
       searchByProximity: searchByProximity,
       getSchool: getSchool,
       getNearSchoolCrimes: getNearSchoolCrimes
   };

   return service;

    function searchByProximity(lat, long, type, phase){
        var deferred = $q.defer();
        var request = {
            method: 'GET',
            url: '/api/schools/identify',
            params: {
                lat: lat,
                lon: long,
                type: type,
                phase: phase
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

    function getNearSchoolCrimes(schoolId){
        var deferred = $q.defer();
        var request = {
            method: 'GET',
            url: '/api/crimes/identify',
            params: {
                schoolId: schoolId
            }
        };
        $http(request).success(function(response){
            console.debug("Get near school crimes OK");
            deferred.resolve(response);
        }).error(function(data, status){
            deferred.reject("Get near school crimes", data, status);
        });

        return deferred.promise;
    }

}]);