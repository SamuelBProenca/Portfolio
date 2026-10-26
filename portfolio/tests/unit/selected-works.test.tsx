import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import SelectedWorks from "@/components/selected-works";
import { catalogProjects as selectedProjects } from "@/content/projects";

describe("selected works accordion", () => {
  it("keeps closing panels mounted for animation but excludes their content from interaction", async () => {
    const user = userEvent.setup();
    render(<SelectedWorks projects={selectedProjects} />);
    const first = screen.getByRole("button", { name: /Curriculum Studio/ });
    const panel = screen.getByRole("region", { name: /Curriculum Studio/ });
    await user.click(first);
    expect(panel).toBeInTheDocument();
    expect(panel).not.toHaveAttribute("hidden");
    expect(panel).toHaveAttribute("aria-hidden", "true");
    expect(panel).toHaveAttribute("inert");
    expect(screen.queryByRole("link", { name: /Abrir Curriculum Studio/ })).not.toBeInTheDocument();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("region", { name: /Curriculum Studio/ })).toBe(panel);
    expect(panel).not.toHaveAttribute("inert");
    expect(panel).toHaveAttribute("aria-hidden", "false");
  });

  it("honors the last selection after repeated toggles", async () => {
    const user = userEvent.setup();
    render(<SelectedWorks projects={selectedProjects} />);
    const first = screen.getByRole("button", { name: /OpsCLI/ });
    const second = screen.getByRole("button", { name: /OctoCards/ });
    await user.click(second);
    await user.click(first);
    await user.click(first);
    await user.click(second);
    expect(screen.getAllByRole("region")).toHaveLength(1);
    expect(second).toHaveAttribute("aria-expanded", "true");
    expect(first).toHaveAttribute("aria-expanded", "false");
  });

  it("starts with Curriculum Studio context and a direct app link without exposing its private repository", () => {
    render(<SelectedWorks projects={selectedProjects} />);
    const first = screen.getByRole("button", { name: /Curriculum Studio/ });
    const panel = screen.getByRole("region", { name: /Curriculum Studio/ });

    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(first).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveAttribute("aria-labelledby", first.id);
    expect(screen.getAllByRole("region")).toHaveLength(1);
    expect(within(panel).getByRole("link", { name: /Abrir Curriculum Studio/ })).toHaveAttribute(
      "href",
      "/curriculumstudio",
    );
    expect(screen.queryByRole("link", { name: /OctoCards/ })).not.toBeInTheDocument();
    expect(within(panel).getByText(/requisitos da vaga aos fatos do perfil/)).toBeVisible();
    expect(within(panel).queryByRole("link", { name: /GitHub/ })).not.toBeInTheDocument();
    expect(document.querySelector('a[href*="Curriculim_Service"]')).not.toBeInTheDocument();
  });

  it("switches project details and repository while closing the previous panel", async () => {
    const user = userEvent.setup();
    render(<SelectedWorks projects={selectedProjects} />);
    await user.click(screen.getByRole("button", { name: /OctoCards/ }));

    expect(screen.getByRole("button", { name: /Curriculum Studio/ })).toHaveAttribute(
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
    const first = screen.getByRole("button", { name: /Curriculum Studio/ });
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
    const first = screen.getByRole("button", { name: /Curriculum Studio/ });
    const second = screen.getByRole("button", { name: /OpsCLI/ });
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
