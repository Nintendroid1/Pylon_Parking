const { Pool } = require('pg')
const pool = new Pool({
  user: 'postgres',
  database: 'PylonParking',
  password: 'superman',
});
module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
}