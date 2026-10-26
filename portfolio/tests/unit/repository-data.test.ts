// @vitest-environment node
import { describe, it, expect, vi } from "vitest";
import { fetchRepositoryCard, parseRepositoryCard } from "@/lib/repository-data";
import { loadProjectCatalog } from "@/lib/project-catalog";
import { catalogProjects, selectedProjects, selectFeaturedProjects } from "@/content/projects";
import snapshot from "@/content/repository-snapshot.json";

const identity = { owner: "SamuelBProenca", name: "OctoCards" };
const card = snapshot.cards.find((item) => item.name === "OctoCards")!;
const meta = {
  name: "OctoCards",
  private: false,
  html_url: card.url,
  stargazers_count: 1,
  forks_count: 0,
};
describe("public repository data", () => {
  it("loads GitHub metadata, README and languages without replacing editorial copy", async () => {
    const fetcher = vi.fn(async (url: string) => {
      if (url.endsWith("/languages")) return Response.json({ TypeScript: 100 });
      if (url.endsWith("/readme")) return new Response("# README <script>bad()</script>");
      return Response.json(meta);
    });
    const result = await fetchRepositoryCard(identity, { fetcher });
    expect(result.description).toContain("<script>");
    expect(result.principal_languages).toEqual(["TypeScript"]);
    expect(fetcher).toHaveBeenCalledTimes(3);
    expect(fetcher.mock.calls[0][0]).toBe("https://api.github.com/repos/SamuelBProenca/OctoCards");
  });
  it.each([true, undefined])(
    "refuses non-public metadata before reading files (%s)",
    async (isPrivate) => {
      const fetcher = vi.fn(async () => Response.json({ ...meta, private: isPrivate }));
      await expect(fetchRepositoryCard(identity, { fetcher })).rejects.toThrow("not public");
      expect(fetcher).toHaveBeenCalledTimes(1);
    },
  );
  it("uses the OctoCards contract when its origin is configured without forwarding a GitHub token", async () => {
    const fetcher = vi.fn<typeof fetch>(async () =>
      Response.json({ ...card, featured: true, deployHref: "https://attacker.example" }),
    );
    const result = await fetchRepositoryCard(identity, {
      fetcher,
      apiOrigin: "https://cards.example.com",
      githubToken: "test-server-only",
    });
    expect(fetcher.mock.calls[0][0]).toBe(
      "https://cards.example.com/api/cards/OctoCards?owner=SamuelBProenca",
    );
    expect(JSON.stringify(fetcher.mock.calls)).not.toContain("test-server-only");
    expect(result).not.toHaveProperty("featured");
    expect(result).not.toHaveProperty("deployHref");
  });
  it("treats a missing README as optional", async () => {
    const fetcher = vi.fn(async (url: string) =>
      url.endsWith("/readme")
        ? new Response("", { status: 404 })
        : Response.json(url.endsWith("/languages") ? {} : meta),
    );
    expect((await fetchRepositoryCard(identity, { fetcher })).description).toBe("Sem descrição");
  });
  it.each([
    "git@github.com:SamuelBProenca/OctoCards.git",
    "http://example.com",
    "https://user:pass@cards.example.com",
    "https://cards.example.com/path",
  ])("rejects an invalid API origin %s", async (apiOrigin) => {
    const fetcher = vi.fn<typeof fetch>();
    await expect(fetchRepositoryCard(identity, { apiOrigin, fetcher })).rejects.toThrow();
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("rejects mismatched identities and unsafe data", () => {
    expect(() =>
      parseRepositoryCard({ ...card, url: "https://attacker.example" }, identity),
    ).toThrow();
    expect(() => parseRepositoryCard({ ...card, stars: -1 }, identity)).toThrow();
    expect(() => parseRepositoryCard({ ...card, principal_languages: [42] }, identity)).toThrow();
    expect(() =>
      parseRepositoryCard({ ...card, illustration_image_url: "javascript:alert(1)" }, identity),
    ).toThrow();
  });
  it("falls back for an upstream failure and retains private product presentation", async () => {
    const fetcher = vi.fn<typeof fetch>().mockRejectedValue(new Error("timeout"));
    const catalog = await loadProjectCatalog({ fetcher });
    expect(catalog).toHaveLength(4);
    expect(catalog.find((item) => item.id === "octocards")?.evidence?.source).toBe("snapshot");
    expect(catalog.find((item) => item.id === "curriculum")?.evidence).toBeUndefined();
    expect(fetcher).toHaveBeenCalledTimes(3);
    expect(catalog.find((item) => item.id === "octocards")?.headline).toBe(
      "Do repositório para o portfólio.",
    );
  });
  it.each([429, 503])("falls back on HTTP %s without removing catalog entries", async (status) => {
    const result = await loadProjectCatalog({
      fetcher: async () => new Response("unavailable", { status }),
    });
    expect(result.filter((item) => item.evidence?.source === "snapshot")).toHaveLength(3);
  });
  it("does not allow malformed JSON or oversized upstream bodies", async () => {
    await expect(
      fetchRepositoryCard(identity, {
        apiOrigin: "https://cards.example.com",
        fetcher: async () => new Response("{"),
      }),
    ).rejects.toThrow();
    await expect(
      fetchRepositoryCard(identity, { fetcher: async () => new Response("x".repeat(262145)) }),
    ).rejects.toThrow("too large");
  });
  it("preserves the commercial selection regardless of stars, ordering or extra repositories", () => {
    expect(selectedProjects.map((item) => item.id)).toEqual(["curriculum", "octocards"]);
    const items = [{ id: "new-most-starred", stars: 100000 }, ...catalogProjects.toReversed()];
    expect(selectFeaturedProjects(items).map((item) => item.id)).toEqual([
      "curriculum",
      "octocards",
    ]);
    expect(catalogProjects.map((item) => item.id)).toContain("dojo");
    expect(catalogProjects.map((item) => item.id)).toContain("opscli");
  });
});
