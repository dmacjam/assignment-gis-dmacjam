var pgp = require('pg-promise')();
var conString = "postgres://postgres@localhost:5432/pdt-gis";
var db = pgp(conString);

module.exports = {
    db: db
};