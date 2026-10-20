"use client";

import { useState } from "react";

const specialties = [
  "Design de sistemas",
  "Engenharia backend",
  "Automação operacional",
  "Infraestrutura",
] as const;

export default function IntroStrip() {
  const [paused, setPaused] = useState(false);
  return (
    <div className="container intro-strip" role="region" aria-label="Especialidades">
      <div className="intro-strip__viewport">
        <div className="intro-strip__track" data-paused={paused}>
          {[false, true].map((duplicate) => (
            <ul
              className="intro-strip__group"
              key={String(duplicate)}
              aria-hidden={duplicate || undefined}
            >
              {specialties.map((specialty) => (
                <li key={specialty}>
                  <span>{specialty}</span>
                  <b aria-hidden="true">+</b>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <button
        className="intro-strip__pause"
        type="button"
        aria-label={paused ? "Retomar faixa de especialidades" : "Pausar faixa de especialidades"}
        aria-pressed={paused}
        onClick={() => setPaused((value) => !value)}
      >
        <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span>
      </button>
    </div>
  );
}
