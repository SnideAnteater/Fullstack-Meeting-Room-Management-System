"use client";

import { format } from "date-fns";

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  label?: string;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  label,
  className = "",
}: DatePickerProps) {
  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium dark:text-gray-200">
          {label}
        </label>
      )}
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={today}
        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
      />
    </div>
  );
}
