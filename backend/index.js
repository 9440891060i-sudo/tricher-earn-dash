require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: [
    "https://tricher-earn-dash.vercel.app",
    "https://tricher-earn-dash-jkd9.vercel.app",
    "http://localhost:8081"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// 🔥 THIS LINE IS CRITICAL
app.options("*", cors());

app.use(morgan('dev'));
app.use(bodyParser.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://admin:admin@cluster0.mdegu3z.mongodb.net/';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Models
const Coupon = require('./models/coupon');
const Partner = require('./models/partner');
const Support = require('./models/support');

// Routes
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/partners', require('./routes/partners'));
app.use('/api/support', require('./routes/support'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/payouts', require('./routes/payouts'));
app.use('/api/identity', require('./routes/identity'));



app.get('/', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
