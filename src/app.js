const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Configure CORS
const allowedOrigin = process.env.CLIENT_URL;
app.use(
  cors({
    origin: allowedOrigin && allowedOrigin !== '*' ? allowedOrigin : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Built-in JSON body parser
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'UserFlow API is running smoothly'
  });
});

// Mount modular routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

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
