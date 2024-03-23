const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL;

const connectDatabase = async () => {
    try {
        connection = await mongoose.connect(MONGODB_URL);
        console.log(`Connected to database ${connection.connection.name} on ${connection.connection.host}`);
    } catch (error) {
        console.log('Error connecting to database');
        console.error(error);
    }
};

module.exports = connectDatabase;
