const express = require("express");
const router = express.Router();

router.use(express.json());

EosApi = require('eosjs-api') // Or EosApi = require('./src')

eos = EosApi() // // 127.0.0.1:8888

router.get('/', (req, res) => {
    // eos.getActions('park.vt')
    // .then(response => {
    //     let actionHistory = response.actions;
    //     res.status(200).json({actionHistory})
    // }).catch(err => {
    //     console.log(err);
    //     res.status(500).json({message: "Internal Server Error"});
    // });
    //res.status(200).json({"temp":[{"balance":"100.0000 VTP"}]});
    res.status(200).json({data: [{user: "park.vt", quantity: "10.0000 VTP",spot_id: 123, zone_id: 456, time_code: 1586401381, buyer: "alice", seller: "bob"}]});
});

module.exports = router;