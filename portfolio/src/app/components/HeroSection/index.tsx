'use client';
import { useState } from "react";

export default function HeroSection() {
  const [lang, setLang] = useState("pt"); // agora é dinâmico

  const title =
    lang === "pt"
      ? "Codar comigo é fincar raízes para a prosperidade e abrir asas rumo a novas alturas."
      : "Code with me is to plant roots for prosperity and spread wings towards new heights.";

  const description =
    lang === "pt"
      ? "Sou um desenvolvedor que entrega soluções sólidas como raízes e visionárias como o voo de um pássaro. Atuo com sistemas, redes e automações inteligentes."
      : "I am a developer who delivers solutions as solid as roots and visionary as the flight of a bird. I work with systems, networks, and intelligent automations.";

  return (
    <section className="text-center mb-20">
      <button onClick={() => setLang(lang === "pt" ? "en" : "pt")}>
        Alternar Idioma
      </button>
      <h2 className="text-4xl font-bold mb-4">{title}</h2>
      <p className="text-lg text-neutral-400 max-w-2xl mx-auto">{description}</p>
    </section>
  );
}
