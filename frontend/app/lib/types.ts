export interface Room {
  id: string;
  name: string;
  capacity: number;
}

export interface TimeSlot {
  id: string;
  roomId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isBooked: boolean;
  bookedBy?: string; // IC Number
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  icNumber: string;
}

export interface BookingRequest {
  roomId: string;
  date: string;
  startTime: string;
  icNumber: string;
}

export interface CreateRoomRequest {
  name: string;
  capacity: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
