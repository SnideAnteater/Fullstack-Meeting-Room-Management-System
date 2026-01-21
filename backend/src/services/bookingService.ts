import { db } from "../config/database";
import { Booking, BookingRequest } from "../types";
import { nanoid } from "nanoid";

export class BookingService {
  // Create a new booking
  createBooking(bookingData: BookingRequest): Booking {
    const { roomId, date, startTime, icNumber } = bookingData;
    const bookingId = nanoid();

    const startHour = parseInt(startTime.split(":")[0]);
    const endTime = `${(startHour + 1).toString().padStart(2, "0")}:00`;

    // Check if slot is already booked
    const checkStmt = db.prepare(`
      SELECT id FROM bookings 
      WHERE room_id = ? AND date = ? AND start_time = ?
    `);
    const existing = checkStmt.get(roomId, date, startTime);

    if (existing) {
      throw new Error("This time slot is already booked");
    }

    // Validate time slot is within operating hours
    if (startHour < 9 || startHour >= 18) {
      throw new Error("Time slot must be between 09:00 and 18:00");
    }

    // Get room name
    const roomStmt = db.prepare("SELECT name FROM rooms WHERE id = ?");
    const room = roomStmt.get(roomId) as { name: string } | undefined;

    if (!room) {
      throw new Error("Room not found");
    }

    // Insert booking
    const insertStmt = db.prepare(`
      INSERT INTO bookings (id, room_id, ic_number, date, start_time, end_time)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = insertStmt.run(
      bookingId,
      roomId,
      icNumber,
      date,
      startTime,
      endTime,
    );
    return {
      id: bookingId,
      roomId,
      roomName: room.name,
      date,
      startTime,
      endTime,
      icNumber,
    };
  }

  /**
   * Get all bookings for a specific IC number
   */
  getBookingsByIcNumber(icNumber: string): Booking[] {
    const stmt = db.prepare(`
      SELECT 
        b.id,
        b.room_id as roomId,
        r.name as roomName,
        b.date,
        b.start_time as startTime,
        b.end_time as endTime,
        b.ic_number as icNumber
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      WHERE b.ic_number = ?
      ORDER BY b.date DESC, b.start_time DESC
    `);

    return stmt.all(icNumber) as Booking[];
  }

  /**
   * Get a specific booking by ID
   */
  getBookingById(bookingId: string): Booking | undefined {
    const stmt = db.prepare(`
      SELECT 
        b.id,
        b.room_id as roomId,
        r.name as roomName,
        b.date,
        b.start_time as startTime,
        b.end_time as endTime,
        b.ic_number as icNumber
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      WHERE b.id = ?
    `);

    return stmt.get(bookingId) as Booking | undefined;
  }

  /**
   * Get all bookings (admin function)
   */
  getAllBookings(): Booking[] {
    const stmt = db.prepare(`
      SELECT 
        b.id,
        b.room_id as roomId,
        r.name as roomName,
        b.date,
        b.start_time as startTime,
        b.end_time as endTime,
        b.ic_number as icNumber
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      ORDER BY b.date DESC, b.start_time DESC
    `);

    return stmt.all() as Booking[];
  }

  /**
   * Get all bookings for a specific month and year
   * @param month - Month number (1-12)
   * @param year - Year (e.g., 2026)
   * @param icNumber - Optional IC number to filter by specific user
   */
  getBookingsByMonth(
    month: number,
    year: number,
    icNumber?: string,
  ): Booking[] {
    // Validate month
    if (month < 1 || month > 12) {
      throw new Error("Month must be between 1 and 12");
    }

    // Format month to always be 2 digits
    const monthStr = month.toString().padStart(2, "0");

    // Create date range for the month
    const startDate = `${year}-${monthStr}-01`;

    // Calculate last day of month
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${monthStr}-${lastDay.toString().padStart(2, "0")}`;

    let query = `
      SELECT 
        b.id,
        b.room_id as roomId,
        r.name as roomName,
        b.date,
        b.start_time as startTime,
        b.end_time as endTime,
        b.ic_number as icNumber
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      WHERE b.date BETWEEN ? AND ?
    `;

    const params: (string | number)[] = [startDate, endDate];

    // Add IC number filter if provided
    if (icNumber) {
      query += " AND b.ic_number = ?";
      params.push(icNumber);
    }

    query += " ORDER BY b.date ASC, b.start_time ASC";

    const stmt = db.prepare(query);
    return stmt.all(...params) as Booking[];
  }
}
