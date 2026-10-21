const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Configure CORS
const allowedOrigin = process.env.CLIENT_URL;
app.use(
  cors({
    origin: allowedOrigin && allowedOrigin !== '*'
      ? allowedOrigin.split(',').map((o) => o.trim().replace(/\/+$/, ''))
      : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Built-in JSON body parser
app.use(express.json());

// Health check endpoint (accessible at root /, /health, /api/health with or without trailing slash)
app.get(['/', '/health', '/health/', '/api/health', '/api/health/'], (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.status(200).json({
    status: 'ok',
    database: dbStatusMap[dbState] || 'unknown',
    uptime: Math.floor(process.uptime()),
    message: 'UserFlow API is running smoothly'
  });
});

// Mount modular routes (both /api/... and root /... paths for maximum deployment compatibility)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/users', userRoutes);

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found'
  });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.message);
  const status = err.statusCode || err.status || 500;
  res.status(status).json({
    message: status === 500 ? 'An unexpected server error occurred.' : err.message
  });
});

module.exports = app;
