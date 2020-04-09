const express = require("express");
const router = express.Router();

router.use(express.json());

const { JsonRpc } = require('eosjs');
const fetch = require('node-fetch');           // node only; not needed in browsers
const rpc = new JsonRpc('http://localhost:8888', { fetch });

router.get('/', (req, res) => {
    rpc.get_table_rows({
        json: true,              // Get the response as json
        code: 'eosio.token',     // Contract that we target
        scope: 'alice',         // Account that owns the data
        table: 'accounts',        // Table name
        limit: 10,               // Maximum number of rows that we want to get
        reverse: false,         // Optional: Get reversed data
        show_payer: false      // Optional: Show ram payer
    })
    .then( resp => {
        const temp = resp.rows;
        res.status(200).json({temp});
    });
    
});

module.exports = router;