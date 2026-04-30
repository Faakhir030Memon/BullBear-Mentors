const User = require('../models/User');
const Purchase = require('../models/Purchase');
const Course = require('../models/Course');
const Certificate = require('../models/Certificate');

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

// @desc    Approve or reject a user's profile picture
// @route   PUT /api/admin/users/:id/pic-status
// @access  Private/Admin
const updatePicStatus = async (req, res) => {
    const { status } = req.body; // 'approved' or 'rejected'
    const user = await User.findById(req.params.id);
    if (user) {
        user.profilePicStatus = status;
        if (status === 'rejected') {
            user.profilePicture = ''; // remove the picture
        }
        await user.save();
        res.json({ message: `Profile picture ${status}`, user });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Admin sets their own profile picture
// @route   PUT /api/admin/set-pic
// @access  Private/Admin
const setAdminPic = async (req, res) => {
    const { profilePicture } = req.body;
    const user = await User.findById(req.user._id);
    if (user) {
        user.profilePicture = profilePicture;
        user.profilePicStatus = 'approved';
        await user.save();
        res.json({ message: 'Profile picture updated', profilePicture });
    } else {
        res.status(404).json({ message: 'Admin not found' });
    }
};

// @desc    Get stats for dashboard
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
    const userCount = await User.countDocuments({});
    const courseCount = await Course.countDocuments({});
    const certCount = await Certificate.countDocuments({});
    const pendingPurchases = await Purchase.countDocuments({ status: 'pending' });
    const pendingPics = await User.countDocuments({ profilePicStatus: 'pending', profilePicture: { $ne: '' } });
    const totalRevenue = await Purchase.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
        users: userCount,
        courses: courseCount,
        certificates: certCount,
        pendingPurchases,
        pendingPics,
        revenue: totalRevenue[0]?.total || 0
    });
};

// @desc    Export purchases to CSV
// @route   GET /api/admin/export-purchases
// @access  Private/Admin
const exportPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.find({})
            .populate('user', 'firstName lastName email')
            .populate('course', 'title');

        let csv = 'User Name,Email,Course,Transaction ID,Amount,Duration (Months),Status,Date\n';

        purchases.forEach(p => {
            const userName = `${p.user?.firstName || 'Unknown'} ${p.user?.lastName || 'User'}`;
            const email = p.user?.email || 'N/A';
            const courseTitle = p.course?.title || 'Deleted Course';
            const date = new Date(p.createdAt).toLocaleDateString();
            
            csv += `"${userName}","${email}","${courseTitle}","${p.transactionId}",${p.amount},${p.duration},"${p.status}","${date}"\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=purchases_report.csv');
        res.status(200).send(csv);
    } catch (err) {
        res.status(500).json({ message: 'Export failed' });
    }
};

module.exports = {
    getUsers,
    blockUser,
    deleteUser,
    updatePicStatus,
    setAdminPic,
    getStats,
    exportPurchases,
};
