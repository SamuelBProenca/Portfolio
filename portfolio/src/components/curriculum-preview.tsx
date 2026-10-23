/** Decorative, illustrative product view. It contains no candidate data or usage metrics. */
export default function CurriculumPreview({ steps }: { steps: readonly string[] }) {
  return (
    <div className="studio-mini">
      <div className="studio-mini__header">
        <span className="studio-mini__mark">
          CS<span>.</span>
        </span>
        <span>Curriculum Studio</span>
        <span className="studio-mini__edition">PERFIL / VAGA / PDF</span>
      </div>
      <div className="studio-mini__intro">
        Seu percurso.
        <br />
        <span>Uma versão com foco.</span>
      </div>
      <div className="studio-mini__workspace">
        <div className="studio-mini__editor">
          <span className="studio-mini__label">PONTO DE PARTIDA</span>
          {steps.map((step) => (
            <div key={step}>{step}</div>
          ))}
          <span className="studio-mini__action">Revisar e montar ↗</span>
        </div>
        <div className="studio-mini__paper">
          <span className="studio-mini__paper-mark">SEU CURRÍCULO</span>
          <strong>Seu percurso</strong>
          <span>Experiências reais.</span>
          <div className="studio-mini__section">EXPERIÊNCIAS</div>
          <i />
          <i />
          <i />
          <div className="studio-mini__section">HABILIDADES</div>
          <i />
          <i />
          <div className="studio-mini__section">FORMAÇÃO</div>
          <i />
        </div>
      </div>
      <div className="studio-mini__footer">
        <span>Você revisa. O documento ganha direção.</span>
        <span>↗</span>
      </div>
    </div>
  );
}
