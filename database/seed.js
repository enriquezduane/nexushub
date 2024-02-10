const mongoose = require('mongoose');
const { users, replies, posts, boards, categories } = require('./seedData');
const User = require('../models/userModel');
const Reply = require('../models/replyModel');
const Post = require('../models/postModel');
const Board = require('../models/boardModel');
const Category = require('../models/categoryModel');
const dotenv = require('dotenv');
dotenv.config();

MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/NexusHub';

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

        console.log('\nDatabase cleared')

        // Insert data
        await User.insertMany(users);
        await Reply.insertMany(replies);
        await Post.insertMany(posts);
        await Board.insertMany(boards);
        await Category.insertMany(categories);

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



// if seed data doesnt have object ids, use this function to append references
async function appendReferences(users, replies, posts, boards, categories) {
    // append references for replies
    await Reply.updateMany({ title: 'Re: Can we get a light mode, please?' }, { $set: { refPost: posts[3]._id, poster: users[4]._id } });
    await Reply.updateMany({ title: 'Re: Can we get a light mode, please?' }, { $set: { refPost: posts[3]._id, poster: users[5]._id } });
    await Reply.updateMany({ title: "Re: Why does the MVP always spawn when I'm AFK?!" }, { $set: { refPost: posts[4]._id, poster: users[4]._id } });
    await Reply.updateMany({ title: "Re: Why does the MVP always spawn when I'm AFK?!" }, { $set: { refPost: posts[4]._id, poster: users[5]._id } });
    await Reply.updateMany({ title: "Re: Why does the MVP always spawn when I'm AFK?!" }, { $set: { refPost: posts[4]._id, poster: users[6]._id } });
    await Reply.updateMany({ title: 'Re: NexusHub Forum Upgraded' }, { $set: { refPost: posts[6]._id, poster: users[4]._id } });
    await Reply.updateMany({ title: 'Re: Ultimate Guide to Zeny Farming 2024 Edition' }, { $set: { refPost: posts[7]._id, poster: users[4]._id } });
    await Reply.updateMany({ title: 'Re: Ultimate Guide to Zeny Farming 2024 Edition' }, { $set: { refPost: posts[7]._id, poster: users[5]._id } });
    await Reply.updateMany({ title: 'Re: Frozen Ragnarok Online (HighRate)' }, { $set: { refPost: posts[8]._id, poster: users[4]._id } });
    await Reply.updateMany({ title: 'Re: Assassin Cross vs Sniper, which is better for PvP?' }, { $set: { refPost: posts[9]._id, poster: users[5]._id } });
    await Reply.updateMany({ title: 'Re: Assassin Cross vs Sniper, which is better for PvP?' }, { $set: { refPost: posts[9]._id, poster: users[4]._id } });
    await Reply.updateMany({ title: 'Re: Assassin Cross vs Sniper, which is better for PvP?' }, { $set: { refPost: posts[9]._id, poster: users[6]._id } });
    await Reply.updateMany({ title: 'Re: Ragnarok Mobile vs. Ragnarok Online - Thoughts?' }, { $set: { refPost: posts[10]._id, poster: users[7]._id } });
    await Reply.updateMany({ title: "Re: HiraniRO 5x5x5x" }, { $set: { refPost: posts[11]._id, poster: users[7]._id } });

    // append references for posts
    await Post.updateOne({ id: 1 }, { $set: { poster: users[2]._id } });
    await Post.updateOne({ id: 2 }, { $set: { poster: users[0]._id } });
    await Post.updateOne({ id: 3 }, { $set: { poster: users[1]._id } });
    await Post.updateMany({ id: 4 }, { $set: { poster: users[3]._id, replies: [replies[0]._id, replies[1]._id] } });
    await Post.updateMany({ id: 5 }, { $set: { poster: users[5]._id, replies: [replies[2]._id, replies[3]._id, replies[4]._id] } });
    await Post.updateOne({ id: 6 }, { $set: { poster: users[0]._id } });
    await Post.updateMany({ id: 7 }, { $set: { poster: users[0]._id, replies: [replies[5]._id] } });
    await Post.updateMany({ id: 8 }, { $set: { poster: users[6]._id, replies: [replies[6]._id, replies[7]._id] } });
    await Post.updateMany({ id: 9 }, { $set: { poster: users[9]._id, replies: [replies[8]._id] } });
    await Post.updateMany({ id: 10 }, { $set: { poster: users[7]._id, replies: [replies[9]._id, replies[10]._id, replies[11]._id] } });
    await Post.updateMany({ id: 11 }, { $set: { poster: users[8]._id, replies: [replies[12]._id] } });
    await Post.updateMany({ id: 12 }, { $set: { poster: users[10]._id, replies: [replies[13]._id] } });

    // append references for boards
    await Board.updateMany({ id: 1 }, { $set: { posts: [posts[0]._id, posts[1]._id, posts[2]._id, posts[6]._id], lastPost: posts[6]._id } });
    await Board.updateMany({ id: 2 }, { $set: { posts: [posts[3]._id], lastPost: posts[3]._id } });
    await Board.updateMany({ id: 3 }, { $set: { posts: [posts[4]._id], lastPost: posts[4]._id } });
    await Board.updateMany({ id: 4 }, { $set: { posts: [posts[8]._id], lastPost: posts[8]._id } });
    await Board.updateMany({ id: 5 }, { $set: { posts: [posts[11]._id], lastPost: posts[11]._id } });
    await Board.updateMany({ id: 6 }, { $set: { posts: [posts[10]._id], lastPost: posts[10]._id } });
    await Board.updateMany({ id: 7 }, { $set: { posts: [posts[5]._id, posts[9]._id], lastPost: posts[9]._id } });
    await Board.updateMany({ id: 8 }, { $set: { posts: [posts[7]._id], lastPost: posts[7]._id } });

    // append references for categories
    await Category.updateOne({ id: 1 }, { $set: { boards: [boards[0]._id, boards[1]._id, boards[2]._id] } });
    await Category.updateOne({ id: 2 }, { $set: { boards: [boards[3]._id, boards[4]._id] } });
    await Category.updateOne({ id: 3 }, { $set: { boards: [boards[5]._id, boards[6]._id] } });
    await Category.updateOne({ id: 4 }, { $set: { boards: [boards[7]._id] } });
}