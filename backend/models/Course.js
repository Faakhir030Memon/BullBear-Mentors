const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String }, // URL to image
    prices: {
        oneMonth: { type: Number, default: 30000 },
        sixMonth: { type: Number, default: 153000 }, // 180k - 15%
        twelveMonth: { type: Number, default: 270000 } // 360k - 25%
    },
    category: { type: String, enum: ['Normal', 'Premium'], default: 'Premium' },
    content: [{
        title: String,
        description: String,
        fileUrl: String,
        fileType: String, // e.g. 'video', 'pdf', 'word', 'image'
        fileSize: String // e.g. '2.5 MB'
    }],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
