const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const Partner = require('../models/partner');

const upload = multer({ dest: __dirname + '/../uploads' });

// Upload identity document
router.post('/upload', auth, upload.single('document'), async (req, res) => {
  try {
    const p = req.user;
    if (!req.file) return res.status(400).json({ error: 'file_required' });
    // store filename/path on partner
    p.identity = p.identity || {};
    p.identity.idDocument = req.file.filename;
    await p.save();
    res.json({ ok: true, filename: req.file.filename });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

module.exports = router;
