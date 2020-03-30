// const bcrypt = require('bcrypt');
const { withJWTAuthMiddleware } = require("express-kun");
const secret = "verysecretpasswordthatsdefinatelynotinthesource";

function getTokenFromBearer(req) {
  const authorization = req.headers.authorization;
  if (!authorization) {
    throw new Error("No Authorization Header");
  }
  try {
    const token = authorization.split("Bearer ")[1];
    return token;
  } catch {
    throw new Error("Invalid Token Format");
  }
}

function createSecureRouter(router) {
  return withJWTAuthMiddleware(router, secret);
}

module.exports = {
  createSecureRouter,
  getTokenFromBearer
};
