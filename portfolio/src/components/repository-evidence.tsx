import type { RepositoryEvidence as Evidence } from "@/lib/project-catalog";

export default function RepositoryEvidence({ evidence }: { evidence?: Evidence }) {
  if (!evidence) return null;
  const { card } = evidence;
  return (
    <section className="repository-evidence" aria-label="Dados do repositório OctoCards">
      <h2>Explore a implementação.</h2>
      <p>
        {card.principal_languages.join(" / ") || "Linguagens não informadas"} · {card.stars}{" "}
        {card.stars === 1 ? "estrela" : "estrelas"} · {card.forks}{" "}
        {card.forks === 1 ? "fork" : "forks"}.
        {evidence.source === "snapshot" ? " Dados da referência salva em " : " Consulta em "}
        <time dateTime={evidence.reviewedAt}>
          {new Date(evidence.reviewedAt).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
        </time>
        .
      </p>
      <details>
        <summary>Ler README do repositório</summary>
        <pre tabIndex={0} aria-label="README do OctoCards em texto">
          {card.description}
        </pre>
      </details>
    </section>
  );
}
