const express = require('express');
const router = express.Router();
// const multer = require('multer');
// const multerS3 = require('multer-s3');
const auth = require('../middleware/auth');
// const s3 = require('../lib/s3');
const Partner = require('../models/partner');

const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../lib/s3");

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: "private",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const ext = file.originalname.split(".").pop();
      cb(null, `identity/${req.user._id}.${ext}`);
    }
  })
});

// Upload identity document → S3
router.post('/upload', auth, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'file_required' });
    }

    req.user.identity = req.user.identity || {};
    req.user.identity.idDocument = req.file.key; // S3 key
    await req.user.save();

    res.json({
      ok: true,
      key: req.file.key
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

module.exports = router;
