#!/bin/bash

if [ -z "$1" ]
   then
      echo "No argument supplied"
fi

cleos wallet create -f "$1_wallet_key"
