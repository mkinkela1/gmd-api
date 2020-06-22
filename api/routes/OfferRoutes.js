const Express = require('express');
const Router = Express.Router({ mergeParams: true });
const passport = require('passport');

require('./../../passport');
const OfferController = require('./../controllers/OfferController');

Router.post('/', passport.authenticate('jwt', {session: false}), OfferController.createOffer);
Router.get('/', passport.authenticate('jwt', {session: false}), OfferController.getOffers);
Router.get('/:id', passport.authenticate('jwt', {session: false}), OfferController.getOfferById);
Router.put('/:id', passport.authenticate('jwt', {session: false}), OfferController.updateOffer);
Router.delete('/:id', passport.authenticate('jwt', {session: false}), OfferController.deleteOffer);

module.exports = Router;