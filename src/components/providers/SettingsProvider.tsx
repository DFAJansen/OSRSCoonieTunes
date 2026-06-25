"use client";

import { useCoonieSettings } from "@/hooks/useCoonieSettings";

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  useCoonieSettings();
  return <>{children}</>;
}
