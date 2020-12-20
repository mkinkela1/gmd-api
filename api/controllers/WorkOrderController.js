const Mongoose = require('mongoose');

const WorkOrder = require('./../models/workOrder');

/**
 * Create offer
 *
 * @param req
 * @param res
 * @param next
 */
exports.createWorkOrder = (req, res, next) => {

    const { workOrderNumber, location, date, fullName, address, vatNumber, works, workDescription, fundsSpent } = req.body;

    let workOrder = new WorkOrder({
        _id: new Mongoose.Types.ObjectId(),
        workOrderNumber,
        location,
        date,
        fullName,
        address,
        vatNumber,
        works,
        workDescription,
        fundsSpent
    });

    workOrder
        .save()
        .then(r => res.status(201).json(r))
        .catch(e => res.status(500).json(e));

};

/**
 * Get all work orders
 *
 * @param req
 * @param res
 * @param next
 */
exports.getWorkOrders = (req, res, next) => {

    WorkOrder
        .find()
        .then(r => res.status(200).json(r))
        .catch(e => res.status(500).json(e));
}

/**
 * Get work order by id
 *
 * @param req
 * @param res
 * @param next
 */
exports.getWorkOrderById = (req, res, next) => {

    const { id } = req.params;

    WorkOrder
        .find({ _id: id })
        .then(r => res.status(200).json(r))
        .catch(e => res.status(500).json(e));
}

/**
 * Delete work order by id
 *
 * @param req
 * @param res
 * @param next
 */
exports.deleteWorkOrder = (req, res, next) => {

    const { id } = req.params;

    WorkOrder
        .findOneAndDelete({ _id: id })
        .then(() => res.status(204).json())
        .catch(e => res.status(500).json(e))
}

exports.updateWorkOrderById = (req, res, next) => {

    const { id } = req.params;
    const { workOrderNumber, location, date, fullName, address, vatNumber, works, workDescription, fundsSpent } = req.body;

    const workOrder = {
        workOrderNumber,
        location,
        date,
        fullName,
        address,
        vatNumber,
        works,
        workDescription,
        fundsSpent
    }

    WorkOrder
        .findOneAndUpdate(
            { _id: id },
            { $set: workOrder },
            { returnOriginal: false, new: true, upsert: true }
        )
        .exec()
        .then(r => res.status(200).json(r))
        .catch(e => res.status(500).json(e));
}