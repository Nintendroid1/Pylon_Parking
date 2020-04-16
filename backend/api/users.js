const express = require("express");
const router = express.Router();
const jwt = require("./jwt");
const db = require("../db");
const fs = require("fs");
// const { withJWTAuthMiddleware } = require("express-kun");
// const { createSecureRouter, getTokenFromBearer } = require("./auth.js");
// const secureRouter = createSecureRouter(router);
const FormData = require('form-data');
var multer = require("multer");
var upload = multer({ dest: "../public/data/uploads/" });
const { requireLogin } = require("./auth.js");

router.post("/:pid/avatar", upload.single("image"), function(req, res) {
  if (req.body.image) {
    // Grab the extension to resolve any image error
    var ext = req.body.image.split(';')[0].match(/jpeg|png|gif/)[0];
    // strip off the data: url prefix to get just the base64-encoded bytes
    let base64Image = req.body.image.split(";base64,").pop();
    fs.writeFile(`public/images/avatars/${req.params.pid}_avatar.png`, base64Image, { encoding: "base64" }, function(
      err
    ) {
      if (err) {
        console.log(err.stack);
        res.status(500).json({message: "Internal Server Error"});
      } else {
        res.json({message: "Updated user avatar!"});
      }
    });
  }
});

router.use(express.json());

router.get("/:pid/avatar", requireLogin, function(req, res) {
  if (req.user) {
    fs.readFile(`public/images/avatars/${req.user.pid}_avatar.png`, "base64", function(
      err, data
    ) {
      if (err) {
        console.log(err.stack);
        res.status(404).json({message: "User has no avatar"});
      } else {
        let body = new FormData();
        body.append('image', data);
        // Or body.append('upload', base64Image);
        body.append('regions', 'us'); // Change to your country
        res.send({image: data});
      }
    });
  }
});


router.get("/", (req, res) => {
  res.send("This should be login api");
});

router.get("/:pid/spots", requireLogin, function(req, res) {
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
      db.query(
        "SELECT Z.zone_name, P.*\
        FROM spot_range P\
        INNER JOIN zones Z\
        ON P.zone_id = Z.zone_id\
        WHERE P.user_pid = $1 \
        AND P.start_time >= (SELECT EXTRACT(epoch FROM date_trunc('day', NOW()))) AND P.end_time <= (SELECT EXTRACT(epoch FROM date_trunc('day', NOW() + INTERVAL '1 day')))\
        ORDER BY zone_id, spot_id, start_time",
        [req.params.pid]
      ).then(dbres => {
        if (dbres.rows[0]) {
          let info = dbres.rows;
          let areOnSameDay = (date1, date2) => {
            return (
              date1.getDate() == date2.getDate() &&
              date1.getMonth() == date2.getMonth() &&
              date1.getFullYear() == date2.getFullYear()
            );
          };
          let mergeTimes = (index, arr) => {
              let final_res = [];
            while (index < arr.length) {
              let temp_res = [arr[index]];
              let totalCost = Number(temp_res[0].price);
              let temp_ind = 1;
              let arr_ind = index + 1;
              let startDate = new Date(Number(temp_res[0].start_time) * 1000);
              let curDate = new Date(
                Number(temp_res[temp_ind - 1].end_time) * 1000
              );
              while (
                arr_ind < arr.length &&
                temp_res[temp_ind - 1].end_time == arr[arr_ind].start_time &&
                areOnSameDay(startDate, curDate) &&
                temp_res[temp_ind - 1].availability ==
                  arr[arr_ind].availability &&
                temp_res[temp_ind - 1].zone_id == arr[arr_ind].zone_id &&
                temp_res[temp_ind - 1].spot_id == arr[arr_ind].spot_id
              ) {
                temp_res.push(arr[arr_ind]);
                totalCost += Number(arr[arr_ind].price);
                arr_ind++;
                temp_ind++;
                curDate = new Date(
                  Number(temp_res[temp_ind - 1].end_time) * 1000
                );
              }
              // console.log(final_res);
              final_res.push({
                  ...temp_res[0],
                  end_time: Number(temp_res[temp_res.length - 1].end_time) - 1,
                  price: totalCost
                }
              );
              index = arr_ind;
              //.concat(mergeTimes(arr_ind, arr));
            }
            return final_res;
          };

          sellInfo.parkingSpotsInfo = mergeTimes(0, dbres.rows);
        } else {
          sellInfo.parkingSpotsInfo = [];
        }
        res.status(200).json({ ...sellInfo });
      });
    });
});

router.get("/:pid", requireLogin, function(req, res) {
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
