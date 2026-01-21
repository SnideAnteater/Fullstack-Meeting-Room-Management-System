"use client";

import { useState, useEffect, useCallback } from "react";
import { useIC } from "../contexts/ICContext";
import { bookingService } from "../services/bookingService";
import { Booking } from "../lib/types";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingSkeleton } from "../components/LoadingSkeleton";

export default function BookingsPage() {
  const { icNumber } = useIC();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1,
  );
  const [selectedDateBookings, setSelectedDateBookings] = useState<
    Booking[] | null
  >(null);

  const loadBookings = useCallback(async () => {
    if (!icNumber) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await bookingService.getBookingsByMonth(
        selectedYear,
        selectedMonth,
        icNumber,
      );
      setBookings(data);
    } catch (err) {
      setError("Failed to load bookings. Please try again.");
      console.error("Error loading bookings:", err);
    } finally {
      setIsLoading(false);
    }
  }, [icNumber, selectedYear, selectedMonth]);

  useEffect(() => {
    if (icNumber) {
      loadBookings();
    }
  }, [icNumber, loadBookings]);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const getBookingsForDate = (date: number): Booking[] => {
    const dateStr = `${selectedYear}-${selectedMonth.toString().padStart(2, "0")}-${date.toString().padStart(2, "0")}`;
    return bookings.filter((b) => b.date === dateStr);
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from(
    { length: 10 },
    (_, i) => currentDate.getFullYear() - 2 + i,
  );

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth);
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDay + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold dark:text-white mb-2">
            My Bookings Calendar
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View your meeting room reservations by month
          </p>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onRetry={loadBookings} />
          </div>
        )}

        {/* Month/Year Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <button
              onClick={handlePrevMonth}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              ← Previous
            </button>

            <div className="flex gap-4">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {monthNames.map((month, index) => (
                  <option key={month} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleNextMonth}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* Calendar Grid */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="bg-gray-50 dark:bg-gray-800 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      {day}
                    </div>
                  ),
                )}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
                {calendarDays.map((day, index) => {
                  if (!day) {
                    return (
                      <div
                        key={index}
                        className="bg-gray-50 dark:bg-gray-900 min-h-32"
                      />
                    );
                  }

                  const dayBookings = getBookingsForDate(day);
                  const displayBookings = dayBookings.slice(0, 3);
                  const hasMore = dayBookings.length > 3;

                  return (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 min-h-32 p-2 relative"
                    >
                      <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        {day}
                      </div>
                      <div className="space-y-1">
                        {displayBookings.map((booking) => (
                          <div
                            key={booking.id}
                            className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded px-2 py-1 truncate"
                            title={`${booking.roomName} - ${booking.startTime}`}
                          >
                            <div className="font-medium truncate">
                              {booking.roomName}
                            </div>
                            <div className="text-blue-600 dark:text-blue-300">
                              {booking.startTime}
                            </div>
                          </div>
                        ))}
                        {hasMore && (
                          <button
                            onClick={() => setSelectedDateBookings(dayBookings)}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline w-full text-left"
                          >
                            +{dayBookings.length - 3} more
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {bookings.length === 0 && (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg mt-6">
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
                  No bookings this month
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  You haven&apos;t made any room reservations for{" "}
                  {monthNames[selectedMonth - 1]} {selectedYear}
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
            )}
          </>
        )}

        {/* View More Modal */}
        {selectedDateBookings && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedDateBookings(null)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  All Bookings
                </h3>
                <button
                  onClick={() => setSelectedDateBookings(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    strokeWidth={2}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="px-6 py-4 space-y-3">
                {selectedDateBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {booking.roomName}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {booking.startTime} - {booking.endTime}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      {booking.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
