const Hotel = require('../models/Hotel');
const Room = require('../models/Room');

// Create a new hotel
exports.createHotel = async (req, res) => {
  const { name, description, pricePerNight, location, starRating, amenities, images } = req.body;

  // Check if the user has the correct role
  if (req.user.role !== 'HotelOwner' && req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'You do not have permission to create a hotel.' });
  }

  const hotel = new Hotel({
    owner: req.user.id,
    name,
    description,
    pricePerNight,
    location,
    starRating,
    amenities,
    images,
  });

  await hotel.save();
  res.status(201).json(hotel);
};

// Get all hotels with filtering, search, and pagination
exports.getHotels = async (req, res) => {
  const { location, minPrice, maxPrice, minRating, maxRating, page = 1, limit = 10 } = req.query;

  const query = {};
  if (location) query.location = { $regex: location, $options: 'i' }; // Case-insensitive match
  if (minPrice) query.pricePerNight = { $gte: minPrice };
  if (maxPrice) query.pricePerNight = { $lte: maxPrice };
  if (minRating) query.starRating = { $gte: minRating };
  if (maxRating) query.starRating = { $lte: maxRating };

  const hotels = await Hotel.find(query)
    .populate('rooms')
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ hotels, currentPage: page });
};

// Search hotels by name, location, or amenities
exports.searchHotels = async (req, res) => {
  const { search } = req.query;

  if (!search) {
    return res.status(400).json({ message: 'Please provide a search term.' });
  }

  const hotels = await Hotel.find({
    $or: [
      { name: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
      { amenities: { $regex: search, $options: 'i' } },
    ],
  });

  res.json(hotels);
};

// Get a single hotel by ID
exports.getHotelById = async (req, res) => {
  const hotel = await Hotel.findById(req.params.id).populate('rooms');

  if (!hotel) {
    return res.status(404).json({ message: 'Hotel not found' });
  }

  res.json(hotel);
};

// Update a hotel
exports.updateHotel = async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);

  if (!hotel) {
    return res.status(404).json({ message: 'Hotel not found' });
  }

  // Check if the user is the owner or an admin
  if (req.user.id !== hotel.owner.toString() && req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'You do not have permission to update this hotel.' });
  }

  const updates = req.body;
  Object.keys(updates).forEach((key) => (hotel[key] = updates[key]));

  const updatedHotel = await hotel.save();
  res.json(updatedHotel);
};

// Delete a hotel
exports.deleteHotel = async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);

  if (!hotel) {
    return res.status(404).json({ message: 'Hotel not found' });
  }

  await hotel.deleteOne();
  res.json({ message: 'Hotel deleted successfully.' });
};
