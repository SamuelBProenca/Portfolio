import type { Metadata } from "next";
import PageHero from "@/components/page-hero";
import { writingCollections } from "@/content/writing";
import copyStyles from "@/styles/copy-v2.module.css";

export const metadata: Metadata = {
  title: "Escrita",
  description:
    "Um arquivo em construção com artigos técnicos, ensaios e hipóteses de Samuel Proença.",
};

export default function WritingPage() {
  return (
    <>
      <PageHero
        eyebrow="Escrita / Em preparação"
        title="Artigos, estudos e ensaios."
        description="Estou preparando textos sobre problemas técnicos que encontrei, decisões tomadas em projetos e assuntos que quero investigar com mais cuidado. Ainda não há artigos publicados aqui."
      />
      <section className="content-section">
        <div className="container">
          <div className="section-top">
            <span className="eyebrow">Coleções editoriais</span>
            <span className="section-index">02 TRILHAS / PUBLICAÇÕES FUTURAS</span>
          </div>
          <div className="writing-collections">
            {writingCollections.map((collection) => (
              <article
                className="writing-collection"
                data-scroll-reveal
                id={collection.id}
                aria-labelledby={`${collection.id}-title`}
                key={collection.id}
              >
                <div>
                  <span className="writing-category">{collection.category}</span>
                  <h2 id={`${collection.id}-title`}>{collection.title}</h2>
                  <p>{collection.description}</p>
                </div>
                <span className="writing-label">Publicações em preparação</span>
              </article>
            ))}
          </div>
          <div className="empty-editorial" data-scroll-reveal>
            <h3 className={copyStyles.footerHeading}>
              As publicações serão adicionadas nesta página conforme ficarem prontas.
            </h3>
            <p>
              Os temas apresentados são propostas editoriais; não há artigos publicados nesta
              página.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
