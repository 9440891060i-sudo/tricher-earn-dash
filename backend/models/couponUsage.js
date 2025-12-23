const mongoose = require('mongoose');

const CouponUsageSchema = new mongoose.Schema({
  couponCode: String,
  order_id: String,
  amount: Number,
  partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner' },
  used_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CouponUsage', CouponUsageSchema);
