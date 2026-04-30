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
