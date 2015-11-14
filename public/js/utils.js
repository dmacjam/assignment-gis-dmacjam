var utils = angular.module('utils', ['services']);

utils.factory('graphicUtils', function(apiServices){
   var graphicUtils = {
       addSchoolToMap: addSchoolToMap
   };
   return graphicUtils;

   function addSchoolToMap(geometry){
       var geojson = createGeojson();
       geojson.features.push(createFeature(JSON.parse(geometry)));
       console.debug("Adding to map", geometry, geojson);
       featureLayer.setGeoJSON(geojson);
   }

   function createGeojson() {
       return {"features": []};
   }

   function createFeature(geometry, properties){
       return {
           "type": "Feature",
           "geometry": geometry,
           "properties": {}
       };
   }

});