const express = require("express");
const router = express.Router();
const { withJWTAuthMiddleware } = require("express-kun");
const jwt = require("./jwt");
const db = require("../db");
const { createSecureRouter, getTokenFromBearer } = require("./auth.js");
// const { requireLogin } = require("./auth.js");

router.use(express.json());

const secureRouter = createSecureRouter(router);

router.get("/", (req, res) => {
  res.send("This should be login api");
});

secureRouter.get("/:pid/spots", function(req, res) {
  // let req_token = getTokenFromBearer(req);
  // if (jwt.verifyJWT(req_token, req.params.pid)) {
  let sellInfo = {};
  db.query("SELECT * FROM users WHERE PID = $1", [req.params.pid])
    .then(dbres => {
      if (dbres.rows[0]) {
        let tempUser = dbres.rows[0];
        sellInfo = {
          pid: tempUser.pid,
          email: tempUser.email,
          first_name: tempUser.first_name,
          last_name: tempUser.last_name,
          parkingSpotsInfo: []
        };
      }
    })
    .then(() => {
      db.query("SELECT Z.zone_name, P.* FROM parking_times P INNER JOIN zones Z ON P.zone_id = Z.zone_id WHERE P.user_pid = $1", [
        req.params.pid
      ]).then(dbres => {
        if (dbres.rows[0]) {
          sellInfo.parkingSpotsInfo = dbres.rows;
        } else {
          sellInfo.parkingSpotsInfo = [];
        }
        res.status(200).json({ ...sellInfo });
      });
    });
});

secureRouter.get("/:pid", function(req, res) {
  // let req_token = getTokenFromBearer(req);
  // if (jwt.verifyJWT(req_token, req.params.pid)) {
  let userInfo = {};
  console.log(req.params.pid);
  db.query("SELECT * FROM users WHERE PID = $1", [req.params.pid]).then(
    (dbres, err) => {
      if (dbres.rows[0]) {
        let tempUser = dbres.rows[0];
        userInfo = {
          pid: tempUser.pid,
          email: tempUser.email,
          first_name: tempUser.first_name,
          last_name: tempUser.last_name,
          balance: 0
        };
      }
      res.status(200).json({ ...userInfo });
    }
  );
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
