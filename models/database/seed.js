const mongoose = require('mongoose');
const { users, replies, posts, boards, categories, reports } = require('./seedData');
const User = require('../userModel');
const Reply = require('../replyModel');
const Post = require('../postModel');
const Board = require('../boardModel');
const Category = require('../categoryModel');
const Report = require('../reportModel');
const Activity = require('../activityModel');
const OnlineCount = require('../onlineCountModel');
const dotenv = require('dotenv');
dotenv.config();

MONGODB_URL = process.env.MONGODB_URL;

async function seedDatabase() {
    try {
        // Connect to MongoDB
        connection = await mongoose.connect(MONGODB_URL);
        console.log(`\nConnected to database ${connection.connection.name} on ${connection.connection.host}`);

        // Clear existing data
        await User.deleteMany();
        await Reply.deleteMany();
        await Post.deleteMany();
        await Board.deleteMany();
        await Category.deleteMany();
        await Report.deleteMany();
        await Activity.deleteMany();
        await OnlineCount.deleteMany();

        console.log('\nDatabase cleared')

        // Insert data
        await User.insertMany(users);
        await Reply.insertMany(replies);
        await Post.insertMany(posts);
        await Board.insertMany(boards);
        await Category.insertMany(categories);
        await Report.insertMany(reports);
        await OnlineCount.create(new OnlineCount());

        console.log(`\nDatabase ${connection.connection.name} on ${connection.connection.host} seeded succesfully\n`);
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // Disconnect from MongoDB
        await mongoose.disconnect();
    }
}

// Call the seed function
seedDatabase();