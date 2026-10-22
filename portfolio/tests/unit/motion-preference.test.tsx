import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import MotionPreference from "@/components/motion-preference";

beforeEach(() => localStorage.clear());
afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

describe("automatic motion preference", () => {
  it("keeps animation automatic with the system preference and renders no control", () => {
    const { container } = render(<MotionPreference />);
    expect(container).toBeEmptyDOMElement();
    expect(document.documentElement).toHaveAttribute("data-motion", "system");
    expect(localStorage.getItem("portfolio:full-motion")).toBeNull();
  });

  it("preserves the explicit opt-in saved by the former activation button", () => {
    localStorage.setItem("portfolio:full-motion", "true");
    render(<MotionPreference />);
    expect(document.documentElement).toHaveAttribute("data-motion", "full");
  });

  it("restores changes from another tab and cleans up on unmount", () => {
    const { unmount } = render(<MotionPreference />);
    act(() => {
      localStorage.setItem("portfolio:full-motion", "true");
      window.dispatchEvent(new StorageEvent("storage", { key: "portfolio:full-motion" }));
    });
    expect(document.documentElement).toHaveAttribute("data-motion", "full");
    act(() => {
      localStorage.clear();
      window.dispatchEvent(new StorageEvent("storage", { key: null }));
    });
    expect(document.documentElement).toHaveAttribute("data-motion", "system");
    unmount();
    expect(document.documentElement).not.toHaveAttribute("data-motion");
    act(() => {
      localStorage.setItem("portfolio:full-motion", "true");
      window.dispatchEvent(new StorageEvent("storage", { key: "portfolio:full-motion" }));
    });
    expect(document.documentElement).not.toHaveAttribute("data-motion");
  });

  it("uses the system preference if storage cannot be read", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Storage blocked", "SecurityError");
    });
    render(<MotionPreference />);
    expect(document.documentElement).toHaveAttribute("data-motion", "system");
  });
});
