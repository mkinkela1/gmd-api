const jwt      = require('jsonwebtoken');
const passport = require('passport');
const bcrypt = require('bcryptjs');

const {TOKEN_SECRET_KEY, TOKEN_LIFE, REFRESH_TOKEN_SECRET_KEY, REFRESH_TOKEN_LIFE} = process.env;

const User = require('./../models/user');
const TokenBlacklist = require('./../models/tokenBlacklist');
const Mongoose = require("mongoose");

const { RefreshToken } = require("../services/refreshToken");
const RefreshTokenService = new RefreshToken();

require('./../../passport');

/**
 * User authentication
 *
 * @param req
 * @param res
 * @param next
 */
exports.auth = (req, res, next) => {

    passport.authenticate('login', {session: false}, (err, user, info) => {

        if (err || !user) {
            return res.status(400).json({
                message: info ? info.message : 'Login failed',
                user   : user,
                err
            });
        }

        req.login(user, {session: false}, (err) => {
            if (err) {
                res.status(500).json(err);
            }

            const token = jwt.sign(user.toJSON(), TOKEN_SECRET_KEY, { expiresIn: TOKEN_LIFE });
            const refreshToken = jwt.sign(user.toJSON(), REFRESH_TOKEN_SECRET_KEY, { expiresIn: REFRESH_TOKEN_LIFE });

            RefreshTokenService.addToken(refreshToken, user);

            return res.status(201).json({
                user,
                token: {
                    token,
                    refreshToken
                }
            });
        });
    })(req, res, next);
};

/**
 * Refresh tokens
 *
 * @param req
 * @param res
 * @param next
 */
exports.refreshToken = (req, res, next) => {

    let { refreshToken } = req.body;

    const user = RefreshTokenService.validateToken(refreshToken);

    if(user) {

        RefreshTokenService.removeToken(refreshToken);

        const token = jwt.sign(user.toJSON(), TOKEN_SECRET_KEY, { expiresIn: TOKEN_LIFE });
        refreshToken = jwt.sign(user.toJSON(), REFRESH_TOKEN_SECRET_KEY, { expiresIn: REFRESH_TOKEN_LIFE });

        RefreshTokenService.addToken(refreshToken, user);

        return res.status(201).json({
            user,
            token: {
                token,
                refreshToken
            }
        });
    } else {

        return res.status(401).json('Refresh token not valid');
    }

};

/**
 * Store tokens that are not expired to blacklist
 *
 * @param req
 * @param res
 * @param next
 */
exports.logout = (req, res, next) => {

    const { token, refreshToken } = req.body;

    let tokenList = [];
    if(token)
        tokenList.push({ _id: new Mongoose.Types.ObjectId(), token });
    if(refreshToken)
        tokenList.push({ _id: new Mongoose.Types.ObjectId(), token: refreshToken });

    TokenBlacklist
        .create(tokenList)
        .then(r => res.status(201).json(r))
        .catch(e => res.status(500).json(e));
};

/**
 * Create a new user
 *
 * @param req
 * @param res
 * @param next
 */
exports.register = (req, res, next) => {

    const { email, password } = req.body;

    User
        .findOne({ email })
        .exec()
        .then(r => {

            if(r && r._id)
                res.status(409).json('User already exists');
            else {

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (e, hash) => {

                        if(e)
                            return res.status(500).json(e);
                        else {

                            const user = new User({
                                _id: new Mongoose.Types.ObjectId(),
                                email,
                                password: hash,
                            });

                            user
                                .save()
                                .then(r => res.status(201).json(r))
                                .catch(e => res.status(500).json(e))
                        }
                    })
                });
            }
        })
        .catch(e => res.status(500).json(e));
};