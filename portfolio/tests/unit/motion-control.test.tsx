import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import MotionControl from "@/components/motion-control";

let media: MediaQueryList;
beforeEach(() => {
  localStorage.clear();
  media = Object.assign(new EventTarget(), { matches: true }) as MediaQueryList;
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => media),
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe("motion preference", () => {
  it("leaves normal animation enabled without adding a preference button", () => {
    Object.defineProperty(media, "matches", { value: false });
    render(<MotionControl />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute("data-motion", "system");
  });

  it("lets a reduced-motion visitor opt in, persist the choice and restore the system setting", async () => {
    const user = userEvent.setup();
    render(<MotionControl />);
    const button = screen.getByRole("button", { name: "Ativar animações" });
    expect(button).toHaveAttribute("aria-pressed", "false");
    await user.tab();
    await user.keyboard("{Enter}");
    expect(document.documentElement).toHaveAttribute("data-motion", "full");
    expect(localStorage.getItem("portfolio:full-motion")).toBe("true");
    expect(button).toHaveAccessibleName("Reduzir movimento");
    expect(button).toHaveAttribute("aria-pressed", "true");
    await user.keyboard(" ");
    expect(document.documentElement).toHaveAttribute("data-motion", "system");
    expect(localStorage.getItem("portfolio:full-motion")).toBeNull();
  });

  it("restores a previous explicit choice", async () => {
    localStorage.setItem("portfolio:full-motion", "true");
    render(<MotionControl />);
    expect(document.documentElement).toHaveAttribute("data-motion", "full");
    await userEvent.click(screen.getByRole("button", { name: "Reduzir movimento" }));
    expect(document.documentElement).toHaveAttribute("data-motion", "system");
  });

  it("reacts when the system preference changes during a visit", () => {
    Object.defineProperty(media, "matches", { value: false, configurable: true });
    render(<MotionControl />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    act(() => {
      Object.defineProperty(media, "matches", { value: true });
      media.dispatchEvent(new Event("change"));
    });
    expect(screen.getByRole("button", { name: "Ativar animações" })).toBeVisible();
  });
});
