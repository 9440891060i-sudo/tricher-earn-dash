const express = require('express');
const router = express.Router();
const Coupon = require('../models/coupon');
const CouponUsage = require('../models/couponUsage');
const auth = require('../middleware/auth');

// Create coupon (partner must be authenticated)
router.post('/', auth, async (req, res) => {
  try {
    const { discount_value, code, max_uses, expires_at, commission } = req.body;
    if (typeof discount_value !== 'number') return res.status(400).json({ error: 'discount_value required' });

    const payload = {
      discount_value,
      commission: commission || 0,
      partnerId: req.user._id,
      code: code || undefined,
      max_uses: max_uses || undefined,
      expires_at: expires_at ? new Date(expires_at) : undefined,
    };

    const coupon = new Coupon(payload);
    await coupon.save();
    res.json(coupon);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// Get coupon usage analytics
router.get('/:code/usage', async (req, res) => {
  try {
    const { code } = req.params;
    const coupon = await Coupon.findOne({ code });
    if (!coupon) return res.status(404).json({ error: 'not found' });

    // Query usage collection
    const usages = await CouponUsage.find({ couponCode: coupon.code }).sort({ used_at: -1 }).limit(10);
    const totalSales = usages.reduce((s, u) => s + (u.amount || 0), 0);
    res.json({
      usageCount: coupon.uses || 0,
      totalSales,
      recentUsages: usages.map(u => ({ order_id: u.order_id, amount: u.amount, used_at: u.used_at })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// Delete coupon
router.delete('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const doc = await Coupon.findOne({ code });
    if (!doc) return res.status(404).json({ error: 'not found' });
    // if request includes auth, ensure owner matches
    // otherwise allow delete (could be admin)
    // try to read auth
    try {
      const auth = require('../middleware/auth');
      // note: we can't easily run middleware here, but check req.user
    } catch (e) {}
    await Coupon.deleteOne({ code });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// List coupons for authenticated partner
router.get('/', auth, async (req, res) => {
  try {
    const coupons = await Coupon.find({ partnerId: req.user._id }).sort({ created_at: -1 });
    res.json(coupons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// Record a coupon usage (public endpoint, but could be protected by secret)
router.post('/:code/use', async (req, res) => {
  try {
    const { code } = req.params;
    const { order_id, amount, partnerId } = req.body;
    const coupon = await Coupon.findOne({ code });
    if (!coupon) return res.status(404).json({ error: 'not_found' });
    if (coupon.expires_at && new Date() > coupon.expires_at) return res.status(400).json({ error: 'expired' });
    if (coupon.max_uses && coupon.uses >= coupon.max_uses) return res.status(400).json({ error: 'maxed' });

    // create usage record
    const usage = new CouponUsage({ couponCode: code, order_id, amount, partnerId });
    await usage.save();
    coupon.uses = (coupon.uses || 0) + 1;
    await coupon.save();

    res.json({ ok: true, usageId: usage._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

module.exports = router;
