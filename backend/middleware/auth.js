const jwt = require('jsonwebtoken');
const Partner = require('../models/partner');

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'unauthorized' });
  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET || 'secretkey';
    const decoded = jwt.verify(token, secret);
    const user = await Partner.findById(decoded.id);
    if (!user) return res.status(401).json({ error: 'unauthorized' });
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'unauthorized' });
  }
};

module.exports = auth;
