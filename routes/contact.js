const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');
const requestValidator = require('../middlewares/request-validator');
const { body, query, param } = require('express-validator');

// Validation schemas
const createContactMessageValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: 100 })
        .withMessage('Name cannot exceed 100 characters'),
    
    body('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Please provide a valid email address'),
    
    body('phone')
        .optional()
        .trim()
        .isLength({ max: 20 })
        .withMessage('Phone number cannot exceed 20 characters'),
    
    body('subject')
        .trim()
        .notEmpty()
        .withMessage('Subject is required')
        .isLength({ max: 200 })
        .withMessage('Subject cannot exceed 200 characters'),
    
    body('message')
        .trim()
        .notEmpty()
        .withMessage('Message is required')
        .isLength({ max: 2000 })
        .withMessage('Message cannot exceed 2000 characters'),
    
    body('inquiryType')
        .optional()
        .isIn(['general', 'booking', 'programs', 'membership', 'events', 'partnership'])
        .withMessage('Invalid inquiry type')
];

const updateMessageStatusValidation = [
    body('status')
        .optional()
        .isIn(['unread', 'read', 'responded', 'resolved'])
        .withMessage('Invalid status'),
    
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'urgent'])
        .withMessage('Invalid priority'),
    
    body('assignedTo')
        .optional()
        .isMongoId()
        .withMessage('Invalid assigned user ID'),
    
    body('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array')
];

const assignMessageValidation = [
    body('assignedTo')
        .notEmpty()
        .withMessage('Assigned user is required')
        .isMongoId()
        .withMessage('Invalid assigned user ID')
];

const respondToMessageValidation = [
    body('response')
        .trim()
        .notEmpty()
        .withMessage('Response is required')
        .isLength({ max: 2000 })
        .withMessage('Response cannot exceed 2000 characters')
];

// Public routes
/**
 * @route   POST /api/contact/message
 * @desc    Submit contact form message
 * @access  Public
 */
router.post(
    '/message',
    createContactMessageValidation,
    requestValidator,
    contactController.createContactMessage
);

// Protected admin routes
/**
 * @route   GET /api/contact/messages
 * @desc    Get all contact messages with filtering and pagination
 * @access  Admin
 * @query   page, limit, status, inquiryType, priority, assignedTo, search, sortBy, sortOrder
 */
router.get(
    '/messages',
    authenticateToken,
    authorizeRole('admin'),
    [
        query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
        query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
        query('status').optional().isIn(['unread', 'read', 'responded', 'resolved']).withMessage('Invalid status'),
        query('inquiryType').optional().isIn(['general', 'booking', 'programs', 'membership', 'events', 'partnership']).withMessage('Invalid inquiry type'),
        query('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
        query('assignedTo').optional().isMongoId().withMessage('Invalid assigned user ID'),
        query('sortBy').optional().isIn(['createdAt', 'updatedAt', 'name', 'email', 'status', 'priority']).withMessage('Invalid sort field'),
        query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
    ],
    requestValidator,
    contactController.getContactMessages
);

/**
 * @route   GET /api/contact/messages/:id
 * @desc    Get single contact message by ID
 * @access  Admin
 */
router.get(
    '/messages/:id',
    authenticateToken,
    authorizeRole('admin'),
    [
        param('id').isMongoId().withMessage('Invalid message ID')
    ],
    requestValidator,
    contactController.getContactMessageById
);

/**
 * @route   PUT /api/contact/messages/:id
 * @desc    Update contact message status, priority, assignment, or tags
 * @access  Admin
 */
router.put(
    '/messages/:id',
    authenticateToken,
    authorizeRole('admin'),
    [
        param('id').isMongoId().withMessage('Invalid message ID'),
        ...updateMessageStatusValidation
    ],
    requestValidator,
    contactController.updateMessageStatus
);

/**
 * @route   POST /api/contact/messages/:id/assign
 * @desc    Assign message to a user
 * @access  Admin
 */
router.post(
    '/messages/:id/assign',
    authenticateToken,
    authorizeRole('admin'),
    [
        param('id').isMongoId().withMessage('Invalid message ID'),
        ...assignMessageValidation
    ],
    requestValidator,
    contactController.assignMessage
);

/**
 * @route   POST /api/contact/messages/:id/respond
 * @desc    Add response to a contact message
 * @access  Admin
 */
router.post(
    '/messages/:id/respond',
    authenticateToken,
    authorizeRole('admin'),
    [
        param('id').isMongoId().withMessage('Invalid message ID'),
        ...respondToMessageValidation
    ],
    requestValidator,
    contactController.respondToMessage
);

/**
 * @route   DELETE /api/contact/messages/:id
 * @desc    Delete contact message (soft delete)
 * @access  Admin
 */
router.delete(
    '/messages/:id',
    authenticateToken,
    authorizeRole('admin'),
    [
        param('id').isMongoId().withMessage('Invalid message ID')
    ],
    requestValidator,
    contactController.deleteMessage
);

/**
 * @route   GET /api/contact/stats
 * @desc    Get contact message statistics
 * @access  Admin
 */
router.get(
    '/stats',
    authenticateToken,
    authorizeRole('admin'),
    contactController.getMessageStats
);

module.exports = router;