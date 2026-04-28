const express = require('express');
const router = express.Router();
const { getStories, createStory, updateStory, deleteStory } = require('../controllers/storyController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getStories)
    .post(protect, admin, createStory);

router.route('/:id')
    .put(protect, admin, updateStory)
    .delete(protect, admin, deleteStory);

module.exports = router;
