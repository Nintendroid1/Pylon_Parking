#!/bin/bash

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

echo -e "From now on you should only have to use './start_react.sh' to start the frontend server\n"

echo -e "Starting react frontend..."
npm run start
