const Room = require('../models/Room');
const Hotel = require('../models/Hotel');

// Create a new room
exports.createRoom = async (req, res) => {
  const { hotelId, roomType, price, description, amenities, images } = req.body;

  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    return res.status(404).json({ message: 'Hotel not found' });
  }

  // Check if the user owns the hotel or is an admin
  if (req.user.id !== hotel.owner.toString() && req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'You do not have permission to add rooms to this hotel.' });
  }

  const room = new Room({
    hotel: hotelId,
    roomType,
    price,
    description,
    amenities,
    images,
  });

  await room.save();

  hotel.rooms.push(room._id);
  await hotel.save();

  res.status(201).json(room);
};

// Get all rooms with filtering, search, and pagination
exports.getRooms = async (req, res) => {
  const { hotelId, roomType, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

  const query = {};
  if (hotelId) query.hotel = hotelId;
  if (roomType) query.roomType = roomType;
  if (minPrice) query.price = { $gte: minPrice };
  if (maxPrice) query.price = { ...query.price, $lte: maxPrice };

  const rooms = await Room.find(query)
    .populate('hotel', 'name location') // Include hotel details
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ rooms, currentPage: page });
};

// Search rooms
exports.searchRooms = async (req, res) => {
  const { search } = req.query;

  if (!search) {
    return res.status(400).json({ message: 'Please provide a search term.' });
  }

  const rooms = await Room.find({
    $or: [
      { roomType: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { amenities: { $regex: search, $options: 'i' } },
    ],
  });

  res.json(rooms);
};

// Get a single room by ID
exports.getRoomById = async (req, res) => {
  const room = await Room.findById(req.params.id).populate('hotel', 'name location');

  if (!room) {
    return res.status(404).json({ message: 'Room not found' });
  }

  res.json(room);
};

// Check room availability
exports.checkRoomAvailability = async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    return res.status(404).json({ message: 'Room not found' });
  }

  res.json({ roomId: room._id, availability: room.availability });
};

// Update a room
exports.updateRoom = async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    return res.status(404).json({ message: 'Room not found' });
  }

  // Check if the user owns the hotel or is an admin
  const hotel = await Hotel.findById(room.hotel);
  if (req.user.id !== hotel.owner.toString() && req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'You do not have permission to update this room.' });
  }

  const updates = req.body;
  Object.keys(updates).forEach((key) => (room[key] = updates[key]));

  const updatedRoom = await room.save();
  res.json(updatedRoom);
};

// Delete a room
exports.deleteRoom = async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    return res.status(404).json({ message: 'Room not found' });
  }

  // Check if the user owns the hotel or is an admin
  const hotel = await Hotel.findById(room.hotel);
  if (req.user.id !== hotel.owner.toString() && req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'You do not have permission to delete this room.' });
  }

  await room.deleteOne();
  res.json({ message: 'Room deleted successfully.' });
};
