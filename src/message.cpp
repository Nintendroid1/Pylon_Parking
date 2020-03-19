#include <eosio/eosio.hpp>
#include <eosio/system.hpp>

using namespace eosio;

class [[eosio::contract]] message : public contract {
  public:
      using contract::contract;
    

      [[eosio::action]]
      void post(name user, uint64_t PID, std::string email, std::string first_name, std::string last_name,
              uint64_t spot_id, uint64_t zone_id, bool available) {
         require_auth(user);
         if(available) {
             print( first_name, " ", last_name, " wants to purchase Parking Spot: ", spot_id, " in Zone: ", zone_id, " (Timestamp: ", current_time_point().sec_since_epoch(), ")");
         }
         
      }
};