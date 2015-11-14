var pg = require('pg');
var config = require('../db-config');


exports.identify = function(req, res){
    console.log("Getting nearest school");
    pg.connect(config.conString, function(err, client, done) {

        if (err) {
            return console.error('error fetching client from pool', err);
        }
        var query = "SELECT *, st_asgeojson(way) as geojson FROM schools s " +
            "WHERE st_dwithin(ST_SetSRID(ST_MakePoint("+req.query.lon+","+req.query.lat+"),4326)::geography,s.way::geography, 1000)";
        console.log("Query is:", query);
        client.query(query, function(err, result) {
            done();
            if (err) {
                return console.error('error running query', err);
            }
            console.log(result.rows);
            res.send(result.rows);
        });

    });
};