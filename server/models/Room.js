// models/Room.js
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true }, // Reference to the hotel this room belongs to
  roomType: { type: String, enum: ['Single', 'Double', 'Suite'], required: true },
  price: { type: Number, required: true }, // Price per night for the room
  availability: { type: Boolean, default: true }, // Availability of the room
  description: { type: String },
  amenities: [String], // List of amenities (e.g., Wi-Fi, AC, TV, etc.)
  images: [String], // Array to store images of the room
  createdAt: { type: Date, default: Date.now },
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
