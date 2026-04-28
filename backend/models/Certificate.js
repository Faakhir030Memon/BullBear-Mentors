const mongoose = require('mongoose');

const certificateSchema = mongoose.Schema({
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
    issuedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Admin
    },
    certificateId: {
        type: String,
        required: true,
        unique: true
    },
    recipientName: {
        type: String,
        required: true
    },
    courseTitle: {
        type: String,
        required: true
    },
    completionDate: {
        type: Date,
        required: true
    },
    grade: {
        type: String,
        default: 'Excellence'
    }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
