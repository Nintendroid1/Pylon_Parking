const express = require('express');
const router = express.Router();
const jwt = require('./jwt');
const db = require('../db');

router.use(express.json());

router.get('/', (req, res) => {
    res.send("This should be login api");
});

router.post('/login', (req,res) => {
    //Check database
    let isValidLogin = false;
    db.query('SELECT pass FROM users WHERE PID = $1', [req.body.userName])
    .then(dbres => {
        if(dbres.rows[0]) {
            isValidLogin = dbres.rows[0].pass === req.body.pass;
        }
    })
    .then(()=> {
        if(isValidLogin) {
            res.status(200).json({
                token : jwt.createJWT(req.body.userName),
                user : req.body.userName,
                message: `Successfuly logged in`
            });
        }
        else {
            res.status(401).json({message:'Invalid Login'});
        }
    })

});

router.post('/register', (req,res) => {
    //Check database for duplicate username/email
    db.query('SELECT PID FROM users WHERE PID = $1 OR email = $2', [req.body.user.pid, req.body.user.email], (err, dbres) => {
        if (err) {
            console.log(err.stack);
            res.status(500).json({message:'Internal server error'});
        } else {
            //check for duplicate email and username, if there is a duplicate
            //send error if there is and return
            if(dbres.rows[0]) {
                res.status(409).json({message:'Either email or pid already in use', user:req.body.user});
            } else {
                //Add into database new user stuff
                const text = 'INSERT INTO users(PID, pass, email, first_name, last_name, admin_status) VALUES($1, $2, $3, $4, $5, false) RETURNING *';
                const values = [req.body.user.pid, req.body.user.pass, req.body.user.email, req.body.user.first_name, req.body.user.last_name];
                db.query(text, values, (err,dbres) => {
                    if (err) {
                        console.log(err.stack);
                        res.status(500).json({message:'Internal server error'});
                    } else {
                        console.log(dbres.rows[0]);
                        res.status(200).json({
                            token: jwt.createJWT(req.body.user.pid),
                            user: req.body.user,
                            message: 'Succesuflly created user'
                        });
                    }
                });
            }
        }
    });
});
module.exports = router;