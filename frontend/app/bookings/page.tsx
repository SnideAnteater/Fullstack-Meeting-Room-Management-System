"use client";

import { useState, useEffect } from "react";
import { useIC } from "../contexts/ICContext";
import { bookingService } from "../services/bookingService";
import { Booking } from "../lib/types";
import { BookingCard } from "../components/BookingCard";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingSkeleton } from "../components/LoadingSkeleton";

export default function BookingsPage() {
  const { icNumber } = useIC();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (icNumber) {
      loadBookings();
    }
  }, [icNumber]);

  const loadBookings = async () => {
    if (!icNumber) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await bookingService.getMyBookings(icNumber);
      setBookings(data);
    } catch (err) {
      setError("Failed to load bookings. Please try again.");
      console.error("Error loading bookings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold dark:text-white mb-2">
            My Bookings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View all your meeting room reservations
          </p>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onRetry={loadBookings} />
          </div>
        )}

        {isLoading ? (
          <LoadingSkeleton />
        ) : bookings.length === 0 ? (
          <div className="text-center py-16">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              strokeWidth={1.5}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No bookings yet
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              You haven&apos;t made any room reservations. Visit the Rooms page
              to book a slot.
            </p>
            <div className="mt-6">
              <a
                href="/rooms"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Browse Rooms
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
