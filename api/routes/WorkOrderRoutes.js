const Express = require('express');
const Router = Express.Router({ mergeParams: true });
const passport = require('passport');

require('./../../passport');
const WorkOrderController = require('./../controllers/WorkOrderController');

Router.post('/', passport.authenticate('jwt', {session: false}), WorkOrderController.createWorkOrder);
Router.get('/', passport.authenticate('jwt', {session: false}), WorkOrderController.getWorkOrders);
Router.get('/:id', passport.authenticate('jwt', {session: false}), WorkOrderController.getWorkOrderById);
Router.put('/:id', passport.authenticate('jwt', {session: false}), WorkOrderController.updateWorkOrderById);
Router.delete('/:id', passport.authenticate('jwt', {session: false}), WorkOrderController.deleteWorkOrder);

module.exports = Router;