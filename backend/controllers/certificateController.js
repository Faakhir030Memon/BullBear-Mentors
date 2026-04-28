const Certificate = require('../models/Certificate');
const User = require('../models/User');
const Course = require('../models/Course');
const { v4: uuidv4 } = require('uuid');

// @desc    Issue a certificate to a user
// @route   POST /api/certificates
// @access  Private/Admin
const issueCertificate = async (req, res) => {
    const { userId, courseId, recipientName, courseTitle, completionDate, grade } = req.body;

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
        return res.status(404).json({ message: 'User or course not found' });
    }

    const existing = await Certificate.findOne({ user: userId, course: courseId });
    if (existing) {
        return res.status(400).json({ message: 'Certificate already issued for this user and course' });
    }

    const certificate = await Certificate.create({
        user: userId,
        course: courseId,
        issuedBy: req.user._id,
        certificateId: `BBM-${uuidv4().split('-')[0].toUpperCase()}`,
        recipientName,
        courseTitle,
        completionDate: new Date(completionDate),
        grade: grade || 'Excellence'
    });

    res.status(201).json(certificate);
};

// @desc    Get all certificates (Admin)
// @route   GET /api/certificates
// @access  Private/Admin
const getAllCertificates = async (req, res) => {
    const certificates = await Certificate.find({})
        .populate('user', 'firstName lastName email profilePicture')
        .populate('course', 'title')
        .populate('issuedBy', 'firstName lastName');
    res.json(certificates);
};

// @desc    Get current user's certificates
// @route   GET /api/certificates/my
// @access  Private
const getMyCertificates = async (req, res) => {
    const certificates = await Certificate.find({ user: req.user._id })
        .populate('course', 'title');
    res.json(certificates);
};

// @desc    Get a single certificate by certificateId
// @route   GET /api/certificates/:certId
// @access  Public
const getCertificateById = async (req, res) => {
    const certificate = await Certificate.findOne({ certificateId: req.params.certId })
        .populate('user', 'firstName lastName profilePicture')
        .populate('course', 'title');

    if (!certificate) {
        return res.status(404).json({ message: 'Certificate not found' });
    }
    res.json(certificate);
};

// @desc    Delete a certificate
// @route   DELETE /api/certificates/:id
// @access  Private/Admin
const deleteCertificate = async (req, res) => {
    const certificate = await Certificate.findById(req.params.id);
    if (certificate) {
        await certificate.deleteOne();
        res.json({ message: 'Certificate removed' });
    } else {
        res.status(404).json({ message: 'Certificate not found' });
    }
};

module.exports = {
    issueCertificate,
    getAllCertificates,
    getMyCertificates,
    getCertificateById,
    deleteCertificate
};
