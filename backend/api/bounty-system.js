const express = require("express");
const router = express.Router();
const jwt = require('./jwt');
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
var multer  = require('multer')
var upload = multer({ dest: '../public/data/uploads/' })

router.post("/", upload.single('image'), function (req, res) {
  if (req.body.image) {
    let body = new FormData();
    body.append('upload', req.body.image);
    // Or body.append('upload', base64Image);
    body.append('regions', 'us'); // Change to your country
    fetch("https://api.platerecognizer.com/v1/plate-reader/", {
        method: 'POST',
        headers: {
            "Authorization": "Token dd2e85cdffcb75b447a8cdbb1207565b46ca7b66"
        },
        body: body
    }).then(res => res.json())
    .then(json => {
      console.log(json)
      res.status(200).json({ ...json });
    })
    .catch((err) => {
      console.log(err);
      // 406 is Not Acceptable.
      res.status(406).json({ message: 'Image is bad.' })
    });
  }
});

router.post("/report", (req, res) => {
  /*
    - req.body.zone_id = zone id for the reported spot.
    - req.body.spot_id = spot id for the reported spot.
    - req.body.license_info = license plate info of the car parked here.
  */
});

module.exports = router;
