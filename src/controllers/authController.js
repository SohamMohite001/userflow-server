const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Log in a user with email and password, issuing a signed JWT upon success.
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Query user and explicitly select password field
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password.'
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('[AuthController] JWT_SECRET is not configured on the server.');
      return res.status(500).json({
        message: 'Server configuration error.'
      });
    }

    // Sign JWT token with id and role
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      secret,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle user logout.
 * Note: Stateless JWTs are discarded client-side; this confirms session termination.
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
  return res.status(200).json({
    message: 'Logout successful'
  });
};

module.exports = {
  login,
  logout
};
