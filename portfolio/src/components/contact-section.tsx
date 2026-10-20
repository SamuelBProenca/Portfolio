import ContactForm from "@/components/contact-form";

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
          <div className="contact-section__copy">
            <h2>
              Vamos falar
              <br />
              do próximo
              <br />
              projeto.
            </h2>
            <p>
              Tem um projeto em mente ou uma oportunidade na equipe? Conte o contexto e o que você
              precisa construir.
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
