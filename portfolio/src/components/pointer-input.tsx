"use client";

import { useEffect } from "react";

export default function PointerInput() {
  useEffect(() => {
    const root = document.documentElement;
    function updateInput(event: PointerEvent) {
      if (!["mouse", "touch", "pen"].includes(event.pointerType)) return;
      // Hybrid desktops may report a coarse primary pointer even while using a mouse.
      if (root.dataset.input !== event.pointerType) root.dataset.input = event.pointerType;
    }
    window.addEventListener("pointermove", updateInput, { passive: true });
    window.addEventListener("pointerdown", updateInput, { passive: true });
    return () => {
      window.removeEventListener("pointermove", updateInput);
      window.removeEventListener("pointerdown", updateInput);
      delete root.dataset.input;
    };
  }, []);

  return null;
}
