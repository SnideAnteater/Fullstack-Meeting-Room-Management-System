export interface Room {
  id: number;
  name: string;
  capacity: number;
}

export interface TimeSlot {
  id: number;
  roomId: number;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isBooked: boolean;
  bookedBy?: string; // IC Number
}

export interface Booking {
  id: number;
  roomId: number;
  roomName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  icNumber: string;
}

export interface BookingRequest {
  roomId: number;
  date: string;
  startTime: string;
  icNumber: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
