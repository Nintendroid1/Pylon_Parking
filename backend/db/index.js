//setup the queries to the database
const { Pool } = require('pg')
const pool = new Pool({
  user: 'postgres',
  database: 'PylonParking',
  password: 'superman',
});
module.exports = {
  query: async function(text, params, callback) {
    return pool.query(text, params, callback)
  },
}
