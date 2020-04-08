const express = require('express');
const router = express.Router();
const jwt = require('./jwt');
const db = require('../db');
//const socketAPI = require("../realtime/socket-broadcaster");

router.use(express.json());

router.post('/',(req,res) => {
    if(req.body.pid && req.body.token && req.body.spot.spot_id && req.body.spot.zone_id && req.body.spot.start_time && req.body.spot.end_time && req.body.spot.price) {

        let isValidReq = true;
        db.query("SELECT * FROM parking_times WHERE spot_id = $1 AND zone_id = $2 AND time_code BETWEEN $3 AND $4",
            [req.body.spot.spot_id, req.body.spot.zone_id, req.body.spot.start_time, req.body.spot.end_time-1])
        .then(dbres => {
            for(i in dbres.rows) {
                if(dbres.rows[i].user_pid != req.body.pid) {
                    isValidReq = false;
                }
            }
            if(isValidReq) {
                db.query("UPDATE parking_times SET price = $5, availability = true WHERE spot_id = $1 AND zone_id = $2 AND time_code BETWEEN $3 AND $4",
                [req.body.spot.spot_id, req.body.spot.zone_id, req.body.spot.start_time, req.body.spot.end_time-1, req.body.spot.price], (dbres,err) => {
                    if(err) {
                        res.status(500).json({message: "Internal Server Error"});
                    }
                    else {
                        res.status(200).json({message: "Success"});
                    }
                });
            }
            else {
                res.status(410).json({message: "Don't own all spots trying to sell"});
            }
        }).catch(err => {
            console.log(err);
        })
    }
    else {
        res.status(400).json({message: "Bad json format"});
    }
});

module.exports = router;