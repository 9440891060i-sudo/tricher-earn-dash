# Tricher Backend

Simple Express + Mongoose backend for coupons, partners, support.

Setup:

1. cd backend
2. npm install
3. export MONGO_URI="your-mongo-uri" (or set on Windows via set)
4. npm run dev

APIs:

- POST /api/coupons
- GET /api/coupons/:code/usage
- DELETE /api/coupons/:code
- POST /api/partners/signup
- POST /api/partners/:id/metrics
- GET /api/partners/leaderboard/top
- POST /api/support
