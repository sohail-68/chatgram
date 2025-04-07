const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Hotel = require('../models/Hotel');
const User = require('../models/User');

// Create a new booking
exports.createBooking = async (req, res) => {
  const { hotelId, roomId, checkInDate, checkOutDate, totalAmount } = req.body;

  // Ensure dates are valid
  if (new Date(checkInDate) >= new Date(checkOutDate)) {
    return res.status(400).json({ message: 'Check-out date must be later than check-in date.' });
  }

  const room = await Room.findById(roomId);
  const hotel = await Hotel.findById(hotelId);

  if (!room || !hotel) {
    return res.status(404).json({ message: 'Hotel or room not found' });
  }

  if (!room.availability) {
    return res.status(400).json({ message: 'Room is not available for booking.' });
  }

  const booking = new Booking({
    customer: req.user.id,
    hotel: hotelId,
    room: roomId,
    checkInDate,
    checkOutDate,
    totalAmount,
  });

  await booking.save();

  // Update room availability
  room.availability = false;
  await room.save();

  res.status(201).json(booking);
};

// Get all bookings (Admin only)
exports.getBookings = async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Access denied.' });
  }

  const bookings = await Booking.find()
    .populate('customer', 'name email')
    .populate('hotel', 'name location')
    .populate('room', 'roomType price');
  res.json(bookings);
};

// Get bookings for the logged-in user
exports.getUserBookings = async (req, res) => {
  const bookings = await Booking.find({ customer: req.user.id })
    .populate('hotel', 'name location')
    .populate('room', 'roomType price');
  res.json(bookings);
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('customer', 'name email')
    .populate('hotel', 'name location')
    .populate('room', 'roomType price');

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  if (req.user.id !== booking.customer.toString() && req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Access denied.' });
  }

  res.json(booking);
};

// Update booking status (Admin only)
exports.updateBookingStatus = async (req, res) => {
  const { status } = req.body;

  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Access denied.' });
  }

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  if (!['Confirmed', 'Cancelled', 'Completed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid booking status.' });
  }

  booking.bookingStatus = status;
  booking.updatedAt = Date.now();
  await booking.save();

  res.json(booking);
};

// Cancel a booking
exports.cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  if (req.user.id !== booking.customer.toString() && req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Access denied.' });
  }

  // Mark booking as cancelled
  booking.bookingStatus = 'Cancelled';
  booking.updatedAt = Date.now();
  await booking.save();

  // Mark room as available again
  const room = await Room.findById(booking.room);
  if (room) {
    room.availability = true;
    await room.save();
  }

  res.json({ message: 'Booking cancelled successfully.', booking });
};
