#start_blockchain.sh

You will need to keep the eosio.contracts directory in your local machine and then scp if you want to completely wipe everything
git clone https://github.com/EOSIO/eosio.contracts --branch v1.7.0 --single-branch

Contracts for tokens, msig, and parking are under the assumption they are present are in the following:
~/CONTRACTS_DIR/eosio.contracts/contracts/eosio.token
~/CONTRACTS_DIR/eosio.contracts/contracts/eosio.msig
~/CONTRACTS_DIR/parkingspot

If you have problems compiling eosio.token you will have to copy the eosio.token.hpp to be in src directory
Then replace the include statement to be: #include "eosio.token.hpp" 