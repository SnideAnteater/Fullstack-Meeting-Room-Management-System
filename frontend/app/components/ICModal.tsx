"use client";

import { useState } from "react";
import { useIC } from "../contexts/ICContext";
import { z } from "zod";

// Malaysian IC validation
const icSchema = z
  .string()
  .regex(/^\d{12}$/, "IC Number must be exactly 12 digits");

export function ICModal() {
  const { icNumber, setICNumber } = useIC();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  if (icNumber) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedIC = input.replace(/-/g, "");

    try {
      icSchema.parse(cleanedIC);
      setICNumber(cleanedIC);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0].message);
      } else {
        setError("Invalid IC Number");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Welcome</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Please enter your Malaysian IC Number to continue
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError("");
            }}
            placeholder="YYMMDD-PB-###G or 12 digits"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-2 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={14}
            autoFocus
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Continue
          </button>
        </form>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
          Format: 12 digits (e.g., 990101011234)
        </p>
      </div>
    </div>
  );
}
