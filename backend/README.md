# Meeting Room Management System - Backend

REST API backend for the meeting room booking system built with Node.js, Express, TypeScript, and SQLite.

## Features

- ✅ **Room Management** - Get list of meeting rooms with capacity
- ✅ **Room Creation** - Create new meeting rooms with validation
- ✅ **Time Slot Availability** - View available hourly slots (09:00-18:00)
- ✅ **Booking System** - Create bookings with double-booking prevention
- ✅ **User Bookings** - Retrieve bookings by IC number
- ✅ **Monthly Calendar View** - Get all bookings for a specific month/year
- ✅ **SQLite Database** - Persistent storage with automatic schema initialization
- ✅ **TypeScript** - Full type safety
- ✅ **CORS Enabled** - Ready for frontend integration

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **Language:** TypeScript 5
- **Database:** SQLite (better-sqlite3)
- **Other:** CORS, dotenv, nanoId

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts       # Database configuration
│   ├── controllers/
│   │   ├── bookingController.ts
│   │   └── roomController.ts
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   └── logger.ts
│   ├── routes/
│   │   └── index.ts          # API routes
│   ├── services/
│   │   ├── bookingService.ts
│   │   └── roomService.ts
│   ├── types/
│   │   └── index.ts          # TypeScript interfaces
│   ├── app.ts                # Express app
│   └── index.ts              # Server entry point
├── database/
│   ├── schema.sql            # Database schema
│   └── meetings.db           # SQLite database (auto-generated)
├── .env
├── .gitignore
├── package.json
└── tsconfig.json
```

## Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Environment variables are already configured in `.env`:**
   ```
   PORT=8080
   NODE_ENV=development
   DATABASE_PATH=./database/meetings.db
   ```

## Running the Server

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Build for production:**

```bash
npm run build
```

**Run production build:**

```bash
npm start
```

The server will start on `http://localhost:8080`

## API Endpoints

### Rooms

#### Get Rooms with Available Slots

```http
GET /api/rooms?date=YYYY-MM-DD
```

**Query Parameters:**

- `date` (required) - Date in YYYY-MM-DD format

**Response:**

```json
{
  "success": true,
  "data": {
    "rooms": [
      {
        "id": "1",
        "name": "Conference Room A",
        "capacity": 10
      }
    ],
    "timeSlots": [
      {
        "id": "1-9",
        "roomId": "1",
        "date": "2026-01-21",
        "startTime": "09:00",
        "endTime": "10:00",
        "isBooked": false
      }
    ]
  }
}
```

#### Get Specific Room

```http
GET /api/rooms/:id
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Conference Room A",
    "capacity": 10
  }
}
```

#### Create New Room

```http
POST /api/rooms
```

**Request Body:**

```json
{
  "name": "Executive Suite",
  "capacity": 15
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "name": "Executive Suite",
    "capacity": 15
  },
  "message": "Room created successfully"
}
```

**Validation:**

- Room name must be unique (case-insensitive)
- Name cannot be empty and must contain only alphanumeric characters and spaces
- Capacity must be between 1 and 100

### Bookings

#### Create Booking

```http
POST /api/bookings
```

**Request Body:**

```json
{
  "roomId": "1",
  "date": "2026-01-21",
  "startTime": "09:00",
  "icNumber": "990101011234"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "roomId": "1",
    "roomName": "Conference Room A",
    "date": "2026-01-21",
    "startTime": "09:00",
    "endTime": "10:00",
    "icNumber": "990101011234"
  },
  "message": "Booking created successfully"
}
```

**Error Response (Double Booking):**

```json
{
  "success": false,
  "message": "This time slot is already booked"
}
```

#### Get User's Bookings

```http
GET /api/bookings?icNumber=990101011234
```

**Query Parameters:**

- `icNumber` (required) - 12-digit Malaysian IC number

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "roomId": 1,
      "roomName": "Conference Room A",
      "date": "2026-01-21",
      "startTime": "09:00",
      "endTime": "10:00",
      "icNumber": "990101011234"
    }
  ]
}
```

#### Get Specific Booking

```http
GET /api/bookings/:id
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "roomId": "1",
    "roomName": "Conference Room A",
    "date": "2026-01-21",
    "startTime": "09:00",
    "endTime": "10:00",
    "icNumber": "990101011234"
  }
}
```

#### Get Monthly Bookings

```http
GET /api/bookings/month/:year/:month?icNumber=990101011234
```

**URL Parameters:**

- `year` (required) - Year (e.g., 2026)
- `month` (required) - Month (1-12)

**Query Parameters:**

- `icNumber` (optional) - Filter by specific IC number

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "abc123",
      "roomId": "1",
      "roomName": "Conference Room A",
      "date": "2026-01-15",
      "startTime": "09:00",
      "endTime": "10:00",
      "icNumber": "990101011234"
    },
    {
      "id": "def456",
      "roomId": "2",
      "roomName": "Meeting Room B",
      "date": "2026-01-22",
      "startTime": "14:00",
      "endTime": "15:00",
      "icNumber": "990101011234"
    }
  ],
  "message": "Found 2 booking(s) for 2026-01"
}
```

### Health Check

```http
GET /health
```

**Response:**

```json
{
  "status": "OK",
  "timestamp": "2026-01-21T10:30:00.000Z"
}
```

## Database

### Schema

The database includes two main tables:

1. **rooms** - Meeting room information
   - id (Primary Key)
   - name (Unique)
   - capacity
   - created_at

2. **bookings** - Booking records
   - id (Primary Key)
   - room_id (Foreign Key)
   - ic_number (Malaysian IC)
   - date
   - start_time
   - end_time
   - created_at
   - UNIQUE constraint on (room_id, date, start_time)

### Pre-loaded Rooms

The database is automatically seeded with:

- Conference Room A (capacity: 10)
- Meeting Room B (capacity: 6)
- Huddle Room C (capacity: 4)

## Business Rules

1. **Operating Hours:** 09:00 - 18:00 (9 AM - 6 PM)
2. **Time Slots:** 1-hour duration
3. **No Double Booking:** Unique constraint on room + date + time
4. **IC Number:** 12-digit Malaysian IC format
5. **Date Format:** YYYY-MM-DD
6. **Time Format:** HH:mm

## Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## CORS Configuration

CORS is enabled for the frontend at `http://localhost:3000`. To allow other origins, modify:

```typescript
// src/index.ts
app.use(
  cors({
    origin: "http://localhost:3000", // Change this
  }),
);
```

## Testing with cURL

**Get rooms:**

```bash
curl "http://localhost:8080/api/rooms?date=2026-01-21"
```

**Create booking:**

```bash
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": 1,
    "date": "2026-01-21",
    "startTime": "09:00",
    "icNumber": "990101011234"
  }'
```

**Get user bookings:**

```bash
curl "http://localhost:8080/api/bookings?icNumber=990101011234"
```

## Integration with Frontend

The backend is designed to work seamlessly with the Next.js frontend. The frontend expects:

- Backend running on `http://localhost:8080`
- API endpoints at `/api/*`
- IC numbers in headers (optional, currently in request body)

## Development Notes

- Database is created automatically on first run
- Schema is applied automatically from `database/schema.sql`
- Logs all HTTP requests with method, URL, status, and duration
- Graceful shutdown on SIGINT/SIGTERM

## License

ISC
