var utils = angular.module('utils', ['services']);

utils.factory('graphicUtils', function(apiServices){
   var graphicUtils = {
       addSchoolToMap: addSchoolToMap,
       addCrimesToMap: addCrimesToMap,
       clearCrimes: clearCrimes
   };
   return graphicUtils;

   function addSchoolToMap(school){
       var geojson = createGeojson();
       var properties = {
           'title': school.est_name,
           "marker-size": "medium",
           "marker-symbol": "star",
           "marker-color": '#00f'
       };
       console.debug("School geojson", school.geojson);
       geojson.features.push(createFeature(JSON.parse(school.geojson), properties ));
       console.debug("Adding to map", school.geojson, geojson);
       featureLayer.setGeoJSON(geojson);
   }

    function addCrimesToMap(geojsons){
        var geojson = createGeojson();

        for(var i=0; i< geojsons.length; i++){
            var properties = {
                "marker-size": "medium",
                "marker-symbol": "star",
                "marker-color": '#0f0',
                "title": geojsons[i].crime_type
            };
            console.debug("i geojson", properties);
            geojson.features.push(createFeature(JSON.parse(geojsons[i].geojson), properties));
        }
        console.debug("GEOJSON", geojson, geojson.features.length);
        crimesFeatureLayer.setGeoJSON(geojson);
    }

   function createGeojson() {
       return {"features": []};
   }

   function createFeature(geometry, properties){
       return {
           "type": "Feature",
           "geometry": geometry,
           "properties": properties
       };
   }

   function clearCrimes(){
       crimesFeatureLayer.setGeoJSON({"features":[]});
   };

});