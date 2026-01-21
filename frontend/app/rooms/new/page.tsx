"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { roomService } from "../../services/roomService";
import { ErrorMessage } from "../../components/ErrorMessage";

export default function NewRoomPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    capacity?: string;
  }>({});

  const validateName = (name: string): string | undefined => {
    if (!name.trim()) {
      return "Room name is required";
    }
    if (name.length > 100) {
      return "Room name must be 100 characters or less";
    }
    if (!/^[a-zA-Z0-9\s]+$/.test(name)) {
      return "Room name can only contain letters, numbers, and spaces";
    }
    return undefined;
  };

  const validateCapacity = (capacity: string): string | undefined => {
    if (!capacity) {
      return "Capacity is required";
    }
    const num = parseInt(capacity);
    if (isNaN(num)) {
      return "Capacity must be a number";
    }
    if (num < 1 || num > 100) {
      return "Capacity must be between 1 and 100";
    }
    return undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const nameError = validateName(formData.name);
    const capacityError = validateCapacity(formData.capacity);

    if (nameError || capacityError) {
      setValidationErrors({
        name: nameError,
        capacity: capacityError,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setValidationErrors({});

      await roomService.createRoom({
        name: formData.name.trim(),
        capacity: parseInt(formData.capacity),
      });

      // Redirect to rooms page on success
      router.push("/rooms");
    } catch (err) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to create room. Please try again.",
      );
      console.error("Error creating room:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameChange = (value: string) => {
    setFormData({ ...formData, name: value });
    if (validationErrors.name) {
      setValidationErrors({ ...validationErrors, name: validateName(value) });
    }
  };

  const handleCapacityChange = (value: string) => {
    setFormData({ ...formData, capacity: value });
    if (validationErrors.capacity) {
      setValidationErrors({
        ...validationErrors,
        capacity: validateCapacity(value),
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold dark:text-white mb-2">
            Add New Room
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create a new meeting room for your coworking space
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          {error && (
            <div className="mb-6">
              <ErrorMessage message={error} onRetry={() => setError(null)} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Room Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Room Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  validationErrors.name
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="e.g., Conference Room A"
                maxLength={100}
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.name}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {formData.name.length}/100 characters (alphanumeric and spaces
                only)
              </p>
            </div>

            {/* Capacity */}
            <div>
              <label
                htmlFor="capacity"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Capacity *
              </label>
              <input
                type="number"
                id="capacity"
                value={formData.capacity}
                onChange={(e) => handleCapacityChange(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  validationErrors.capacity
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="e.g., 10"
                min="1"
                max="100"
              />
              {validationErrors.capacity && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.capacity}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Number of people the room can accommodate (1-100)
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSubmitting ? "Creating..." : "Create Room"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/rooms")}
                disabled={isSubmitting}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Guidelines */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
            Guidelines
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1 list-disc list-inside">
            <li>Room names must be unique</li>
            <li>
              Use descriptive names (e.g., "Executive Suite" or "Room 401")
            </li>
            <li>Capacity should reflect comfortable seating arrangements</li>
            <li>Once created, rooms cannot be deleted (contact admin)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
