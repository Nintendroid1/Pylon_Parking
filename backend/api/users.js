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
  //let keys = ["5KY2ydXyvyrYSAZrgNXYTyrWST75ABF33VccrGen42RBdwMKcNt","5JLDNMsHS61J623WFB9TYJvmDasMVrk5iYfijZqehccQPqiJKTM"]
  let keys = ['5KUdsBDPC3UxVA3ht4LGCGhBr6ppbKmMNdJ5oNgawRKMjQwMXwe',conf.parkVTKey,conf.adminKey];

  const signatureProvider = new JsSignatureProvider(keys);
  const rpc = new JsonRpc('http://127.0.0.1:8888', { fetch });
  const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

  // api.transact({
  //   actions: [{
  //     account: 'eosio',
  //     name: 'updateauth',
  //     authorization: [{
  //       actor: 'testpid1',
  //       permission: 'active'
  //     }],
  //     data: {
  //       account: 'testpid1',
  //       permission: 'active',
  //       parent: 'owner',
  //       auth: {
  //         threshold: 1,
  //         keys:[{"key":"EOS8PHGniEVDSzPUpWbWndRvEsSLY9ECwAK5H3EpyHYHn8a7vV3Uu", "weight":1}], 
  //         accounts:[{"permission":{"actor":"park.vt","permission":"eosio.code"},"weight":1}], 
  //         waits:[]
  //       }
  //     }
  //   }]
  // },
  // {
  //   blocksBehind: 3,
  //   expireSeconds: 30,
  // })
  // .then(result => {
  //   console.log(result);
  // })
  // .catch(err => console.log(err));

  //Get Accounts Associated with private key
  // let {PrivateKey, PublicKey, Signature, Aes, key_utils, config} = require('eosjs-ecc');
  // let pubkey = PrivateKey.fromString(keys[1]).toPublic().toString();
  // rpc.history_get_key_accounts(pubkey).then(result => {
  //   if(result.account_names.includes('greg')) {
  //     console.log("true");
  //   }
  // }).catch(err => console.log(err));

  //Transfer Tokens
  api.transact({
    actions: [{
      account: 'eosio.token',
      name: 'transfer',
      authorization: [{
        actor: 'testpid1',
        permission: 'active'
      }],
      data: {
        from: 'testpid1',
        to: 'admin',
        quantity: '5.0000 VTP',
        memo: 'I give up'
      }
    }]
  },
  {
    blocksBehind: 3,
    expireSeconds: 30,
  })
  .then(result => console.log(result))
  .catch(err => console.log(err));

  // Insert parking spot into table
  // api.transact({
  //   actions: [{
  //     account: 'park.vt',
  //     name: 'insert',
  //     authorization: [{
  //       actor: 'park.vt',
  //       permission: 'active'
  //     }],
  //     data: {
  //       user: 'park.vt',
  //       spot_id: '1',
  //       zone_id: '1',
  //       time_code: '1587585953',
  //       owner: 'admin'
  //     }
  //   }]
  // },
  // {
  //   blocksBehind: 3,
  //   expireSeconds: 30,
  // })
  // .then(result => console.log(result))
  // .catch(err => console.log(err));

  //Get Currency Balance
  //rpc.get_currency_balance('eosio.token', 'greg', 'VTP').then((balance) => console.log(parseFloat(balance))).catch(err => console.log(err));

  //Issue Tokens
  // api.transact({
  //   actions: [{
  //     account: 'eosio.token',
  //     name: 'issue',
  //     authorization: [{
  //       actor: 'alice',
  //       permission: 'active'
  //     }],
  //     data: {
  //       to: 'alice',
  //       quantity: '5000.0000 VTP',
  //       memo: 'Chet You Betcha',
  //     }
  //   }]
  // },
  // {
  //   blocksBehind: 3,
  //   expireSeconds: 30,
  // })
  // .then(result => console.log(result))
  // .catch(err => console.log(err));

  // Modavail
  // api.transact({
  //   actions: [{
  //     account: 'park.vt',
  //     name: 'modavail',
  //     authorization: [{
  //       actor: 'testpid1',
  //       permission: 'active'
  //     },{
  //       actor: 'admin',
  //       permission: 'active'
  //     },
  //     {
  //       actor: 'park.vt',
  //       permission: 'active'
  //     }],
  //     data: {
  //       buyer: 'testpid1',
  //       quantity: '2.5000 VTP',
  //       spot_id: '1',
  //       zone_id: '1',
  //       time_code: '1587607200'
  //     }
  //   }]
  // },
  // {
  //   blocksBehind: 3,
  //   expireSeconds: 30,
  // })
  // .then(result => console.log(result))
  // .catch(err => console.log(err));

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
                let {PrivateKey, PublicKey, Signature, Aes, key_utils, config} = require('eosjs-ecc');
                let privateWif;
                PrivateKey.randomKey().then(privateKey => {
                  privateWif = privateKey.toWif();
                  let pubkey = PrivateKey.fromString(privateWif).toPublic().toString();

                  const signatureProvider = new JsSignatureProvider([conf.adminKey,privateWif]);
                  const rpc = new JsonRpc('http://127.0.0.1:8888', { fetch });
                  const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
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
                          quantity: '30.0000 VTP',
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
