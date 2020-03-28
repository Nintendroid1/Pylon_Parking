const express = require("express");
const router = express.Router();
const jwt = require("./jwt");
const db = require("../db");

router.use(express.json());

router.get("/", (req, res) => {
  res.send("This should be login api");
});

router.get("/info", (req, res) => {
  if(jwt.verifyJWT(req.body.token, req.body.pid)) {
    db.query("SELECT * FROM users WHERE PID = req.body.pid");
  }
  else {
    res.status(403).json({message: "Invalid token"});
  }
});

router.post("/login", async function(req, res) {
  try {
    //Check database
    let isValidLogin = false;
    let isAdmin = false;
    console.log(req.body);
    db.query("SELECT pass, admin_status FROM users WHERE PID = $1", [
      req.body.pid
    ])
      .then(dbres => {
        if (dbres.rows[0]) {
          console.log(dbres.rows[0]);
          isValidLogin = dbres.rows[0].pass === req.body.password;
          isAdmin = dbres.rows[0].admin_status;
        }
      })
      .then(() => {
        if (isValidLogin) {
          res.status(200).json({
            token: jwt.createJWT(req.body.pid, isAdmin),
            pid: req.body.pid,
            admin: isAdmin,
            message: `Successfuly logged in`
          });
        } else {
          res.status(401).json({ message: "Invalid Login" });
        }
      });
  } catch (err) {
    console.log(err);
  }
});

router.post("/register", async function(req, res) {
  try {
    //Check database for duplicate username/email
    db.query(
      "SELECT PID FROM users WHERE PID = $1 OR email = $2",
      [req.body.user.pid, req.body.user.email],
      (err, dbres) => {
        if (err) {
          console.log(err.stack);
          res.status(500).json({ message: "Internal server error" });
        } else {
          //check for duplicate email and username, if there is a duplicate
          //send error if there is and return
          if (dbres.rows[0]) {
            res.status(409).json({
              message: "Either email or pid already in use",
              user: req.body.user
            });
          } else {
            //Add into database new user stuff
            const text =
              "INSERT INTO users(PID, pass, email, first_name, last_name, admin_status) VALUES($1, $2, $3, $4, $5, 0) RETURNING *";
            const values = [
              req.body.user.pid,
              req.body.user.password,
              req.body.user.email,
              req.body.user.first_name,
              req.body.user.last_name
            ];
            db.query(text, values, (err, dbres) => {
              if (err) {
                console.log(err.stack);
                res.status(500).json({ message: "Internal server error" });
              } else {
                console.log(dbres.rows[0]);
                res.status(200).json({
                  token: jwt.createJWT(req.body.user.pid, 0),
                  user: { ...req.body.user, admin: 0 },
                  message: "Succesuflly created user"
                });
              }
            });
          }
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
