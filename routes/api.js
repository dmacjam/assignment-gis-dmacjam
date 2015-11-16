var dbFactory = require('../db-config');

exports.identify = function(req, res){
  console.log("Getting nearest schools");
  var query = "SELECT *, st_asgeojson(way) as geojson, ST_Distance(ST_SetSRID(ST_MakePoint($1, $2),4326)::geography,s.geog, false) as distance " +
      "FROM schools s " +
      "WHERE st_dwithin(ST_SetSRID(ST_MakePoint($1, $2),4326)::geography,s.geog, $3) ";

  var filter = filterByTypeAndPhase(req.query.type, req.query.phase);
  if(filter){
      query += "AND ("+filter+") ";
  }
  query += "ORDER BY distance " +
           "LIMIT $4";
  console.log("Query", query);

  return dbFactory.db.query(query, [req.query.lon, req.query.lat, dbFactory.areaDistance, dbFactory.pageLimit]).then(function(results){
      return res.send(results);
  }).catch(function (e) {
      return res.status(500, {
          error: e
      });
  });
};

function filterByTypeAndPhase(type, phase){
    var cnd = [];
    if(type){
        console.log("has type");
        var pgTypes = [];
        for(var i=0; i< dbFactory.types[type].contains.length; i++){
            pgTypes.push(dbFactory.pgp.as.text(dbFactory.types[type].contains[i]));
        }
        cnd.push(dbFactory.pgp.as.format("est_type IN ($1^)", pgTypes.join() ));
    }
    if(phase){
        console.log("has phase");
        cnd.push(dbFactory.pgp.as.format("education_phase = $1",dbFactory.phases[phase] ));
    }
    return cnd.join(" OR ");
}

exports.crimesNearSchool = function(req, res){
    console.log("Getting nearest crimes", req.query.schoolId);
    var returnJson = {};
    var query = "SELECT crime_type, st_asgeojson(c.way) as geojson " +
                "FROM crimes c, schools s " +
                "WHERE s.urn=$1 "+
                "AND st_dwithin(c.geog,s.geog, $2)";
    var groupQuery = "SELECT  c.crime_type as crimeType, COUNT(c.crime_type) as counts  " +
                     "FROM crimes c, schools s " +
                     "WHERE s.urn=$1 " +
                     "AND st_dwithin(c.geog,s.geog, $2) " +
                     "GROUP BY crimeType " +
                     "ORDER BY counts DESC";
    return dbFactory.db.query(query, [req.query.schoolId, dbFactory.crimeDistance]).then(function(results){
        returnJson.geojsons = results;
        returnJson.totalCount = results.length;
        return dbFactory.db.query(groupQuery, [req.query.schoolId, dbFactory.crimeDistance]).then(function(groupResults){
            returnJson.crimes = groupResults;
            return res.send(returnJson);
        });
    }).catch(function (e) {
        return res.status(500, {
            error: e
        });
    });
};

exports.getSchoolByName = function(req, res){
    console.log("Getting school by name", req.query.name);
    var parsedNames = req.query.name.split(",");
    var names = [];
    for(var i=0; i< parsedNames.length; i++){
        var firstQuote = parsedNames[i].indexOf("\"");
        var lastQuote = parsedNames[i].lastIndexOf("\"");
        var name = parsedNames[i].substring(firstQuote+1, lastQuote);
        names.push(name);
    }
    var query = "SELECT *, st_asgeojson(way) as geojson " +
                "FROM schools " +
                "WHERE to_tsvector('english',est_name) @@ to_tsquery($1) " +
                "OR lower(est_name) LIKE lower('$2^%')" +
                "LIMIT 10";
    return dbFactory.db.query(query, [names.join(' & '), names.join(' ')]).then(function(results){
        return res.send(results);
    }).catch(function (e) {
        return res.status(500, {
            error: e
        });
    });
};

exports.undesiredPlacesNearSchool = function(req, res){
    console.log("Getting undesired places near school", req.query.schoolId);
    var query = "SELECT p.amenity as amenity, st_asgeojson(p.way) as geojson " +
                "FROM schools s, planet_osm_point p " +
                "WHERE s.urn=$1 " +
                "AND st_dwithin(s.geog,p.geog, $2) " +
                "AND p.amenity IN ($3^)";
    var amenitiesAsPgText = [];
    for(var i=0; i< dbFactory.undesiredPlaces.length; i++){
        amenitiesAsPgText.push(dbFactory.pgp.as.text(dbFactory.undesiredPlaces[i]));
    }
    return dbFactory.db.query(query, [req.query.schoolId, dbFactory.undesiredPlacesDistance, amenitiesAsPgText.join() ]).then(function(results){
        return res.send(results);
    }).catch(function (e) {
        return res.status(500, {
            error: e
        });
    });

};
