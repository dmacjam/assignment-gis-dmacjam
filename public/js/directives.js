var sidebar = angular.module('sidebar', ['services', 'utils', 'checklist-model']);

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

           this.allTypes = [
               {text: 'Uni', contains: ['Higher Education Institutions']},
               {text: 'Free school', contains: ['Free Schools Special','Free Schools - 16-19',
                                                'Free Schools','Free Schools - Alternative Provision',
                                                'Studio Schools', 'University Technical College']},
               {text: 'Academy', contains: ['Academy 16-19 Converter','Academy 16-19 Sponsor Led',
                                            'Academy Alternative Provision Converter','Academy Alternative Provision Sponsor Led',
                                            'Academy Converter', 'Academy Special Converter',
                                            'Academy Special Sponsor Led', 'Academy Sponsor Led']},
               {text: 'Primary', contains: ['Primary']},
               {text: 'Secondary', contains: ['Secondary']},
               {text: 'College', contains: ['Further Education', 'Sixth Form Centres']}
           ];

           $scope.checkedTypes = [this.allTypes[0]];

           this.showDetail = function(id){
               console.debug("Types is", $scope.checkedTypes);
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
