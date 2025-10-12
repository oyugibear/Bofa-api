const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletter');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');
const requestValidator = require('../middlewares/request-validator');
const { body, query, param } = require('express-validator');

// Validation schemas
const subscribeValidation = [
    body('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Please provide a valid email address'),
    
    body('firstName')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('First name cannot exceed 50 characters'),
    
    body('lastName')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Last name cannot exceed 50 characters'),
    
    body('preferences')
        .optional()
        .isObject()
        .withMessage('Preferences must be an object'),
    
    body('preferences.events')
        .optional()
        .isBoolean()
        .withMessage('Events preference must be boolean'),
    
    body('preferences.programs')
        .optional()
        .isBoolean()
        .withMessage('Programs preference must be boolean'),
    
    body('preferences.news')
        .optional()
        .isBoolean()
        .withMessage('News preference must be boolean'),
    
    body('preferences.promotions')
        .optional()
        .isBoolean()
        .withMessage('Promotions preference must be boolean'),
    
    body('preferences.tournaments')
        .optional()
        .isBoolean()
        .withMessage('Tournaments preference must be boolean'),
    
    body('source')
        .optional()
        .isIn(['contact_form', 'website_footer', 'manual', 'admin_panel', 'booking_form'])
        .withMessage('Invalid source')
];

const unsubscribeValidation = [
    body('token')
        .optional()
        .isString()
        .withMessage('Token must be a string'),
    
    body('email')
        .optional()
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Please provide a valid email address'),
    
    body('reason')
        .optional()
        .isIn(['not_interested', 'too_frequent', 'irrelevant_content', 'spam', 'other'])
        .withMessage('Invalid unsubscribe reason')
].refine((body) => {
    return body.token || body.email;
}, {
    message: 'Either token or email is required',
    path: ['token']
});

const updatePreferencesValidation = [
    body('preferences')
        .optional()
        .isObject()
        .withMessage('Preferences must be an object'),
    
    body('firstName')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('First name cannot exceed 50 characters'),
    
    body('lastName')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Last name cannot exceed 50 characters')
];

const sendNewsletterValidation = [
    body('subject')
        .trim()
        .notEmpty()
        .withMessage('Subject is required')
        .isLength({ max: 200 })
        .withMessage('Subject cannot exceed 200 characters'),
    
    body('content')
        .trim()
        .notEmpty()
        .withMessage('Content is required'),
    
    body('preferences')
        .optional()
        .isArray()
        .withMessage('Preferences must be an array')
        .custom((preferences) => {
            const validPrefs = ['events', 'programs', 'news', 'promotions', 'tournaments'];
            return preferences.every(pref => validPrefs.includes(pref));
        })
        .withMessage('Invalid preference in array'),
    
    body('testEmail')
        .optional()
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Test email must be a valid email address')
];

// Public routes
/**
 * @route   POST /api/newsletter/subscribe
 * @desc    Subscribe to newsletter
 * @access  Public
 */
router.post(
    '/subscribe',
    subscribeValidation,
    requestValidator,
    newsletterController.subscribeToNewsletter
);

/**
 * @route   POST /api/newsletter/unsubscribe
 * @desc    Unsubscribe from newsletter
 * @access  Public
 */
router.post(
    '/unsubscribe',
    unsubscribeValidation,
    requestValidator,
    newsletterController.unsubscribeFromNewsletter
);

// Protected admin routes
/**
 * @route   GET /api/newsletter/subscribers
 * @desc    Get all newsletter subscribers with filtering and pagination
 * @access  Admin
 * @query   page, limit, status, source, search, sortBy, sortOrder
 */
router.get(
    '/subscribers',
    authenticateToken,
    authorizeRole('admin'),
    [
        query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
        query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
        query('status').optional().isIn(['active', 'unsubscribed', 'bounced', 'pending']).withMessage('Invalid status'),
        query('source').optional().isIn(['contact_form', 'website_footer', 'manual', 'admin_panel', 'booking_form']).withMessage('Invalid source'),
        query('sortBy').optional().isIn(['subscriptionDate', 'email', 'firstName', 'lastName', 'status', 'lastEmailSent']).withMessage('Invalid sort field'),
        query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
    ],
    requestValidator,
    newsletterController.getSubscribers
);

/**
 * @route   GET /api/newsletter/subscribers/:id
 * @desc    Get single subscriber by ID
 * @access  Admin
 */
router.get(
    '/subscribers/:id',
    authenticateToken,
    authorizeRole('admin'),
    [
        param('id').isMongoId().withMessage('Invalid subscriber ID')
    ],
    requestValidator,
    async (req, res, next) => {
        try {
            const Newsletter = require('../models/newsletterModel');
            const subscriber = await Newsletter.findById(req.params.id);
            
            if (!subscriber) {
                return res.status(404).json({
                    success: false,
                    message: 'Subscriber not found'
                });
            }

            res.status(200).json({
                success: true,
                data: subscriber
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @route   PUT /api/newsletter/subscribers/:id/preferences
 * @desc    Update subscriber preferences
 * @access  Admin
 */
router.put(
    '/subscribers/:id/preferences',
    authenticateToken,
    authorizeRole('admin'),
    [
        param('id').isMongoId().withMessage('Invalid subscriber ID'),
        ...updatePreferencesValidation
    ],
    requestValidator,
    newsletterController.updateSubscriberPreferences
);

/**
 * @route   DELETE /api/newsletter/subscribers/:id
 * @desc    Delete subscriber (soft delete)
 * @access  Admin
 */
router.delete(
    '/subscribers/:id',
    authenticateToken,
    authorizeRole('admin'),
    [
        param('id').isMongoId().withMessage('Invalid subscriber ID')
    ],
    requestValidator,
    newsletterController.deleteSubscriber
);

/**
 * @route   POST /api/newsletter/send
 * @desc    Send newsletter to subscribers
 * @access  Admin
 */
router.post(
    '/send',
    authenticateToken,
    authorizeRole('admin'),
    sendNewsletterValidation,
    requestValidator,
    newsletterController.sendNewsletter
);

/**
 * @route   GET /api/newsletter/stats
 * @desc    Get newsletter statistics
 * @access  Admin
 */
router.get(
    '/stats',
    authenticateToken,
    authorizeRole('admin'),
    newsletterController.getNewsletterStats
);

/**
 * @route   POST /api/newsletter/subscribers/:id/reactivate
 * @desc    Reactivate unsubscribed subscriber
 * @access  Admin
 */
router.post(
    '/subscribers/:id/reactivate',
    authenticateToken,
    authorizeRole('admin'),
    [
        param('id').isMongoId().withMessage('Invalid subscriber ID')
    ],
    requestValidator,
    async (req, res, next) => {
        try {
            const Newsletter = require('../models/newsletterModel');
            const subscriber = await Newsletter.findById(req.params.id);
            
            if (!subscriber) {
                return res.status(404).json({
                    success: false,
                    message: 'Subscriber not found'
                });
            }

            await subscriber.reactivate();

            res.status(200).json({
                success: true,
                message: 'Subscriber reactivated successfully',
                data: subscriber
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @route   POST /api/newsletter/bulk-operations
 * @desc    Perform bulk operations on subscribers
 * @access  Admin
 */
router.post(
    '/bulk-operations',
    authenticateToken,
    authorizeRole('admin'),
    [
        body('action')
            .notEmpty()
            .withMessage('Action is required')
            .isIn(['delete', 'reactivate', 'unsubscribe'])
            .withMessage('Invalid action'),
        
        body('subscriberIds')
            .isArray({ min: 1 })
            .withMessage('Subscriber IDs array is required and must not be empty'),
        
        body('subscriberIds.*')
            .isMongoId()
            .withMessage('Invalid subscriber ID')
    ],
    requestValidator,
    async (req, res, next) => {
        try {
            const { action, subscriberIds } = req.body;
            const Newsletter = require('../models/newsletterModel');

            let result;
            
            switch (action) {
                case 'delete':
                    result = await Newsletter.updateMany(
                        { _id: { $in: subscriberIds } },
                        { 
                            isDeleted: true, 
                            deletedAt: new Date(),
                            deletedBy: req.user._id
                        }
                    );
                    break;
                    
                case 'reactivate':
                    result = await Newsletter.updateMany(
                        { _id: { $in: subscriberIds } },
                        { 
                            status: 'active',
                            unsubscribeDate: null,
                            unsubscribeReason: null,
                            bounceCount: 0
                        }
                    );
                    break;
                    
                case 'unsubscribe':
                    result = await Newsletter.updateMany(
                        { _id: { $in: subscriberIds } },
                        { 
                            status: 'unsubscribed',
                            unsubscribeDate: new Date()
                        }
                    );
                    break;
            }

            res.status(200).json({
                success: true,
                message: `${result.modifiedCount} subscribers ${action}d successfully`,
                data: {
                    modifiedCount: result.modifiedCount
                }
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @route   GET /api/newsletter/export
 * @desc    Export subscribers data
 * @access  Admin
 */
router.get(
    '/export',
    authenticateToken,
    authorizeRole('admin'),
    [
        query('status').optional().isIn(['active', 'unsubscribed', 'bounced', 'pending']).withMessage('Invalid status'),
        query('format').optional().isIn(['csv', 'json']).withMessage('Format must be csv or json')
    ],
    requestValidator,
    async (req, res, next) => {
        try {
            const { status, format = 'csv' } = req.query;
            const Newsletter = require('../models/newsletterModel');

            const filter = { isDeleted: false };
            if (status) filter.status = status;

            const subscribers = await Newsletter.find(filter)
                .select('email firstName lastName subscriptionDate status preferences source')
                .sort({ subscriptionDate: -1 });

            if (format === 'json') {
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Content-Disposition', 'attachment; filename=subscribers.json');
                return res.json(subscribers);
            }

            // CSV format
            const csvData = subscribers.map(sub => ({
                Email: sub.email,
                'First Name': sub.firstName || '',
                'Last Name': sub.lastName || '',
                'Subscription Date': sub.subscriptionDate.toISOString().split('T')[0],
                Status: sub.status,
                'Events Preference': sub.preferences.events,
                'Programs Preference': sub.preferences.programs,
                'News Preference': sub.preferences.news,
                'Promotions Preference': sub.preferences.promotions,
                'Tournaments Preference': sub.preferences.tournaments,
                Source: sub.source
            }));

            const csv = require('csv-stringify');
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=subscribers.csv');
            
            csv(csvData, { header: true }, (err, output) => {
                if (err) return next(err);
                res.send(output);
            });

        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;