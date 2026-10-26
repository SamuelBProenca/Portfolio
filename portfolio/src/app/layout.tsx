import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import PointerInput from "@/components/pointer-input";
import MotionPreference from "@/components/motion-preference";
import ScrollProgress from "@/components/scroll-progress";
import ScrollReveals from "@/components/scroll-reveals";
import "@/styles/styles.css";
import "@/styles/responsive.css";
import "@/styles/rework.css";
import "@/styles/interactions.css";
import "@/styles/curriculum-studio.css";
import "@/styles/repository-evidence.css";

export const metadata: Metadata = {
  icons: { icon: "/favicon.svg" },
  title: { default: "Samuel Proença | Desenvolvedor full-stack", template: "%s | Samuel Proença" },
  description:
    "Conheça os projetos de Samuel Proença: aplicações web, APIs, automações e ferramentas desenvolvidas com TypeScript, React, Python e C#/.NET.",
};

export const viewport: Viewport = { colorScheme: "dark", themeColor: "#141414" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        <ScrollProgress />
        <SiteHeader />
        <main id="conteudo">{children}</main>
        <SiteFooter />
        <PointerInput />
        <MotionPreference />
        <ScrollReveals />
      </body>
    </html>
  );
}
