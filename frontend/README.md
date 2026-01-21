# Meeting Room Management System - Frontend

A modern web application for managing coworking space meeting room bookings built with Next.js 16, React 19, and TypeScript.

## Features

- ✅ **IC Number Authentication** - Malaysian IC-based user identification with localStorage persistence
- ✅ **Room Browsing** - View available meeting rooms with capacity information
- ✅ **Room Creation** - Add new meeting rooms with validation (name, capacity)
- ✅ **Hourly Booking System** - Book slots from 09:00 to 18:00 (9 AM to 6 PM)
- ✅ **Date Selection** - Book rooms for current and future dates (past dates blocked)
- ✅ **Monthly Calendar View** - Visualize your bookings in a calendar grid
- ✅ **Real-time Availability** - See which slots are already booked
- ✅ **Responsive Design** - Mobile-first approach with Tailwind CSS
- ✅ **Dark Mode Support** - Automatic dark mode based on system preferences
- ✅ **Backend Integration** - Full API integration with Node.js backend

## Tech Stack

- **Framework:** Next.js 16.1.4 (App Router)
- **UI Library:** React 19.2.3
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4
- **HTTP Client:** Axios
- **Date Handling:** date-fns
- **State Management:** React Context API

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Usage

### First Time Setup

1. When you first load the app, you'll see a modal asking for your IC Number
2. **Start the Backend Server** - Make sure the backend is running on `http://localhost:8080`
3. When you first load the app, you'll see a modal asking for your IC Number
4. Enter a 12-digit Malaysian IC number (e.g., `990101011234`)
5. The IC will be stored in localStorage for subsequent visits

### Booking a Room

1. Navigate to "Rooms" from the navigation bar
2. Select a date using the date picker (today or future dates)
3. Browse available rooms and their time slots
4. Click on an available time slot (blue buttons) to book
5. Booked slots appear grayed out and disabled

### Viewing Your Bookings

1. Navigate to "My Bookings" from the navigation bar
2. View your bookings in a monthly calendar grid
3. Use the month/year dropdowns or prev/next buttons to navigate
4. Each dntegrates with a Node.js + Express + SQLite backend with these endpoints:

**Rooms:**

- `GET /api/rooms?date=YYYY-MM-DD` - Get rooms with available time slots
- `GET /api/rooms/:id` - Get specific room details
- `POST /api/rooms` - Create a new room

**Bookings:**

- `POST /api/bookings` - Create a new booking
- `GET /api/bookings?icNumber=XXX` - Get user's bookings
- `GET /api/bookings/:id` - Get specific booking
- `GET /api/bookings/month/:year/:month?icNumber=XXX` - Get monthly bookings

**Environment Variables:**

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Project Structure

```
frontend/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── BookingCard.tsx
│   │   ├── DatePicker.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── ICModal.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   ├── Navigation.tsx
│   │   └── RoomCard.tsx
│   ├── contexts/            # React Context providers
│   │   ├── AppProviders.tsx
│   │   └── ICContext.tsx
│   ├── lib/                 # Utilities and types
│   │   ├── api.ts           # Axios instance
│   │   ├── mockData.ts      # Mock data for development
│   │   ├── types.ts         # TypeScript interfaces
│   │   └── utils.ts         # Helper functions
│   ├── services/            # API service layer
│   │   ├── bookingService.ts
│   │   └── roomService.ts
│   ├── rooms/
│   │   ├── page.tsx         # Rooms listing & booking
│   │   └── new/
│   │       └── page.tsx     # Add new room
│   ├── bookings/
│   │   └── page.tsx         # Monthly calendar view
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── public/
├── .env.local
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Key Components

### ICContext

Manages Malaysian IC number authentication and formatting:

- Stores IC as 12 digits ("990101011234")
- Displays formatted version ("990101-01-1234")
- Persists to localStorage

### Monthly Calendar

- Shows bookings in a calendar grid layout
- Month/year navigation with dropdowns and prev/next buttons
- Displays up to 3 bookings per date cell
- "View More" modal for dates with 4+ bookings
- Color-coded booking indicators

### Room Cards

- Displays room information (name, capacity)
- Grid of hourly time slots (09:00-17:00)
- Visual distinction between available and booked slots
- Click to book available slots

## Validation Rules

**IC Number:**

- Must be exactly 12 digits
- Stored without dashes, displayed with formatting

**Room Name:**

- 1-100 characters
- Alphanumeric and spaces only
- Must be unique (enforced by backend)

**Room Capacity:**

- Integer between 1 and 100

**Booking:**

- Room ID (string)
- Date (YYYY-MM-DD format)
- Start time (HH:mm format, 09:00-17:00)
- IC number (12 digits)00 characters)

3. Enter capacity (1-100 people)
4. Click "Create Room" to add the room
5. You'll be redirected to the Rooms page on success
