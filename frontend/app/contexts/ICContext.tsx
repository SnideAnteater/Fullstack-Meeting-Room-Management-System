"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { formatIC, cleanIC } from "../lib/utils";

interface ICContextType {
  icNumber: string | null;
  formattedIC: string | null;
  setICNumber: (ic: string) => void;
  clearICNumber: () => void;
  isLoaded: boolean;
}

const ICContext = createContext<ICContextType | undefined>(undefined);

export function ICProvider({ children }: { children: ReactNode }) {
  const [icNumber, setICNumberState] = useState<string | null>(() => {
    // Initialize from localStorage if available
    if (typeof window !== "undefined") {
      return localStorage.getItem("userIC");
    }
    return null;
  });

  // Start as loaded since we initialize state synchronously
  const [isLoaded] = useState(true);

  const setICNumber = (ic: string) => {
    const cleanedIC = cleanIC(ic);
    localStorage.setItem("userIC", cleanedIC);
    setICNumberState(cleanedIC);
  };

  const clearICNumber = () => {
    localStorage.removeItem("userIC");
    setICNumberState(null);
  };

  const formattedIC = icNumber ? formatIC(icNumber) : null;

  // Prevent hydration mismatch
  if (!isLoaded) {
    return null;
  }

  return (
    <ICContext.Provider
      value={{ icNumber, formattedIC, setICNumber, clearICNumber, isLoaded }}
    >
      {children}
    </ICContext.Provider>
  );
}

export const useIC = () => {
  const context = useContext(ICContext);
  if (!context) {
    throw new Error("useIC must be used within ICProvider");
  }
  return context;
};
