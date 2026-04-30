const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, upload.single('file'), (req, res) => {
    if (req.file) {
        res.json({
            url: `/${req.file.path.replace('\\', '/')}`, 
            type: req.file.mimetype,
            size: req.file.size > 1024 * 1024 
                ? (req.file.size / (1024 * 1024)).toFixed(2) + ' MB' 
                : (req.file.size / 1024).toFixed(2) + ' KB'
        });
    } else {
        res.status(400).json({ message: 'No file uploaded' });
    }
});

module.exports = router;
