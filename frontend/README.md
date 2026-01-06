# BRIDGE — Frontend (React) — Paystack Edition

This frontend is configured to work with the backend endpoints included in this package.
It uses Paystack inline checkout (server initializes transaction and returns authorization_url).

To run locally:
1. cd frontend
2. npm install
3. npm run dev

When deploying to Railway, set the FRONTEND_URL and ensure the backend origin is accessible.
