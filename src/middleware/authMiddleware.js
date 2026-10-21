const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate requests using JWT Bearer token.
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Access token required.'
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'Access token required.'
    });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('[AuthMiddleware] JWT_SECRET is not configured on the server.');
    return res.status(500).json({
      message: 'Server configuration error.'
    });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = {
      id: decoded.id,
      role: decoded.role
    };
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token.'
    });
  }
};

/**
 * Middleware to restrict route access strictly to administrators.
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      message: 'Access denied. Administrator privileges required.'
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin
};
