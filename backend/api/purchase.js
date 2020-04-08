const express = require("express");
const router = express.Router();
const jwt = require("./jwt");
const db = require("../db");
const socketAPI = require("../realtime/socket-broadcaster");

router.use(express.json());

router.post("/", (req, res) => {
  if (jwt.verifyJWT(req.body.token, req.body.pid)) {
    //Talk to the blockchain here

    db.query(
      "SELECT availability FROM parking_times WHERE spot_ID = $1 AND zone_ID = $2 AND time_code BETWEEN $3 AND $4",
      [
        req.body.spot.spot_id,
        req.body.spot.zone_id,
        req.body.spot.start_time,
        req.body.spot.end_time - 1
      ]
    ).then(dbres => {
      if (dbres.rows[0]) {
        let isValidReq = true;
        for (i in dbres.rows) {
          if (!dbres.rows[i].availability) {
            isValidReq = false;
          }
        }
        if (isValidReq) {
          db.query(
            "UPDATE parking_times SET user_PID = $1, availability = false WHERE spot_ID = $2 AND zone_ID = $3 AND time_code BETWEEN $4 AND $5 RETURNING *",
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
                    spot_page: zone_call
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
  }
});

module.exports = router;
