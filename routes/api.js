var dbFactory = require('../db-config');

exports.identify = function(req, res){
  console.log("Getting nearest schools");
  var query = "SELECT *, st_asgeojson(way) as geojson, ST_Distance(ST_SetSRID(ST_MakePoint($1, $2),4326)::geography,s.way::geography, false) as distance " +
      "FROM schools s " +
      "WHERE st_dwithin(ST_SetSRID(ST_MakePoint($1, $2),4326)::geography,s.way::geography, 1000)" +
      "ORDER BY distance";
  return dbFactory.db.query(query, [req.query.lon, req.query.lat ]).then(function(results){
      return res.send(results);
  }).catch(function (e) {
      return res.status(500, {
          error: e
      });
  });
};