const express = require('express');
const router = express.Router();
const {
    getUsers,
    blockUser,
    deleteUser,
    getStats,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getStats);
router.get('/users', protect, admin, getUsers);
router.put('/users/:id/block', protect, admin, blockUser);
router.delete('/users/:id', protect, admin, deleteUser);

module.exports = router;
