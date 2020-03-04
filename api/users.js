const express = require('express');
const router = express.Router();
const jwt = require('./jwt');

const { Client } = require('pg');
const client = new Client();

router.get('/', (req, res) => {
    res.send("This should be login api");
});

router.post('/', (req,res) => {
    //Check database
    const isValidLogin = true;

    if(isValidLogin) {
        res.status(200).json({
            token : jwt.createJWT(),
            user : 'this is a json with username and admin status',
            message: `Logged in as `
        });
    }
    else {
        res.status(401).json({message:'Invalid Login'});
    }
});

module.exports = router;