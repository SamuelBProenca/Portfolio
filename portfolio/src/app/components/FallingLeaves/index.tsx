// components/FallingLeaves/index.tsx
"use client";

import React, { useEffect, useState } from "react";

const leafSvgs = [
  `<svg viewBox="0 0 64 64" fill="orange" xmlns="http://www.w3.org/2000/svg"><path d="M32 2c8 8 20 20 20 34S44 62 32 62 12 50 12 36 24 10 32 2z"/></svg>`,
  `<svg viewBox="0 0 64 64" fill="#f4a261" xmlns="http://www.w3.org/2000/svg"><path d="M32 4c10 6 22 18 18 32s-14 22-26 22S6 44 10 30 22 10 32 4z"/></svg>`,
  `<svg viewBox="0 0 64 64" fill="#e9c46a" xmlns="http://www.w3.org/2000/svg"><path d="M32 6c8 8 16 20 12 30s-10 16-20 16S8 40 12 30 24 14 32 6z"/></svg>`
];

type Leaf = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  sway: string;
  rotate: number;
  opacity: number;
  svg: string;
};

export default function FallingLeaves({ count = 18 }: { count?: number }) {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    const arr = Array.from({ length: count }, (_, i) => {
      const size = 20 + Math.random() * 30;
      const sway = `${(Math.random() - 0.5) * 120}px`;
      return {
        id: i,
        left: Math.random() * 100,
        size,
        duration: 6 + Math.random() * 8,
        delay: Math.random() * 6,
        sway,
        rotate: Math.random() * 360,
        opacity: 0.6 + Math.random() * 0.4,
        svg: leafSvgs[Math.floor(Math.random() * leafSvgs.length)]
      } as Leaf;
    });
    setLeaves(arr);
  }, [count]);

  return (
    <div aria-hidden className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {leaves.map((leaf) => (
        <span
          key={leaf.id}
          className="leaf absolute animate-fall"
          style={
            {
              left: `${leaf.left}%`,
              top: `-10vh`,
              width: `${leaf.size}px`,
              height: `${leaf.size}px`,
              animationDuration: `${leaf.duration}s`,
              animationDelay: `${leaf.delay}s`,
              transform: `rotate(${leaf.rotate}deg)`,
              opacity: leaf.opacity,
              ["--sway" as string]: leaf.sway
            } as React.CSSProperties
          }
          dangerouslySetInnerHTML={{ __html: leaf.svg }}
        />
      ))}
    </div>
  );
}
