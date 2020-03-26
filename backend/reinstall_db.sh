#!/bin/bash

sudo -u postgres psql -d PylonParking -a -f install.sql
