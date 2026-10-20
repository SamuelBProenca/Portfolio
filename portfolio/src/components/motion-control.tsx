"use client";

import { useEffect, useSyncExternalStore } from "react";

const preferenceKey = "portfolio:full-motion";
const preferenceEvent = "portfolio:motion-change";
let memoryPreference = false;

function getMotionMode() {
  let fullMotion = memoryPreference;
  try {
    fullMotion = window.localStorage.getItem(preferenceKey) === "true";
  } catch {
    // The control still works for this visit when browser storage is unavailable.
  }
  if (fullMotion) return "full";
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduced" : "system";
}

function subscribe(listener: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", listener);
  window.addEventListener("storage", listener);
  window.addEventListener(preferenceEvent, listener);
  return () => {
    media.removeEventListener("change", listener);
    window.removeEventListener("storage", listener);
    window.removeEventListener(preferenceEvent, listener);
  };
}

export default function MotionControl() {
  const mode = useSyncExternalStore(subscribe, getMotionMode, () => "system");

  useEffect(() => {
    document.documentElement.dataset.motion = mode === "full" ? "full" : "system";
    return () => {
      delete document.documentElement.dataset.motion;
    };
  }, [mode]);

  function toggleMotion() {
    memoryPreference = mode !== "full";
    try {
      if (memoryPreference) window.localStorage.setItem(preferenceKey, "true");
      else window.localStorage.removeItem(preferenceKey);
    } catch {
      // Keep the in-memory choice when storage is blocked.
    }
    window.dispatchEvent(new Event(preferenceEvent));
  }

  if (mode === "system") return null;
  return (
    <button
      className="contact-outline motion-control"
      type="button"
      aria-pressed={mode === "full"}
      onClick={toggleMotion}
    >
      {mode === "full" ? "Reduzir movimento" : "Ativar animações"}
    </button>
  );
}
