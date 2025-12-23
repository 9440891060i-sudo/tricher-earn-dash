const mongoose = require('mongoose');

const PartnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String },
  bank: {
    bankName: String,
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String,
  },
  social: {
    platform: String,
    handle: String,
    followers: String,
  },
  crypto: {
    wallet: String,
    network: String,
  },
  identity: {
    idType: String,
    idNumber: String,
    idDocument: String,
  },
  resetToken: { type: String },
  resetExpires: { type: Date },
  totalSales: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  pendingPayouts: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Partner', PartnerSchema);
