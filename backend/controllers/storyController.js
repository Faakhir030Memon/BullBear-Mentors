const SuccessStory = require('../models/SuccessStory');

// @desc    Get all stories
// @route   GET /api/stories
// @access  Public
const getStories = async (req, res) => {
    const stories = await SuccessStory.find({});
    res.json(stories);
};

// @desc    Create a story
// @route   POST /api/stories
// @access  Private/Admin
const createStory = async (req, res) => {
    const { name, role, content, image, type } = req.body;

    const story = new SuccessStory({
        name,
        role,
        content,
        image,
        type
    });

    const createdStory = await story.save();
    res.status(201).json(createdStory);
};

// @desc    Delete a story
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

module.exports = {
    getStories,
    createStory,
    deleteStory
};
