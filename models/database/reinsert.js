const mongoose = require('mongoose');
const User = require('../userModel');
const Reply = require('../replyModel');
const Post = require('../postModel');
const Board = require('../boardModel');
const Category = require('../categoryModel');
const Report = require('../reportModel');
const dotenv = require('dotenv');
dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://joshuatating:gY1Vgmuy5O2BXGxk@cluster0.irigxnl.mongodb.net/NexusHub?retryWrites=true&w=majority&appName=Cluster0';

async function seedDatabase() {
    try {
        // Connect to MongoDB
        const connection = await mongoose.connect(MONGODB_URL);
        console.log(`\nConnected to database ${connection.connection.name} on ${connection.connection.host}`);

        // Query existing collections
        const existingUsers = await User.find();
        const existingReplies = await Reply.find();
        const existingPosts = await Post.find();
        const existingBoards = await Board.find();
        const existingCategories = await Category.find();
        const existingReports = await Report.find();

        // Clear existing data
        await User.deleteMany();
        await Reply.deleteMany();
        await Post.deleteMany();
        await Board.deleteMany();
        await Category.deleteMany();
        await Report.deleteMany();

        console.log('\nDatabase cleared');

        // Insert queried data
        await User.insertMany(existingUsers);
        await Reply.insertMany(existingReplies);
        await Post.insertMany(existingPosts);
        await Board.insertMany(existingBoards);
        await Category.insertMany(existingCategories);
        await Report.insertMany(existingReports);

        console.log(`\nDatabase ${connection.connection.name} on ${connection.connection.host} seeded successfully\n`);
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // Disconnect from MongoDB
        await mongoose.disconnect();
    }
}

// Call the seed function
seedDatabase();
