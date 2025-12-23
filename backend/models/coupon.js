const mongoose = require('mongoose');
const shortid = require('shortid');

const CouponSchema = new mongoose.Schema({
  code: { type: String, unique: true, default: () => shortid.generate().toUpperCase() },
  partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner' },
  discount_type: { type: String, default: 'percent' },
  discount_value: { type: Number, required: true },
  commission: { type: Number, default: 0 },
  max_uses: { type: Number, default: 500 },
  uses: { type: Number, default: 0 },
  expires_at: { type: Date },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Coupon', CouponSchema);
