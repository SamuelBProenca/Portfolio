"use client";

import React from 'react';
import HeroSection from './components/HeroSection';
import HProjects from './components/highlighted-projects';
import Skills from './components/skills';
import Contact from './components/contact';
import Experiences from './components/experiences';
import About from './components/about';
import Projects from './components/projects';
import FallingLeaves from './components/FallingLeaves';

export default function HomePage() {
  const projects = [
    {
      title: "Automation CLI System",
      tag: "Operational automation tool",
      description:
        "A CLI system designed to reduce repetitive operational work, automate structured reporting and improve daily verification flows under constrained legacy environments.",
      stack: ["Batch", "PowerShell", "Networking", "CLI Tooling"],
      href: "/projects/automation-cli",
    },
    {
      title: "OctoCards",
      tag: "GitHub cards API generator",
      description:
        "A backend service for generating reusable developer cards and visual profile assets from GitHub data.",
      stack: ["Node.js", "TypeScript", "REST APIs"],
      href: "/projects/octocards",
    },
    {
      title: "Log Analyzer",
      tag: "Structured diagnostic pipeline",
      description:
        "A project focused on transforming raw logs into structured diagnostic information and actionable operational insight.",
      stack: ["Python", "Parsing", "Data Processing"],
      href: "/projects/log-analyzer",
    },
    {
      title: "Notification Service",
      tag: "Event-driven system design",
      description:
        "A modular notification architecture designed around extensibility, routing and decoupled event handling.",
      stack: ["Node.js", "Architecture Patterns", "Events"],
      href: "/projects/notification-service",
    },
  ];

  const notes = [
    "Automating repetitive work with Batch and PowerShell",
    "Designing CLI tools under system constraints",
    "Building practical internal tools from real operational pain points",
    "From script to system: evolving an internal automation workflow",
  ];

  const designs = [
    "Operational Automation CLI Architecture",
    "Log Analyzer System Design",
    "Notification Service Architecture",
    "Collaborative Systems Architecture",
  ];

  const tools = [
    {
      title: "Automation Tools",
      description:
        "Internal utilities and operational scripts refined into reusable tooling.",
    },
    {
      title: "Templates & Starter Kits",
      description:
        "Engineering-first starters, automation templates and systems built to save time.",
    },
    {
      title: "Real-use Experiments",
      description:
        "Ideas that begin as practical solutions and evolve into reusable products.",
    },
  ];

  const stack = {
    Languages: ["TypeScript", "Python", "Go", "PHP", "C#", "JavaScript"],
    Backend: ["Node.js", "REST APIs", "Architecture Patterns", "System Design"],
    Infrastructure: ["Linux", "Networking", "Automation", "CLI Tools", "Observability"],
    Tooling: ["Next.js", "Tailwind", "Git", "PowerShell", "Shell Scripting"],
  };

  return (
    <main className="min-h-screen bg-[#0B1120] text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 lg:px-12">
        <header className="sticky top-0 z-30 mb-14 border-b border-white/5 bg-[#0B1120]/80 py-4 backdrop-blur">
          <div className="flex items-center justify-between gap-6">
            <div className="text-sm uppercase tracking-[0.28em] text-slate-400">Samuel Proença</div>
            <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
              <a href="#projects" className="transition hover:text-white">Projects</a>
              <a href="#notes" className="transition hover:text-white">Notes</a>
              <a href="#design" className="transition hover:text-white">System Design</a>
              <a href="#products" className="transition hover:text-white">Products</a>
              <a href="#contact" className="transition hover:text-white">Contact</a>
            </nav>
          </div>
        </header>

        <section className="grid gap-10 pb-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-6">
            <div className="inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-200">
              Systems • Backend • Automation
            </div>

            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white md:text-7xl md:leading-[1.05]">
                Building useful systems from real-world problems.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
                I design and build systems, automation tools and backend solutions focused on real operational pain points,
                clear structure and practical impact.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href="#projects"
                className="rounded-2xl bg-blue-500 px-6 py-3 font-medium text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
              >
                View Projects
              </a>
              <a
                href="#notes"
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-slate-100 transition hover:bg-white/10"
              >
                Engineering Notes
              </a>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-slate-400">
              <a href="https://github.com/SamuelBProenca" className="transition hover:text-white">GitHub</a>
              <a href="https://www.linkedin.com/in/samuel-proenca" className="transition hover:text-white">LinkedIn</a>
              <a href="mailto:contato@samuelproenca.com" className="transition hover:text-white">Email</a>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-900/40 p-6 shadow-2xl shadow-black/30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.22),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.12),transparent_28%)]" />
            <div className="relative space-y-5">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-400">
                <span>Engineering Snapshot</span>
                <span>Live profile concept</span>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-5">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-medium text-white">Current focus</div>
                    <div className="mt-1 text-sm text-slate-400">Architecture, backend systems and practical automation</div>
                  </div>
                  <span className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-300">
                    Active
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    "Operational Automation",
                    "System Design",
                    "Backend Services",
                    "CLI Tooling",
                  ].map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <div className="text-sm text-slate-400">Portfolio direction</div>
                  <div className="mt-1 text-2xl font-semibold text-white">Engineer-first</div>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <div className="text-sm text-slate-400">Current structure</div>
                  <div className="mt-1 text-2xl font-semibold text-white">Projects + Cases</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-3">
            <div className="text-sm uppercase tracking-[0.24em] text-slate-400">About</div>
            <h2 className="text-3xl font-semibold text-white md:text-4xl">Engineering first, portfolio second.</h2>
          </div>
          <div className="space-y-5 text-slate-300">
            <p className="leading-8">
              I enjoy building tools and systems that solve real problems. Most of my work begins with operational friction,
              repetitive workflows, missing tooling or backend architecture challenges that need cleaner structure.
            </p>
            <p className="leading-8">
              Instead of building software only for demonstration, I prefer building things that are actually useful — then
              turning those projects into well-structured engineering case studies.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                "Backend Engineering",
                "Systems Design",
                "Automation & Tooling",
                "Infrastructure Thinking",
                "Operational Efficiency",
              ].map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="space-y-6 py-16">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.24em] text-slate-400">Projects</div>
              <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">Engineering Projects</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-400">
              Built from real problems, refined through iteration, and shaped by practical constraints.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <article
                key={project.title}
                className="group rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-6 transition hover:-translate-y-1 hover:border-blue-400/30 hover:shadow-xl hover:shadow-blue-500/5"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm text-blue-200">{project.tag}</div>
                    <h3 className="mt-1 text-2xl font-semibold text-white">{project.title}</h3>
                  </div>
                  <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">
                    Case
                  </span>
                </div>
                <p className="mb-5 leading-7 text-slate-300">{project.description}</p>
                <div className="mb-6 flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  <a href={project.href} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/15">
                    View Case Study
                  </a>
                  <a href="#" className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5">
                    Source
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div id="notes" className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
            <div className="text-sm uppercase tracking-[0.24em] text-slate-400">Writing</div>
            <h2 className="mt-2 text-3xl font-semibold text-white">Engineering Notes</h2>
            <p className="mt-4 leading-8 text-slate-300">
              Technical notes, reflections and small case studies derived from real projects, automation experiments and
              architecture decisions.
            </p>
            <div className="mt-6 space-y-4">
              {notes.map((note) => (
                <div key={note} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-slate-200">
                  {note}
                </div>
              ))}
            </div>
            <a href="/notes" className="mt-6 inline-flex rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/5">
              Read All Notes
            </a>
          </div>

          <div id="design" className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
            <div className="text-sm uppercase tracking-[0.24em] text-slate-400">Architecture</div>
            <h2 className="mt-2 text-3xl font-semibold text-white">System Design</h2>
            <p className="mt-4 leading-8 text-slate-300">
              A place to document architecture decisions, system flows, constraints and engineering tradeoffs behind real
              projects.
            </p>
            <div className="mt-6 space-y-4">
              {designs.map((design) => (
                <div key={design} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-slate-200">
                  {design}
                </div>
              ))}
            </div>
            <a href="/design" className="mt-6 inline-flex rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/5">
              Explore Designs
            </a>
          </div>
        </section>

        <section id="products" className="space-y-6 py-16">
          <div>
            <div className="text-sm uppercase tracking-[0.24em] text-slate-400">Products & Tools</div>
            <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">Reusable solutions, not just experiments.</h2>
            <p className="mt-4 max-w-3xl leading-8 text-slate-300">
              Some of the tools I build evolve beyond internal use and become reusable products, templates or automation
              packages. This section is where practical solutions can grow into standalone offerings.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {tools.map((tool) => (
              <article key={tool.title} className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
                <h3 className="text-xl font-semibold text-white">{tool.title}</h3>
                <p className="mt-3 leading-7 text-slate-300">{tool.description}</p>
              </article>
            ))}
          </div>
          <a href="/products" className="inline-flex rounded-2xl bg-blue-500 px-5 py-3 font-medium text-white transition hover:bg-blue-400">
            Explore Products
          </a>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
            <div className="text-sm uppercase tracking-[0.24em] text-slate-400">Live Integrations</div>
            <h2 className="mt-2 text-3xl font-semibold text-white">Projects powering the portfolio</h2>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-lg font-medium text-white">OctoCards Integration</div>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  Dynamic profile visuals and reusable project cards generated by your own tooling.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-lg font-medium text-white">Activity Intelligence Layer</div>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  A curated layer that aggregates recent work, technical notes and evolving project signals into a living
                  profile.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
            <div className="text-sm uppercase tracking-[0.24em] text-slate-400">Technical Stack</div>
            <h2 className="mt-2 text-3xl font-semibold text-white">Built around systems thinking</h2>
            <div className="mt-6 space-y-5">
              {Object.entries(stack).map(([group, items]) => (
                <div key={group} className="space-y-2">
                  <div className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">{group}</div>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <span key={item} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="mt-16 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-500/10 via-white/[0.03] to-emerald-500/10 p-8 md:p-10">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div className="space-y-3">
              <div className="text-sm uppercase tracking-[0.24em] text-slate-400">Contact</div>
              <h2 className="text-3xl font-semibold text-white md:text-4xl">Let’s build something interesting.</h2>
              <p className="max-w-2xl leading-8 text-slate-300">
                Open to conversations about backend engineering, systems, automation, internal tooling and architecture.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="https://github.com/SamuelBProenca" className="rounded-2xl bg-blue-500 px-5 py-3 font-medium text-white transition hover:bg-blue-400">
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/samuel-proenca" className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-slate-100 transition hover:bg-white/10">
                LinkedIn
              </a>
              <a href="mailto:contato@samuelproenca.com" className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-slate-100 transition hover:bg-white/10">
                Email
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
