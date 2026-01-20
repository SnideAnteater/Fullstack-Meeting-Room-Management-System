"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIC } from "../contexts/ICContext";

export function Navigation() {
  const { formattedIC, clearICNumber } = useIC();
  const pathname = usePathname();

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      clearICNumber();
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold dark:text-white">
              Meeting Room Manager
            </h1>

            <div className="flex gap-4">
              <Link
                href="/rooms"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/rooms")
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Rooms
              </Link>
              <Link
                href="/bookings"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/bookings")
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                My Bookings
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">IC: </span>
              <span className="font-mono">{formattedIC}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
