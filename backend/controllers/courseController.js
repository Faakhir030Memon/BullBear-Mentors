const path = require('path');
const fs = require('fs');
const Course = require('../models/Course');
const Purchase = require('../models/Purchase');

// @desc    Fetch all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
    const courses = await Course.find({}).select('-content');
    res.json(courses);
};

const getCourseById = async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (course) {
        let isAuthorized = false;

        // Admin is always authorized
        if (req.user && req.user.role === 'admin') {
            isAuthorized = true;
        } else if (req.user) {
            // Check if user has an active purchase for this course
            const purchase = await Purchase.findOne({
                user: req.user._id,
                course: course._id,
                status: 'active'
            });
            if (purchase) {
                isAuthorized = true;
            }
        }

        // If not authorized, hide fileUrls in content
        if (!isAuthorized) {
            const sanitizedContent = course.content.map(item => ({
                title: item.title,
                description: item.description,
                fileType: item.fileType,
                // fileUrl is omitted
            }));
            
            // Return course with sanitized content
            const courseObj = course.toObject();
            courseObj.content = sanitizedContent;
            return res.json(courseObj);
        }

        res.json(course);
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
    const { title, description, image, prices, content, category } = req.body;

    const course = new Course({
        title,
        description,
        image,
        prices,
        content,
        category: category || 'Premium'
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res) => {
    const { title, description, image, prices, content, isActive, category } = req.body;

    const course = await Course.findById(req.params.id);

    if (course) {
        course.title = title || course.title;
        course.description = description || course.description;
        course.image = image || course.image;
        course.prices = prices || course.prices;
        course.content = content || course.content;
        course.category = category || course.category;
        course.isActive = isActive !== undefined ? isActive : course.isActive;

        const updatedCourse = await course.save();
        res.json(updatedCourse);
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
};

// @desc    Download course file securely
// @route   GET /api/courses/:id/download/:fileIndex
// @access  Private
const downloadFile = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        const fileIndex = parseInt(req.params.fileIndex);

        if (!course || !course.content || !course.content[fileIndex]) {
            return res.status(404).json({ message: 'File not found' });
        }

        const purchase = await Purchase.findOne({
            user: req.user._id,
            course: course._id,
            status: 'active'
        });

        if (!purchase && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to download this file' });
        }

        const file = course.content[fileIndex];
        // fileUrl is like "/uploads/filename.ext"
        const filePath = path.join(process.cwd(), file.fileUrl);

        if (fs.existsSync(filePath)) {
            res.download(filePath, file.title || 'course-material');
        } else {
            res.status(404).json({ message: 'File does not exist on server' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    downloadFile,
};
