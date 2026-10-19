import type { Metadata } from "next";
import Link from "next/link";
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
        description="Há textos que procuram explicar como algo funciona. Outros procuram investigar possibilidades. Quero manter essas conversas distintas, sem perder a liberdade de pensar."
      />
      <section className="content-section">
        <div className="container">
          <div className="section-top">
            <span className="eyebrow">Coleções editoriais</span>
            <span className="section-index">02 TRILHAS / PUBLICAÇÕES FUTURAS</span>
          </div>
          <div className="writing-collections">
            {writingCollections.map((collection) => (
              <Link
                className="collection-link"
                href={`#${collection.id}`}
                id={collection.id}
                key={collection.id}
              >
                <div>
                  <span className="writing-category">{collection.category}</span>
                  <h2>{collection.title}</h2>
                  <p>{collection.description}</p>
                </div>
                <span className="arr">↗</span>
              </Link>
            ))}
          </div>
          <div className="empty-editorial">
            <h3>Ainda sem publicações nesta primeira versão.</h3>
            <p>
              O design das coleções está pronto. A listagem de artigos, os filtros por tema, páginas
              de leitura e pesquisa serão construídos depois, usando conteúdo efetivamente escrito e
              revisado.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
