const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/all', (req, res) => {
    db.query('SELECT zone_id, zone_name FROM zones', (err,dbres) => {
        if (err) {
            console.log(err.stack);
            res.status(500).json({message: "Internal server error"});
        }
        else {
            // socket call.
            const socketAPI = router.get('socket-api');
            socketAPI.broadcastZoneInfo(1, 'testing things out');

			console.log(dbres.rows);
            res.status(200).json({zones: dbres.rows});
        }
    })
});

router.get('/:zone_id/spot/:spot_id', (req, res) => {
    console.log(req.params)
    db.query('SELECT * FROM parking_times WHERE spot_ID = $1 AND zone_ID = $2',[ req.params.spot_id, req.params.zone_id ], (err,dbres) => {
        if (err) {
            console.log(err.stack);
            res.status(500).json({message: "Internal server error"});
        }
        else {
            console.log(dbres)
            res.status(200).json({parkingInfo: dbres.rows});
        }
    })
});

router.get('/:zone_id', (req, res) => {
    // db.query('SELECT spot_id FROM parking_spots WHERE zone_ID = $1',[req.params.zone_id], (err,dbres) => {
    db.query('SELECT spot_id, zone_id, MIN(time_code) "next_avail" FROM parking_times where zone_id = $1 GROUP BY zone_id, spot_id ORDER BY spot_id ASC',[req.params.zone_id], (err,dbres) => {
        if (err) {
            console.log(err.stack);
            res.status(500).json({message: "Internal server error"});
        }
        else {
            res.status(200).json({parkingInfo: dbres.rows});
        }
    })
});

module.exports = router;
