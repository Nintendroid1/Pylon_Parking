#!/bin/bash

#
# Some example uses to see how to talk to the API
#

API=http://localhost:3000/api/users

echo deleting user database...
curl -s -X DELETE ${API} | json_pp -

echo creating user gback...
curl -s --header "Content-Type: application/json" \
    -d '{"name":"gback","password":"pass","fullname":"Dr Back"}' \
    -X POST ${API} | json_pp -

echo getting information about user 0...
curl -s --header "Content-Type: application/json" \
    -X GET ${API}/0 | json_pp -

echo get list of all users
curl -s --header "Content-Type: application/json" \
    -X GET ${API} | json_pp -
