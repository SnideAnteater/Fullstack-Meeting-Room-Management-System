import { Router } from "express";
import { RoomController } from "../controllers/roomController";
import { BookingController } from "../controllers/bookingController";

const router = Router();
const roomController = new RoomController();
const bookingController = new BookingController();

// Room routes
router.get("/rooms", roomController.getRooms.bind(roomController));
router.get("/rooms/:id", roomController.getRoomById.bind(roomController));
router.post("/rooms", roomController.createRoom.bind(roomController));

// Booking routes
router.post(
  "/bookings",
  bookingController.createBooking.bind(bookingController),
);
router.get("/bookings", bookingController.getBookings.bind(bookingController));
router.get(
  "/bookings/:id",
  bookingController.getBookingById.bind(bookingController),
);
router.get(
  "/bookings/month/:year/:month",
  bookingController.getBookingsByMonth.bind(bookingController),
);

export default router;
