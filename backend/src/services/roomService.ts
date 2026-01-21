import { db } from "../config/database";
import { Room, TimeSlot } from "../types";
import { nanoid } from "nanoid";

export class RoomService {
  /**
   * Get all rooms
   */
  getAllRooms(): Room[] {
    const stmt = db.prepare("SELECT id, name, capacity FROM rooms ORDER BY id");
    return stmt.all() as Room[];
  }

  /**
   * Get a specific room by ID
   */
  getRoomById(roomId: string): Room | undefined {
    const stmt = db.prepare(
      "SELECT id, name, capacity FROM rooms WHERE id = ?",
    );
    return stmt.get(roomId) as Room | undefined;
  }

  /**
   * Get available time slots for all rooms on a specific date
   */
  getAvailableTimeSlots(date: string): TimeSlot[] {
    const rooms = this.getAllRooms();
    const timeSlots: TimeSlot[] = [];

    // Get all bookings for the specified date
    const stmt = db.prepare(`
      SELECT id, room_id, start_time, ic_number 
      FROM bookings 
      WHERE date = ?
    `);
    const bookings = stmt.all(date) as Array<{
      id: string;
      room_id: string;
      start_time: string;
      ic_number: string;
    }>;

    // Create a map of booked slots
    const bookedSlots = new Map<string, string>();
    bookings.forEach((booking) => {
      const key = `${booking.room_id}-${booking.start_time}`;
      bookedSlots.set(key, booking.ic_number);
    });

    // Generate hourly slots from 09:00 to 18:00 for each room
    rooms.forEach((room) => {
      for (let hour = 9; hour < 18; hour++) {
        const startTime = `${hour.toString().padStart(2, "0")}:00`;
        const endTime = `${(hour + 1).toString().padStart(2, "0")}:00`;
        const slotKey = `${room.id}-${startTime}`;
        const isBooked = bookedSlots.has(slotKey);

        const bookingId = isBooked
          ? bookings.find(
              (b) => b.room_id === room.id && b.start_time === startTime,
            )?.id
          : undefined;

        timeSlots.push({
          id: bookingId ? bookingId : `${room.id}${hour}`,
          roomId: room.id,
          date,
          startTime,
          endTime,
          isBooked,
          bookedBy: isBooked ? bookedSlots.get(slotKey) : undefined,
        });
      }
    });

    return timeSlots;
  }

  /**
   * Get rooms with their available slots for a specific date
   */
  getRoomsWithSlots(date: string): { rooms: Room[]; timeSlots: TimeSlot[] } {
    const rooms = this.getAllRooms();
    const timeSlots = this.getAvailableTimeSlots(date);

    return { rooms, timeSlots };
  }

  /**
   * Create a new room
   */
  createRoom(name: string, capacity: number): Room {
    const roomId = nanoid();

    // Validation
    if (!name || name.trim().length === 0) {
      throw new Error("Room name is required");
    }

    if (!capacity || capacity < 1) {
      throw new Error("Capacity must be at least 1");
    }

    // Check if room name already exists
    const checkStmt = db.prepare(
      "SELECT id FROM rooms WHERE LOWER(name) = LOWER(?)",
    );
    const existing = checkStmt.get(name.trim());

    if (existing) {
      throw new Error("A room with this name already exists");
    }

    // Insert new room
    const insertStmt = db.prepare(`
    INSERT INTO rooms (id, name, capacity)
    VALUES (?, ?, ?)
  `);

    const result = insertStmt.run(roomId, name.trim(), capacity);
    return {
      id: roomId,
      name: name.trim(),
      capacity,
    };
  }
}
