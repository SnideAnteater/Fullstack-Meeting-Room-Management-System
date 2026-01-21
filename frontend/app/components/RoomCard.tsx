"use client";

import { Room, TimeSlot } from "../lib/types";

interface RoomCardProps {
  room: Room;
  timeSlots: TimeSlot[];
  onBookSlot: (roomId: string, slot: TimeSlot) => void;
  isLoading?: boolean;
}

export function RoomCard({
  room,
  timeSlots,
  onBookSlot,
  isLoading,
}: RoomCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold dark:text-white mb-1">
          {room.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Capacity: {room.capacity} people
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Available Slots:
        </p>
        <div className="grid grid-cols-3 gap-2">
          {timeSlots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => onBookSlot(room.id, slot)}
              disabled={slot.isBooked || isLoading}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                slot.isBooked
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  : "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
              } ${isLoading ? "opacity-50 cursor-wait" : ""}`}
            >
              {slot.startTime}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
