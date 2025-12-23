const express = require('express');
const router = express.Router();
const Partner = require('../models/partner');
const auth = require('../middleware/auth');

// Create partner (signup)
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, bank } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'name and email required' });
    const existing = await Partner.findOne({ email });
    if (existing) return res.status(400).json({ error: 'email_exists' });

    const partner = new Partner({ name, email, phone, bank });
    await partner.save();
    res.json(partner);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// Get partner by id
router.get('/:id', auth, async (req, res) => {
  try {
    const p = await Partner.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'not_found' });
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// Update partner profile (self)
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user._id.toString() !== id) return res.status(403).json({ error: 'forbidden' });
    const p = await Partner.findById(id);
    if (!p) return res.status(404).json({ error: 'not_found' });
    const { name, email, phone, bank, identity, social, crypto } = req.body;
    if (name) p.name = name;
    if (email) p.email = email;
    if (phone) p.phone = phone;
    if (bank) p.bank = { ...p.bank, ...bank };
    if (identity) p.identity = { ...p.identity, ...identity };
    if (social) p.social = { ...p.social, ...social };
    if (crypto) p.crypto = { ...p.crypto, ...crypto };
    await p.save();
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// Update earnings and sales (used by dashboard jobs)
router.post('/:id/metrics', auth, async (req, res) => {
  try {
    const { totalSales, totalEarnings, pendingPayouts } = req.body;
    const p = await Partner.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'not_found' });

    if (typeof totalSales === 'number') p.totalSales = totalSales;
    if (typeof totalEarnings === 'number') p.totalEarnings = totalEarnings;
    if (typeof pendingPayouts === 'number') p.pendingPayouts = pendingPayouts;

    await p.save();
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// Leaderboard: top partners by totalSales
router.get('/leaderboard/top', async (req, res) => {
  try {
    const top = await Partner.find().sort({ totalSales: -1 }).limit(20).select('name totalSales totalEarnings');
    res.json(top);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

module.exports = router;
