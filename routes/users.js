const express = require('express');
const UserController = require("../controllers/user/index.js");
const { authenticateToken, authorizeRole } = require('../middlewares/auth');

const router = express.Router()

// Protected routes - User must be authenticated to access their own data
router.get('/:id', authenticateToken, UserController.getUser);
router.put('/:id', authenticateToken, UserController.updateUser);

// Admin only routes
router.get('/', authenticateToken, authorizeRole('Admin'), UserController.getUsers);
router.delete('/:id', authenticateToken, authorizeRole('Admin'), UserController.deleteUser);



module.exports = router;