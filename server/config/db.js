require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('../utils/logger'); // Assuming you have a logger utility

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        logger.info('MongoDB connected successfully');
    } catch (error) {
        logger.error('MongoDB connection error:', error);
        process.exit(1); // Exit the process if the connection fails
    }
};

module.exports = { connectMongoDB };
