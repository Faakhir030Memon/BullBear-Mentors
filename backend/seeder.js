const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');
const User = require('./models/User');
const bcrypt = require('bcrypt');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Clear existing data
        await Course.deleteMany();
        await User.deleteMany();

        // Create Admin
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        
        await User.create({
            firstName: 'Mymn',
            lastName: 'SaaB',
            email: 'admin@bullbear.com',
            password: hashedPassword,
            role: 'admin'
        });

        // Create Courses
        const courses = [
            {
                title: 'Mastering Price Action',
                description: 'Complete guide to understanding market structure, liquidity, and institutional order blocks.',
                image: 'https://images.unsplash.com/photo-1611974717482-48a425fd0483?w=800&q=80',
                prices: {
                    oneMonth: 30000,
                    sixMonth: 153000,
                    twelveMonth: 270000
                },
                content: [
                    { title: 'Introduction to Candlesticks', description: 'Basics of price movement' },
                    { title: 'Support & Resistance Reimagined', description: 'Advanced zones' }
                ]
            },
            {
                title: 'Institutional Flow Strategy',
                description: 'Follow the big money. Learn how banks and hedge funds move the markets.',
                image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80',
                prices: {
                    oneMonth: 30000,
                    sixMonth: 153000,
                    twelveMonth: 270000
                },
                content: [
                    { title: 'Market Liquidity Concepts', description: 'Where is the money?' },
                    { title: 'Entry Models', description: 'Precision entries' }
                ]
            }
        ];

        await Course.insertMany(courses);

        console.log('Data Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
