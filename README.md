# General course assignment

Build a map-based application, which lets the user see geo-based data on a map and filter/search through it in a meaningfull way. Specify the details and build it in your language of choice. The application should have 3 components:

1. Custom-styled background map, ideally built with [mapbox](http://mapbox.com). Hard-core mode: you can also serve the map tiles yourself using [mapnik](http://mapnik.org/) or similar tool.
2. Local server with [PostGIS](http://postgis.net/) and an API layer that exposes data in a [geojson format](http://geojson.org/).
3. The user-facing application (web, android, ios, your choice..) which calls the API and lets the user see and navigate in the map and shows the geodata. You can (and should) use existing components, such as the Mapbox SDK, or [Leaflet](http://leafletjs.com/).

## Example projects

- Showing nearby landmarks as colored circles, each type of landmark has different circle color and the more interesting the landmark is, the bigger the circle. Landmarks are sorted in a sidebar by distance to the user. It is possible to filter only certain landmark types (e.g., castles).

- Showing bicykle roads on a map. The roads are color-coded based on the road difficulty. The user can see various lists which help her choose an appropriate road, e.g. roads that cross a river, roads that are nearby lakes, roads that pass through multiple countries, etc.

## Data sources

- [Open Street Maps](https://www.openstreetmap.org/)

## Choose the perfect school for you kid

**Application description**: Showing schools on the map, each type of school has different color. Schools are sorted by the distance from selected spot and user can set maximum possible distance to school. The user can also filter schools by criminality, that was commited near school, or number of bar/pubs and casinos near school.

**Data source**: 
- [Schools In England Dec 2014](http://data.bureau.opendata.arcgis.com/datasets/4dbf29eb5ee0418c874782669aecf38d_0)
- [Criminality In The UK](https://data.police.uk/about/)

**Technologies used**:
- Mapbox
- PostGIS
- web app - Mapbox SDK
