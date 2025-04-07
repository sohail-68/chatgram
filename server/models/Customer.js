// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Full name of the user
  email: { type: String, required: true, unique: true }, // Email address
  password: { type: String, required: true }, // Hashed password
  phone: { type: String }, // Optional phone number
  role: {
    type: String,
    enum: ['Customer', 'Admin', 'HotelOwner'], // Role-based access control
    default: 'Customer',
  },
  profileImage: { type: String }, // URL of the profile image
  address: { type: String }, // Optional address field for the user
  preferences: [String], // User preferences (e.g., "Non-smoking", "High floor")
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }], // Reference to user's bookings
  createdAt: { type: Date, default: Date.now }, // Account creation date
  updatedAt: { type: Date, default: Date.now }, // Last update timestamp
});

// Pre-save hook to hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords for authentication
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
