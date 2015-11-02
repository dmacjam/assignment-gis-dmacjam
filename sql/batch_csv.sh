#! /bin/sh

for file in /media/dmacjam/Data\ disc/Open\ data/Crime\ UK\ august\ 2015/*.csv; do
	echo $file
    PGPASSWORD=XXX psql -d pdt-gis -h localhost -U postgres -p 5432 -c "\COPY public.crimes FROM stdin DELIMITER ',' CSV HEADER" < $file
done

