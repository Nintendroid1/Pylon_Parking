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
                    receipt: {
                      start_time: req.body.spot.start_time,
                      end_time: req.body.spot.end_time,
                      zone_id: req.body.spot.zone_id,
                      spot_id: req.body.spot.spot_id,
                      total_price: totalPrice
                    }
                  });
                
                /*
                  responseObject = [{"pid":"admin","start_time":1583040600,"end_time":1583041500,"zone_id":"1","spot_id":"1","price":1}]
                */

                const respObjLastIndex = responseObject.length - 1;
                const spotPurchasedInfo = {
                  isAvail: false,
                  parkingInfo: {
                    start_time: responseObject[0].start_time,
                    end_time: responseObject[respObjLastIndex].end_time,
                    zone_id: Number(responseObject[0].zone_id),
                    spot_id: Number(responseObject[0].spot_id)
                  }
                }

                const spotsSoldByOtherUser = responseObject.filter(e => e.pid !== "admin");

                const socket = req.app.settings["socket-api"];

                const parkingSpotId = spotPurchasedInfo.zone_id + '-' + spotPurchasedInfo.spot_id;

                // Updating the list parking spots page.
                socketAPI.broadcastZoneInfo(
                  socket,
                  spotPurchasedInfo.zone_id,
                  spotPurchasedInfo
                );

                // Updating the user profile, sell page, and parking spot page.
                spotsSoldByOtherUser.forEach(e => {
                  socketAPI.broadcastUserInfo(
                    socket,
                    e.pid,
                    e.price
                  );

                  const sellPageData = {
                    zone_id: e.zone_id,
                    spot_id: e.spot_id,
                    start_time: e.start_time
                  };

                  socketAPI.broadcastSellPageInfo(
                    socket,
                    e.pid,
                    sellPageData
                  );

                  const parkingSpotPageData = {
                    start_time: e.start_time,
                    end_time: e.end_time,
                    price: e.price
                  };

                  socketAPI.broadcastParkingSpotInfo(
                    socket,
                    parkingSpotId,
                    parkingSpotPageData
                  )
                })
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
