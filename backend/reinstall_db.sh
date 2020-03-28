#!/bin/bash

sudo -u postgres psql -d PylonParking -a -f install.sql
sudo -u postgres psql -d PylonParking -a -f populate_db.sql
