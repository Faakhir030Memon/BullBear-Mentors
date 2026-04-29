const Purchase = require('../models/Purchase');
const Course = require('../models/Course');

// @desc    Create a new purchase request
// @route   POST /api/purchase
// @access  Private
const createPurchase = async (req, res) => {
    const { courseId, transactionId, duration, amount } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
        return res.status(404).json({ message: 'Course not found' });
    }

    const purchaseExists = await Purchase.findOne({ transactionId });
    if (purchaseExists) {
        return res.status(400).json({ message: 'Transaction ID already used' });
    }

    const purchase = new Purchase({
        user: req.user._id,
        course: courseId,
        transactionId,
        duration,
        amount,
        status: 'pending'
    });

    const createdPurchase = await purchase.save();
    res.status(201).json(createdPurchase);
};

// @desc    Verify a purchase (Admin)
// @route   PUT /api/purchase/:id/verify
// @access  Private/Admin
const verifyPurchase = async (req, res) => {
    const { status } = req.body; // 'active' or 'rejected'
    const purchase = await Purchase.findById(req.params.id);

    if (purchase) {
        purchase.status = status;
        purchase.verifiedBy = req.user._id;

        if (status === 'active') {
            purchase.startDate = new Date();
            const expiryDate = new Date();
            expiryDate.setMonth(expiryDate.getMonth() + purchase.duration);
            purchase.expiryDate = expiryDate;
        }

        const updatedPurchase = await purchase.save();
        res.json(updatedPurchase);
    } else {
        res.status(404).json({ message: 'Purchase not found' });
    }
};

// @desc    Get logged in user purchases
// @route   GET /api/purchase/my
// @access  Private
const getMyPurchases = async (req, res) => {
    const purchases = await Purchase.find({ user: req.user._id }).populate('course');
    
    // Sanitize purchases: if not active, hide fileUrls
    const sanitizedPurchases = purchases.map(p => {
        const pObj = p.toObject();
        if (pObj.status !== 'active' && pObj.course && pObj.course.content) {
            pObj.course.content = pObj.course.content.map(item => ({
                title: item.title,
                description: item.description,
                fileType: item.fileType
                // fileUrl omitted
            }));
        }
        return pObj;
    });

    res.json(sanitizedPurchases);
};

// @desc    Get all purchases (Admin)
// @route   GET /api/purchase
// @access  Private/Admin
const getAllPurchases = async (req, res) => {
    const purchases = await Purchase.find({}).populate('user', 'firstName lastName email').populate('course');
    res.json(purchases);
};

module.exports = {
    createPurchase,
    verifyPurchase,
    getMyPurchases,
    getAllPurchases,
};
