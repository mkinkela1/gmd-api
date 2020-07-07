const Mongoose = require('mongoose');

const Offer = require('./../models/offer');

/**
 * Create offer
 *
 * @param req
 * @param res
 * @param next
 */
exports.createOffer = (req, res, next) => {

    const { documentName, documentNumber, documentDate, boatModel, masterCitizenNumber, fullName, address, phoneNumber, email, validTill, paymentType, items } = req.body;

    let offerItems = [];
    items.forEach(({ productName, quantity, unit, unitPrice, amount }) => {
        offerItems.push({
            productName,
            quantity,
            unit,
            unitPrice,
            amount
        })
    });

    let offer = new Offer({
        _id: new Mongoose.Types.ObjectId(),
        documentName,
        documentNumber,
        documentDate,
        boatModel,
        masterCitizenNumber,
        fullName,
        address,
        phoneNumber,
        email,
        validTill,
        paymentType,
        items: offerItems
    });

    offer
        .save()
        .then(r => res.status(201).json(r))
        .catch(e => res.status(500).json(e));

};

/**
 * Get offer by id
 *
 * @param req
 * @param res
 * @param next
 */
exports.getOfferById = (req, res, next) => {

    const { id } = req.params;

    Offer
        .findOne({ _id: id })
        .then(r => res.status(200).json(r))
        .catch(e => res.status(500).json(e));
};

/**
 * Get all offers
 *
 * @param req
 * @param res
 * @param next
 */
exports.getOffers = (req, res, next) => {

    Offer
        .find({})
        .then(r => res.status(200).json(r))
        .catch(e => res.status(500).json(e));
};

/**
 * Update offer
 *
 * @param req
 * @param res
 * @param next
 */
exports.updateOffer = (req, res, next) => {

    const { id } = req.params;
    const { documentName, documentNumber, documentDate, boatModel, masterCitizenNumber, fullName, address, phoneNumber, email, validTill, paymentType, items } = req.body;

    let offerItems = [];
    items.forEach(({ productName, quantity, unit, unitPrice, amount }) => {
        offerItems.push({
            productName,
            quantity,
            unit,
            unitPrice,
            amount
        })
    });

    let offer = {
        documentName,
        documentNumber,
        documentDate,
        boatModel,
        masterCitizenNumber,
        fullName,
        address,
        phoneNumber,
        email,
        validTill,
        paymentType,
        items: offerItems
    };

    Offer
        .findOneAndUpdate(
            { _id: id },
            { $set: offer },
            { returnOriginal: false, new: true, upsert: true }
        )
        .exec()
        .then(r => res.status(200).json(r))
        .catch(e => res.status(500).json(e));
}

/**
 * Delete offer
 *
 * @param req
 * @param res
 * @param next
 */
exports.deleteOffer = (req, res, next) => {

    const { id } = req.params;

    Offer
        .findOneAndDelete({ _id: id })
        .then(() => res.status(204).json())
        .catch(e => res.status(500).json(e))
}