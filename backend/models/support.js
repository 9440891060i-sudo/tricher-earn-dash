const mongoose = require('mongoose');

const SupportSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  status: { type: String, default: 'open' },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Support', SupportSchema);
