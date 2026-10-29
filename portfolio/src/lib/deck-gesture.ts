/** A deliberate horizontal gesture selects at most one neighboring project. */
export function isHorizontalDeckGesture(dx: number, dy: number) {
  return Math.abs(dx) >= 12 && Math.abs(dx) > Math.abs(dy) * 1.3;
}

export function deckGestureTarget(current: number, count: number, dx: number, width: number) {
  const threshold = Math.max(48, Math.min(80, width * 0.15));
  const step = Math.abs(dx) >= threshold ? (dx < 0 ? 1 : -1) : 0;
  return Math.max(0, Math.min(count - 1, current + step));
}
