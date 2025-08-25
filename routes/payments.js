const express = require('express');
const PaymentController = require("../controllers/payments/index.js");
const { authenticateToken, authorizeRole } = require('../middlewares/auth');

const router = express.Router()

// Protected routes
router.post('/add', authenticateToken, PaymentController.createPayment);
router.get('/:id', authenticateToken, PaymentController.getPayment);
router.get('/user/:id', authenticateToken, PaymentController.getPaymentByUser);

// Admin routes
router.get('/', authenticateToken, authorizeRole('Admin'), PaymentController.getPayments);
router.put('/edit/:id', authenticateToken, authorizeRole('Admin'), PaymentController.editPayment);

// Webhook routes (public for payment providers)
router.get('/confirm_payment/paystack', PaymentController.confirmPaymentPaystack);



// change the route to a random number or string

module.exports = router;