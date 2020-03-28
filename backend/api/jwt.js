const jwt = require("jsonwebtoken");

//TODO get secret and set it here
const secret = "verysecretpasswordthatsdefinatelynotinthesource";

function createJWT(userName, admin_status) {
  return jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      pid: userName,
      admin: admin_status
    },
    secret
  );
}

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
