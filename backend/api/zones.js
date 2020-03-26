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
            res.status(200).json(dbres.rows);
        }
    })
});

router.get('/:zone_id/spot/:spot_id', (req, res) => {
    db.query('SELECT * FROM parking_times WHERE spot_ID = $1 AND zone_ID = $2',[req.params.zone_id, req.params.spot_id], (err,dbres) => {
        if (err) {
            console.log(err.stack);
            res.status(500).json({message: "Internal server error"});
        }
        else {
            res.status(200).json(dbres.rows);
        }
    })
});

router.get('/:zone_id', (req, res) => {
    db.query('SELECT spot_id FROM parking_spots WHERE zone_ID = $1',[req.params.zone_id], (err,dbres) => {
        if (err) {
            console.log(err.stack);
            res.status(500).json({message: "Internal server error"});
        }
        else {
            res.status(200).json(dbres.rows);
        }
    })
});

module.exports = router;