#!/bin/bash

FORMAT_STDERR='sed "s/\(.*\)/    \1/g" >&2'

# Make sure installed packages are the most recent version
# According to package.json
echo "Reinstalling npm packages/dependencies..."
rm package-lock.json
echo -e "    Removing ./node_modules..."
echo -e 'rm -r ./node_modules'
rm -r ./node_modules
echo -e "    Reinstalling node modules"
echo -e "npm install"
npm install
echo -e "Done!\n"

# Reinstalling database
echo "Reinstalling Database, this will probably take a minute..."
sudo -u postgres psql -d PylonParking -a -f install.sql             2> >(eval "$FORMAT_STDERR") > /dev/null
sudo -u postgres psql -d PylonParking -a -f ./gen/zones.sql         2> >(eval "$FORMAT_STDERR") > /dev/null
sudo -u postgres psql -d PylonParking -a -f ./gen/parking_spots.sql 2> >(eval "$FORMAT_STDERR") > /dev/null
sudo -u postgres psql -d PylonParking -a -f ./gen/users.sql         2> >(eval "$FORMAT_STDERR") > /dev/null
sudo -u postgres psql -d PylonParking -a -f ./gen/parking_times.sql 2> >(eval "$FORMAT_STDERR") > /dev/null
sudo -u postgres psql -d PylonParking -a -f ./gen/update_db.sql     2> >(eval "$FORMAT_STDERR") > /dev/null
echo -e "Done!\n"

echo -e "From now on you should only have to use './run_server.sh' to start the server\n"

echo "Starting server..."
# Start the server on port 3001
PORT=3001 node app.js
