export interface Room {
  id: string;
  name: string;
  capacity: number;
}

export interface TimeSlot {
  id: string;
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  bookedBy?: string;
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  date: string;
  startTime: string;
  endTime: string;
  icNumber: string;
}

export interface BookingRequest {
  roomId: string;
  date: string;
  startTime: string;
  icNumber: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface CreateRoomRequest {
  name: string;
  capacity: number;
}
