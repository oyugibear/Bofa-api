const express = require('express');
const FieldsController = require("../controllers/field/index.js");
const multer = require('multer');
const { uploadServiceImage } = require('../middlewares/uploads/upload.js');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.js');
const router = express.Router()

// Public routes
router.get('/', FieldsController.getFields);
router.get('/:id', FieldsController.getField);

// Protected routes - Admin only
// router.post('/add', authenticateToken, authorizeRole('Admin'), FieldsController.createField);
// router.put('/:id', authenticateToken, authorizeRole('Admin'), FieldsController.updateField);
// router.delete('/:id', authenticateToken, authorizeRole('Admin'), FieldsController.deleteField);
router.post('/add', FieldsController.createField);
router.put('/:id', FieldsController.updateField);
router.delete('/:id', FieldsController.deleteField);



module.exports = router;