import { describe, expect, it } from "vitest";
import { deckGestureTarget, isHorizontalDeckGesture } from "@/lib/deck-gesture";

describe("deliberate deck gestures", () => {
  it.each([
    [11, 0, false],
    [12, 0, true],
    [-50, 30, true],
    [30, 50, false],
    [40, 40, false],
  ])("classifies %s horizontal / %s vertical pixels as %s", (dx, dy, expected) =>
    expect(isHorizontalDeckGesture(Number(dx), Number(dy))).toBe(expected),
  );
  it("requires a useful distance and advances one card regardless of drag length", () => {
    expect(deckGestureTarget(1, 4, -47, 320)).toBe(1);
    expect(deckGestureTarget(1, 4, -48, 320)).toBe(2);
    expect(deckGestureTarget(1, 4, -79, 1440)).toBe(1);
    expect(deckGestureTarget(1, 4, -800, 1440)).toBe(2);
    expect(deckGestureTarget(1, 4, 800, 1440)).toBe(0);
  });
  it("stays at the first and last card instead of wrapping", () => {
    expect(deckGestureTarget(0, 4, 200, 390)).toBe(0);
    expect(deckGestureTarget(3, 4, -200, 390)).toBe(3);
  });
});
