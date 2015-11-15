var pgp = require('pg-promise')();
var conString = "postgres://postgres@localhost:5432/pdt-gis";
var db = pgp(conString);

module.exports = {
    pgp: pgp,
    db: db,
    types: [
        {
            text: 'Uni',
            contains: ['Higher Education Institutions']
        },
        {
            text: 'Free school',
            contains: ['Free Schools Special','Free Schools - 16-19',
                'Free Schools','Free Schools - Alternative Provision',
                'Studio Schools', 'University Technical College']
        },
        {
            text: 'Academy',
            contains: ['Academy 16-19 Converter','Academy 16-19 Sponsor Led',
                'Academy Alternative Provision Converter','Academy Alternative Provision Sponsor Led',
                'Academy Converter', 'Academy Special Converter',
                'Academy Special Sponsor Led', 'Academy Sponsor Led']
        },
        {
            text: 'College',
            contains: ['Further Education', 'Sixth Form Centres']
        }
    ],
   phases: ['Primary', 'Secondary'],
   areaDistance: 5000,
   crimeDistance: 1000,
   pageLimit: 15
};