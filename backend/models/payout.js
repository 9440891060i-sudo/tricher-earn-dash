const mongoose = require('mongoose');

const PayoutSchema = new mongoose.Schema({
  partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner' },
  amount: Number,
  status: { type: String, enum: ['pending','paid','rejected'], default: 'pending' },
  requested_at: { type: Date, default: Date.now },
  processed_at: Date,
});

module.exports = mongoose.model('Payout', PayoutSchema);
