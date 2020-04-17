#!/bin/bash

sudo -u postgres psql -d PylonParking -a -f install.sql
sudo -u postgres psql -d PylonParking -a -f ./gen/zones.sql
sudo -u postgres psql -d PylonParking -a -f ./gen/parking_spots.sql
sudo -u postgres psql -d PylonParking -a -f ./gen/users.sql
sudo -u postgres psql -d PylonParking -a -f ./gen/parking_times.sql > /dev/null
sudo -u postgres psql -d PylonParking -a -f ./gen/update_db.sql
