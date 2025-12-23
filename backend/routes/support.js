const express = require('express');
const router = express.Router();
const Support = require('../models/support');

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!email || !message) return res.status(400).json({ error: 'email_and_message_required' });
    const doc = new Support({ name, email, subject, message });
    await doc.save();
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

router.get('/', async (req, res) => {
  try {
    const list = await Support.find().sort({ created_at: -1 }).limit(100);
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

module.exports = router;
