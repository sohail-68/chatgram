const express = require('express');
const {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  checkRoomAvailability,
  searchRooms,
} = require('../controllers/roomController');
const { authenticateUser, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a new room (HotelOwner or Admin)
router.post('/', authenticateUser, createRoom);

// Get all rooms with search, filter, and pagination
router.get('/', getRooms);

// Search rooms
router.get('/search', searchRooms);

// Check room availability by ID
router.get('/:id/availability', checkRoomAvailability);

// Get a single room by ID
router.get('/:id', getRoomById);

// Update a room (HotelOwner or Admin)
router.put('/:id', authenticateUser, updateRoom);

// Delete a room (Admin only)
router.delete('/:id', authenticateUser, isAdmin, deleteRoom);

module.exports = router;
