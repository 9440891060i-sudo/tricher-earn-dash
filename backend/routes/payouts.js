const express = require('express');
const router = express.Router();
const Payout = require('../models/payout');
const auth = require('../middleware/auth');

// Request a payout for the authenticated partner
router.post('/request', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: 'invalid_amount' });
    const p = req.user;
    const payout = new Payout({ partnerId: p._id, amount });
    await payout.save();
    // increment pendingPayouts
    p.pendingPayouts = (p.pendingPayouts || 0) + amount;
    await p.save();
    res.json(payout);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// Admin: list payouts (simple)
router.get('/', auth, async (req, res) => {
  try {
    // in real app check admin role; here return partner's payouts
    const p = req.user;
    const list = await Payout.find({ partnerId: p._id }).sort({ requested_at: -1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

module.exports = router;
