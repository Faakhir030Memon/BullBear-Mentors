const Course = require('../models/Course');

// @desc    Fetch all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
    const courses = await Course.find({});
    res.json(courses);
};

// @desc    Fetch single course
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (course) {
        res.json(course);
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
    const { title, description, image, prices, content } = req.body;

    const course = new Course({
        title,
        description,
        image,
        prices,
        content,
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res) => {
    const { title, description, image, prices, content, isActive } = req.body;

    const course = await Course.findById(req.params.id);

    if (course) {
        course.title = title || course.title;
        course.description = description || course.description;
        course.image = image || course.image;
        course.prices = prices || course.prices;
        course.content = content || course.content;
        course.isActive = isActive !== undefined ? isActive : course.isActive;

        const updatedCourse = await course.save();
        res.json(updatedCourse);
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (course) {
        await course.deleteOne();
        res.json({ message: 'Course removed' });
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
};

module.exports = {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
};
