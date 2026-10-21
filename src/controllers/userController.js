const User = require('../models/User');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Fetch all registered users (Administrator only).
 * GET /api/users
 */
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      users
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Register a new user (Administrator only).
 * POST /api/users
 */
const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate name
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        message: 'Name is required and must be at least 2 characters.'
      });
    }

    if (name.trim().length > 100) {
      return res.status(400).json({
        message: 'Name cannot exceed 100 characters.'
      });
    }

    // Validate email
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return res.status(400).json({
        message: 'A valid email address is required.'
      });
    }

    // Validate password
    if (!password || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({
        message: 'Password is required and must be at least 8 characters.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check for existing user with this email
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        message: 'Email address is already registered.'
      });
    }

    // Always enforce USER role for client-created accounts
    const newUser = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: password,
      role: 'USER'
    });

    await newUser.save();

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    // Handle MongoDB duplicate key error (code 11000)
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Email address is already registered.'
      });
    }

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        message: messages.join(', ')
      });
    }

    next(error);
  }
};

module.exports = {
  getUsers,
  createUser
};
