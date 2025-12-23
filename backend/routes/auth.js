const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Partner = require('../models/partner');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// setup mail transporter if SMTP env present
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || 'support@tricher.app';

const mailTransporter = SMTP_HOST && SMTP_USER && SMTP_PASS ? nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS }
}) : null;

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

// Forgot password - generates a reset token and returns minimal response
router.post('/forgot', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'missing_email' });
    const p = await Partner.findOne({ email });
    if (!p) return res.status(404).json({ error: 'not_found' });

    // If SMTP is configured, send a 6-digit OTP; otherwise fall back to token in response (dev)
    if (mailTransporter) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      p.resetToken = otp;
      p.resetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      await p.save();

      // send OTP email
      try {
        await mailTransporter.sendMail({
          from: FROM_EMAIL,
          to: p.email,
          subject: 'Your Tricher password reset OTP',
          text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
        });
      } catch (mailErr) {
        console.error('Failed to send reset OTP email', mailErr);
      }

      return res.json({ ok: true });
    }

    // dev fallback: return a token in response
    const token = crypto.randomBytes(20).toString('hex');
    p.resetToken = token;
    p.resetExpires = Date.now() + 3600 * 1000; // 1 hour
    await p.save();
    const showToken = process.env.SHOW_RESET_TOKEN === 'true' || process.env.NODE_ENV !== 'production';
    const payload = { ok: true };
    if (showToken) payload.token = token;
    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// Verify OTP (from email) and return a reset token to allow password change
router.post('/forgot/verify', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'missing_fields' });
    const p = await Partner.findOne({ email, resetToken: otp, resetExpires: { $gt: Date.now() } });
    if (!p) return res.status(400).json({ error: 'invalid_or_expired' });

    // generate one-time token for reset endpoint
    const token = crypto.randomBytes(20).toString('hex');
    p.resetToken = token;
    p.resetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await p.save();
    res.json({ ok: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// Reset password using token
router.post('/reset', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: 'missing_fields' });
    const p = await Partner.findOne({ resetToken: token, resetExpires: { $gt: Date.now() } });
    if (!p) return res.status(400).json({ error: 'invalid_or_expired' });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    p.password = hash;
    p.resetToken = undefined;
    p.resetExpires = undefined;
    await p.save();
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

module.exports = router;
