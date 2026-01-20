"use client";

import { ICProvider } from "./ICContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <ICProvider>{children}</ICProvider>;
}
