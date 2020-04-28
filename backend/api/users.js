const express = require("express");
const router = express.Router();
const jwt = require("./jwt");
const db = require("../db");
const fs = require("fs");
const conf = require("./config.js");
// const { withJWTAuthMiddleware } = require("express-kun");
// const { createSecureRouter, getTokenFromBearer } = require("./auth.js");
// const secureRouter = createSecureRouter(router);
const FormData = require('form-data');
var multer = require("multer");
var upload = multer({ dest: "../public/data/uploads/" });
const { requireLogin } = require("./auth.js");

const { Api, JsonRpc, RpcError } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');      // development only
const fetch = require('node-fetch');                                    // node only; not needed in browsers
const { TextEncoder, TextDecoder } = require('util');                   // node only; native TextEncoder/Decoder


/*
 * Upload an avatar to your profile 
*/
router.post("/:pid/avatar", upload.single("image"), function(req, res) {
  if (req.body.image) {
    // Grab the extension to resolve any image error
    var ext = req.body.image.split(';')[0].match(/jpeg|png|gif/)[0];
    // strip off the data: url prefix to get just the base64-encoded bytes
    let base64Image = req.body.image.split(";base64,").pop();
    fs.writeFile(`public/images/${req.params.pid}_avatar.png`, base64Image, { encoding: "base64" }, function(
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


router.get("/", (req, res) => {
  res.send("This should be login api");
});

/*
 * Return the spots that a given user owns based on PID,
 * queries the database and groups based on time and availability
 */
router.get("/:pid/spots", requireLogin, function(req, res) {
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
      console.log(Math.floor(Date.now()/1000));
      db.query(
        "SELECT Z.zone_name, P.*\
        FROM parking_times P\
        INNER JOIN zones Z\
        ON P.zone_id = Z.zone_id\
        WHERE P.user_pid = $1 \
        AND P.time_code >= $2 \
        ORDER BY zone_id, spot_id, time_code",
        [req.params.pid, Math.floor(Date.now()/1000)]
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
          sellInfo.parkingSpotsInfo = [{
            zone_name: dbres.rows[0].zone_name,
            zone_id: dbres.rows[0].zone_id,
            spot_id: dbres.rows[0].spot_id,
            start_time: dbres.rows[0].time_code,
            end_time: dbres.rows[0].time_code + 899,
            user_pid: sellInfo.pid,
            availability: dbres.rows[0].availability.toString(),
            price: parseFloat(dbres.rows[0].price)
          }];
          for(let i = 1; i < dbres.rows.length; i++) {
            let cur = dbres.rows[i].time_code;
            let prevEnd = sellInfo.parkingSpotsInfo[sellInfo.parkingSpotsInfo.length -1].end_time;
            let prevStart = sellInfo.parkingSpotsInfo[sellInfo.parkingSpotsInfo.length -1].start_time;

            if(cur == (prevEnd + 1) && areOnSameDay(new Date(Number(cur) * 1000), new Date(Number(prevStart) * 1000))
                                  && dbres.rows[i].availability.toString() == sellInfo.parkingSpotsInfo[sellInfo.parkingSpotsInfo.length -1].availability
                                  && dbres.rows[i].spot_id == sellInfo.parkingSpotsInfo[sellInfo.parkingSpotsInfo.length -1].spot_id
                                  && dbres.rows[i].zone_id == sellInfo.parkingSpotsInfo[sellInfo.parkingSpotsInfo.length -1].zone_id) {
              sellInfo.parkingSpotsInfo[sellInfo.parkingSpotsInfo.length -1].end_time += 900;
              sellInfo.parkingSpotsInfo[sellInfo.parkingSpotsInfo.length -1].price += parseFloat(dbres.rows[i].price);
            }
            else {
              sellInfo.parkingSpotsInfo.push({
                zone_name: dbres.rows[i].zone_name,
                zone_id: dbres.rows[i].zone_id,
                spot_id: dbres.rows[i].spot_id,
                start_time: dbres.rows[i].time_code,
                end_time: dbres.rows[i].time_code + 899,
                user_pid: sellInfo.pid,
                availability: dbres.rows[i].availability.toString(),
                price: parseFloat(dbres.rows[i].price)
              })
            }
          }

        } else {
          sellInfo.parkingSpotsInfo = [];
        }
        res.status(200).json({ ...sellInfo });
      });
    });
});

/*
 * Get the user info for a user by pid,
 * queries the database for the info,
 * also returns the account balance by
 * querying the block chain
 */
router.get("/:pid", requireLogin, function(req, res) {
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
      const rpc = new JsonRpc('http://127.0.0.1:8888', { fetch });
      rpc.get_currency_balance('eosio.token', req.params.pid.toLocaleLowerCase(), 'VTP')
      .then((balance) => {
        userInfo.balance = parseFloat(balance);
        res.status(200).json({ ...userInfo });
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({message: "Internal Server Error"});
      });
      
    }
  );
});

/* 
 * Handles login requests, checks the provided info against
 * the info stored in the database.
 */
router.post("/login", async function(req, res) {
  try {
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

/*
 * Register a new user, must have lowercase name under 12 character
 * and only contain numbers 1-5
 * 
 * Adds the user information into the database as well as the block chain,
 * and then grants the new user the correct permissions and 300 VTP
 */
router.post("/register", async function(req, res) {
  try {
    const letters = /^[a-z1-5]+$/;
    if(!req.body.user.pid.match(letters) || !(req.body.user.pid.length<=12)) {
      res.status(400).json({message: "pid should only contain letters a-z and numbers 1-5"})
      return;
    }
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

                //Add to chain

                //Generate the the private key for the user
                let {PrivateKey, PublicKey, Signature, Aes, key_utils, config} = require('eosjs-ecc');
                let privateWif;
                PrivateKey.randomKey().then(privateKey => {
                  privateWif = privateKey.toWif();
                  let pubkey = PrivateKey.fromString(privateWif).toPublic().toString();

                  const signatureProvider = new JsSignatureProvider([conf.adminKey,privateWif]);
                  const rpc = new JsonRpc('http://127.0.0.1:8888', { fetch });
                  const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
                  //Add the new account into the blockchain
                  api.transact({
                    actions: [{
                      account: 'eosio',
                      name: 'newaccount',
                      authorization: [{
                        actor: 'admin',
                        permission: 'active',
                      }],
                      data: {
                        creator: 'admin',
                        name: req.body.user.pid.toLowerCase(),
                        owner: {
                          threshold: 1,
                          keys: [{
                            key: pubkey,
                            weight: 1
                          }],
                          accounts: [],
                          waits: []
                        },
                        active: {
                          threshold: 1,
                          keys: [{
                            key: pubkey,
                            weight: 1
                          }],
                          accounts: [],
                          waits: []
                        },
                      },
                    }]
                  }, {
                    blocksBehind: 3,
                    expireSeconds: 30,
                  })
                  .then(blockRes => {
                    console.log(blockRes);
                    //Update the permissions so they can use the appropriate contracts and give them initial balance
                    api.transact({
                      actions: [{
                        account: 'eosio',
                        name: 'updateauth',
                        authorization: [{
                          actor: req.body.user.pid.toLowerCase(),
                          permission: 'active'
                        }],
                        data: {
                          account: req.body.user.pid.toLowerCase(),
                          permission: 'active',
                          parent: 'owner',
                          auth: {
                            threshold: 1,
                            keys:[{"key":pubkey, "weight":1}], 
                            accounts:[{"permission":{"actor":"park.vt","permission":"eosio.code"},"weight":1}], 
                            waits:[]
                          }
                        }
                      },{
                        account: 'eosio.token',
                        name: 'transfer',
                        authorization: [{
                          actor: 'admin',
                          permission: 'active'
                        }],
                        data: {
                          from: 'admin',
                          to: req.body.user.pid.toLowerCase(),
                          quantity: '300.0000 VTP',
                          memo: 'Initial Tokens'
                        }
                      }]
                    },
                    {
                      blocksBehind: 3,
                      expireSeconds: 30,
                    })
                    .then(result => {
                      console.log(result);
                    })
                    .catch(err => console.log(err));
                  })
                  .then(blockRes => {
                    console.log(blockRes);
                    res.status(200).json({
                      token: jwt.createJWT(req.body.user.pid, 0),
                      user: { ...req.body.user, admin: 0 },
                      publicKey: pubkey,
                      privateKey: privateWif,
                      message: "Succesuflly created user"
                    });
                  })
                  .catch(err => {
                    console.log(err);
                    db.query("DELETE from users WHERE pid = $1", [req.body.user.pid], (err, dbres) => {
                      if (err) {
                        console.log(err.stack);
                        res.status(500).json({ message: "Internal server error, database failed to update" });
                      } else {
                        res.status(500).json({message: "Internal Server Error"});
                      }
                    });
                  });
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
