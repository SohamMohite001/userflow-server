const mongoose = require('mongoose');

/**
 * Connect to MongoDB Atlas using connection string from environment variables.
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is missing.');
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`[MongoDB] Connected to database: ${conn.connection.name} @ ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Database connection failed: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
