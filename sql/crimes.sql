DROP TABLE crimes;

CREATE TABLE crimes
(
  crime_id text,
  date_month text,
  reported_by text,
  falls_within text,
  lon real,
  lat real,
  location text,
  lsoa_code varchar(30),
  lsoa_name text,
  crime_type text,
  last_outcome_category text,
  context text
)
WITH (
  OIDS=FALSE
);
ALTER TABLE crimes
  OWNER TO gisuser;

-- bash script
COPY crimes FROM '/home/dmacjam/Downloads/2015-08-btp-street.csv' DELIMITERS ',' CSV HEADER;

-- add primary key
ALTER TABLE crimes ADD COLUMN id BIGSERIAL PRIMARY KEY;

SELECT * FROM crimes LIMIT 50;

SELECT AddGeometryColumn ('crimes','way',4326,'POINT',2);

-- http://postgis.net/docs/ST_MakePoint.html
update crimes set way=ST_SetSRID(ST_MakePoint(lon,lat), 4326);  