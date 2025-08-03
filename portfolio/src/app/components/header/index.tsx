"use client";

import React, { useState } from "react";
import LogoComponent from "../../assets/logoComponent";
import { HiMenu, HiX } from "react-icons/hi"; // Ícones de menu

const HeaderComponent = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="mb-16 px-4 sm:px-8">
      <div className="max-w-[1800px] mx-auto px-6 flex items-center justify-between">
        {/* Logo + Título */}
        <div className="flex items-center gap-3">
          <div className="bg-dark p-4">
            <LogoComponent theme="dark" width={50} height={50} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight hidden sm:block">Samuel Proença</h1>
        </div>

        {/* Navegação desktop */}
        <nav className="hidden md:flex space-x-6 text-sm text-neutral-300">
          <a href="#about" className="hover:text-cyan-400">Sobre</a>
          <a href="#projects" className="hover:text-cyan-400">Projetos</a>
          <a href="#skills" className="hover:text-cyan-400">Skills</a>
          <a href="#contact" className="hover:text-cyan-400">Contato</a>
        </nav>

        {/* Menu hamburger mobile */}
        <button 
          className="md:hidden text-2xl text-neutral-300 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Menu suspenso para mobile */}
      {menuOpen && (
        <nav className="md:hidden mt-4 px-6 flex flex-col space-y-4 text-sm text-neutral-300">
          <a href="#about" className="hover:text-cyan-400">Sobre</a>
          <a href="#projects" className="hover:text-cyan-400">Projetos</a>
          <a href="#skills" className="hover:text-cyan-400">Skills</a>
          <a href="#contact" className="hover:text-cyan-400">Contato</a>
        </nav>
      )}
    </header>
  );
};

export default HeaderComponent;
