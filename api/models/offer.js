const mongoose = require('mongoose');

const offer = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    documentName: { type: String, required: true },
    documentNumber: { type: Number, required: true },
    documentDate: { type: Date, required: true, default: Date.now() },
    boatModel: { type: String },
    masterCitizenNumber: { type: String },
    fullName: { type: String },
    address: { type: String },
    phoneNumber: { type: String },
    email: { type: String },
    validTill: { type: Date, required: true, default: Date.now() },
    paymentType: { type: String },
    items: [{
        _id: mongoose.Schema.Types.ObjectId,
        productName: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        unit: { type: String, required: true },
        unitPriceBeforeDiscount: { type: Number, required: true },
        discount: { type: Number, required: true },
        unitPriceWithDiscount: { type: Number, required: true },
        amount: { type: Number, required: true }
    }]
});

module.exports = mongoose.model('Offer', offer);