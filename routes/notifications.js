const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notifications');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');
const requestValidator = require('../middlewares/request-validator');
const { body, query, param } = require('express-validator');

// Validation schemas
const createNotificationValidation = [
    body('type')
        .notEmpty()
        .withMessage('Notification type is required')
        .isIn([
            'contact_message', 
            'newsletter_signup', 
            'booking_alert', 
            'system_alert',
            'payment_received',
            'league_registration',
            'team_request',
            'urgent_message'
        ])
        .withMessage('Invalid notification type'),
    
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 200 })
        .withMessage('Title cannot exceed 200 characters'),
    
    body('message')
        .trim()
        .notEmpty()
        .withMessage('Message is required')
        .isLength({ max: 1000 })
        .withMessage('Message cannot exceed 1000 characters'),
    
    body('recipient')
        .notEmpty()
        .withMessage('Recipient is required')
        .isMongoId()
        .withMessage('Invalid recipient ID'),
    
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'urgent'])
        .withMessage('Invalid priority'),
    
    body('relatedModel')
        .optional()
        .isIn(['ContactMessage', 'Newsletter', 'Booking', 'Payment', 'League', 'Team', 'User'])
        .withMessage('Invalid related model'),
    
    body('relatedId')
        .optional()
        .isMongoId()
        .withMessage('Invalid related ID'),
    
    body('actionUrl')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Action URL cannot exceed 500 characters'),
    
    body('actionText')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Action text cannot exceed 50 characters'),
    
    body('category')
        .optional()
        .isIn(['communication', 'booking', 'payment', 'system', 'marketing', 'user_activity'])
        .withMessage('Invalid category')
];

const bulkOperationsValidation = [
    body('action')
        .notEmpty()
        .withMessage('Action is required')
        .isIn(['markAsRead', 'archive', 'delete', 'unarchive'])
        .withMessage('Invalid action'),
    
    body('notificationIds')
        .isArray({ min: 1 })
        .withMessage('Notification IDs array is required and must not be empty'),
    
    body('notificationIds.*')
        .isMongoId()
        .withMessage('Invalid notification ID')
];

const extendNotificationValidation = [
    body('days')
        .optional()
        .isInt({ min: 1, max: 365 })
        .withMessage('Days must be between 1 and 365')
];

// Protected routes (require authentication)
/**
 * @route   GET /api/notifications
 * @desc    Get notifications for the current user
 * @access  Private
 * @query   page, limit, type, priority, isRead, category, sortBy, sortOrder
 */
router.get(
    '/',
    authenticateToken,
    [
        query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
        query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
        query('type').optional().isIn([
            'contact_message', 
            'newsletter_signup', 
            'booking_alert', 
            'system_alert',
            'payment_received',
            'league_registration',
            'team_request',
            'urgent_message'
        ]).withMessage('Invalid notification type'),
        query('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
        query('isRead').optional().isBoolean().withMessage('isRead must be boolean'),
        query('category').optional().isIn(['communication', 'booking', 'payment', 'system', 'marketing', 'user_activity']).withMessage('Invalid category'),
        query('sortBy').optional().isIn(['createdAt', 'updatedAt', 'priority', 'type']).withMessage('Invalid sort field'),
        query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
    ],
    requestValidator,
    notificationsController.getNotifications
);

/**
 * @route   GET /api/notifications/count
 * @desc    Get unread notification count
 * @access  Private
 */
router.get(
    '/count',
    authenticateToken,
    notificationsController.getUnreadCount
);

/**
 * @route   GET /api/notifications/stats
 * @desc    Get notification statistics for current user
 * @access  Private
 */
router.get(
    '/stats',
    authenticateToken,
    notificationsController.getNotificationStats
);

/**
 * @route   GET /api/notifications/archived
 * @desc    Get archived notifications
 * @access  Private
 */
router.get(
    '/archived',
    authenticateToken,
    [
        query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
        query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
        query('sortBy').optional().isIn(['archivedAt', 'createdAt', 'priority']).withMessage('Invalid sort field'),
        query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
    ],
    requestValidator,
    notificationsController.getArchivedNotifications
);

/**
 * @route   GET /api/notifications/:id
 * @desc    Get single notification by ID
 * @access  Private
 */
router.get(
    '/:id',
    authenticateToken,
    [
        param('id').isMongoId().withMessage('Invalid notification ID')
    ],
    requestValidator,
    notificationsController.getNotificationById
);

/**
 * @route   PUT /api/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private
 */
router.put(
    '/:id/read',
    authenticateToken,
    [
        param('id').isMongoId().withMessage('Invalid notification ID')
    ],
    requestValidator,
    notificationsController.markAsRead
);

/**
 * @route   PUT /api/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.put(
    '/read-all',
    authenticateToken,
    notificationsController.markAllAsRead
);

/**
 * @route   PUT /api/notifications/:id/archive
 * @desc    Archive notification
 * @access  Private
 */
router.put(
    '/:id/archive',
    authenticateToken,
    [
        param('id').isMongoId().withMessage('Invalid notification ID')
    ],
    requestValidator,
    notificationsController.archiveNotification
);

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete notification (soft delete)
 * @access  Private
 */
router.delete(
    '/:id',
    authenticateToken,
    [
        param('id').isMongoId().withMessage('Invalid notification ID')
    ],
    requestValidator,
    notificationsController.deleteNotification
);

/**
 * @route   POST /api/notifications/bulk-operations
 * @desc    Perform bulk operations on notifications
 * @access  Private
 */
router.post(
    '/bulk-operations',
    authenticateToken,
    bulkOperationsValidation,
    requestValidator,
    notificationsController.bulkOperations
);

/**
 * @route   PUT /api/notifications/:id/extend
 * @desc    Extend notification expiry
 * @access  Private
 */
router.put(
    '/:id/extend',
    authenticateToken,
    [
        param('id').isMongoId().withMessage('Invalid notification ID'),
        ...extendNotificationValidation
    ],
    requestValidator,
    notificationsController.extendNotification
);

// Admin-only routes
/**
 * @route   POST /api/notifications
 * @desc    Create notification (Admin only)
 * @access  Admin
 */
router.post(
    '/',
    authenticateToken,
    authorizeRole('admin'),
    createNotificationValidation,
    requestValidator,
    notificationsController.createNotification
);

/**
 * @route   DELETE /api/notifications/cleanup-expired
 * @desc    Cleanup expired notifications (Admin only)
 * @access  Admin
 */
router.delete(
    '/cleanup-expired',
    authenticateToken,
    authorizeRole('admin'),
    notificationsController.cleanupExpired
);

/**
 * @route   POST /api/notifications/broadcast
 * @desc    Broadcast notification to multiple users (Admin only)
 * @access  Admin
 */
router.post(
    '/broadcast',
    authenticateToken,
    authorizeRole('admin'),
    [
        body('type')
            .notEmpty()
            .withMessage('Notification type is required')
            .isIn([
                'contact_message', 
                'newsletter_signup', 
                'booking_alert', 
                'system_alert',
                'payment_received',
                'league_registration',
                'team_request',
                'urgent_message'
            ])
            .withMessage('Invalid notification type'),
        
        body('title')
            .trim()
            .notEmpty()
            .withMessage('Title is required')
            .isLength({ max: 200 })
            .withMessage('Title cannot exceed 200 characters'),
        
        body('message')
            .trim()
            .notEmpty()
            .withMessage('Message is required')
            .isLength({ max: 1000 })
            .withMessage('Message cannot exceed 1000 characters'),
        
        body('recipients')
            .isArray({ min: 1 })
            .withMessage('Recipients array is required and must not be empty'),
        
        body('recipients.*')
            .isMongoId()
            .withMessage('Invalid recipient ID'),
        
        body('priority')
            .optional()
            .isIn(['low', 'medium', 'high', 'urgent'])
            .withMessage('Invalid priority')
    ],
    requestValidator,
    async (req, res, next) => {
        try {
            const {
                type,
                title,
                message,
                recipients,
                priority = 'medium',
                actionUrl,
                actionText,
                metadata = {},
                category
            } = req.body;

            const Notification = require('../models/notificationModel');

            // Create notifications for all recipients
            const notifications = recipients.map(recipientId => ({
                type,
                title,
                message,
                recipient: recipientId,
                priority,
                actionUrl,
                actionText,
                metadata,
                category: category || Notification.getCategoryFromType(type)
            }));

            const createdNotifications = await Notification.insertMany(notifications);

            res.status(201).json({
                success: true,
                message: `Notification broadcast to ${recipients.length} users`,
                data: {
                    count: createdNotifications.length,
                    recipients: recipients.length
                }
            });

        } catch (error) {
            console.error('Error broadcasting notifications:', error);
            next(error);
        }
    }
);

/**
 * @route   GET /api/notifications/system/stats
 * @desc    Get system-wide notification statistics (Admin only)
 * @access  Admin
 */
router.get(
    '/system/stats',
    authenticateToken,
    authorizeRole('admin'),
    async (req, res, next) => {
        try {
            const Notification = require('../models/notificationModel');

            const [
                totalNotifications,
                totalUnread,
                typeStats,
                priorityStats,
                categoryStats,
                recentActivity
            ] = await Promise.all([
                Notification.countDocuments({ isDeleted: false }),
                Notification.countDocuments({ isRead: false, isDeleted: false }),
                Notification.aggregate([
                    { $match: { isDeleted: false } },
                    { $group: { _id: '$type', count: { $sum: 1 } } }
                ]),
                Notification.aggregate([
                    { $match: { isDeleted: false } },
                    { $group: { _id: '$priority', count: { $sum: 1 } } }
                ]),
                Notification.aggregate([
                    { $match: { isDeleted: false } },
                    { $group: { _id: '$category', count: { $sum: 1 } } }
                ]),
                Notification.find({ isDeleted: false })
                    .sort({ createdAt: -1 })
                    .limit(10)
                    .select('type title priority createdAt recipient')
                    .populate('recipient', 'first_name second_name email')
            ]);

            res.status(200).json({
                success: true,
                data: {
                    totalNotifications,
                    totalUnread,
                    typeBreakdown: typeStats,
                    priorityBreakdown: priorityStats,
                    categoryBreakdown: categoryStats,
                    recentActivity
                }
            });

        } catch (error) {
            console.error('Error fetching system notification stats:', error);
            next(error);
        }
    }
);

module.exports = router;