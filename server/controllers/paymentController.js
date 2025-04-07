const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// Create a new payment
exports.createPayment = async (req, res) => {
  const { bookingId, paymentMethod, amount, transactionId } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  if (amount !== booking.totalAmount) {
    return res.status(400).json({ message: 'Payment amount does not match the booking total.' });
  }

  const payment = new Payment({
    booking: bookingId,
    paymentMethod,
    amount,
    transactionId,
    paymentStatus: 'Completed',
  });

  await payment.save();

  // Update booking payment status
  booking.paymentStatus = 'Paid';
  await booking.save();

  res.status(201).json(payment);
};

// Get all payments (Admin only)
exports.getPayments = async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Access denied.' });
  }

  const payments = await Payment.find()
    .populate('booking', 'checkInDate checkOutDate totalAmount')
    .populate('booking.customer', 'name email');
  res.json(payments);
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate('booking', 'checkInDate checkOutDate totalAmount')
    .populate('booking.customer', 'name email');

  if (!payment) {
    return res.status(404).json({ message: 'Payment not found' });
  }

  res.json(payment);
};

// Update payment status (Admin only)
exports.updatePaymentStatus = async (req, res) => {
  const { status } = req.body;

  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Access denied.' });
  }

  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    return res.status(404).json({ message: 'Payment not found' });
  }

  if (!['Pending', 'Completed', 'Failed', 'Refunded'].includes(status)) {
    return res.status(400).json({ message: 'Invalid payment status.' });
  }

  payment.paymentStatus = status;
  payment.paymentDate = Date.now();
  await payment.save();

  res.json(payment);
};
