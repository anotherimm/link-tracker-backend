const express = require('express');
const cors = require('cors');
const createRouter = require('./routes/create');
const clicksRouter = require('./routes/clicks');
const trackRouter = require('./routes/track');

const app = express();

// Middleware
app.use(cors({
    origin: 'https://anotherimm.github.io',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Routes
app.use('/api/create', createRouter);
app.use('/api/clicks', clicksRouter);
app.use('/api/track', trackRouter);

// Error handling
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
});

module.exports = app;