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
               console.debug("Types is", $scope.checkedType, $scope.checkedPhase);
               if(id){
                   $scope.schoolDetail = null;
                   $scope.crimeTypes = null;
                   console.debug("showDetail() urn=", id);
                   apiServices.getSchool(id).then(function(school){
                       $scope.schoolDetail = school;
                       graphicUtils.addSchoolToMap(school.geojson);
                   });
                   apiServices.getNearSchoolCrimes(id).then(function(crimes){
                       $scope.crimeTypes = crimes.crimes;
                       $scope.crimesCount = crimes.totalCount;
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
            }
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
    {id: 1, text: 'Secondary'}
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

           $scope.checkedType = allTypes[0].id;

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
