"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollReveals() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};
    let requested = false;
    let scrolled = window.scrollY > 0;
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    // The first screen is server-rendered and already visible. Only download
    // the animation library when scrolling can actually reveal another section.
    const gate = new MutationObserver(startWhenNeeded);
    function onScroll() {
      scrolled = true;
      startWhenNeeded();
    }
    function startWhenNeeded() {
      if (requested || cancelled) return;
      if (reduced.matches && root.dataset.motion !== "full") {
        root.dataset.scrollReveals = "ready";
        return;
      }
      if (!scrolled) {
        root.dataset.scrollReveals = "deferred";
        return;
      }
      requested = true;
      gate.disconnect();
      reduced.removeEventListener("change", startWhenNeeded);
      window.removeEventListener("scroll", onScroll);
      delete root.dataset.scrollReveals;
      void initialize();
    }

    async function initialize() {
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        const main = document.getElementById("conteudo");
        if (cancelled || !main) return;
        gsap.registerPlugin(ScrollTrigger);

        const root = document.documentElement;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
        const revealed = new WeakSet<HTMLElement>();
        const tweens = new Map<HTMLElement, ReturnType<typeof gsap.fromTo>>();
        let context: ReturnType<typeof gsap.context> | undefined;
        let enabled: boolean | undefined;

        function configure() {
          const next = !reduced.matches || root.dataset.motion === "full";
          if (next === enabled) return;
          enabled = next;
          context?.revert();
          tweens.clear();
          if (!next) return;

          context = gsap.context(() => {
            main!.querySelectorAll<HTMLElement>("[data-scroll-reveal]").forEach((element) => {
              // Never hide content already on screen, including deep links and restored scroll.
              if (revealed.has(element) || element.getBoundingClientRect().top < innerHeight) {
                revealed.add(element);
                return;
              }
              tweens.set(
                element,
                gsap.fromTo(
                  element,
                  { opacity: 0, y: 20 },
                  {
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out",
                    clearProps: "opacity,transform",
                    onComplete: () => revealed.add(element),
                    scrollTrigger: { trigger: element, start: "top 92%", once: true },
                  },
                ),
              );
            });
          }, main!);
        }

        function revealFocused(event: FocusEvent) {
          if (!(event.target instanceof Element)) return;
          const element = event.target.closest<HTMLElement>("[data-scroll-reveal]");
          const tween = element && tweens.get(element);
          // Keyboard users can reach content before a scroll event has been processed.
          if (tween) {
            tween.scrollTrigger?.kill(false, true);
            tween.progress(1);
          }
        }

        const preference = new MutationObserver(configure);
        cleanup = () => {
          preference.disconnect();
          reduced.removeEventListener("change", configure);
          main.removeEventListener("focusin", revealFocused);
          context?.revert();
          delete root.dataset.scrollReveals;
        };
        configure();
        preference.observe(root, { attributes: true, attributeFilter: ["data-motion"] });
        reduced.addEventListener("change", configure);
        main.addEventListener("focusin", revealFocused);
        root.dataset.scrollReveals = "ready";
      } catch {
        // Content is visible by default; an unavailable enhancement must not hide it.
        cleanup();
      }
    }

    gate.observe(root, { attributes: true, attributeFilter: ["data-motion"] });
    reduced.addEventListener("change", startWhenNeeded);
    window.addEventListener("scroll", onScroll, { passive: true });
    startWhenNeeded();
    return () => {
      cancelled = true;
      gate.disconnect();
      reduced.removeEventListener("change", startWhenNeeded);
      window.removeEventListener("scroll", onScroll);
      cleanup();
      delete root.dataset.scrollReveals;
    };
  }, [pathname]);

  return null;
}
