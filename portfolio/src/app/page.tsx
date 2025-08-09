"use client";

import React from 'react';
import HeroSection from './components/HeroSection';
import HProjects from './components/highlighted-projects';
import Skills from './components/skills';
import Contact from './components/contact';
import Experiences from './components/experiences';
import About from './components/about';
import Projects from './components/projects';
// import FallingLeaves from './components/FallingLeaves';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white relative">
      
      {/* Folhas caindo - ficam no fundo, mas acima do background */}
      <div className="absolute inset-0 z-0">
        {/* <FallingLeaves /> */}
      </div>

      {/* Efeitos de luzes */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="absolute top-[120px] -left-24 w-[400px] h-[400px] rounded-full bg-purple-500 opacity-20 blur-2xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-cyan-400 opacity-25 blur-2xl animate-ping delay-1000" />
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-emerald-400 opacity-20 blur-2xl animate-pulse delay-2000" />
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 w-full flex justify-center">
        <main className="max-w-screen-xl w-full px-6 py-12">
          <HeroSection />
          <About />
          <Skills />
          <Experiences />
          <HProjects />
          <Projects />
          <Contact />
        </main>
      </div>
    </div>
  );
}
