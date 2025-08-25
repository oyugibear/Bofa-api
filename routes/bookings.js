const express = require('express');
const BookingController = require("../controllers/booking/index.js");
const { authenticateToken, authorizeRole } = require('../middlewares/auth');

const router = express.Router()


// Protected routes - require authentication
router.post('/add', authenticateToken, BookingController.createBooking);
router.get('/user/:id', authenticateToken, BookingController.getUserBookings);
router.get('/:id', authenticateToken, BookingController.getBooking);
router.put('/addlink/:id', authenticateToken, BookingController.addLinkToBooking);
router.put('/rescheduleBooking/:id', authenticateToken, BookingController.rescheduleBooking);
router.put('/completeBooking/:id', authenticateToken, BookingController.completeBooking);

// Admin only routes
router.put('/edit/:id', authenticateToken, BookingController.editBooking);
router.get('/', authenticateToken, authorizeRole('Admin'), BookingController.getBookings);



module.exports = router;