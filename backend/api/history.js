const express = require("express");
const router = express.Router();

const { checkForLogin } = require("./auth.js");

router.use(express.json());

EosApi = require('eosjs-api') // Or EosApi = require('./src')

eos = EosApi() // // 127.0.0.1:8888

router.get('/', checkForLogin, function(req, res) {
  let user_pid = "admin";
  if (typeof req.user != undefined)
  {
    user_pid = req.user.pid;
  }
  console.log(user_pid);
    eos.getActions(user_pid.toLowerCase(), -1, -100000)
    .then(response => {
        let actionHistory = response.actions.reverse();
        let result = [];
        for(let i = 0; i < actionHistory.length; i++) {
            if(actionHistory[i].action_trace.act.name === "modavail") {
                result.push({
                    user: 'park.vt',
                    quantity: actionHistory[i].action_trace.act.data.quantity,
                    spot_id: actionHistory[i].action_trace.act.data.spot_id,
                    zone_id: actionHistory[i].action_trace.act.data.zone_id,
                    time_code: actionHistory[i].action_trace.act.data.time_code,
                    buyer: actionHistory[i].action_trace.act.data.buyer,
                    seller: actionHistory[i].action_trace.act.authorization[0].actor
                });
            }
        }
        res.status(200).json({result})
    }).catch(err => {
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    });
    //res.status(200).json({"temp":[{"balance":"100.0000 VTP"}]});
    // res.status(200).json({data: [{user: "park.vt", quantity: "10.0000 VTP",spot_id: 123, zone_id: 456, time_code: 1586401381, buyer: "alice", seller: "bob"}]});
});

module.exports = router;
