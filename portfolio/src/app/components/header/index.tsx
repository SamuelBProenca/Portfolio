"use client";

import React, { useState } from "react";
import LogoComponent from "../../assets/logoComponent";
import { HiMenu, HiX } from "react-icons/hi";

const HeaderComponent = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState<"pt" | "en">("pt");

  const navItems = {
    pt: [
      { id: "about", label: "Sobre" },
      { id: "projects", label: "Projetos" },
      { id: "highlights", label: "Destaques" },
      { id: "skills", label: "Skills" },
      { id: "contact", label: "Contato" }
    ],
    en: [
      { id: "about", label: "About" },
      { id: "projects", label: "Projects" },
      { id: "highlights", label: "Highlights" },
      { id: "skills", label: "Skills" },
      { id: "contact", label: "Contact" }
    ]
  };

  return (
    <header className="mb-2 px-4 sm:px-8 bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 transition-colors">
      <div className="max-w-[1800px] mx-auto px-6 flex items-center justify-between">
        {/* Logo + Título */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg transition-colors duration-300 dark:bg-neutral-800 bg-neutral-200">
            <LogoComponent width={50} height={50}  />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight hidden sm:block dark:text-neutral-100 text-neutral-800">
            Samuel Proença
          </h1>
        </div>

        {/* Navegação desktop */}
        <nav className="hidden md:flex space-x-6 text-sm dark:text-neutral-300 text-neutral-700">
          {navItems[lang].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="relative group transition-colors"
            >
              {item.label}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* Troca de idioma */}
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 text-xs border rounded dark:border-neutral-500 border-neutral-400"
            onClick={() => setLang(lang === "pt" ? "en" : "pt")}
          >
            {lang.toUpperCase()}
          </button>

          {/* Menu mobile */}
          <button
            className="md:hidden text-2xl dark:text-neutral-300 text-neutral-700 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* Menu suspenso mobile */}
      {menuOpen && (
        <nav className="md:hidden mt-4 px-6 flex flex-col space-y-4 text-sm dark:text-neutral-300 text-neutral-700">
          {navItems[lang].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="relative group transition-colors"
            >
              {item.label}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </nav>
      )}
    </header>
  );
};

export default HeaderComponent;
