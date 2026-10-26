"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const container = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!fill.current) return;
    const root = document.documentElement;
    let frame = 0;
    function renderProgress() {
      const maximum = Math.max(1, root.scrollHeight - innerHeight);
      const ratio = Math.min(1, Math.max(0, scrollY / maximum));
      if (fill.current) fill.current.style.transform = `scaleX(${ratio})`;
    }
    function queueProgress() {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        renderProgress();
      });
    }
    // Reading progress needs no animation library or network request.
    const observer =
      typeof ResizeObserver === "function" ? new ResizeObserver(queueProgress) : null;
    renderProgress();
    root.dataset.scrollProgress = "ready";
    window.addEventListener("scroll", queueProgress, { passive: true });
    window.addEventListener("resize", queueProgress, { passive: true });
    observer?.observe(document.body);
    return () => {
      window.removeEventListener("scroll", queueProgress);
      window.removeEventListener("resize", queueProgress);
      observer?.disconnect();
      cancelAnimationFrame(frame);
      delete root.dataset.scrollProgress;
    };
  }, []);

  return (
    <div className="topline scroll-progress" ref={container} aria-hidden="true">
      <div className="scroll-progress__track">
        <span className="scroll-progress__fill" ref={fill} />
      </div>
    </div>
  );
}
