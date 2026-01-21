# Meeting Room Management System

A full-stack web application for managing coworking space meeting room bookings. Users can view available rooms, book time slots, and manage their reservations through an intuitive calendar interface.

## 🎯 Overview

This system allows coworking space members to:

- Browse available meeting rooms with capacity information
- Book hourly time slots (09:00 - 18:00)
- View their bookings in a monthly calendar
- Create new meeting rooms (admin-like functionality, no auth required)

### Full Stack Application

- **Frontend:** Next.js 16 + React 19 + TypeScript
- **Backend:** Node.js + Express 5 + TypeScript
- **Database:** SQLite (better-sqlite3)
- **API:** RESTful with standardized JSON responses

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository:**

   ```bash
   git clone
   cd Full-Stack-Meeting-Room-Management-System
   ```

2. **Setup Backend:**

   ```bash
   cd backend
   npm install
   npm run dev
   ```

   Backend will run on `http://localhost:8080`

3. **Setup Frontend** (in a new terminal):

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   Frontend will run on `http://localhost:3000`

4. **Open your browser:**
   Navigate to `http://localhost:3000`

### First-time Usage

1. You'll be prompted to enter a Malaysian IC number (e.g., `990101011234`)
2. The database comes pre-seeded with 3 meeting rooms
3. Start booking time slots or add new rooms!

## 🔌 API Endpoints

### Rooms

- `GET /api/rooms?date=YYYY-MM-DD` - Get rooms with available slots
- `GET /api/rooms/:id` - Get specific room
- `POST /api/rooms` - Create new room

### Bookings

- `POST /api/bookings` - Create booking
- `GET /api/bookings?icNumber=XXX` - Get user's bookings
- `GET /api/bookings/:id` - Get specific booking
- `GET /api/bookings/month/:year/:month?icNumber=XXX` - Get monthly bookings

### Health

- `GET /health` - Server health check

See individual README files in `/backend` and `/frontend` for detailed API documentation.

## 🛠️ Technology Stack

### Frontend

- **Framework:** Next.js 16.1.4 (App Router)
- **UI Library:** React 19.2.3
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4
- **HTTP Client:** Axios
- **Date Handling:** date-fns
- **State Management:** React Context API

### Backend

- **Runtime:** Node.js
- **Framework:** Express 5
- **Language:** TypeScript 5
- **Database:** SQLite (better-sqlite3)
- **Other:** CORS, dotenv

## 📝 Environment Variables

### Backend (.env)

```env
PORT=8080
NODE_ENV=development
DATABASE_PATH=./database/meetings.db
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## 🤝 Contributing

This is a demonstration project built for a coworking space scenario. Feel free to fork and adapt for your needs.

## 📄 License

ISC

## 🔗 Additional Documentation

- [Backend Documentation](./backend/README.md) - Detailed API specs, database schema, deployment
- [Frontend Documentation](./frontend/README.md) - Component structure, usage guide, validation rules
