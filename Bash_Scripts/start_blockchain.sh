#!/bin/bash

# -- Remove exisiting blockchain
kill -9 keosd
kill -9 nodeos
keosd &

# start_dev_chain.sh
# --Starts development blockchain
nodeos -e -p eosio \
        --delete-all-blocks \
        --delete-state-history \
        --hard-replay \
        --plugin eosio::producer_plugin \
        --plugin eosio::chain_api_plugin \
        --plugin eosio::http_plugin \
        --plugin eosio::history_plugin \
        --plugin eosio::history_api_plugin \
        --chain-state-db-size-mb 10240 \
        --filter-on="*" \
        --access-control-allow-origin='*' \
        --contracts-console \
        --http-validate-host=false \
        --verbose-http-errors >> nodeos.log 2>&1 &

# --Remove wallets
rm -rf ~/eosio-wallet/

# --create_wallet.sh
cleos wallet create -f wallet_key.txt
cleos wallet unlock < wallet_key.txt
cleos wallet create_key -n default > pub_key.txt
cleos wallet import -n default --private-key 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3

#All default accounts will have the same password
var=`cat pub_key.txt`

#Making the assumption the contracts are present
#Assumed directory structure ~/CONTRACTS_DIR

# --eosio.token -> Transfer tokens
cleos create account eosio eosio.token ${var:47:53}
eosio-cpp -I include -o ~/CONTRACTS_DIR/eosio.contracts/contracts/eosio.token/eosio.token.wasm ~/CONTRACTS_DIR/eosio.contracts/contracts/eosio.token/src/eosio.token.cpp --abigen 
cleos set contract eosio.token ~/CONTRACTS_DIR/eosio.contracts/contracts/eosio.token \
         --abi eosio.token.abi -p eosio.token@active

# --eosio.msig -> Multisig
cleos create account eosio eosio.msig ${var:47:53}
eosio-cpp -I ~/CONTRACTS_DIR/eosio.contracts/contracts/eosio.msig/include -o ~/CONTRACTS_DIR/eosio.contracts/contracts/eosio.msig/eosio.msig.wasm ~/CONTRACTS_DIR/eosio.contracts/contracts/eosio.msig/src/eosio.msig.cpp --abigen  
cleos set contract eosio.msig ~/CONTRACTS_DIR/eosio.contracts/contracts/eosio.msig \
         --abi eosio.msig.abi -p eosio.msig@active

# --park.vt
cleos create account eosio park.vt ${var:47:53}
eosio-cpp ~/CONTRACTS_DIR/parkingspot/parkingspot.cpp -o ~/CONTRACTS_DIR/parkingspot/parkingspot.wasm
cleos set contract park.vt ~/CONTRACTS_DIR/parkingspot \
         --abi parkingspot.abi -p park.vt@active