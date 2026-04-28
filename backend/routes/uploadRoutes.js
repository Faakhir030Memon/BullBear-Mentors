const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, upload.single('file'), (req, res) => {
    if (req.file) {
        res.json({
            url: `/${req.file.path.replace('\\', '/')}`, // normalize path for windows
            type: req.file.mimetype
        });
    } else {
        res.status(400).json({ message: 'No file uploaded' });
    }
});

module.exports = router;
