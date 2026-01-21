import { Request, Response } from "express";
import { BookingService } from "../services/bookingService";
import { ApiResponse, BookingRequest } from "../types";

const bookingService = new BookingService();

export class BookingController {
  /**
   * POST /api/bookings
   * Create a new booking
   */
  async createBooking(req: Request, res: Response): Promise<void> {
    try {
      const { roomId, date, startTime, icNumber } = req.body as BookingRequest;

      // Validation
      if (!roomId || !date || !startTime || !icNumber) {
        res.status(400).json({
          success: false,
          message: "Missing required fields: roomId, date, startTime, icNumber",
        } as ApiResponse<null>);
        return;
      }

      // Validate IC number format (12 digits)
      if (!/^\d{12}$/.test(icNumber)) {
        res.status(400).json({
          success: false,
          message: "IC number must be 12 digits",
        } as ApiResponse<null>);
        return;
      }

      // Validate date format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        res.status(400).json({
          success: false,
          message: "Invalid date format. Use YYYY-MM-DD",
        } as ApiResponse<null>);
        return;
      }

      // Validate time format
      if (!/^\d{2}:\d{2}$/.test(startTime)) {
        res.status(400).json({
          success: false,
          message: "Invalid time format. Use HH:mm",
        } as ApiResponse<null>);
        return;
      }

      const booking = bookingService.createBooking({
        roomId,
        date,
        startTime,
        icNumber,
      });

      res.status(201).json({
        success: true,
        data: booking,
        message: "Booking created successfully",
      } as ApiResponse<typeof booking>);
    } catch (error) {
      console.error("Error creating booking:", error);

      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        } as ApiResponse<null>);
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to create booking",
        } as ApiResponse<null>);
      }
    }
  }

  /**
   * GET /api/bookings?icNumber=XXX
   * Get all bookings for a specific IC number
   */
  async getBookings(req: Request, res: Response): Promise<void> {
    try {
      const { icNumber } = req.query;

      if (!icNumber || typeof icNumber !== "string") {
        res.status(400).json({
          success: false,
          message: "IC number parameter is required",
        } as ApiResponse<null>);
        return;
      }

      const bookings = bookingService.getBookingsByIcNumber(icNumber);

      res.json({
        success: true,
        data: bookings,
      } as ApiResponse<typeof bookings>);
    } catch (error) {
      console.error("Error getting bookings:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve bookings",
      } as ApiResponse<null>);
    }
  }

  /**
   * GET /api/bookings/:id
   * Get a specific booking by ID
   */
  async getBookingById(req: Request, res: Response): Promise<void> {
    try {
      const bookingId = req.params.id;

      if (!bookingId || typeof bookingId !== "string") {
        res.status(400).json({
          success: false,
          message: "Invalid booking ID",
        } as ApiResponse<null>);
        return;
      }

      const booking = bookingService.getBookingById(bookingId);

      if (!booking) {
        res.status(404).json({
          success: false,
          message: "Booking not found",
        } as ApiResponse<null>);
        return;
      }

      res.json({
        success: true,
        data: booking,
      } as ApiResponse<typeof booking>);
    } catch (error) {
      console.error("Error getting booking:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve booking",
      } as ApiResponse<null>);
    }
  }

  /**
   * GET /api/bookings/month/:year/:month?icNumber=XXX
   * example: /api/bookings/month/2024/6?icNumber=123456789012
   * example: /api/bookings/month/2024/01
   * Get all bookings for a specific month and year
   */
  async getBookingsByMonth(req: Request, res: Response): Promise<void> {
    try {
      const { year, month } = req.params;
      const { icNumber } = req.query;

      const yearNum = parseInt(year);
      const monthNum = parseInt(month);

      // Validation
      if (isNaN(yearNum) || isNaN(monthNum)) {
        res.status(400).json({
          success: false,
          message: "Invalid year or month",
        } as ApiResponse<null>);
        return;
      }

      if (monthNum < 1 || monthNum > 12) {
        res.status(400).json({
          success: false,
          message: "Month must be between 1 and 12",
        } as ApiResponse<null>);
        return;
      }

      const bookings = bookingService.getBookingsByMonth(
        monthNum,
        yearNum,
        icNumber as string | undefined,
      );

      res.json({
        success: true,
        data: bookings,
        message: `Found ${bookings.length} booking(s) for ${year}-${month.toString().padStart(2, "0")}`,
      } as ApiResponse<typeof bookings>);
    } catch (error) {
      console.error("Error getting bookings by month:", error);

      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        } as ApiResponse<null>);
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to retrieve bookings",
        } as ApiResponse<null>);
      }
    }
  }
}
