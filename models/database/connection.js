// This file is simply used to connect to the database to speed up load times on the deployed web app.
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://joshuatating:gY1Vgmuy5O2BXGxk@cluster0.irigxnl.mongodb.net/NexusHub?retryWrites=true&w=majority&appName=Cluster0';

async function connect() {
    try {
        // Connect to MongoDB
        connection = await mongoose.connect(MONGODB_URL);
        console.log(`\nConnected to database ${connection.connection.name} on ${connection.connection.host}`);
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // Disconnect from MongoDB
        await mongoose.disconnect();
    }
}

// Call the seed function
connect();