const Express = require('express');
const Router = Express.Router({ mergeParams: true });

const AuthenticationController = require('./../controllers/AuthenticationController');

Router.post('/login', AuthenticationController.auth);
Router.post('/refresh-token', AuthenticationController.refreshToken);
Router.post('/logout', AuthenticationController.logout);

module.exports = Router;