const express = require('express');

const BlogsController = require("../controllers/blogs/index.js");
const { uploadBlogsImage } = require('../middlewares/uploads/upload.js');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');

const router = express.Router()

// Public routes
router.get('/', BlogsController.getBlogs);
router.get('/:id', BlogsController.getBlog);

// Protected routes - Admin only
router.post('/add', authenticateToken, authorizeRole('Admin'), uploadBlogsImage, BlogsController.createBlog);
router.put('/:id', authenticateToken, authorizeRole('Admin'), uploadBlogsImage, BlogsController.updateBlog);
router.delete('/:id', authenticateToken, authorizeRole('Admin'), BlogsController.deleteBlog);



module.exports = router;