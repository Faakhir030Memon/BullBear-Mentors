const express = require('express');
const router = express.Router();
const {
    getUsers,
    blockUser,
    deleteUser,
    updatePicStatus,
    setAdminPic,
    getStats,
    exportPurchases,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getStats);
router.get('/export-purchases', protect, admin, exportPurchases);
router.get('/users', protect, admin, getUsers);
router.put('/users/:id/block', protect, admin, blockUser);
router.put('/users/:id/pic-status', protect, admin, updatePicStatus);
router.delete('/users/:id', protect, admin, deleteUser);
router.put('/set-pic', protect, admin, setAdminPic);

module.exports = router;
