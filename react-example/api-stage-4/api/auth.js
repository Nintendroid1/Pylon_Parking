const nconf = require('nconf');
// respect the following settings
const jwtsecret = nconf.get('jwtsecret');
const jwtexpirationtime = nconf.get('jwtexpirationtime');
const userdb = require('../db/queries');
var jwt = require('jsonwebtoken');
let passport = require('passport');
const bcrypt = require('bcrypt');

/* Here, you have to implement the following: */

/*
 * (a) a jwt strategy for passport that will become part of your
 *     middleware for handling authentication. See
 *     http://www.passportjs.org/packages/passport-jwt/
 *
 *     Make sure to use jwtsecret for secretOrKey
 *     Use the fromAuthHeaderAsBearerToken extractor.
 *
 *     Once the token payload is verified, you could perform here additional
 *     tests, such as whether the user identified by the token still exists.
 *     For now, none are required - simply call done with the JWT payload.
 */
var JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;
let opts = {
  secretOrKey: jwtsecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};
passport.use(
  new JwtStrategy(opts, function(jwt_payload, done) {
    /*
     * We're in this function if someone represents a valid JWT.
     * We cold check here, for instance, whether the token for
     * this user has been revoked before its experitaion time
     */
    done(null, jwt_payload);
  })
);

/*var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'jwtsecret';
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    done(null, jwt_payload)
}));*/
/*
 * (b) a way to make a JSON WebToken out of a user object and return it.
 *     Write the function so that it can be used both when registering a
 *     new user in the /api/users POST endpoint as well as when an
 *     existing user logs on via /api/login (see below).
 *     See https://www.npmjs.com/package/jsonwebtoken
 *     You should add an exp (expires) claim via expireIn as per
 *     jwtexpirationtime; adding a subject claim for username is useful, too.
 */

const token = user => {
  return jwt.sign(user, opts.secretOrKey, { expiresIn: jwtexpirationtime });
};

/*
 * (c) the handler for the POST /api/login entry point.
 *     It should receive the username and password, verify the password.
 *     If unsuccessful, return an appropriate error to the client, along
 *     with a message.
 *
 *     If successful, send a suitable JSON WebToken to the client.
 */

const loginRequestHandler = async (req, res) => {
  let tempUser = req.body;
  let result = await userdb.getUserByName(tempUser.username);
  let user = result[0];
  if (user === undefined) {
    res.status(401).json({ message: 'Incorrect username or bad password' });
  } else {
    const match = await bcrypt.compare(tempUser.password, user.password);
    if (match) {
      let temp = {
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        admin: user.admin,
        id: user.id
      };
      res.json({
        id: temp.id,
        token: token(temp),
        message: 'User Login Successful!'
      });
    } else {
      res.status(401).json({ message: 'Incorrect username or bad password' });
    }
  }
};

/*
 * (d) a middleware higher-order function that takes a predicate and returns a
 *     middleware function that uses passport.authenticate with the
 *     installed jwt strategy.
 *
 *     You should set { session: false } and you should invoke
 *     the passport.authenticate function with a custom callback, as
 *     described on http://www.passportjs.org/docs/authenticate/
 *     (look for "Custom Callback")
 *
 *     The resulting middleware should use the jwt strategy to check
 *     the validity of the token, and then, in addition, the validity
 *     of the provided predicate. If everything checks out ok, it should
 *     set req.user to the value of the decoded token and invoke next().
 *     Otherwise it should end the request with an appropriate status
 *     code and error message.
 */
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
  requireLogin: requireAuthenticationWithPredicate({ test: () => true }),
  /* export other functions from part (b) and (c). */
  token: token,
  loginRequestHandler
};
