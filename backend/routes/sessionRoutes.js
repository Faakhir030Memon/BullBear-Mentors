const express = require('express');
const router = express.Router();
const {
    createSession,
    getSessions,
    updateSessionStatus,
    deleteSession
} = require('../controllers/sessionController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, admin, createSession)
    .get(protect, getSessions);

router.route('/:id')
    .put(protect, admin, updateSessionStatus)
    .delete(protect, admin, deleteSession);

module.exports = router;
