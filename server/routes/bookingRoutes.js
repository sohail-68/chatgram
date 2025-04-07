const express = require('express');
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getUserBookings,
} = require('../controllers/bookingController');
const { authenticateUser } = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a booking
router.post('/', authenticateUser, createBooking);

// Get all bookings (Admin only)
router.get('/', authenticateUser, getBookings);

// Get bookings for the logged-in user
router.get('/my-bookings', authenticateUser, getUserBookings);

// Get booking by ID
router.get('/:id', authenticateUser, getBookingById);

// Update booking status (Admin only)
router.put('/:id/status', authenticateUser, updateBookingStatus);

// Cancel a booking
router.delete('/:id', authenticateUser, cancelBooking);

module.exports = router;
