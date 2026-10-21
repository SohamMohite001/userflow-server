const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// All user management routes require valid JWT authentication and ADMIN privileges
router.use(authenticateToken, requireAdmin);

// GET /api/users - List all registered users
router.get('/', userController.getUsers);

// POST /api/users - Register a new standard user
router.post('/', userController.createUser);

module.exports = router;
