require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

// Verify critical environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error(
    `[Startup Error] Missing required environment variable(s): ${missingEnvVars.join(', ')}`
  );
  process.exit(1);
}

const PORT = parseInt(process.env.PORT, 10) || 5000;
const HOST = '0.0.0.0';

// Connect to MongoDB Atlas first, then start listening
const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, HOST, () => {
      console.log(`[UserFlow Server] Running on http://${HOST}:${PORT}`);
    });

    const shutdown = () => {
      console.log('\n[UserFlow Server] Shutting down gracefully...');
      server.close(() => {
        console.log('[UserFlow Server] HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('[Startup Error] Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
