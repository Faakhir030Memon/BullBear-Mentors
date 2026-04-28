const mongoose = require('mongoose');

const successStorySchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    type: { type: String, enum: ['story', 'certificate'], default: 'story' }
}, { timestamps: true });

module.exports = mongoose.model('SuccessStory', successStorySchema);
