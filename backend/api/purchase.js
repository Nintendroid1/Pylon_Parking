const express = require('express');
const router = express.Router();
const jwt = require('./jwt');
const db = require('../db');

router.use(express.json());

router.post('/', (req, res) => {

    if(jwt.verifyJWT(req.body.token, req.body.userName)) {
        //Talk to the blockchain here

        db.query('SELECT availability FROM parking_times WHERE spot_ID = $1 AND zone_ID = $2 AND time_code = $3', [req.body.spot.spot_id, req.body.spot.zone_id, req.body.spot.time_code])
        .then(dbres => {
            if(dbres.rows[0]) {
                if(dbres.rows[0].availability) {
                    db.query('UPDATE parking_times SET user_PID = $1, availability = false WHERE spot_ID = $2 AND zone_ID = $3 AND time_code = $4 RETURNING *', [req.body.userName, req.body.spot.spot_id, req.body.spot.zone_id, req.body.spot.time_code], (err,result) => {
                        if (err) {
                            console.log(err.stack);
                            res.status(500).json({message: "Internal error"});
                        }
                        else {
                            res.status(200).json({message: "Spot aquired", spot: result.rows});
                        }
                    });
                }
                else {
                    res.status(403).json({message: "Spot not available"});
                }
            }
            else {
                res.status(403).json({message: "Bad spot code"});
            }
        })
    }
    else {
        res.status(403).json({message: "Bad login or json format"});
    }
});

module.exports = router;