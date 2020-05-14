const Express = require('express');
const Router = Express.Router({ mergeParams: true });

const AuthenticationController = require('./../controllers/AuthenticationController');

Router.post('/login', AuthenticationController.auth);
Router.post('/refresh-token', AuthenticationController.refreshToken);
Router.post('/logout', AuthenticationController.logout);
Router.post('/register', AuthenticationController.register);

module.exports = Router;