curl -XPOST -H "Content-type: application/json" \
    -d '{"pid": "admin" , "password": "adminpass" }' \
    localhost:3001/api/users/login
