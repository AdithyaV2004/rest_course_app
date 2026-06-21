# Course App

Course App is a full-stack course selling platform with a React frontend and a Node.js/Express backend. It supports user sign up and sign in, course browsing, purchasing courses, adding wallet balance, viewing profiles, and an admin area for managing courses.

## Features

- User authentication with JWT-based login
- Public course browsing
- Purchase flow for enrolled courses
- Wallet balance top-up
- User profile and purchased courses dashboard
- Admin dashboard for creating and updating courses

## Project Structure

- `backend/` - Express API, MongoDB models, controllers, and routes
- `frontend/course-app-frontend/` - Vite + React app

## Requirements

- Node.js 18 or newer
- MongoDB database connection

## Setup

### 1. Install dependencies

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend/course-app-frontend
npm install
```

### 2. Configure the backend

The backend reads its MongoDB connection string and JWT secret from `backend/src/secrets.js`.

Before running the app, update that file with your own MongoDB URI and secret values if needed.

### 3. Start the backend

From the `backend/` folder, run:

```bash
npm start
```

The API runs on `http://localhost:3000`.

### 4. Start the frontend

From the `frontend/course-app-frontend/` folder, run:

```bash
npm run dev
```

The frontend runs on `http://localhost:5173`.

## How to Use

1. Open the frontend in your browser at `http://localhost:5173`.
2. Create a new account on the sign up page, or sign in if you already have one.
3. Browse available courses from the home or dashboard views.
4. Add money to your wallet from the wallet page if you want to purchase courses.
5. Purchase a course from the user dashboard.
6. Check your purchased courses and profile from the protected pages.
7. If you have an admin account, go to the admin dashboard to create or update courses.

## API Overview

The backend exposes routes for:

- `POST /users/signup` - create a user account
- `POST /users/signin` - log in and receive a token
- `GET /users/courses` - list courses for authenticated users
- `POST /users/courses/:courseId/purchases` - buy a course
- `GET /users/purchased` - view purchased courses
- `POST /wallet/add` - add wallet balance
- `GET /admin/courses` - list courses for admin users
- `POST /admin/courses` - create a course
- `PUT /admin/courses/:courseId` - update a course
- `GET /me` - get the current user profile

## Notes

- The frontend expects the backend to be running on port `3000`.
- The backend currently allows requests from `http://localhost:5173`.
- If you change ports, update the API base URL in `frontend/course-app-frontend/src/api/client.js` and the CORS origin in `backend/src/index.js`.
