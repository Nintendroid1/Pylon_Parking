const express = require('express');
const router = express.Router();
const jwt = require('./jwt');
const db = require('../db');
const { requireLogin } = require("./auth.js");
//const socketAPI = require("../realtime/socket-broadcaster");

router.use(express.json());

router.post('/', requireLogin, (req,res) => {
    // if(jwt.verifyJWT(req.body.token, req.body.pid)) {
        if(req.body.pid && req.body.key && req.body.spot.spot_id && req.body.spot.zone_id && req.body.spot.start_time && req.body.spot.end_time && req.body.spot.price) {

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
                    db.query("UPDATE parking_times SET price = $5, availability = true WHERE spot_id = $1 AND zone_id = $2 AND seller_key = $6 time_code BETWEEN $3 AND $4 RETURNING *",
                    [req.body.spot.spot_id, req.body.spot.zone_id, req.body.spot.start_time, req.body.spot.end_time-1, req.body.spot.price, req.body.key], (err, response) => {
                        if(err) {
                            console.log(err);
                            res.status(500).json({message: "Internal Server Error"});
                        }
                        else {
                            res.status(200).json({message: "Success", rows: response.rows});
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
    // } else {
    //     res.status(401).json({message: "Bad login"});
    // }
});

module.exports = router;
