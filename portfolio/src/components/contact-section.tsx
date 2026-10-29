import ContactForm from "@/components/contact-form";
import styles from "@/styles/copy-v2.module.css";

const linkedIn = "https://www.linkedin.com/in/samuel-proen%C3%A7a";

export default function ContactSection() {
  return (
    <section id="contato" className="contact-band contact-section">
      <div className="container">
        <div className="section-top">
          <span className="eyebrow">Contato</span>
          <span className="section-index">PRÓXIMO PASSO / 2026</span>
        </div>
        <div className="contact-layout">
          <div className="contact-section__copy" data-scroll-reveal>
            <h2 className={styles.contactHeading}>
              Tem uma aplicação para desenvolver ou um processo para automatizar?
            </h2>
            <p>
              Conte o que você precisa construir, o que já existe e quais são as principais
              dificuldades. Também tenho interesse em conversar sobre oportunidades de
              desenvolvimento full-stack.
            </p>
            <div className="contact-links contact-section__alternatives">
              <a href="https://github.com/SamuelBProenca" target="_blank" rel="noopener noreferrer">
                GitHub ↗
              </a>
              <a href={linkedIn} target="_blank" rel="noopener noreferrer">
                LinkedIn ↗
              </a>
              <a href="mailto:samuelbrito782@gmail.com">Prefere enviar um e-mail? ↗</a>
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
