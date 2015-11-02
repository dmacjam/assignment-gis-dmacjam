-- Table: schools


DROP TABLE schools;

CREATE TABLE schools
(
  urn varchar(20) PRIMARY KEY,
  local_authority text,
  est_number varchar(10),
  est_name text,
  est_type text,
  est_status text,
  education_phase text,
  low_age smallint,
  high_age smallint,
  sixth_form text,
  gender text,
  religion text,
  admission_policy text,
  capacity integer,
  pupils_number integer,
  boys_count integer,
  girls_count integer,
  free_school_meals_percentage text,    -- convert to real
  ukprn varchar(20),
  street text,
  locality text,
  address3 text,
  town text,
  county text,
  postcode text,
  website text,
  phone text,
  head_lastname text,
  sen1 text,
  sen2 text,
  sen3 text,
  urban_or_rural text,
  easting text,
  northing text
)
WITH (
  OIDS=FALSE
);
ALTER TABLE schools
  OWNER TO gisuser;

COPY schools FROM '/home/dmacjam/Downloads/edudata_processed2.csv' DELIMITERS ',' CSV HEADER;

SELECT AddGeometryColumn ('schools','way',4326,'POINT',2);

update schools set way=ST_Transform(ST_PointFromText('POINT('||easting||' '||northing||')',27700), 4326);

(
  SELECT * FROM schools
) as schools

SELECT est_type, count(*) FROM schools GROUP BY est_type;


-- http://blog.retep.org/2013/04/14/converting-os-grid-coordinates-into-latlong-using-postgis/

SELECT AddGeometryColumn ('schools','geom',27700,'POINT',2);

update schools set geom=ST_GeomFromText('POINT('||easting||' '||northing||')',27700);

alter table schools add column lat real;

alter table schools add column lon real;

update schools set lon=st_x(st_transform(geom,4326)), lat=st_y(st_transform(geom,4326));

  
SELECT AddGeometryColumn('schools','geom_mercator',900913, 'POINT', 2);

update schools set geom_mercator=ST_Transform(geom, 900913);

-- data

SELECT est_type, count(*) FROM schools GROUP BY est_type;
SELECT education_phase, count(*) FROM schools GROUP BY education_phase;

(
  SELECT * FROM schools 
  WHERE est_type in ('Higher Education Institutions')
) as universities

(
  SELECT * FROM schools 
  WHERE est_type in ('Free Schools Special','Free Schools - 16-19',
                    'Free Schools','Free Schools - Alternative Provision',
                    'Studio Schools', 'University Technical College')
) as free_schools

(
  SELECT * FROM schools 
  WHERE est_type in ('Academy 16-19 Converter','Academy 16-19 Sponsor Led',
                    'Academy Alternative Provision Converter','Academy Alternative Provision Sponsor Led',
                    'Academy Converter', 'Academy Special Converter',
                    'Academy Special Sponsor Led', 'Academy Sponsor Led')
) as academies

(
  SELECT * FROM schools 
  WHERE education_phase in ('Primary')
) as primary_school

(
  SELECT * FROM schools 
  WHERE education_phase in ('Secondary')
) as secondary_school

(
  SELECT * FROM schools 
  WHERE est_type in ('Further Education', 'Sixth Form Centres')
) as college
