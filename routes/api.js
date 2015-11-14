var dbFactory = require('../db-config');

exports.identify = function(req, res){
  console.log("Getting nearest schools");
  var query = "SELECT *, st_asgeojson(way) as geojson FROM schools s WHERE st_dwithin(ST_SetSRID(ST_MakePoint($1, $2),4326)::geography,s.way::geography, 1000)";
  return dbFactory.db.query(query, [req.query.lon, req.query.lat ]).then(function(results){
      return res.send(results);
  }).catch(function (e) {
      return res.status(500, {
          error: e
      });
  });
};