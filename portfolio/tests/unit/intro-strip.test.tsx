import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import IntroStrip from "@/components/intro-strip";

describe("specialty marquee", () => {
  it("exposes specialties once to assistive technology and hides the looping copy", () => {
    render(<IntroStrip />);
    const strip = screen.getByRole("region", { name: "Especialidades" });
    expect(within(strip).getAllByRole("listitem")).toHaveLength(4);
    expect(
      within(strip)
        .getAllByRole("listitem")
        .map((item) => item.textContent),
    ).toEqual(["Backend+", "Automação+", "Arquitetura+", "Infraestrutura+"]);
    expect(within(strip).getAllByRole("list")).toHaveLength(1);
    const groups = strip.querySelectorAll("ul");
    expect(groups).toHaveLength(2);
    expect(groups[1]).toHaveAttribute("aria-hidden", "true");
    expect(groups[1].textContent).toBe(groups[0].textContent);
  });

  it("pauses and resumes with the keyboard without replacing the animated track", async () => {
    const user = userEvent.setup();
    render(<IntroStrip />);
    const button = screen.getByRole("button", { name: "Pausar faixa de especialidades" });
    const track = document.querySelector(".intro-strip__track");
    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveAccessibleName("Retomar faixa de especialidades");
    expect(track).toHaveAttribute("data-paused", "true");
    await user.keyboard(" ");
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(track).toHaveAttribute("data-paused", "false");
    expect(document.querySelector(".intro-strip__track")).toBe(track);
  });
});
