const express = require('express');
const router = express.Router();
const {
    createPurchase,
    verifyPurchase,
    getMyPurchases,
    getAllPurchases,
} = require('../controllers/purchaseController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getAllPurchases)
    .post(protect, createPurchase);

router.get('/my', protect, getMyPurchases);
router.put('/:id/verify', protect, admin, verifyPurchase);

module.exports = router;
