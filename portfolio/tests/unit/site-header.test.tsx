import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SiteHeader from "@/components/site-header";

const route = vi.hoisted(() => ({ pathname: "/" }));

vi.mock("next/navigation", () => ({ usePathname: () => route.pathname }));
vi.mock("next/link", () => ({
  default: function MockLink(props: ComponentProps<"a">) {
    return <a {...props} onClick={(event) => event.preventDefault()} />;
  },
}));

let desktopQuery: MediaQueryList;

beforeEach(() => {
  route.pathname = "/";
  desktopQuery = Object.assign(new EventTarget(), {
    matches: false,
    media: "(min-width: 761px)",
    onchange: null,
  }) as MediaQueryList;
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn(() => desktopQuery),
  });
});

describe("site navigation", () => {
  it.each([
    ["/projetos/octocards", "Projetos", "location"],
    ["/projetos", "Projetos", "page"],
    ["/", "Início", "page"],
  ])("identifies the current page or parent section at %s", (pathname, label, current) => {
    route.pathname = pathname;
    render(<SiteHeader />);
    for (const name of ["Menu principal", "Menu para celular"]) {
      const navigation = screen.getByRole("navigation", { name });
      expect(within(navigation).getByRole("link", { name: label })).toHaveAttribute(
        "aria-current",
        current,
      );
      expect(navigation.querySelectorAll("[aria-current]")).toHaveLength(1);
    }
  });

  it("does not mark similarly prefixed routes as the current section", () => {
    route.pathname = "/projetos-arquivados";
    render(<SiteHeader />);
    expect(document.querySelectorAll("[aria-current]")).toHaveLength(0);
  });

  it("exposes an accessible toggle that opens and closes its associated mobile menu", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);
    const toggle = screen.getByRole("button", { name: "Abrir menu" });
    const mobileNavigation = screen.getByRole("navigation", { name: "Menu para celular" });

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveAttribute("aria-controls", mobileNavigation.id);
    await user.click(toggle);
    expect(screen.getByRole("button", { name: "Fechar menu" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(document.body).toHaveClass("menu-open");

    await user.click(toggle);
    expect(toggle).toHaveAccessibleName("Abrir menu");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(document.body).not.toHaveClass("menu-open");
  });

  it.each(["Projetos", "Contato"])("closes the mobile menu when %s is selected", async (label) => {
    const user = userEvent.setup();
    render(<SiteHeader />);
    const toggle = screen.getByRole("button", { name: "Abrir menu" });
    await user.click(toggle);
    const mobileNavigation = screen.getByRole("navigation", { name: "Menu para celular" });
    await user.click(within(mobileNavigation).getByRole("link", { name: label }));

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveAccessibleName("Abrir menu");
    expect(document.body).not.toHaveClass("menu-open");
  });

  it("returns keyboard focus to the toggle when Escape dismisses the menu", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);
    const toggle = screen.getByRole("button", { name: "Abrir menu" });
    await user.click(toggle);
    within(screen.getByRole("navigation", { name: "Menu para celular" }))
      .getByRole("link", { name: "Projetos" })
      .focus();
    await user.keyboard("{Escape}");

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
    expect(document.body).not.toHaveClass("menu-open");
  });

  it("updates the current-page link and closes the menu after a route change", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<SiteHeader />);
    const originalNavigation = screen.getByRole("navigation", { name: "Menu principal" });
    const originalLink = within(originalNavigation).getByRole("link", { name: "Sobre" });
    await user.click(screen.getByRole("button", { name: "Abrir menu" }));
    route.pathname = "/sobre";
    rerender(<SiteHeader />);
    expect(screen.getByRole("navigation", { name: "Menu principal" })).toBe(originalNavigation);
    expect(within(originalNavigation).getByRole("link", { name: "Sobre" })).toBe(originalLink);

    expect(screen.getByRole("button", { name: "Abrir menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(document.body).not.toHaveClass("menu-open");
    for (const label of ["Menu principal", "Menu para celular"]) {
      const navigation = screen.getByRole("navigation", { name: label });
      expect(within(navigation).getByRole("link", { name: "Sobre" })).toHaveAttribute(
        "aria-current",
        "page",
      );
      expect(within(navigation).getByRole("link", { name: "Início" })).not.toHaveAttribute(
        "aria-current",
      );
    }
  });

  it("restores scrolling when the viewport grows to desktop size", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);
    await user.click(screen.getByRole("button", { name: "Abrir menu" }));
    Object.defineProperty(desktopQuery, "matches", { value: true });
    act(() => {
      desktopQuery.dispatchEvent(new Event("change"));
    });

    expect(screen.getByRole("button", { name: "Abrir menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(document.body).not.toHaveClass("menu-open");
  });

  it("restores scrolling when the open header is removed", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<SiteHeader />);
    await user.click(screen.getByRole("button", { name: "Abrir menu" }));
    unmount();
    expect(document.body).not.toHaveClass("menu-open");
  });
});
