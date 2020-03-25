const jwt = require('jsonwebtoken');

//TODO get secret and set it here
const secret = 'verysecretpasswordthatsdefinatelynotinthesource';

function createJWT(userName) {
    return jwt.sign({exp: Math.floor(Date.now() / 1000) + (60 * 60), user: userName,}, secret);
}

function verifyJWT(token,userName) {
    try {
        let decoded = jwt.verify(token, secret);
        return decoded.user === userName;
    } catch(err) {
        return false;
    }
}

const funcs = {
    createJWT,
    verifyJWT
}
module.exports = funcs;