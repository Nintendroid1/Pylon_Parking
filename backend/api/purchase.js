const express = require("express");
const router = express.Router();
const jwt = require("./jwt");
const db = require("../db");
const socketAPI = require("../realtime/socket-broadcaster");
const { requireLogin } = require("./auth.js");

router.use(express.json());

router.post("/", requireLogin, (req, res) => {
    //Talk to the blockchain here

    console.log(req.body.spot);
    db.query(
      "SELECT availability, price, user_PID, time_code FROM parking_times WHERE spot_ID = $1 AND zone_ID = $2 AND time_code BETWEEN $3 AND $4 ORDER BY time_code",
      [
        req.body.spot.spot_id,
        req.body.spot.zone_id,
        req.body.spot.start_time,
        req.body.spot.end_time - 1
      ]
    ).then(dbres => {
      if (dbres.rows[0]) {
        let isValidReq = true;
        let totalPrice = 0.0;
        let responseObject = [{
          pid: dbres.rows[0].user_pid,
          start_time: dbres.rows[0].time_code,
          end_time: dbres.rows[0].time_code,
          zone_id: req.body.spot.zone_id,
          spot_id: req.body.spot.spot_id,
          price: 0.0
        }];
        for (i in dbres.rows) {
          if (!dbres.rows[i].availability) {
            isValidReq = false;
          }
          //Building response object
          if (dbres.rows[i].user_pid != responseObject[responseObject.length -1].pid) {
            responseObject.push({
              pid: dbres.rows[i].user_pid,
              start_time: dbres.rows[i].time_code,
              end_time: dbres.rows[i].time_code + 900,
              zone_id: req.body.spot.zone_id,
              spot_id: req.body.spot.spot_id,
              price: parseFloat(dbres.rows[i].price)
            });
          }
          else {
            responseObject[responseObject.length -1].end_time += 900;
            responseObject[responseObject.length -1].price += parseFloat(dbres.rows[i].price);
          }
          totalPrice += parseFloat(dbres.rows[i].price);
        }
        if (isValidReq) {
          //talk to the blockchain here

          db.query(
            "UPDATE parking_times SET user_PID = $1, availability = false, seller_key = NULL WHERE spot_ID = $2 AND zone_ID = $3 AND time_code BETWEEN $4 AND $5 RETURNING *",
            [
              req.body.pid,
              req.body.spot.spot_id,
              req.body.spot.zone_id,
              req.body.spot.start_time,
              req.body.spot.end_time - 1
            ],
            (err, result) => {
              if (err) {
                console.log(err.stack);
                res.status(500).json({ message: "Internal error" });
              } else {
                /*
                                Socket updating other users that this spot has been acquired.
                            */
                // Getting the socket, which is in the settings object.
                const socket = req.app.settings["socket-api"];
                let updatedParkingSpotInfo = null; // object that would be sent back as if the get specific parking spot with parking spot id was called.

                const parkingSpotInfoForTransactionHistory = null; // object containing info for the transaction history page, in case someone viewing entire history.

                db.query(
                  "SELECT * FROM parking_times WHERE spot_ID = $1 AND zone_ID = $2",
                  [req.params.spot_id, req.params.zone_id],
                  (dbres, err) => {
                    if (err) {
                      console.log("it's me");
                      console.log(err.stack);
                    } else {
                      updatedParkingSpotInfo = dbres.rows;
                      // Send updated info to clients viewing this parking spot.
                      // id: [zone_id]-[spot_id]
                      const parkingSpotId =
                        req.body.spot.zone_id + "-" + req.body.spot.spot_id;
                      socketAPI.broadcastParkingSpotInfo(
                        socket,
                        parkingSpotId,
                        updatedParkingSpotInfo
                      );
                    }
                  }
                );

                // Send updated info to clients viewing this parking spot in the zones page.
                // TODO
                // socketAPI.broadcastZoneInfo(
                //   socket,
                //   req.body.spot.zone_id,
                //   updatedParkingSpotInfoForZone
                // );

                // socketAPI.broadcastTransactionHistoryInfo(
                // TODO
                //   socket,
                //   parkingSpotInfoForTransactionHistory
                // );

                // TODO
                // If the parking spot sold was owned by another user that is
                // not the university, then an object containing the zone_id
                // and spot_id of the parking spot sold.

                // TODO
                // If the parking spot sold was owned by another user that is
                // not the university, then an updated value on the amount of
                // tokens they have after the parking spot was sold.

                zone_call = null;
                db.query(
                  "SELECT * FROM parking_times WHERE spot_ID = $1 AND zone_ID = $2",
                  [req.body.spot_id, req.body.zone_id],
                  (err, dbres) => {
                    if (err) {
                      console.log(err.stack);
                      res
                        .status(500)
                        .json({ message: "Internal server error" });
                    } else {
                      zone_call = dbres.rows;
                    }
                  }
                );

                res
                  .status(200)
                  .json({
                    message: "Spot aquired",
                    spot: result.rows,
                    spot_page: zone_call,
                    recipt: {
                      start_time: req.body.spot.start_time,
                      end_time: req.body.spot.end_time,
                      zone_id: req.body.spot.zone_id,
                      spot_id: req.body.spot.spot_id,
                      total_price: totalPrice
                    },
                    responseInfo: responseObject
                  });
              }
            }
          );
        } else {
          res.status(403).json({ message: "Spot not available" });
        }
      } else {
        res.status(403).json({ message: "Bad spot code" });
      }
    });
});

module.exports = router;
