#include <eosio/eosio.hpp>
#include <eosio/print.hpp>
#include <eosio/asset.hpp>
#include <eosio/system.hpp>

using namespace eosio;

class [[eosio::contract("hodl")]] hodl : public eosio::contract {
  private:
    const symbol hodl_symbol;

    struct [[eosio::table]] balance
    {
      eosio::asset funds;
      uint64_t primary_key() const { return funds.symbol.raw(); }
    };

    using balance_table = eosio::multi_index<"balance"_n, balance>;

    uint32_t now() {
      return current_time_point().sec_since_epoch();
    }

    //Time to expire is now() + 1 hour
    uint32_t start = now();
    const uint32_t the_party = start + 3600;

  public:
    using contract::contract;

    //Will only accept VTP token
    hodl(name receiver, name code, datastream<const char *> ds) : contract(receiver, code, ds),hodl_symbol("VTP", 1){}

    [[eosio::on_notify("eosio.token::transfer")]]
    void deposit(name hodler, name to, eosio::asset quantity, std::string memo) {
      if (hodler == get_self() || to != get_self())
      {
        return;
      }

      //The time to withdraw has not already passed
      check(now() < the_party, "Transfer took too long");
      
      //The incoming transfer has a valid amount of tokens
      check(quantity.amount > 0, "Insufficient Funds");

      //The incoming transfer uses the token we specify in the constructor
      //print(quantity.symbol, " ", hodl_symbol);
      check(quantity.symbol == hodl_symbol, "Incorrect Currency Type");

      balance_table balance(get_self(), hodler.value);
      auto hodl_it = balance.find(hodl_symbol.raw());

      if (hodl_it != balance.end())
        balance.modify(hodl_it, get_self(), [&](auto &row) {
          row.funds += quantity;
        });
      else
        balance.emplace(get_self(), [&](auto &row) {
          row.funds = quantity;
        });
    }

    [[eosio::action]]
    void party(name hodler)
    {
      //Check the authority of hodlder
      require_auth(hodler);

      // //Check the current time has pass the the party time
      check(now() > the_party, "Need to Wait");

      balance_table balance(get_self(), hodler.value);
      auto hodl_it = balance.find(hodl_symbol.raw());

      // //Make sure the holder is in the table
      check(hodl_it != balance.end(), "Invalid User");

      action{
        permission_level{get_self(), "active"_n},
        "eosio.token"_n,
        "transfer"_n,
        std::make_tuple(get_self(), hodler, hodl_it->funds, std::string("Party! Your hodl is free."))
      }.send();

      balance.erase(hodl_it);
    }
};