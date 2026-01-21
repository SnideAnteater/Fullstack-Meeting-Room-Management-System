import { Request, Response } from "express";
import { RoomService } from "../services/roomService";
import { ApiResponse, CreateRoomRequest } from "../types";

const roomService = new RoomService();

export class RoomController {
  /**
   * GET /api/rooms?date=YYYY-MM-DD
   * Get all rooms with available time slots for a specific date
   */
  async getRooms(req: Request, res: Response): Promise<void> {
    try {
      const { date } = req.query;

      if (!date || typeof date !== "string") {
        res.status(400).json({
          success: false,
          message: "Date parameter is required (format: YYYY-MM-DD)",
        } as ApiResponse<null>);
        return;
      }

      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        res.status(400).json({
          success: false,
          message: "Invalid date format. Use YYYY-MM-DD",
        } as ApiResponse<null>);
        return;
      }

      const data = roomService.getRoomsWithSlots(date);

      res.json({
        success: true,
        data,
      } as ApiResponse<typeof data>);
    } catch (error) {
      console.error("Error getting rooms:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve rooms",
      } as ApiResponse<null>);
    }
  }

  /**
   * GET /api/rooms/:id
   * Get a specific room by ID
   */
  async getRoomById(req: Request, res: Response): Promise<void> {
    try {
      const roomId = req.params.id;

      if (!roomId || typeof roomId !== "string") {
        res.status(400).json({
          success: false,
          message: "Invalid room ID",
        } as ApiResponse<null>);
        return;
      }

      const room = roomService.getRoomById(roomId);

      if (!room) {
        res.status(404).json({
          success: false,
          message: "Room not found",
        } as ApiResponse<null>);
        return;
      }

      res.json({
        success: true,
        data: room,
      } as ApiResponse<typeof room>);
    } catch (error) {
      console.error("Error getting room:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve room",
      } as ApiResponse<null>);
    }
  }

  /**
   * POST /api/rooms
   * Create a new room
   */
  async createRoom(req: Request, res: Response): Promise<void> {
    try {
      const { name, capacity } = req.body as CreateRoomRequest;

      // Validation
      if (!name || !capacity) {
        res.status(400).json({
          success: false,
          message: "Missing required fields: name, capacity",
        } as ApiResponse<null>);
        return;
      }

      if (typeof capacity !== "number" || capacity < 1) {
        res.status(400).json({
          success: false,
          message: "Capacity must be a positive number",
        } as ApiResponse<null>);
        return;
      }

      const room = roomService.createRoom(name, capacity);

      res.status(201).json({
        success: true,
        data: room,
        message: "Room created successfully",
      } as ApiResponse<typeof room>);
    } catch (error) {
      console.error("Error creating room:", error);

      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        } as ApiResponse<null>);
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to create room",
        } as ApiResponse<null>);
      }
    }
  }
}
