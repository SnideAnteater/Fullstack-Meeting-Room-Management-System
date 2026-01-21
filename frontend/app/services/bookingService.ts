import { api } from "../lib/api";
import { Booking, BookingRequest, ApiResponse } from "../lib/types";

export const bookingService = {
  /**
   * Create a new booking
   */
  async createBooking(bookingData: BookingRequest): Promise<Booking> {
    const response = await api.post<ApiResponse<Booking>>(
      "/bookings",
      bookingData,
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to create booking");
    }

    return response.data.data!;
  },

  /**
   * Get all bookings for a specific IC number
   */
  async getMyBookings(icNumber: string): Promise<Booking[]> {
    const response = await api.get<ApiResponse<Booking[]>>(
      `/bookings?icNumber=${icNumber}`,
    );
    return response.data.data || [];
  },

  /**
   * Get a specific booking by ID
   */
  async getBooking(bookingId: string): Promise<Booking | null> {
    const response = await api.get<ApiResponse<Booking>>(
      `/bookings/${bookingId}`,
    );
    return response.data.data || null;
  },

  /**
   * Get all bookings for a specific month and year
   */
  async getBookingsByMonth(
    year: number,
    month: number,
    icNumber: string,
  ): Promise<Booking[]> {
    const response = await api.get<ApiResponse<Booking[]>>(
      `/bookings/month/${year}/${month}?icNumber=${icNumber}`,
    );
    return response.data.data || [];
  },
};
