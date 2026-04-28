const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|pdf|doc|docx|mp4|mkv|avi|webm/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    // Some mime types for docx are application/vnd.openxmlformats-officedocument.wordprocessingml.document
    const mimetype = file.mimetype.startsWith('image/') || 
                     file.mimetype.startsWith('video/') ||
                     file.mimetype === 'application/pdf' ||
                     file.mimetype.includes('word');

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Invalid file type! Only Images, PDFs, Word docs, and Videos are allowed.');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

module.exports = upload;
