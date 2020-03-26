const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/all', (req, res) => {
    db.query('SELECT zone_id, name FROM zones', (err,dbres) => {
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
    res.send("This should list details of a particular spot");
});

router.get('/:zone_id', (req, res) => {
    res.send("This should list all the spots in a zone");
});

module.exports = router;