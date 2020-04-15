// const bcrypt = require('bcrypt');
//
// const { withJWTAuthMiddleware } = require("express-kun");
// const secret = "verysecretpasswordthatsdefinatelynotinthesource";

// function getTokenFromBearer(req) {
//   const authorization = req.headers.authorization;
//   if (!authorization) {
//     throw new Error("No Authorization Header");
//   }
//   try {
//     const token = authorization.split("Bearer ")[1];
//     return token;
//   } catch {
//     throw new Error("Invalid Token Format");
//   }
// }

// function createSecureRouter(router) {
//   return withJWTAuthMiddleware(router, secret);
// }

// module.exports = {
//   createSecureRouter,
//   getTokenFromBearer
// };


var passport = require("passport");
var passportJwt = require("passport-jwt");
var conf = require("./config.js");
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {
  secretOrKey: conf.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {

  done(null, jwt_payload);
}));

const requireAuthenticationWithPredicate = pred => (req, res, next) => {
  passport.authenticate('jwt', { session: false }, function(err, user) {
    if (user === false) {
      res.status(401).json({ message: 'Invalid User' });
    } else if (pred.test(user) === true) {
      req.user = user;
      next();
    } else {
      res.status(403).json({ message: 'Authentication Failed' });
    }
  })(req, res, next);
};

module.exports = {
  requireAdmin: requireAuthenticationWithPredicate({
    test: user => user.admin === 1 || user.admin,
    message: 'needs admin permissions'
  }),
  requireLogin: requireAuthenticationWithPredicate({test: () => true})
}
