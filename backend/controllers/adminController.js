const User = require('../models/User');
const Purchase = require('../models/Purchase');
const Course = require('../models/Course');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
};

// @desc    Block/Unblock user
// @route   PUT /api/admin/users/:id/block
// @access  Private/Admin
const blockUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.isBlocked = !user.isBlocked;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get stats for dashboard
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
    const userCount = await User.countDocuments({});
    const courseCount = await Course.countDocuments({});
    const totalRevenue = await Purchase.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
        users: userCount,
        courses: courseCount,
        revenue: totalRevenue[0]?.total || 0
    });
};

module.exports = {
    getUsers,
    blockUser,
    deleteUser,
    getStats,
};
