const mongoose = require('mongoose');

const purchaseSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Course'
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    duration: {
        type: Number, // 1, 6, 12
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'expired', 'rejected'],
        default: 'pending'
    },
    startDate: { type: Date },
    expiryDate: { type: Date },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Admin ID
    }
}, { timestamps: true });

module.exports = mongoose.model('Purchase', purchaseSchema);
