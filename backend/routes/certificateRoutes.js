const express = require('express');
const router = express.Router();
const {
    issueCertificate,
    getAllCertificates,
    getMyCertificates,
    getCertificateById,
    getPublicCertificates,
    deleteCertificate
} = require('../controllers/certificateController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/public', getPublicCertificates);
router.route('/')
    .get(protect, admin, getAllCertificates)
    .post(protect, admin, issueCertificate);

router.get('/my', protect, getMyCertificates);
router.get('/verify/:certId', getCertificateById);
router.delete('/:id', protect, admin, deleteCertificate);

module.exports = router;
