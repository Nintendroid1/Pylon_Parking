#All default accounts will have the same password
if [ -z "$1" ]
    then
        echo "No argument supplied"
        exit 1
fi

var=`cat pub_key.txt`

# User Account
cleos create account eosio $1 ${var:47:53}

#Allows park.vt to do transactions for you
cleos set account permission $1 active '{"threshold": 1, "keys":[{"key":"EOS6nRKK9ihLw1vctm5nzUzeWewqQfsT5v6YHe8UgMqGcUSLnV3hh", "weight":1}], "accounts":[{"permission":{"actor":"park.vt","permission":"eosio.code"},"weight":1}], "waits":[] }' owner -p $1