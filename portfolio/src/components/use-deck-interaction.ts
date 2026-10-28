"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { deckGestureTarget, isHorizontalDeckGesture } from "@/lib/deck-gesture";

type Animator = typeof import("motion/mini").animate;
type Animation = ReturnType<Animator>;
type ActiveAnimation = { control: Animation; element: HTMLElement; properties: string[] };
let animatorPromise: Promise<Animator | null> | undefined;

function motionAllowed() {
  return (
    document.documentElement.dataset.motion === "full" ||
    (typeof matchMedia === "function" && !matchMedia("(prefers-reduced-motion: reduce)").matches)
  );
}
function subscribeMotion(change: () => void) {
  const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  media?.addEventListener("change", change);
  const observer = new MutationObserver(change);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-motion"],
  });
  return () => {
    media?.removeEventListener("change", change);
    observer.disconnect();
  };
}
const serverMotion = () => false;

function clearAnimation(animation: ActiveAnimation) {
  animation.control.cancel();
  animation.properties.forEach((property) => animation.element.style.removeProperty(property));
}

function playAnimation(
  animator: Animator,
  element: HTMLElement,
  frames: Parameters<Animator>[1],
  active: { current: ActiveAnimation[] },
) {
  const animation = {
    control: animator(element, frames, { duration: 0.3, ease: [0.22, 1, 0.36, 1] }),
    element,
    properties: Object.keys(frames),
  };
  active.current.push(animation);
  void animation.control.then(() => {
    if (!active.current.includes(animation)) return;
    clearAnimation(animation);
    active.current = active.current.filter((item) => item !== animation);
  });
}

type Gesture = {
  id: number;
  x: number;
  y: number;
  width: number;
  blocked: boolean;
  horizontal: boolean;
};

export default function useDeckInteraction(count: number) {
  const [current, setCurrent] = useState(0);
  const [ready, setReady] = useState(false);
  const allowed = useSyncExternalStore(subscribeMotion, motionAllowed, serverMotion);
  const deck = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const animator = useRef<Animator | null>(null);
  const animations = useRef<ActiveAnimation[]>([]);
  const gesture = useRef<Gesture | null>(null);
  const suppressClickUntil = useRef(0);
  const pending = useRef<{ height: number; direction: number } | null>(null);

  function cancelAnimations() {
    animations.current.forEach(clearAnimation);
    animations.current = [];
    cards.current.forEach((card) => card?.style.removeProperty("transform"));
  }
  function animate(element: HTMLElement, frames: Parameters<Animator>[1]) {
    if (!allowed || !animator.current) return;
    playAnimation(animator.current, element, frames, animations);
  }
  function prepareMotion() {
    if (!allowed || animator.current) return;
    animatorPromise ??= import("motion/mini").then((module) => module.animate).catch(() => null);
    void animatorPromise.then((loaded) => {
      // A disconnected deck must not receive a late update after navigation.
      if (!deck.current) return;
      animator.current = loaded;
      setReady(Boolean(loaded));
    });
  }
  function select(index: number) {
    const next = Math.max(0, Math.min(count - 1, index));
    if (next === current) return;
    const height = stage.current?.getBoundingClientRect().height ?? 0;
    cancelAnimations();
    if (cards.current[current]?.contains(document.activeElement))
      stage.current?.focus({ preventScroll: true });
    pending.current = { height, direction: next > current ? 1 : -1 };
    setCurrent(next);
  }
  useLayoutEffect(() => {
    const entry = pending.current;
    pending.current = null;
    const card = cards.current[current];
    const surface = stage.current;
    if (!entry || !allowed || !animator.current || !card || !surface) return;
    playAnimation(
      animator.current,
      card,
      {
        transform: [`translateX(${entry.direction * 48}px) rotate(${entry.direction}deg)`, "none"],
        opacity: [0.72, 1],
      },
      animations,
    );
    playAnimation(
      animator.current,
      surface,
      {
        height: [entry.height, surface.getBoundingClientRect().height],
      },
      animations,
    );
  }, [current, allowed]);

  useEffect(() => {
    if (!allowed) cancelAnimations();
    return cancelAnimations;
  }, [allowed]);

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    prepareMotion();
    suppressClickUntil.current = 0;
    gesture.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      width: event.currentTarget.clientWidth,
      blocked: Boolean((event.target as Element).closest("a, button, summary, input, textarea")),
      horizontal: false,
    };
  }
  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = gesture.current;
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.horizontal) {
      if (Math.abs(dy) > 12 && !isHorizontalDeckGesture(dx, dy)) {
        gesture.current = null;
        return;
      }
      if (!isHorizontalDeckGesture(dx, dy)) return;
      if (!drag.blocked && event.pointerType === "mouse" && !window.getSelection()?.isCollapsed) {
        gesture.current = null;
        return;
      }
      drag.horizontal = true;
      cancelAnimations();
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    if (!drag.blocked && allowed) {
      const offset = Math.max(-120, Math.min(120, dx));
      cards.current[current]!.style.transform = `translateX(${offset}px) rotate(${offset / 60}deg)`;
    }
  }
  function finishPointer(event: PointerEvent<HTMLDivElement>, cancelled = false) {
    const drag = gesture.current;
    if (!drag || drag.id !== event.pointerId) return;
    gesture.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    if (!drag.horizontal) return;
    suppressClickUntil.current = Date.now() + 500;
    const next =
      cancelled || drag.blocked
        ? current
        : deckGestureTarget(current, count, event.clientX - drag.x, drag.width);
    if (next !== current) select(next);
    else {
      const card = cards.current[current];
      if (!card) return;
      const from = getComputedStyle(card).transform;
      card.style.removeProperty("transform");
      animate(card, { transform: [from, getComputedStyle(card).transform] });
    }
  }
  function onClickCapture(event: MouseEvent<HTMLDivElement>) {
    if (event.detail > 0 && Date.now() < suppressClickUntil.current) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  return {
    current,
    select,
    stage,
    cards,
    deck,
    motionReady: ready && allowed,
    prepareMotion,
    pointerHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: (event: PointerEvent<HTMLDivElement>) => finishPointer(event),
      onPointerCancel: (event: PointerEvent<HTMLDivElement>) => finishPointer(event, true),
      onLostPointerCapture: (event: PointerEvent<HTMLDivElement>) => {
        // Touch transfers implicit capture from the initial child to the stage.
        if (event.target === event.currentTarget) finishPointer(event, true);
      },
      onClickCapture,
    },
  };
}
