const express = require('express');
const {
  createPayment,
  getPayments,
  getPaymentById,
  updatePaymentStatus,
} = require('../controllers/paymentController');
const { authenticateUser } = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a payment
router.post('/', authenticateUser, createPayment);

// Get all payments (Admin only)
router.get('/', authenticateUser, getPayments);

// Get payment by ID
router.get('/:id', authenticateUser, getPaymentById);

// Update payment status (Admin only)
router.put('/:id/status', authenticateUser, updatePaymentStatus);

module.exports = router;
