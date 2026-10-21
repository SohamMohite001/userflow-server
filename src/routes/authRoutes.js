const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

// POST /api/auth/login - Public authentication route
router.post('/login', authController.login);

// POST /api/auth/logout - Authenticated logout confirmation route
router.post('/logout', authenticateToken, authController.logout);

module.exports = router;
