const express = require('express');
const router = express.Router();
const jwt = require('./jwt');
const db = require('../db');
const socketAPI = require("../realtime/socket-broadcaster");


router.use(express.json());

router.post('/', (req, res) => {

    if(jwt.verifyJWT(req.body.token, req.body.pid)) {
        //Talk to the blockchain here

        db.query('SELECT availability FROM parking_times WHERE spot_ID = $1 AND zone_ID = $2 AND time_code = $3', [req.body.spot.spot_id, req.body.spot.zone_id, req.body.spot.time_code])
        .then(dbres => {
            if(dbres.rows[0]) {
                if(dbres.rows[0].availability) {
                    db.query('UPDATE parking_times SET user_PID = $1, availability = false WHERE spot_ID = $2 AND zone_ID = $3 AND time_code = $4 RETURNING *', [req.body.pid, req.body.spot.spot_id, req.body.spot.zone_id, req.body.spot.time_code], (err,result) => {
                        if (err) {
                            console.log(err.stack);
                            res.status(500).json({message: "Internal error"});
                        }
                        else {
                            /* 
                                Socket updating other users that this spot has been acquired.
                            */
                           // Getting the socket, which is in the settings object.
                            const socket = req.app.settings["socket-api"];

                            // TODO
                            const updatedParkingSpotInfo = null; // object that would be sent back as if the get specific parking spot with parking spot id was called.

                            // TODO
                            const updatedParkingSpotInfoForZone = null; // object containing updated info on this parking spot.

                            const parkingSpotInfoForTransactionHistory = null; // object containing info for the transaction history page, in case someone viewing entire history.

                            // Send updated info to clients viewing this parking spot in the zones page.
                            socketAPI.broadcastZoneInfo(socket, req.body.spot.zone_id, updatedParkingSpotInfoForZone);

                            // Send updated info to clients viewing this parking spot.
                            // Expects each parking spot regardless of zone to have a unique id.
                            // id: [zone_id]-[spot_id]
                            const parkingSpotId = req.body.spot.zone_id + '-' + req.body.spot.spot_id;
                            socketAPI.broadcastParkingSpotInfo(socket, parkingSpotId, updatedParkingSpotInfo);

                            socketAPI.broadcastTransactionHistoryInfo(socket, parkingSpotInfoForTransactionHistory);

                            zone_call = null;
                            db.query(
                                "SELECT * FROM parking_times WHERE spot_ID = $1 AND zone_ID = $2",
                                [req.body.spot_id, req.body.zone_id],
                                (err, dbres) => {
                                    if (err) {
                                        console.log(err.stack);
                                        res.status(500).json({ message: "Internal server error" });
                                      } else {
                                        zone_call = dbres.rows;
                                      }
                                }
                            );

                            res.status(200).json({message: "Spot aquired", spot: result.rows, spot_page: zone_call});
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
