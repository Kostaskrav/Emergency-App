const passport    = require('passport');
const passportJWT = require("passport-jwt");

const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy   = passportJWT.Strategy;
const User = require("./schemas/User");


passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : process.env.JWT_KEY
},
function (jwtPayload, cb) {

    //find the user in db if needed
    return User.findById(jwtPayload.id)
        .then(user => {
            //console.log(user)
            return cb(null, user);
        })
        .catch(err => {
            return cb(err);
        });
}
));