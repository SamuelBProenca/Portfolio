import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import SelectedWorks from "@/components/selected-works";
import { selectedProjects } from "@/content/projects";

describe("selected works accordion", () => {
  it("starts with OpsCLI expanded and keeps other project links hidden", () => {
    render(<SelectedWorks projects={selectedProjects} />);
    const first = screen.getByRole("button", { name: /OpsCLI/ });
    const panel = screen.getByRole("region", { name: /OpsCLI/ });

    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(first).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveAttribute("aria-labelledby", first.id);
    expect(screen.getAllByRole("region")).toHaveLength(1);
    expect(within(panel).getByRole("link", { name: /OpsCLI/ })).toHaveAttribute(
      "href",
      "https://github.com/SamuelBProenca/OpsCLI",
    );
    expect(screen.queryByRole("link", { name: /OctoCards/ })).not.toBeInTheDocument();
    expect(within(panel).getByText(/código da ferramenta ainda não está disponível/)).toBeVisible();
  });

  it("switches project details and repository while closing the previous panel", async () => {
    const user = userEvent.setup();
    render(<SelectedWorks projects={selectedProjects} />);
    await user.click(screen.getByRole("button", { name: /OctoCards/ }));

    expect(screen.getByRole("button", { name: /OpsCLI/ })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getAllByRole("region")).toHaveLength(1);
    const api = screen.getByRole("region", { name: /OctoCards/ });
    expect(
      within(api).getByRole("heading", { name: "Do repositório para o portfólio." }),
    ).toBeVisible();
    expect(within(api).getByRole("link", { name: /OctoCards/ })).toHaveAttribute(
      "href",
      "https://github.com/SamuelBProenca/OctoCards",
    );

    await user.click(screen.getByRole("button", { name: /Design Patterns Dojo/ }));
    const dojo = screen.getByRole("region", { name: /Design Patterns Dojo/ });
    expect(screen.getAllByRole("region")).toHaveLength(1);
    expect(within(dojo).getByText(/Adapter, Builder, Decorator/)).toBeVisible();
    expect(within(dojo).getByRole("link")).toHaveAttribute(
      "href",
      "https://github.com/SamuelBProenca/DesignPatternsDojo",
    );
  });

  it("allows closing the active project and reopening it with the keyboard", async () => {
    const user = userEvent.setup();
    render(<SelectedWorks projects={selectedProjects} />);
    const first = screen.getByRole("button", { name: /OpsCLI/ });
    await user.click(first);
    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("region")).not.toBeInTheDocument();

    await user.keyboard("{Enter}");
    expect(first).toHaveAttribute("aria-expanded", "true");
    await user.keyboard(" ");
    expect(first).toHaveAttribute("aria-expanded", "false");
  });

  it("moves keyboard focus between project headers without changing the selection", async () => {
    const user = userEvent.setup();
    render(<SelectedWorks projects={selectedProjects} />);
    const first = screen.getByRole("button", { name: /OpsCLI/ });
    const second = screen.getByRole("button", { name: /OctoCards/ });
    const last = screen.getByRole("button", { name: /Design Patterns Dojo/ });
    first.focus();
    await user.keyboard("{ArrowDown}");
    expect(second).toHaveFocus();
    await user.keyboard("{End}");
    expect(last).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(first).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(last).toHaveFocus();
    await user.keyboard("{Home}");
    expect(first).toHaveFocus();
    expect(first).toHaveAttribute("aria-expanded", "true");
    await user.keyboard("{ArrowDown}{Enter}");
    expect(second).toHaveFocus();
    expect(second).toHaveAttribute("aria-expanded", "true");
  });
});
