import type { Metadata } from "next";
import PageHero from "@/components/page-hero";
import { writingCollections } from "@/content/writing";

export const metadata: Metadata = {
  title: "Escrita",
  description:
    "Um arquivo em construção com artigos técnicos, ensaios e hipóteses de Samuel Proença.",
};

export default function WritingPage() {
  return (
    <>
      <PageHero
        eyebrow="Escrita / Arquivo em construção"
        title="IDEIAS"
        accent="EM CURSO."
        description="Estou preparando textos sobre decisões de engenharia e aprendizados dos projetos, além de um espaço para ensaios e hipóteses. Conheça os temas das futuras publicações."
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
          <div className="empty-editorial">
            <h3>Os primeiros textos estão em preparação.</h3>
            <p>
              Ainda não há artigos publicados. Este espaço vai reunir o que aprendo ao construir,
              revisar e investigar — com contexto, fontes e espaço para perguntas.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
