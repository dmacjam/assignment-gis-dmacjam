var utils = angular.module('utils', ['services']);

utils.factory('graphicUtils', function(apiServices){
   var graphicUtils = {
       addSchoolToMap: addSchoolToMap,
       addCrimesToMap: addCrimesToMap,
       clearCrimes: clearCrimes,
       addCurrentLocation: addCurrentLocation
   };
   return graphicUtils;

   var locationMarker;

   function addSchoolToMap(school){
       var geojson = createGeojson();
       var properties = {
           'title': school.est_name,
           "marker-size": "large",
           "marker-symbol": "school",
           "marker-color": '#00f'
       };
       console.debug("School geojson", school.geojson);
       geojson.features.push(createFeature(JSON.parse(school.geojson), properties ));
       console.debug("Adding to map", school.geojson, geojson);
       featureLayer.setGeoJSON(geojson);
       var latLng = featureLayer.getBounds().getCenter();
       map.setView(latLng, 13);
   }

    function addCrimesToMap(geojsons){
        var geojson = createGeojson();

        for(var i=0; i< geojsons.length; i++){
            var properties = {
                "marker-size": "small",
                "marker-symbol": "embassy",
                "marker-color": '#6c6c6c',
                "title": geojsons[i].crime_type
            };
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
   }

   function addCurrentLocation(lat, lng){
       if(locationMarker){
           map.removeLayer(locationMarker);
       }
       locationMarker = L.marker([lat, lng], {
           icon: L.mapbox.marker.icon({
               'marker-size': 'large',
               'marker-symbol': 'marker-stroked',
               'marker-color': '#fa0'
           })
       }).addTo(map);
   }

});