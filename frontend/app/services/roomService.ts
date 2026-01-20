import { api } from "../lib/api";
import { Room, TimeSlot, BookingRequest, ApiResponse } from "../lib/types";
import { mockRooms, mockTimeSlots } from "../lib/mockData";

export const roomService = {
  /**
   * Get all rooms with available time slots for a specific date
   */
  async getRoomsWithSlots(
    date: string,
  ): Promise<{ rooms: Room[]; timeSlots: TimeSlot[] }> {
    try {
      const response = await api.get<
        ApiResponse<{ rooms: Room[]; timeSlots: TimeSlot[] }>
      >(`/rooms?date=${date}`);
      return response.data.data || { rooms: [], timeSlots: [] };
    } catch (error: any) {
      if (error.useMock) {
        console.warn("Using mock rooms data");
        return {
          rooms: mockRooms,
          timeSlots: mockTimeSlots(date),
        };
      }
      throw error;
    }
  },

  /**
   * Get a specific room by ID
   */
  async getRoom(roomId: number): Promise<Room | null> {
    try {
      const response = await api.get<ApiResponse<Room>>(`/rooms/${roomId}`);
      return response.data.data || null;
    } catch (error: any) {
      if (error.useMock) {
        const room = mockRooms.find((r) => r.id === roomId);
        return room || null;
      }
      throw error;
    }
  },
};
