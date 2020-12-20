const mongoose = require('mongoose');

const workOrder = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    workOrderNumber: { type: Number, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now() },
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    vatNumber: { type: String, required: true },
    works: { type: String, required: true },
    workDescription: [{
        date: { type: Date, required: true, default: Date.now() },
        worker: { type: String, required: true },
        timeFrom: { type: Date, required: true, default: Date.now() },
        timeTo: { type: Date, required: true, default: Date.now() },
        workDescription: { type: String, required: true }
    }],
    fundsSpent: [{
        description: { type: String, required: true },
        amount: { type: String, required: true }
    }]
});

module.exports = mongoose.model('WorkOrder', workOrder);