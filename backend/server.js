const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

require('dotenv').config({
    path: path.join(__dirname, '.env'),
});

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Middleware to inject connection status into req
app.use((req, res, next) => {
    req.isDbConnected = app.locals.isConnected;
    next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/reports', require('./routes/reports'));

app.get('/', (req, res) => {
    res.json({ message: 'SafePath AI Backend API is running' });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date(), dbConnected: app.locals.isConnected });
});

async function startServer() {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/safepath';

    console.log('📡 Connecting to MongoDB...');

    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('✅ Connected to MongoDB Atlas');
        app.locals.isConnected = true;
    } catch (err) {
        console.error('❌ MongoDB Connection Error Details:', err.message);
        console.warn('⚠️ Falling back to DEMO MODE (Mock Data active)');
        app.locals.isConnected = false;
    }

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        if (!app.locals.isConnected) {
            console.log('💡 Note: Application is using local mock data for performance.');
        }
    });

    server.on('error', (e) => {
        if (e.code === 'EADDRINUSE') {
            console.error(`\n❌ CRITICAL: Port ${PORT} is already in use by another process!`);
            console.error(`👉 Solution: Close any other terminals running "npm run dev" or "concurrently".\n`);
            process.exit(1);
        }
    });
}

startServer();
