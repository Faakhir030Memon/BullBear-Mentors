const Course = require('../models/Course');
const Purchase = require('../models/Purchase');

// @desc    Fetch all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
    // For listing, we can omit content entirely or hide fileUrls
    const courses = await Course.find({});
    
    // Sanitize listing: remove fileUrls from content if present
    const sanitizedCourses = courses.map(course => {
        const courseObj = course.toObject();
        if (courseObj.content) {
            courseObj.content = courseObj.content.map(item => ({
                title: item.title,
                description: item.description,
                fileType: item.fileType
            }));
        }
        return courseObj;
    });

    res.json(sanitizedCourses);
};

// @desc    Fetch single course
// @route   GET /api/courses/:id
// @access  Public (Optional Auth)
const getCourseById = async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (course) {
        let isEnrolled = false;

        // If user is logged in, check enrollment status
        if (req.user) {
            if (req.user.role === 'admin') {
                isEnrolled = true;
            } else {
                const purchase = await Purchase.findOne({
                    user: req.user._id,
                    course: course._id,
                    status: 'active'
                });
                if (purchase) isEnrolled = true;
            }
        }

        // If not enrolled/admin, hide the actual file URLs
        if (!isEnrolled) {
            const courseObj = course.toObject();
            if (courseObj.content) {
                courseObj.content = courseObj.content.map(item => ({
                    title: item.title,
                    description: item.description,
                    fileType: item.fileType,
                    // fileUrl is intentionally omitted
                }));
            }
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
