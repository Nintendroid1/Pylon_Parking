const express = require('express');
const router = express.Router();
const jwt = require('./jwt');
const db = require('../db');

router.get('/', (req, res) => {
    res.send("This should be login api");
});

router.post('/login', (req,res) => {
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

router.post('/register', (req,res) => {
    //Check database for duplicate username/email
    db.query('SELECT PID FROM users WHERE PID = $1 OR email = $2', [req.user.pid, req.user.email], (err, dbres) => {
        if (err) {
            console.log(err.stack);
        } else {
            //check for duplicate email and username, if there is a duplicate
            //send error if there is and return
            for(i in dbres.rows) {
                console.log(dbres.rows[i]);
            }
        }
    });

    //Add into database new user stuff
    const text = 'INSERT INTO users(PID, pass, email, first_name, last_name, admin_status) VALUES($1, $2, $3, $4, $5, false) RETURNING *';
    const values = [req.user.PID, req.user.pass, req.user.email, req.user.first_name, req.user.last_name];
    db.query(text, values, (err,dbres) => {
        if (err) {
            console.log(err.stack);
        } else {
            console.log(dbres.rows[0]);
        }
    });
    //do login
});
module.exports = router;