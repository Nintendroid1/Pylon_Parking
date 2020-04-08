const express = require("express");
const router = express.Router();
const db = require("../db");
const socketAPI = require("../realtime/socket-broadcaster");

router.get("/all", (req, res) => {
  db.query("SELECT zone_id, zone_name FROM zones", (err, dbres) => {
    if (err) {
      console.log(err.stack);
      res.status(500).json({ message: "Internal server error" });
    } else {
      // socket call.
      // const socket = req.app.settings["socket-api"];
      // console.log(socket)
      // socket.of('zones').emit('zone-1', 'TEST TEST TEST');
      // socketAPI.broadcastZoneInfo(socket, 1, "testing things out");

      // console.log(dbres.rows);
      res.status(200).json({ zones: dbres.rows });
    }
  });
});

router.get("/:zone_id/spot/:spot_id", (req, res) => {
  if (req.query.startTime && req.query.endTime) {
    db.query(
      "SELECT * FROM parking_times WHERE spot_ID = $1 AND zone_ID = $2 AND start_time >= $3 AND end_time <= $4",
      [
        req.params.spot_id,
        req.params.zone_id,
        req.query.startTime,
        req.query.endTime
      ],
      (dbres, err) => {
        if (err) {
          console.log(err.stack);
          res.status(500).json({ message: "Internal server error" });
        } else {
          console.log(dbres);
          res.status(200).json({ parkingInfo: dbres.rows });
        }
      }
    );
  } else {
    db.query(
      "SELECT * FROM parking_times WHERE spot_ID = $1 AND zone_ID = $2",
      [req.params.spot_id, req.params.zone_id],
      (dbres, err) => {
        if (err) {
          console.log(err.stack);
          res.status(500).json({ message: "Internal server error" });
        } else {
          console.log(dbres);
          res.status(200).json({ parkingInfo: dbres.rows });
        }
      }
    );
  }
});

router.get("/:zone_id", (req, res) => {
  if (req.query.startTime && req.query.endTime) {
    db.query(
      'WITH filtered_times AS (SELECT * FROM parking_times WHERE zone_id = $1 AND start_time >= $2 AND end_time <= $3)\
      SELECT spot_id, zone_id, MIN(start_time) as "start_time", MIN(end_time) as "end_time" FROM filtered_times GROUP BY zone_id, spot_id ORDER BY spot_id ASC',
      [req.params.zone_id, req.query.startTime, req.query.endTime]
    ).then((dbres, err) => {
      if (err) {
        console.log(err.stack);
        res.status(500).json({ message: "Internal server error" });
      } else {
        console.log(dbres.rows);
        res.status(200).json({ parkingInfo: dbres.rows });
      }
    });
  } else {
    // db.query('SELECT spot_id FROM parking_spots WHERE zone_ID = $1',[req.params.zone_id], (err,dbres) => {
    db.query(
      'SELECT spot_id, zone_id, MIN(start_time) as "start_time", MIN(end_time) as "end_time" FROM parking_times WHERE zone_id = $1 GROUP BY zone_id, spot_id ORDER BY spot_id ASC',
      [req.params.zone_id]
    ).then((dbres, err) => {
      if (err) {
        console.log(err.stack);
        res.status(500).json({ message: "Internal server error" });
      } else {
        res.status(200).json({ parkingInfo: dbres.rows });
      }
    });
  }
});

module.exports = router;
