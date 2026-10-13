# ClothConnect — Clothing Donation Platform

A MERN-stack starter project for connecting clothing donors with community organizations.

## Features
- Responsive React landing page and donation dashboard
- Add, view, edit, and delete clothing donations
- Search/filter donations by category and status
- Express REST API with MongoDB/Mongoose
- Optional JWT authentication scaffold and role-based middleware
- Demo mode: the frontend runs with local browser storage if the API is not available

## Requirements
- Node.js 18+
- MongoDB local instance or MongoDB Atlas connection string

## Run the backend
```bash
cd server
cp .env.example .env
npm install
npm run dev
```
Set `MONGODB_URI` and a strong `JWT_SECRET` in `server/.env`.

## Run the frontend (new terminal)
```bash
cd client
npm install
npm run dev
```
Open the URL printed by Vite (usually http://localhost:5173).

The frontend attempts to use `http://localhost:5000/api`. If the API is unavailable, it switches to browser-local demo data and shows a demo-mode notice. Browser demo data is not saved to MongoDB.

## API endpoints
- `GET /api/health`
- `GET /api/donations?search=&category=&status=`
- `POST /api/donations`
- `GET /api/donations/:id`
- `PUT /api/donations/:id`
- `DELETE /api/donations/:id`

This is a college-project starter, not a production-ready deployment. Before public deployment, add full login/register UI, organization allocation workflows, file storage, audit logs, stronger validation, and tests.
