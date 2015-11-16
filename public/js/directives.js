var sidebar = angular.module('sidebar', ['services', 'utils']);

var htmlPath = '../html/directives/';

sidebar.directive('results', function(){
   return {
       restrict: 'E',
       controller: function($scope, apiServices, graphicUtils){
           console.debug("MAP is", map);
           //data init
/*           apiServices.searchByProximity(51.505, 0.06).then(function(schools){
               $scope.schools = schools;
           });*/

           this.showDetail = function(id, index){
               $scope.selected = index;
               console.debug("Types is", $scope.checkedType, $scope.checkedPhase);
               if(id){
                   console.debug("showDetail() urn=", id);
                   apiServices.getSchool(id).then(function(school){
                       $scope.schoolDetail = school;
                       graphicUtils.addSchoolToMap(school);
                   });
               }
           };

           $scope.$watch('schools', function() {
               $scope.resultsError = null;
               if($scope.schools.length === 0){
                   $scope.resultsError = "No search results.";
               }
               $scope.selected = null;
           });

           $scope.$watch('schoolDetail', function(){
               $scope.crimeTypes = null;
               graphicUtils.clearCrimes();
               $scope.dangers = null;
           });

           this.isSelected = function(index){
                console.debug("Selected", $scope.selected, index);
               return (index != $scope.selected);
           };

       },
       controllerAs: 'resultsCtrl',
       templateUrl: htmlPath+'results.html'
   }
});

sidebar.directive('detail', function(){
    return {
        restrict: 'E',
        controller: function($scope, apiServices, graphicUtils){
            this.attributes = {
                "est_name": "Name",
                "est_type": "Type",
                "education_phase": "Education phase",
                "low_age": "Low age",
                "high_age": "High age",
                "street": "Street",
                "locality": "Locality",
                "town": "town",
                "postcode": "Postcode",
                "phone": "Phone",
                "website": "Website",
                "free_school_meals_percentage": "Free meals [%]",
                "pupils_number": "Pupils",
                "capacity": "Capacity",
                "admission_policy": "Admission policy",
                "religion": "Religion",
                "gender": "Gender"
            };

            this.getCrimeTypes = function(){
                apiServices.getNearSchoolCrimes($scope.schoolDetail.urn).then(function(crimes){
                    $scope.crimeTypes = crimes.crimes;
                    $scope.crimesCount = crimes.totalCount;
                    graphicUtils.addCrimesToMap(crimes.geojsons);
                });
            };

            this.getNearbyDangers = function(){
                apiServices.getNearSchoolDangers($scope.schoolDetail.urn).then(function(dangers){
                    $scope.dangersCount = dangers.length;
                    $scope.dangers = countDangersByType(dangers);
                });
            };

            function countDangersByType(dangers){
                var length = dangers.length;
                var countedDangers = {};
                for(var i=0; i< length; i++ ){
                    if(!countedDangers[dangers[i].amenity]){
                        countedDangers[dangers[i].amenity] = 1;
                    }else{
                        countedDangers[dangers[i].amenity]++;
                    }
                }
                return countedDangers;
            }

        },
        controllerAs: 'detailCtrl',
        templateUrl: htmlPath+'detail.html'
    }
});

var toolbar = angular.module('toolbar', ['services', 'utils']);

toolbar.directive('tools', function(){
    return {
        restrict: 'E',
        controller: function($scope, apiServices, graphicUtils){
            this.identify = function(){
                console.debug("Btn clicker");
                map.addOneTimeEventListener('click', function(e){
                    console.debug("Latlng click", e.latlng);
                    graphicUtils.addCurrentLocation(e.latlng.lat, e.latlng.lng);
                    apiServices.searchByProximity(e.latlng.lat, e.latlng.lng, $scope.checkedType, $scope.checkedPhase).then(function(schools){
                        $scope.schools = schools;
                    });
                });
            };

            this.deactivateTools = function(){
                console.debug("Deactivating identify");
            };

            this.toggleSettings = function(){
                $scope.$broadcast("toggleSettings");
            };
        },
        controllerAs: 'toolsCtrl',
        templateUrl: htmlPath+'tools.html'
    }
});

var allPhases= [
    {id: 0, text: 'Primary'},
    {id: 1, text: 'Secondary'},
    {id: 2, text: 'Nursery'}
];

var allTypes = [
    {id: 0, text: 'Uni'},
    {id: 1, text: 'Free school'},
    {id: 2, text: 'Academy'},
    {id: 3, text: 'College'}
];

toolbar.directive('settings', function(){
   return {
       restrict: 'E',
       controller: function($scope){
           var context = this;
           this.isShowed = false;
           this.allTypes = allTypes;
           this.allPhases = allPhases;

           //$scope.checkedType = allTypes[0].id;
           $scope.checkedPhase = allPhases[0].id;

           $scope.$on("toggleSettings", function(event){
               console.debug("Event tu");
               context.isShowed = !context.isShowed;
           });

           this.phaseChanged = function () {
               $scope.checkedType = null;
           };

           this.typeChanged = function () {
               $scope.checkedPhase = null;
           }

       },
       controllerAs: 'settingsCtrl',
       templateUrl: htmlPath+'settings.html'
   }
});

toolbar.directive('search', function(){
   return {
       restrict: 'E',
       controller: function($scope, $http, graphicUtils){

           this.querySchool = function(query){
                return $http({
                    url: '/api/schools',
                    method: 'GET',
                    params: {
                        name: query
                    }
                }).then(function(response){
                    console.debug("Searching schools...", response);
                    return response.data;
                });
           };

           this.onSelect = function(item){
               console.debug("Search select", item);
               $scope.schoolDetail = item;
               graphicUtils.addSchoolToMap(item);
               $scope.crimeTypes = null;
               graphicUtils.clearCrimes();
           };
       },
       controllerAs: 'searchCtrl',
       templateUrl: htmlPath+'search.html'
   }
});
