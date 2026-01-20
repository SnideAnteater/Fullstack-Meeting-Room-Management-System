"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useIC } from "../contexts/ICContext";
import { roomService } from "../services/roomService";
import { bookingService } from "../services/bookingService";
import { Room, TimeSlot } from "../lib/types";
import { DatePicker } from "../components/DatePicker";
import { RoomCard } from "../components/RoomCard";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingSkeleton } from "../components/LoadingSkeleton";

export default function RoomsPage() {
  const { icNumber } = useIC();
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [rooms, setRooms] = useState<Room[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const loadRooms = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await roomService.getRoomsWithSlots(selectedDate);
      setRooms(data.rooms);
      setTimeSlots(data.timeSlots);
    } catch (err) {
      setError("Failed to load rooms. Please try again.");
      console.error("Error loading rooms:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookSlot = async (roomId: number, slot: TimeSlot) => {
    if (!icNumber) {
      setError("Please login with your IC number");
      return;
    }

    if (slot.isBooked) {
      setError("This slot is already booked");
      return;
    }

    try {
      setIsBooking(true);
      setError(null);
      setSuccessMessage(null);

      await bookingService.createBooking({
        roomId,
        date: selectedDate,
        startTime: slot.startTime,
        icNumber,
      });

      setSuccessMessage(`Successfully booked ${slot.startTime} slot!`);

      // Reload rooms to update availability
      await loadRooms();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Failed to book slot. It may already be taken.";
      setError(errorMsg);
      console.error("Error booking slot:", err);
    } finally {
      setIsBooking(false);
    }
  };

  const getTimeSlotsForRoom = (roomId: number): TimeSlot[] => {
    return timeSlots.filter((slot) => slot.roomId === roomId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold dark:text-white mb-2">
            Available Meeting Rooms
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Select a date and choose an available time slot to book
          </p>
        </div>

        <div className="mb-6 max-w-xs">
          <DatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            label="Select Date"
          />
        </div>

        {successMessage && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              {successMessage}
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onRetry={loadRooms} />
          </div>
        )}

        {isLoading ? (
          <LoadingSkeleton />
        ) : rooms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No rooms available for the selected date
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                timeSlots={getTimeSlotsForRoom(room.id)}
                onBookSlot={handleBookSlot}
                isLoading={isBooking}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
