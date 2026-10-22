"use client";

import { useEffect } from "react";

const preferenceKey = "portfolio:full-motion";

export default function MotionPreference() {
  useEffect(() => {
    const root = document.documentElement;
    function restorePreference() {
      let fullMotion = false;
      try {
        // Preserve a visitor's explicit choice from the former activation control.
        fullMotion = window.localStorage.getItem(preferenceKey) === "true";
      } catch {
        // With no readable site preference, CSS follows the system setting.
      }
      root.dataset.motion = fullMotion ? "full" : "system";
    }
    function onStorage(event: StorageEvent) {
      if (event.key === preferenceKey || event.key === null) restorePreference();
    }
    restorePreference();
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      delete root.dataset.motion;
    };
  }, []);

  return null;
}
