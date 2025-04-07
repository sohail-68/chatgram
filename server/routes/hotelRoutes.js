const express = require('express');
const { createHotel, getHotels, getHotelById, updateHotel, deleteHotel, searchHotels } = require('../controllers/hotelController');
const { authenticateUser, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

// Create a new hotel (HotelOwner or Admin)
router.post('/', authenticateUser, createHotel);

// Get all hotels with search, filter, and pagination
router.get('/', getHotels);

// Search hotels (e.g., by location, name, or star rating)
router.get('/search', searchHotels);

// Get a single hotel by ID
router.get('/:id', getHotelById);

// Update a hotel (HotelOwner or Admin)
router.put('/:id', authenticateUser, updateHotel);

// Delete a hotel (Admin only)
router.delete('/:id', authenticateUser, isAdmin, deleteHotel);

module.exports = router;
