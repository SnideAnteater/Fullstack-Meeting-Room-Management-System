import { api } from "../lib/api";
import { Room, TimeSlot, CreateRoomRequest, ApiResponse } from "../lib/types";

export const roomService = {
  /**
   * Get all rooms with available time slots for a specific date
   */
  async getRoomsWithSlots(
    date: string,
  ): Promise<{ rooms: Room[]; timeSlots: TimeSlot[] }> {
    const response = await api.get<
      ApiResponse<{ rooms: Room[]; timeSlots: TimeSlot[] }>
    >(`/rooms?date=${date}`);
    return response.data.data || { rooms: [], timeSlots: [] };
  },

  /**
   * Get a specific room by ID
   */
  async getRoom(roomId: string): Promise<Room | null> {
    const response = await api.get<ApiResponse<Room>>(`/rooms/${roomId}`);
    return response.data.data || null;
  },

  /**
   * Create a new room
   */
  async createRoom(roomData: CreateRoomRequest): Promise<Room> {
    const response = await api.post<ApiResponse<Room>>("/rooms", roomData);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to create room");
    }

    return response.data.data!;
  },
};
