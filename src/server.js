require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

// Read PORT provided by Railway or default to 5000
const PORT = parseInt(process.env.PORT, 10) || 5000;
const HOST = '0.0.0.0';

// Start listening immediately so Railway's proxy and health check succeed without timing out
const server = app.listen(PORT, HOST, () => {
  console.log(`[UserFlow Server] Running and listening on http://${HOST}:${PORT}`);
  console.log(`[UserFlow Server] Process PORT: ${process.env.PORT || 'not defined in env, using 5000'}`);
});

// Verify and connect to MongoDB Atlas
if (!process.env.MONGODB_URI) {
  console.error('[Startup Warning] MONGODB_URI environment variable is missing.');
} else {
  console.log('[UserFlow Server] Connecting to MongoDB Atlas...');
  connectDB()
    .then(() => {
      console.log('[UserFlow Server] Database connected successfully.');
    })
    .catch((err) => {
      console.error('[UserFlow Server] Database connection error:', err.message);
    });
}

// Graceful shutdown
const shutdown = () => {
  console.log('\n[UserFlow Server] Shutting down gracefully...');
  server.close(() => {
    console.log('[UserFlow Server] HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
