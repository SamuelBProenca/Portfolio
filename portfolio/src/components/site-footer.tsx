import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <span>© 2026 Samuel Proença. Feito com intenção.</span>
        <span>
          <a href="https://github.com/SamuelBProenca" target="_blank" rel="noopener noreferrer">
            GitHub ↗
          </a>
          {" · "}
          <Link href="/">Voltar ao início ↑</Link>
        </span>
      </div>
    </footer>
  );
}
