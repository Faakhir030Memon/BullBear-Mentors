const SuccessStory = require('../models/SuccessStory');

// @desc    Get all success stories
// @route   GET /api/stories
// @access  Public
const getStories = async (req, res) => {
    const stories = await SuccessStory.find({});
    res.json(stories);
};

// @desc    Create a success story
// @route   POST /api/stories
// @access  Private/Admin
const createStory = async (req, res) => {
    const { name, description, image, type } = req.body;
    const story = await SuccessStory.create({ name, description, image, type });
    res.status(201).json(story);
};

// @desc    Update a success story
// @route   PUT /api/stories/:id
// @access  Private/Admin
const updateStory = async (req, res) => {
    const story = await SuccessStory.findById(req.params.id);
    if (story) {
        story.name = req.body.name || story.name;
        story.description = req.body.description || story.description;
        story.image = req.body.image || story.image;
        story.type = req.body.type || story.type;
        const updated = await story.save();
        res.json(updated);
    } else {
        res.status(404).json({ message: 'Story not found' });
    }
};

// @desc    Delete a success story
// @route   DELETE /api/stories/:id
// @access  Private/Admin
const deleteStory = async (req, res) => {
    const story = await SuccessStory.findById(req.params.id);
    if (story) {
        await story.deleteOne();
        res.json({ message: 'Story removed' });
    } else {
        res.status(404).json({ message: 'Story not found' });
    }
};

module.exports = { getStories, createStory, updateStory, deleteStory };
