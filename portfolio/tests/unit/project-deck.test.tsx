import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ProjectDeck from "@/components/project-deck";
import { selectedProjects } from "@/content/projects";

const projects = ["greatmaker", "curriculum", "octocards", "linkkeeper"].flatMap((id) =>
  selectedProjects.filter((project) => project.id === id),
);

describe("project deck selection", () => {
  it("exposes only the active project while retaining the four original records", () => {
    render(<ProjectDeck projects={projects} />);
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getAllByRole("article", { hidden: true })).toHaveLength(4);
    expect(screen.getByRole("heading", { name: "GreatMaker" })).toBeVisible();
    expect(screen.getByRole("status")).toHaveTextContent("Projeto 1 de 4: GreatMaker");
    expect(screen.queryByRole("link", { name: "Abrir Curriculum Studio" })).not.toBeInTheDocument();
  });
  it("keeps button focus and bounds selection at both ends", async () => {
    const user = userEvent.setup();
    render(<ProjectDeck projects={projects} />);
    const next = screen.getByRole("button", { name: "Próximo projeto" });
    await user.click(next);
    expect(next).toHaveFocus();
    expect(screen.getByRole("heading", { name: "Curriculum Studio" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Selecionar LinkKeeper" }));
    expect(next).toHaveAttribute("aria-disabled", "true");
    await user.click(next);
    expect(screen.getByRole("status")).toHaveTextContent("Projeto 4 de 4: LinkKeeper");
    expect(screen.getByRole("button", { name: "Selecionar LinkKeeper" })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });
  it("moves focus out of content that becomes inert and supports keyboard selection", async () => {
    const user = userEvent.setup();
    render(<ProjectDeck projects={projects} />);
    screen.getByRole("link", { name: "Ver repositório de GreatMaker" }).focus();
    await user.keyboard("{ArrowRight}");
    const stage = screen.getByRole("group", { name: "Explorar projetos" });
    expect(stage).toHaveFocus();
    expect(screen.getByRole("heading", { name: "Curriculum Studio" })).toBeVisible();
    await user.keyboard("{End}");
    expect(screen.getByRole("heading", { name: "LinkKeeper" })).toBeVisible();
    await user.keyboard("{Home}");
    expect(screen.getByRole("heading", { name: "GreatMaker" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Projeto anterior" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });
  it("preserves working internal and external destinations and truthful status", async () => {
    const user = userEvent.setup();
    render(<ProjectDeck projects={projects} />);
    await user.click(screen.getByRole("button", { name: "Selecionar OctoCards" }));
    const active = screen.getByRole("article");
    expect(within(active).getByRole("link", { name: "Ver documentação técnica" })).toHaveAttribute(
      "href",
      "/projetos/octocards",
    );
    expect(
      within(active).getByRole("link", { name: "Ver repositório de OctoCards" }),
    ).toHaveAttribute("rel", "noopener noreferrer");
    expect(active).toHaveTextContent("Alpha; sem instância pública confirmada");
  });
});
