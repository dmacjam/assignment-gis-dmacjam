var express = require('express');
var router = express.Router();

var dbFactory = require('../db-config');


/* GET schools listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/:id', getSchool);


function getSchool(req, res, next){
    console.log("Getting school");
    var query = "SELECT *, st_asgeojson(way) as geojson FROM schools WHERE urn=$1";
    return dbFactory.db.one(query, req.params.id).then(function(results){
        return res.send(results);
    }).catch(function (e) {
        return res.status(500, {
            error: e
        });
    });
}


module.exports = router;