const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
    const { recipientId, text, fileUrl, fileType, fileName } = req.body;

    if (!text && !fileUrl) {
        return res.status(400).json({ message: 'Cannot send empty message' });
    }

    const message = await Message.create({
        sender: req.user._id,
        recipient: recipientId,
        text,
        fileUrl,
        fileType,
        fileName
    });

    res.status(201).json(message);
};

// @desc    Get messages between two users
// @route   GET /api/messages/:otherUserId
// @access  Private
const getMessages = async (req, res) => {
    const { otherUserId } = req.params;

    const messages = await Message.find({
        $or: [
            { sender: req.user._id, recipient: otherUserId },
            { sender: otherUserId, recipient: req.user._id }
        ]
    }).sort({ createdAt: 1 });

    // Mark as read if the recipient is the logged in user
    await Message.updateMany(
        { sender: otherUserId, recipient: req.user._id, isRead: false },
        { $set: { isRead: true } }
    );

    res.json(messages);
};

// @desc    Get all conversations (for Admin) or single conversation (for User)
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = async (req, res) => {
    // For Admin: Get list of users who have sent messages to Admin
    if (req.user.role === 'admin') {
        const conversations = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: req.user._id },
                        { recipient: req.user._id }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$sender", req.user._id] },
                            "$recipient",
                            "$sender"
                        ]
                    },
                    lastMessage: { $first: "$$ROOT" },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                { $and: [
                                    { $eq: ["$recipient", req.user._id] },
                                    { $eq: ["$isRead", false] }
                                ]},
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    'user.password': 0
                }
            }
        ]);
        res.json(conversations);
    } else {
        // For User: Just return the Admin info to start chat if not already started
        const admin = await User.findOne({ role: 'admin' }).select('-password');
        res.json([{ user: admin }]);
    }
};

module.exports = {
    sendMessage,
    getMessages,
    getConversations
};
