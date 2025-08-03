import React from 'react';
import HeroSection from './components/HeroSection';
import HProjects from './components/highlighted-projects';
import Skills from './components/skills';
import Contact from './components/contact';
import Experiences from './components/experiences';
import About from './components/about';
import Projects from './components/projects';

export default function Home() {
  return (
    <body className="min-h-screen bg-white text-black">
      <div className="w-full flex justify-center">
        <main className="max-w-screen-xl w-full px-6 py-12">
          <HeroSection />
          <HProjects />
          <Skills />
          <Experiences />
          <Projects />
          <About />
          <Contact />
        </main>
      </div>
    </body>

  );
}
