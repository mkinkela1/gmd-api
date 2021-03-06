const passport    = require('passport');
const passportJWT = require("passport-jwt");
const jwt      = require('jsonwebtoken');

const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy   = passportJWT.Strategy;

const User = require('./api/models/user');
const TokenBlacklist = require('./api/models/tokenBlacklist');
const { TOKEN_SECRET_KEY } = process.env;

const bcrypt = require('bcryptjs');

passport.use('login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function (email, password, cb) {

        //Assume there is a DB module providing a global UserModel
        return User
            .findOne({
                email
            })
            .then(user => {

                console.log(user);
                if (!user || !bcrypt.compareSync(password, user.password)) {
                    return cb(null, false, {message: 'Incorrect email or password.'});
                }

                return cb(null, user, {
                    message: 'Logged In Successfully'
                });
            })
            .catch(err => {
                return cb(err);
            });
    }
));
passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : TOKEN_SECRET_KEY
    },
    function (jwtPayload, cb) {

        const token = jwt.sign(jwtPayload, TOKEN_SECRET_KEY);

        TokenBlacklist
            .findOne({ token })
            .then(r => {

                if(r !== null)
                    return cb(null, null);

                return User
                    .findOne({ _id: jwtPayload._id })
                    .then(user => {
                        return cb(null, user);
                    })
                    .catch(err => {
                        return cb(err, false);
                    });
            })
            .catch(err => {
                return cb(err);
            });
    }
));