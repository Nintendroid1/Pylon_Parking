const jwt = require("jsonwebtoken");

//TODO get secret and set it here
var conf = require("./config.js");
const secret = conf.jwtSecret;
const expiration_offset = conf.expire;

//Create a jwt 
function createJWT(userName, admin_status) {
  return jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + expiration_offset,
      pid: userName,
      admin: admin_status
    },
    secret
  );
}

//Check the token is valid
function verifyJWT(token, userName) {
  try {
    let decoded = jwt.verify(token, secret);
    return decoded.pid === userName;
  } catch (err) {
    return false;
  }
}

const funcs = {
  createJWT,
  verifyJWT
};
module.exports = funcs;
