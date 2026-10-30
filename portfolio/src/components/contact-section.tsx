import styles from "@/styles/copy-v2.module.css";
import contactStyles from "@/styles/contact-section.module.css";
import { getProjectIntakeFormUrl } from "@/lib/contact/intake-form";

const linkedIn = "https://www.linkedin.com/in/samuel-proen%C3%A7a";
const professionalEmail = "samuelbrito782@gmail.com";

export default function ContactSection() {
  const intakeFormUrl = getProjectIntakeFormUrl(process.env.PROJECT_INTAKE_FORM_URL);
  return (
    <section
      id="contato"
      className="contact-band contact-section"
      aria-labelledby="contact-heading"
    >
      <div className="container">
        <div className="section-top">
          <span className="eyebrow">Contato</span>
          <span className="section-index">PRÓXIMO PASSO / 2026</span>
        </div>
        <div className="contact-layout">
          <div className="contact-section__copy" data-scroll-reveal>
            <h2 id="contact-heading" className={styles.contactHeading}>
              Tem uma aplicação para desenvolver ou um processo para automatizar?
            </h2>
            <p>
              Conte o que você precisa construir, o que já existe e quais são as principais
              dificuldades. Também tenho interesse em conversar sobre oportunidades de
              desenvolvimento full-stack.
            </p>
          </div>
          <div className={contactStyles.directContact}>
            <p>
              {intakeFormUrl
                ? "Vamos entender seu projeto."
                : "Projetos, recrutamento e contatos profissionais"}
            </p>
            <a
              className={contactStyles.action}
              data-contact-action
              href={intakeFormUrl ?? `mailto:${professionalEmail}`}
              target={intakeFormUrl ? "_blank" : undefined}
              rel={intakeFormUrl ? "noopener noreferrer" : undefined}
              aria-describedby="contact-action-help"
            >
              {intakeFormUrl ? "Descrever meu projeto" : "Enviar e-mail"}
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
              >
                <path d="M5 19 19 5M5 5h14v14" />
              </svg>
            </a>
            <p id="contact-action-help" className={contactStyles.help}>
              {intakeFormUrl
                ? "Responda algumas perguntas no Google Forms para contextualizar sua ideia. Abre em outra aba."
                : "Abre seu aplicativo de e-mail. Conte sua ideia ou envie os detalhes da oportunidade."}
            </p>
            <div className={contactStyles.professionalContact}>
              {intakeFormUrl ? <p>Recrutamento e outros contatos profissionais</p> : null}
              {intakeFormUrl ? (
                <a href={`mailto:${professionalEmail}`}>{professionalEmail}</a>
              ) : (
                <span>{professionalEmail}</span>
              )}
            </div>
            <div
              className={`contact-links contact-section__alternatives ${contactStyles.alternatives}`}
            >
              <a href="https://github.com/SamuelBProenca" target="_blank" rel="noopener noreferrer">
                GitHub ↗
              </a>
              <a href={linkedIn} target="_blank" rel="noopener noreferrer">
                LinkedIn ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
