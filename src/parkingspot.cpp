#include <eosio/eosio.hpp>
#include <eosio/print.hpp>
#include <eosio/system.hpp>

using namespace eosio;

class [[eosio::contract("parkingspot")]] parkingspot : public eosio::contract {

public:
 //"code" param is the account the contract is deployed to
  parkingspot(name receiver, name code, datastream<const char*> ds):contract(receiver, code, ds){}
  
  //Inserts new parking spot
  [[eosio::action]] //Needed for ABI generation
  void insert(name user, uint64_t spot_id, uint64_t zone_id) {
      //Ensures the account executing transaction has proper permissions
      require_auth(user);

      /* Creates Table to index from
      *  first param specifies the owner of this table
      *     in this case the name of the contract
      *  second param is the scope and ensures uniqueness of the table within the contract
      *     in this case the account name this contract is deployed to
      */
      park_index parkdeck(get_self(), get_first_receiver().value);

      //Iterator for parking spots using spot_id as key
      auto iterator = parkdeck.find(spot_id);

      if( iterator == parkdeck.end() ) {
            //The parking spot isn't in the table
            parkdeck.emplace(user, [&](auto& row) {
                row.spot_id = spot_id;
                row.zone_id = zone_id;
                row.available = true;
            });
            print("Parking Spot: ", spot_id, " in Zone: ", zone_id, " is created on: ", current_time_point().sec_since_epoch());
        }
        else {
            //The parking spot is in the table
            print("ALREADY EXISTS! Parking Spot: ", spot_id, " in Zone: ", zone_id);
        }
  }

  //Updates parking spot available
  [[eosio::action]]
  void modavail(name user, uint64_t spot_id, uint64_t zone_id) {
      //Ensures the account executing transaction has proper permissions
      require_auth(user);

      /* Creates Table to index from
      *  first param specifies the owner of this table
      *     in this case the name of the contract
      *  second param is the scope and ensures uniqueness of the table within the contract
      *     in this case the account name this contract is deployed to
      */
      park_index parkdeck(get_self(), get_first_receiver().value);

      //Iterator for parking spots using spot_id as key
      auto iterator = parkdeck.find(spot_id);

      if( iterator == parkdeck.end() ) {
            //The parking spot isn't in the table
            //    check(iterator != addresses.end(), "Record does not exist");
            print("DOES NOT EXIST! Parking Spot: ", spot_id, " in Zone: ", zone_id);
        }
        else {
            bool status_bool = false;
            std::string status_str = "occupied";
            //The parking spot is in the table
            parkdeck.modify(iterator, user, [&](auto& row) {
                row.available = !(row.available);
                status_bool = row.available;
            });
            if(status_bool) {
              status_str = "not occupied";
            }
            print("Parking Spot: ", spot_id, " in Zone: ", zone_id, " is ", status_str, " on: ", current_time_point().sec_since_epoch());
        }
  }

private:
  //Parking spot to store the info
  struct [[eosio::table]] pspot {
    uint64_t spot_id; //key
    uint64_t zone_id;
    bool available;

    //Sets primary key to be the spot id
    uint64_t primary_key() const {return spot_id;}
  };
  
  /*_n is the name of the table
  * takes in a pspot value
  */
  typedef eosio::multi_index<"pspots"_n, pspot> park_index;
};