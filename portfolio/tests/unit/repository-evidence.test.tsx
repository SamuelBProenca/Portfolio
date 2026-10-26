import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import RepositoryEvidence from "@/components/repository-evidence";
import snapshot from "@/content/repository-snapshot.json";

it("renders imported README as inert text, including HTML and scripts", () => {
  const description = '<img src=x onerror="alert(1)"><script>alert(1)</script>';
  const { container } = render(
    <RepositoryEvidence
      evidence={{
        card: { ...snapshot.cards[0], description },
        source: "snapshot",
        reviewedAt: snapshot.reviewedAt,
      }}
    />,
  );
  expect(container.querySelector("pre")?.textContent).toBe(description);
  expect(container.querySelector("script, img")).toBeNull();
  expect(screen.getByText(/Dados da referência salva/)).toBeInTheDocument();
});
