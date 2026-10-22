"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const container = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};

    async function initialize() {
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        if (cancelled || !container.current || !fill.current) return;
        gsap.registerPlugin(ScrollTrigger);

        const root = document.documentElement;
        const context = gsap.context(() => {}, container.current);
        let frame = 0;
        let settled = 0;
        let renderProgress = () => {};
        function queueProgress() {
          if (frame) return;
          frame = requestAnimationFrame(() => {
            frame = 0;
            renderProgress();
          });
        }
        const observer = new ResizeObserver(() => {
          queueProgress();
          // Recalculate section positions only after layout and scrolling settle.
          clearTimeout(settled);
          settled = window.setTimeout(() => ScrollTrigger.refresh(true), 100);
        });
        cleanup = () => {
          window.removeEventListener("scroll", queueProgress);
          window.removeEventListener("resize", queueProgress);
          observer.disconnect();
          cancelAnimationFrame(frame);
          clearTimeout(settled);
          context.revert();
          delete root.dataset.scrollProgress;
        };

        context.add(() => {
          gsap.set(fill.current, { scaleX: 0, transformOrigin: "left center" });
          const setProgress = gsap.quickSetter(fill.current, "scaleX");
          // Reading the native ratio cannot reset an in-progress browser scroll.
          renderProgress = () =>
            setProgress(
              Math.min(1, Math.max(0, scrollY / Math.max(1, ScrollTrigger.maxScroll(window)))),
            );
        });

        // Hide the native scrollbar only after its visual replacement is ready.
        root.dataset.scrollProgress = "ready";
        window.addEventListener("scroll", queueProgress, { passive: true });
        window.addEventListener("resize", queueProgress, { passive: true });
        observer.observe(document.body);
        renderProgress();
      } catch {
        // Preserve native scrolling and its scrollbar if enhancement is unavailable.
        cleanup();
      }
    }

    void initialize();
    return () => {
      cancelled = true;
      cleanup();
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
