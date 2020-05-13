token=$(sh ./login.sh | jq .token)
echo "$token"
curl -XGET \
    -H 'Authorization:
            Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1ODgyOTM2MDAsInBpZCI6ImFkbWluIiwiYWRtaW4iOjEsImlhdCI6MTU4NzY4ODgwMH0.T3Nbkbfr9lMkrtx9FQorFe4fFd1bBtfxHbHTxUZ_yq8' \
    -H "Content-type: application/json" \
localhost:3001/api/users/admin/spots
