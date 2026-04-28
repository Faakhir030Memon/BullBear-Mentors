const Certificate = require('../models/Certificate');
const { v4: uuidv4 } = require('uuid');

// @desc    Issue a certificate (Admin)
// @route   POST /api/certificates
// @access  Private/Admin
const issueCertificate = async (req, res) => {
    const { userId, courseId } = req.body;

    const certificateExists = await Certificate.findOne({ user: userId, course: courseId });
    if (certificateExists) {
        return res.status(400).json({ message: 'Certificate already issued for this course' });
    }

    const certificate = new Certificate({
        user: userId,
        course: courseId,
        certificateId: `BBM-${uuidv4().substring(0, 8).toUpperCase()}`
    });

    const createdCertificate = await certificate.save();
    res.status(201).json(createdCertificate);
};

// @desc    Get user certificates
// @route   GET /api/certificates/my
// @access  Private
const getMyCertificates = async (req, res) => {
    const certificates = await Certificate.find({ user: req.user._id }).populate('course');
    res.json(certificates);
};

// @desc    Get all certificates (Admin)
// @route   GET /api/certificates
// @access  Private/Admin
const getAllCertificates = async (req, res) => {
    const certificates = await Certificate.find({})
        .populate('user', 'firstName lastName email')
        .populate('course', 'title');
    res.json(certificates);
};

module.exports = {
    issueCertificate,
    getMyCertificates,
    getAllCertificates,
};
