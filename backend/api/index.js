const app = require('../src/app');
const mongoose = require('mongoose');
const connectDB = require('../src/config/database');

// Serverless function wrapper to ensure DB connection is established and cached
let isConnected = false;

app.use(async (req, res, next) => {
    if (!isConnected && mongoose.connection.readyState !== 1) {
        try {
            await connectDB();
            isConnected = true;
        } catch (err) {
            console.error('Database connection failed in serverless handler:', err);
            return res.status(500).json({
                success: false,
                message: 'Database connection failed',
                error: err.message
            });
        }
    }
    next();
});

module.exports = app;
