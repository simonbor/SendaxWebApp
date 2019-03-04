FROM mongo
COPY init.json /init.json
CMD mongoimport --host mongo --db sendaxdb --collection Users --type json --file /init.json --jsonArray
