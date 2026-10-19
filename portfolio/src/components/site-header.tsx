"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navigation = [
  { href: "/", label: "Início" },
  { href: "/projetos", label: "Projetos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/escrita", label: "Escrita" },
] as const;

function HeaderContents({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 761px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  const links = navigation.map(({ href, label }) => (
    <Link href={href} key={href} aria-current={pathname === href ? "page" : undefined}>
      {label}
    </Link>
  ));

  return (
    <>
      <div className="topline" />
      <header className="site-header">
        <div className="container site-header__inner">
          <Link className="wordmark" href="/" aria-label="Samuel Proença — início">
            <span className="monogram">SP.</span>
            <span>
              <span className="wordmark__name">Samuel Proença</span>
              <span className="wordmark__role">Software Engineering / Portfolio</span>
            </span>
          </Link>
          <nav className="desktop-nav" aria-label="Menu principal">
            {links}
          </nav>
          <div className="header-contact">
            <Link className="contact-outline" href="/#contato">
              Vamos conversar ↗
            </Link>
            <button
              className="menu-toggle"
              type="button"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
              aria-controls="mobile-panel"
              data-menu-toggle
              onClick={() => setOpen((value) => !value)}
              ref={toggle}
            >
              {open ? "✕" : "☰"}
            </button>
          </div>
        </div>
        <nav
          className={`mobile-panel${open ? " is-open" : ""}`}
          id="mobile-panel"
          aria-label="Menu para celular"
          data-mobile-panel
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a")) setOpen(false);
          }}
        >
          {links}
          <Link href="/#contato">Contato</Link>
        </nav>
      </header>
    </>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  return <HeaderContents key={pathname} pathname={pathname} />;
}
