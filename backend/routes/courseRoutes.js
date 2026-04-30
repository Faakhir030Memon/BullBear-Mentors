const express = require('express');
const router = express.Router();
const {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    downloadFile,
} = require('../controllers/courseController');
const { protect, admin, optionalProtect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getCourses)
    .post(protect, admin, createCourse);

router.route('/:id')
    .get(optionalProtect, getCourseById)
    .put(protect, admin, updateCourse)
    .delete(protect, admin, deleteCourse);

router.get('/:id/download/:fileIndex', protect, downloadFile);

module.exports = router;
