var dbFactory = require('../db-config');

exports.identify = function(req, res){
  console.log("Getting nearest schools");
  var query = "SELECT *, st_asgeojson(way) as geojson, ST_Distance(ST_SetSRID(ST_MakePoint($1, $2),4326)::geography,s.way::geography, false) as distance " +
      "FROM schools s " +
      "WHERE st_dwithin(ST_SetSRID(ST_MakePoint($1, $2),4326)::geography,s.way::geography, $3) ";

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
    var query = "SELECT st_asgeojson(c.way) as geojson " +
                "FROM crimes c, schools s " +
                "WHERE s.urn=$1 "+
                "AND st_dwithin(c.way::geography,s.way::geography, $2)";
    var groupQuery = "SELECT  c.crime_type as crimeType, COUNT(c.crime_type) as counts  " +
                     "FROM crimes c, schools s " +
                     "WHERE s.urn=$1 " +
                     "AND st_dwithin(c.way::geography,s.way::geography, $2) " +
                     "GROUP BY crimeType " +
                     "ORDER BY counts DESC";
    return dbFactory.db.query(query, [req.query.schoolId, dbFactory.crimeDistance]).then(function(results){
        returnJson.geojsons = results;
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
