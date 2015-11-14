var sidebar = angular.module('sidebar', ['services', 'utils']);

var htmlPath = '../html/directives/';

sidebar.directive('results', function(){
   return {
       restrict: 'E',
       controller: function($scope, apiServices, graphicUtils){
           console.debug("MAP is", map);
           //data init
           apiServices.searchByProximity(51.505, 0.06).then(function(schools){
               $scope.schools = schools;
           });

           this.showDetail = function(id){
               if(id){
                   console.debug("showDetail() urn=", id);
                   apiServices.getSchool(id).then(function(school){
                       $scope.schoolDetail = school;
                       graphicUtils.addSchoolToMap(school.geojson);
                   });
               }
           }


       },
       controllerAs: 'resultsCtrl',
       templateUrl: htmlPath+'results.html'
   }
});

sidebar.directive('detail', function(){
    return {
        restrict: 'E',
        controller: function(){

        },
        controllerAs: 'detailCtrl',
        templateUrl: htmlPath+'detail.html'
    }
});

var toolbar = angular.module('toolbar', ['services']);

toolbar.directive('tools', function(){
    return {
        restrict: 'E',
        controller: function($scope, apiServices){
            this.identify = function(){
                console.debug("Btn clicker");
                map.addOneTimeEventListener('click', function(e){
                    console.debug("Latlng click", e.latlng);
                    apiServices.searchByProximity(e.latlng.lat, e.latlng.lng).then(function(schools){
                        $scope.schools = schools;
                    });
                });
            };

            this.deactivateTools = function(){
                console.debug("Deactivating identify");
            };
        },
        controllerAs: 'toolsCtrl',
        templateUrl: htmlPath+'tools.html'
    }
});
