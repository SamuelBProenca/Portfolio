"use client";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [lang, setLang] = useState<"pt" | "en">("pt");

  useEffect(() => {
    const browserLang = navigator.language.slice(0, 2).toLowerCase();
    if (browserLang === "en") setLang("en");
    else setLang("pt");
  }, []);

  const content = {
    pt: {
      name: "Samuel Proença Programador",
      title: "Finque raízes para a prosperidade e abra asas rumo a novas alturas.",
      description:
        "Olá, sou um desenvolvedor fullstack que entrega soluções sólidas e eficientes. Atuo com sistemas, redes e automações inteligentes.",
      switch: "Mudar para inglês",
    },
    en: {
      name: "Samuel Proença Developer",
      title: "Plant roots for prosperity and spread wings towards new heights.",
      description:
        "Hi, I’m a fullstack developer who delivers solid and efficient solutions. I work with systems, networks, and intelligent automations.",
      switch: "Switch to Portuguese",
    },
  };

  const { name, title, description, switch: switchText } = content[lang];



  return (
    <section className="text-center mb-32 gap-5 flex flex-col items-space-center">
      <h1 className="text-4xl font-bold text-cyan-500 transition mb-10">{name}</h1>
      <h2 className="text-3xl md:text-5xl font-semibold mb-8 px-4">{title}</h2>

      <p className="text-lg text-neutral-400 max-w-2xl mx-auto px-6 leading-relaxed">{description}</p>
    </section>
  );
}
