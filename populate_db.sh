#!/bin/bash

sudo -u postgres psql -d PylonParking -c \
    "INSERT INTO zones(zone_id, zone_name)
     VALUES
     (0, 'Litton Reaves'),
     (1, 'Derring Lot'),
     (2, 'Perry Street Lot #1'),
     (3, 'Perry Street Lot #2'),
     (4, 'Perry Street Lot #3'),
     (5, 'Lower Stanger Lot');"

sudo -u postgres psql -d PylonParking -c \
    "INSERT INTO parking_spots(spot_id, zone_id)
     VALUES
     (0, 1),
     (1, 1),
     (2, 1),
     (3, 1);"
