import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import "@/styles/styles.css";
import "@/styles/responsive.css";
import "@/styles/rework.css";

export const metadata: Metadata = {
  title: { default: "Samuel Proença — Engenharia de Software", template: "%s — Samuel Proença" },
  description: "Projetos de engenharia de software, automação, backend e ideias de Samuel Proença.",
};

export const viewport: Viewport = { colorScheme: "dark", themeColor: "#141414" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        <SiteHeader />
        <main id="conteudo">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
