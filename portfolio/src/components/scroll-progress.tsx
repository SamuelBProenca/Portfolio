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
        let refresh = () => {};
        const observer = new ResizeObserver(() => {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(() => {
            refresh();
            // Recalculate section positions once the accordion's height settles.
            clearTimeout(settled);
            settled = window.setTimeout(() => ScrollTrigger.refresh(true), 100);
          });
        });
        cleanup = () => {
          observer.disconnect();
          cancelAnimationFrame(frame);
          clearTimeout(settled);
          context.revert();
          delete root.dataset.scrollProgress;
        };

        context.add(() => {
          gsap.set(fill.current, { scaleX: 0, transformOrigin: "left center" });
          const setProgress = gsap.quickSetter(fill.current, "scaleX");
          const progress = ScrollTrigger.create({
            id: "page-reading-progress",
            start: 0,
            end: () => Math.max(1, ScrollTrigger.maxScroll(window)),
            onUpdate: (self) => setProgress(self.progress),
            onRefresh: (self) => setProgress(self.progress),
          });
          refresh = () => progress.refresh();
        });

        // Hide the native scrollbar only after its visual replacement is ready.
        root.dataset.scrollProgress = "ready";
        observer.observe(document.body);
        refresh();
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
