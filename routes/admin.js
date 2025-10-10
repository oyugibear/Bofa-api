const express = require('express');
const AdminController = require("../controllers/admin/index.js");
const { authenticateToken, authorizeRole } = require('../middlewares/auth.js');

const router = express.Router();

// Initialize default settings (for setup/installation)
router.post('/settings/initialize', AdminController.initializeSettings);

// Admin only routes - require authentication and admin role
router.get('/settings', authenticateToken, authorizeRole('Admin'), AdminController.getSettings);
router.put('/settings', authenticateToken, authorizeRole('Admin'), AdminController.updateSettings);

// Section-specific routes
router.get('/settings/general', authenticateToken, authorizeRole('Admin'), AdminController.getGeneralSettings);
router.put('/settings/general', authenticateToken, authorizeRole('Admin'), AdminController.updateGeneralSettings);

router.get('/settings/fields', authenticateToken, authorizeRole('Admin'), AdminController.getFieldSettings);
router.put('/settings/fields', authenticateToken, authorizeRole('Admin'), AdminController.updateFieldSettings);

router.get('/settings/payment', authenticateToken, authorizeRole('Admin'), AdminController.getPaymentSettings);
router.put('/settings/payment', authenticateToken, authorizeRole('Admin'), AdminController.updatePaymentSettings);

router.get('/settings/notifications', authenticateToken, authorizeRole('Admin'), AdminController.getNotificationSettings);
router.put('/settings/notifications', authenticateToken, authorizeRole('Admin'), AdminController.updateNotificationSettings);

router.get('/settings/security', authenticateToken, authorizeRole('Admin'), AdminController.getSecuritySettings);
router.put('/settings/security', authenticateToken, authorizeRole('Admin'), AdminController.updateSecuritySettings);

// Reset to defaults
router.post('/settings/reset', authenticateToken, authorizeRole('Admin'), AdminController.resetSettings);

module.exports = router;
