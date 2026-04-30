const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    zoomLink: { type: String, required: true },
    startTime: { type: Date, required: true },
    duration: { type: Number, default: 60 }, // minutes
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'live', 'ended'],
        default: 'scheduled'
    }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
