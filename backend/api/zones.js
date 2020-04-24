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
  let spotRes = {};
  if (req.query.startTime && req.query.endTime) {
      db.query(
        "SELECT Z.zone_name, P.*\
        FROM parking_times P\
        INNER JOIN zones Z\
        ON P.zone_id = Z.zone_id\
        WHERE P.spot_id = $1 \
        AND P.zone_id = $2 \
        AND P.time_code >= $3 \
        ORDER BY P.zone_id, spot_id, time_code",
      [
        req.params.spot_id,
        req.params.zone_id,
        req.query.startTime,
        req.query.endTime
      ]
      ).then(dbres => {
        // If there are spots for the user in the zone etc.
        if (dbres.rows[0]) {
          let info = dbres.rows;
          let areOnSameDay = (date1, date2) => {
            return (
              date1.getDate() == date2.getDate() &&
              date1.getMonth() == date2.getMonth() &&
              date1.getFullYear() == date2.getFullYear()
            );
          };
          spotRes.parkingInfo = [{
            zone_name: dbres.rows[0].zone_name,
            zone_id: dbres.rows[0].zone_id,
            spot_id: dbres.rows[0].spot_id,
            start_time: dbres.rows[0].time_code,
            end_time: dbres.rows[0].time_code + 899,
            user_pid: spotRes.pid,
            availability: dbres.rows[0].availability.toString(),
            price: parseFloat(dbres.rows[0].price)
          }];
          for(let i = 1; i < dbres.rows.length; i++) {
            let cur = dbres.rows[i].time_code;
            let prevEnd = spotRes.parkingInfo[spotRes.parkingInfo.length -1].end_time;
            let prevStart = spotRes.parkingInfo[spotRes.parkingInfo.length -1].start_time;

            if(cur == (prevEnd + 1) && areOnSameDay(new Date(Number(cur) * 1000), new Date(Number(prevStart) * 1000))
                                  && dbres.rows[i].availability.toString() == spotRes.parkingInfo[spotRes.parkingInfo.length -1].availability
                                  && dbres.rows[i].spot_id == spotRes.parkingInfo[spotRes.parkingInfo.length -1].spot_id
                                  && dbres.rows[i].zone_id == spotRes.parkingInfo[spotRes.parkingInfo.length -1].zone_id) {
              spotRes.parkingInfo[spotRes.parkingInfo.length -1].end_time += 900;
              spotRes.parkingInfo[spotRes.parkingInfo.length -1].price += parseFloat(dbres.rows[i].price);
            }
            else {
              spotRes.parkingInfo.push({
                zone_name: dbres.rows[i].zone_name,
                zone_id: dbres.rows[i].zone_id,
                spot_id: dbres.rows[i].spot_id,
                start_time: dbres.rows[i].time_code,
                end_time: dbres.rows[i].time_code + 899,
                user_pid: spotRes.pid,
                availability: dbres.rows[i].availability.toString(),
                price: parseFloat(dbres.rows[i].price)
              })
            }
          }

        } else {
          spotRes.parkingInfo = [];
        }
        res.status(200).json({ ...spotRes });
      });
  } else {
      db.query(
        "SELECT Z.zone_name, P.*\
        FROM parking_times P\
        INNER JOIN zones Z\
        ON P.zone_id = Z.zone_id\
        WHERE spot_id = $1\
        AND P.zone_id = $2 \
        ORDER BY P.zone_id, spot_id, time_code",
      [
        req.params.spot_id,
        req.params.zone_id
      ]
      ).then(dbres => {
        // If there are spots for the user in the zone etc.
        if (dbres.rows[0]) {
          let info = dbres.rows;
          let areOnSameDay = (date1, date2) => {
            return (
              date1.getDate() == date2.getDate() &&
              date1.getMonth() == date2.getMonth() &&
              date1.getFullYear() == date2.getFullYear()
            );
          };
          spotRes.parkingInfo = [{
            zone_name: dbres.rows[0].zone_name,
            zone_id: dbres.rows[0].zone_id,
            spot_id: dbres.rows[0].spot_id,
            start_time: dbres.rows[0].time_code,
            end_time: dbres.rows[0].time_code + 899,
            user_pid: spotRes.pid,
            availability: dbres.rows[0].availability.toString(),
            price: parseFloat(dbres.rows[0].price)
          }];
          for(let i = 1; i < dbres.rows.length; i++) {
            let cur = dbres.rows[i].time_code;
            let prevEnd = spotRes.parkingInfo[spotRes.parkingInfo.length -1].end_time;
            let prevStart = spotRes.parkingInfo[spotRes.parkingInfo.length -1].start_time;

            if(cur == (prevEnd + 1) && areOnSameDay(new Date(Number(cur) * 1000), new Date(Number(prevStart) * 1000))
                                  && dbres.rows[i].availability.toString() == spotRes.parkingInfo[spotRes.parkingInfo.length -1].availability
                                  && dbres.rows[i].spot_id == spotRes.parkingInfo[spotRes.parkingInfo.length -1].spot_id
                                  && dbres.rows[i].zone_id == spotRes.parkingInfo[spotRes.parkingInfo.length -1].zone_id) {
              spotRes.parkingInfo[spotRes.parkingInfo.length -1].end_time += 900;
              spotRes.parkingInfo[spotRes.parkingInfo.length -1].price += parseFloat(dbres.rows[i].price);
            }
            else {
              spotRes.parkingInfo.push({
                zone_name: dbres.rows[i].zone_name,
                zone_id: dbres.rows[i].zone_id,
                spot_id: dbres.rows[i].spot_id,
                start_time: dbres.rows[i].time_code,
                end_time: dbres.rows[i].time_code + 899,
                user_pid: spotRes.pid,
                availability: dbres.rows[i].availability.toString(),
                price: parseFloat(dbres.rows[i].price)
              })
            }
          }

        } else {
          spotRes.parkingInfo = [];
        }
        res.status(200).json({ ...spotRes });
      });
  }
});

router.get("/:zone_id", (req, res) => {
  if (req.query.startTime && req.query.endTime) {
    db.query(
      'WITH filtered_times AS ( \
    SELECT \
      * \
    FROM \
      parking_times \
    WHERE \
      zone_id = $1 \
      AND time_code >= $2 \
      AND time_code <= $3 \
      AND availability = true \
  ) \
  SELECT \
    Z.zone_name, F.spot_id, \
    F.zone_id, \
    MIN(F.time_code) as "start_time", \
    MAX(F.time_code) + 899 as "end_time", \
    SUM(F.price) as "price" \
  FROM \
    filtered_times F \
    INNER JOIN zones Z ON Z.zone_id = F.zone_id \
  GROUP BY \
    F.zone_id, \
    F.spot_id, \
    Z.zone_name \
  ORDER BY \
    F.spot_id ASC',
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
    let todayDate = new Date();
    const year = todayDate.getFullYear();
    const month = todayDate.getMonth();
    const day = todayDate.getDate();

    let todayStartTime =
      new Date(Date.UTC(year, month, day, 0, 0)).getTime() / 1000;
    let todayEndTime =
      new Date(Date.UTC(year, month, day, 23, 59)).getTime() / 1000;
    db.query(
      'WITH filtered_times AS ( \
      SELECT \
        * \
      FROM \
        parking_times \
      WHERE \
        zone_id = $1 \
        AND time_code >= $2 \
        AND time_code <= $3 \
        AND availability = true \
    )  \
    SELECT \
      Z.zone_name, \
      F.spot_id, \
      F.zone_id, \
      MIN(F.time_code) as "start_time", \
      MAX(F.time_code) + 899 as "end_time", \
      SUM(F.price) as "price" \
    FROM \
      filtered_times F \
          INNER JOIN zones Z \
          ON Z.zone_id = F.zone_id \
    GROUP BY \
      F.zone_id, \
      F.spot_id, \
      Z.zone_name \
    ORDER BY \
      F.spot_id ASC',
      [req.params.zone_id, todayStartTime, todayEndTime]
    ).then((dbres, err) => {
      if (err) {
        console.log(err.stack);
        res.status(500).json({ message: "Internal server error" });
      } else {
        // db.query(
        //   'SELECT * FROM parking_times WHERE zone_id = $1 AND time_code >= $2 AND time_code <= $3 AND availability = true GROUP BY zone_id, spot_id, time_code, availability',
        //   [req.params.zone_id, todayStartTime, todayEndTime]
        // ).then((test_dbres, err) => { console.log(test_dbres.rows); });
        console.log(dbres.rows);
        res.status(200).json({ parkingInfo: dbres.rows });
      }
    });
  }
});

module.exports = router;
