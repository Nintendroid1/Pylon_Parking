#!/bin/bash

if [ -z "$1" ]
    then
        echo "No argument supplied"
        exit 1
fi

#Assumes currency created already and token contract deployed to eosio.token
#cleos push action eosio.token create '[ "$1", "1000.0 SYS"]' -p eosio.token@active

#$1 = Sender, $2 = Receiver $3 = amount $4= currency $5 = message

#Issue currency
#cleos push action eosio.token issue '["$1", "$3$4", "$5"]' -p $1@active


#Perform transfer
var="'[\""
var+=$1
var+="\", \""
var+=$2
var+="\", \""
var+=$3
var+=" "
var+=$4
var+="\", \""
var+=$5
var+="\"]'"
#TODO command not being recognized
cleos push action eosio.token transfer $var -p $1@active -d

#Print Respective Balances
echo "Balance for" $1
cleos get currency balance eosio.token $1 
echo "Balance for" $2
cleos get currency balance eosio.token $2