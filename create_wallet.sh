#!/bin/bash

if [ -z "$1" ]
   then
      echo "No argument supplied"
fi

cleos wallet create -f "$1_wallet_key.txt"
mv default.wallet $1.wallet

cleos wallet unlock < $1_wallet_key.txt

cleos wallet create_key -n $1 > $1_pub_key.txt

cleows wallet import -n $1 --private-key 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3

cleos create account eosio $1 $1_pub_key.txt
