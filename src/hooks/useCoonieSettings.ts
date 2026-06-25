"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ACTIVE_PARTY_COOKIE,
  DEFAULT_SETTINGS,
  SETTINGS_STORAGE_KEY,
  getActiveParty,
  mergeSettings,
  serializeActiveParty,
  type CoonieSettings
} from "@/lib/settings";

function writeBrowserSettings(settings: CoonieSettings) {
  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  document.documentElement.dataset.theme = settings.theme;
  document.documentElement.dataset.density = settings.density;
  document.documentElement.dataset.animations = settings.animationsEnabled ? "on" : "off";
  document.cookie = `${ACTIVE_PARTY_COOKIE}=${serializeActiveParty(settings)}; path=/; max-age=31536000; SameSite=Lax`;
}

export function useCoonieSettings() {
  const [settings, setSettingsState] = useState<CoonieSettings>(DEFAULT_SETTINGS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    let next = DEFAULT_SETTINGS;
    if (stored) {
      try {
        next = mergeSettings(JSON.parse(stored));
      } catch {
        next = DEFAULT_SETTINGS;
      }
    }
    setSettingsState(next);
    writeBrowserSettings(next);
    setMounted(true);
  }, []);

  const setSettings = useCallback((updater: CoonieSettings | ((current: CoonieSettings) => CoonieSettings)) => {
    setSettingsState((current) => {
      const next = mergeSettings(typeof updater === "function" ? updater(current) : updater);
      writeBrowserSettings(next);
      return next;
    });
  }, []);

  const resetAllSettings = useCallback(() => {
    window.localStorage.removeItem(SETTINGS_STORAGE_KEY);
    writeBrowserSettings(DEFAULT_SETTINGS);
    setSettingsState(DEFAULT_SETTINGS);
  }, []);

  const activeParty = useMemo(() => getActiveParty(settings), [settings]);

  return {
    settings,
    activeParty,
    mounted,
    setSettings,
    resetAllSettings
  };
}
