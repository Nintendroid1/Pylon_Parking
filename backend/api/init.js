const express = require("express");
const router = express.Router();
const conf = require("./config.js");
const db = require("../db");

const { Api, JsonRpc, RpcError } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');      // development only
const fetch = require('node-fetch');                                    // node only; not needed in browsers
const { TextEncoder, TextDecoder } = require('util');                   // node only; native TextEncoder/Decoder

//Initiate all of the spots from the database onto the blockchain
router.get('/parkingspots', (req,res) => {
    let keys = [conf.parkVTKey]
    const signatureProvider = new JsSignatureProvider(keys);
    const rpc = new JsonRpc('http://127.0.0.1:8888', { fetch });
    const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

    db.query("SELECT spot_id, zone_id, time_code FROM parking_times")
    .then( async function(dbres){
        let i = 0;
        let actionsArr = [];
        for(; i < dbres.rows.length; i++) {
            if(actionsArr.length < 100) {
                actionsArr.push({
                    account: 'park.vt',
                    name: 'insert',
                    //name: 'erase',
                    authorization: [{
                    actor: 'park.vt',
                    permission: 'active'
                    }],
                    data: {
                    user: 'park.vt',
                    spot_id: dbres.rows[i].spot_id,
                    zone_id: dbres.rows[i].zone_id,
                    time_code: dbres.rows[i].time_code,
                    owner: 'admin'
                    }
                });
            }
            else {
                try {
                    const result = await api.transact({
                        actions: actionsArr
                    },
                    {
                        blocksBehind: 3,
                        expireSeconds: 30,
                    });
                } catch (err) {
                    console.log(err);
                    //res.status(500).send({message: "Internal Server Error"});
                    //return;
                    if(i > 100) {
                        i -= 100;
                    }
                    else {
                        res.status(500).json({message: "Internal Server Error"});
                        return;
                    }
                }
                actionsArr = [];
                console.log(i);
                i--;
            }
        }
        if(i%100 != 0) {
            try {
                const result = await api.transact({
                    actions: actionsArr
                },
                {
                    blocksBehind: 3,
                    expireSeconds: 30,
                });
            } catch (err) {
                console.log(err);
                res.status(500).send({message: "Internal Server Error"});
                return;
            }
        }
        res.status(200).send({message: "Success, inserted " + i + " spots"});
    })
    .catch(err => {
        console.log(err);
        res.status(500).send({message: "Internal Server Error"});
    });

    // const signatureProvider = new JsSignatureProvider(keys);
    // const rpc = new JsonRpc('http://127.0.0.1:8888', { fetch });
    // const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
})


//Remove all of the parking spots in the database from the blockchain
router.get('/parkingspots/erase', (req,res) => {
    let keys = [conf.parkVTKey]
    const signatureProvider = new JsSignatureProvider(keys);
    const rpc = new JsonRpc('http://127.0.0.1:8888', { fetch });
    const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

    db.query("SELECT spot_id, zone_id, time_code FROM parking_times")
    .then( async function(dbres){
        let i = 0;
        let actionsArr = [];
        for(; i < dbres.rows.length; i++) {
            if(actionsArr.length < 100) {
                actionsArr.push({
                    account: 'park.vt',
                    name: 'erase',
                    authorization: [{
                    actor: 'park.vt',
                    permission: 'active'
                    }],
                    data: {
                    user: 'park.vt',
                    spot_id: dbres.rows[i].spot_id,
                    zone_id: dbres.rows[i].zone_id,
                    time_code: dbres.rows[i].time_code
                    }
                });
            }
            else {
                try {
                    const result = await api.transact({
                        actions: actionsArr
                    },
                    {
                        blocksBehind: 3,
                        expireSeconds: 30,
                    });
                } catch (err) {
                    console.log(err);
                    //res.status(500).send({message: "Internal Server Error"});
                    //return;
                    if(i > 100) {
                        i -= 100;
                    }
                    else {
                        res.status(500).json({message: "Internal Server Error"});
                        return;
                    }
                }
                actionsArr = [];
                console.log(i);
                i--;
            }
        }
        if(i%100 != 0) {
            try {
                const result = await api.transact({
                    actions: actionsArr
                },
                {
                    blocksBehind: 3,
                    expireSeconds: 30,
                });
            } catch (err) {
                console.log(err);
                res.status(500).send({message: "Internal Server Error"});
                return;
            }
        }
        res.status(200).send({message: "Success, inserted " + i + " spots"});
    })
    .catch(err => {
        console.log(err);
        res.status(500).send({message: "Internal Server Error"});
    });

    // const signatureProvider = new JsSignatureProvider(keys);
    // const rpc = new JsonRpc('http://127.0.0.1:8888', { fetch });
    // const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
})
module.exports = router;