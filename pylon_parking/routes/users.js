var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function(req, res, next) {
  //Do database check and jwt creation here
  
  let jwt = 69;
  res.status(200).send(jwt);
});

module.exports = router;
