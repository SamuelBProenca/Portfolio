import styles from "@/styles/copy-v2.module.css";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  accent?: string;
  description: string;
};

export default function PageHero({ eyebrow, title, accent, description }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="container">
        <span className="eyebrow">
          <span className="marker" />
          {eyebrow}
        </span>
        <h1 className={!accent ? styles.pageTitle : undefined}>
          {title}
          {accent && (
            <>
              <br />
              <span>{accent}</span>
            </>
          )}
        </h1>
        <p className="page-intro">{description}</p>
      </div>
    </section>
  );
}
