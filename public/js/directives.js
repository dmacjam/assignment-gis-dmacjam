var sidebar = angular.module('sidebar', ['services']);

var htmlPath = '../html/directives/';

sidebar.directive('results', function(){
   return {
       restrict: 'E',
       controller: function($scope, $http, apiServices){
           //data init
           apiServices.searchByProximity(51.505, 0.06).then(function(schools){
               $scope.schools = schools;
           });

           this.showDetail = function(id){
               if(id){
                   console.debug("showDetail() urn=", id);
                   apiServices.getSchool(id).then(function(school){
                       $scope.schoolDetail = school;
                   });
               }
           }


       },
       controllerAs: 'resultsCtrl',
       templateUrl: htmlPath+'results.html'
   }
});
