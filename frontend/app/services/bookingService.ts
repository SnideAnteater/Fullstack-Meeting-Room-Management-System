import { api } from "../lib/api";
import { Booking, BookingRequest, ApiResponse } from "../lib/types";
import { mockBookings } from "../lib/mockData";

// Type guard for mock error
interface MockError {
  useMock: boolean;
}

function isMockError(error: unknown): error is MockError {
  return typeof error === "object" && error !== null && "useMock" in error;
}

export const bookingService = {
  /**
   * Create a new booking
   */
  async createBooking(bookingData: BookingRequest): Promise<Booking> {
    try {
      const response = await api.post<ApiResponse<Booking>>(
        "/bookings",
        bookingData,
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create booking");
      }

      return response.data.data!;
    } catch (error) {
      if (isMockError(error)) {
        console.warn("Using mock booking creation");
        // Simulate successful booking
        return {
          id: Math.floor(Math.random() * 10000),
          roomId: bookingData.roomId,
          roomName: "Mock Room",
          date: bookingData.date,
          startTime: bookingData.startTime,
          endTime: `${parseInt(bookingData.startTime.split(":")[0]) + 1}:00`,
          icNumber: bookingData.icNumber,
        };
      }

      // Handle specific error responses
      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        if (axiosError.response?.data?.message) {
          throw new Error(axiosError.response.data.message);
        }
      }

      throw error;
    }
  },

  /**
   * Get all bookings for a specific IC number
   */
  async getMyBookings(icNumber: string): Promise<Booking[]> {
    try {
      const response = await api.get<ApiResponse<Booking[]>>(
        `/bookings?icNumber=${icNumber}`,
      );
      return response.data.data || [];
    } catch (error) {
      if (isMockError(error)) {
        console.warn("Using mock bookings data");
        return mockBookings.filter((b) => b.icNumber === icNumber);
      }
      throw error;
    }
  },

  /**
   * Get a specific booking by ID
   */
  async getBooking(bookingId: number): Promise<Booking | null> {
    try {
      const response = await api.get<ApiResponse<Booking>>(
        `/bookings/${bookingId}`,
      );
      return response.data.data || null;
    } catch (error) {
      if (isMockError(error)) {
        const booking = mockBookings.find((b) => b.id === bookingId);
        return booking || null;
      }
      throw error;
    }
  },
};
