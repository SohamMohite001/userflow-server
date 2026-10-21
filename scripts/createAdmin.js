const path = require('path');
// Load environment variables from server/.env if present, or process environment
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const mongoose = require('mongoose');
const User = require('../src/models/User');

const run = async () => {
  const { MONGODB_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  const missing = [];
  if (!MONGODB_URI) missing.push('MONGODB_URI');
  if (!ADMIN_NAME) missing.push('ADMIN_NAME');
  if (!ADMIN_EMAIL) missing.push('ADMIN_EMAIL');
  if (!ADMIN_PASSWORD) missing.push('ADMIN_PASSWORD');

  if (missing.length > 0) {
    console.error(
      `[createAdmin] Missing required environment variables: ${missing.join(', ')}`
    );
    console.error('Please configure these in your .env file or environment before running this script.');
    process.exit(1);
  }

  const normalizedEmail = ADMIN_EMAIL.toLowerCase().trim();

  try {
    console.log('[createAdmin] Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('[createAdmin] Database connection established.');

    // Check if administrator already exists
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      console.log(
        `[createAdmin] Administrator with email "${normalizedEmail}" already exists. No new user was created.`
      );
      await mongoose.connection.close();
      process.exit(0);
    }

    // Provision new administrator
    const admin = new User({
      name: ADMIN_NAME.trim(),
      email: normalizedEmail,
      password: ADMIN_PASSWORD,
      role: 'ADMIN'
    });

    await admin.save();

    console.log(
      `[createAdmin] Initial administrator "${ADMIN_NAME.trim()}" (${normalizedEmail}) created successfully.`
    );
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`[createAdmin] Error provisioning administrator: ${error.message}`);
    if (mongoose.connection.readyState !== 0) {
      try {
        await mongoose.connection.close();
      } catch (closeError) {
        // Ignore close error on exit
      }
    }
    process.exit(1);
  }
};

run();
