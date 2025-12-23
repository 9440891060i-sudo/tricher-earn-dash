const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Partner = require('../models/partner');

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone, bank } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'missing_fields' });
    const existing = await Partner.findOne({ email });
    if (existing) return res.status(400).json({ error: 'email_exists' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const p = new Partner({ name, email, phone, bank, password: hash });
    await p.save();
    const secret = process.env.JWT_SECRET || 'secretkey';
    const token = jwt.sign({ id: p._id }, secret, { expiresIn: '30d' });
    res.json({ token, partner: { id: p._id, name: p.name, email: p.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'missing_fields' });
    const p = await Partner.findOne({ email });
    if (!p) return res.status(400).json({ error: 'invalid' });
    const ok = await bcrypt.compare(password, p.password || '');
    if (!ok) return res.status(400).json({ error: 'invalid' });
    const secret = process.env.JWT_SECRET || 'secretkey';
    const token = jwt.sign({ id: p._id }, secret, { expiresIn: '30d' });
    res.json({ token, partner: { id: p._id, name: p.name, email: p.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

module.exports = router;
