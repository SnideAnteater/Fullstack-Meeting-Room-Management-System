import { Room, TimeSlot, Booking } from "./types";

export const mockRooms: Room[] = [
  { id: 1, name: "Conference Room A", capacity: 10 },
  { id: 2, name: "Meeting Room B", capacity: 6 },
  { id: 3, name: "Huddle Room C", capacity: 4 },
];

// Generate hourly time slots from 09:00 to 18:00 (9 slots)
const generateTimeSlots = (roomId: number, date: string): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let hour = 9; hour < 18; hour++) {
    const startTime = `${hour.toString().padStart(2, "0")}:00`;
    const endTime = `${(hour + 1).toString().padStart(2, "0")}:00`;

    // Randomly book some slots for demonstration
    const isBooked = Math.random() > 0.7;

    slots.push({
      id: parseInt(`${roomId}${hour}`),
      roomId,
      date,
      startTime,
      endTime,
      isBooked,
      bookedBy: isBooked ? "990101-01-1234" : undefined,
    });
  }
  return slots;
};

export const mockTimeSlots = (date: string): TimeSlot[] => {
  return mockRooms.flatMap((room) => generateTimeSlots(room.id, date));
};

export const mockBookings: Booking[] = [
  {
    id: 1,
    roomId: 1,
    roomName: "Conference Room A",
    date: "2026-01-21",
    startTime: "10:00",
    endTime: "11:00",
    icNumber: "990101-01-1234",
  },
  {
    id: 2,
    roomId: 2,
    roomName: "Meeting Room B",
    date: "2026-01-22",
    startTime: "14:00",
    endTime: "15:00",
    icNumber: "990101-01-1234",
  },
  {
    id: 3,
    roomId: 3,
    roomName: "Huddle Room C",
    date: "2026-01-20",
    startTime: "09:00",
    endTime: "10:00",
    icNumber: "990101-01-1234",
  },
];
