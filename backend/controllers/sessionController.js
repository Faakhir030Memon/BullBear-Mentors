const Session = require('../models/Session');
const Purchase = require('../models/Purchase');

// @desc    Create a new live session
// @route   POST /api/sessions
// @access  Private/Admin
const createSession = async (req, res) => {
    const { title, description, zoomLink, startTime, duration, courseId } = req.body;

    const session = await Session.create({
        title,
        description,
        zoomLink,
        startTime,
        duration,
        course: courseId,
        createdBy: req.user._id
    });

    res.status(201).json(session);
};

// @desc    Get sessions for a course (Admin sees all, Users see only their courses)
// @route   GET /api/sessions
// @access  Private
const getSessions = async (req, res) => {
    let query = {};

    if (req.user.role !== 'admin') {
        // Find courses purchased by the user
        const purchases = await Purchase.find({ user: req.user._id, status: 'active' });
        const courseIds = purchases.map(p => p.course);
        query.course = { $in: courseIds };
        // Only show upcoming or live sessions for users
        query.status = { $ne: 'ended' };
    }

    const sessions = await Session.find(query)
        .populate('course', 'title')
        .sort({ startTime: 1 });

    res.json(sessions);
};

// @desc    Update session status
// @route   PUT /api/sessions/:id
// @access  Private/Admin
const updateSessionStatus = async (req, res) => {
    const session = await Session.findById(req.params.id);

    if (session) {
        session.status = req.body.status || session.status;
        const updatedSession = await session.save();
        res.json(updatedSession);
    } else {
        res.status(404).json({ message: 'Session not found' });
    }
};

// @desc    Delete a session
// @route   DELETE /api/sessions/:id
// @access  Private/Admin
const deleteSession = async (req, res) => {
    const session = await Session.findById(req.params.id);
    if (session) {
        await session.deleteOne();
        res.json({ message: 'Session removed' });
    } else {
        res.status(404).json({ message: 'Session not found' });
    }
};

module.exports = {
    createSession,
    getSessions,
    updateSessionStatus,
    deleteSession
};
