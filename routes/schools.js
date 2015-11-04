var express = require('express');
var pg = require('pg');
var router = express.Router();

var config = require('../db-config');

/* GET schools listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/:id', getSchool);


function getSchool(req, res, next){
    console.log("Getting school");
    pg.connect(config.conString, function(err, client, done) {

        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query("SELECT * FROM schools WHERE urn='"+req.params.id+"'", function(err, result) {
            done();
            if (err) {
                return console.error('error running query', err);
            }
            console.log(result.rows);
            res.send(result.rows[0]);
        });

    });
}


module.exports = router;