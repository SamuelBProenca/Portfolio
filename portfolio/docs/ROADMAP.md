# ROADMAP — Depois de validar o design

1. Validar identidade visual, tipografia e retratos (fidelidade real).
2. Concluído em 19/10/2026: migrar o protótipo local para Next.js App Router com TypeScript, componentes compartilhados, conteúdo tipado e assets em `public/`. A integração com o repositório de produção continua pendente.
3. Conferir os links reais dos repositórios e escrever 3–4 cases de projeto com evidências, limitações e decisões arquiteturais.
4. Implementar navegação PT/EN e SEO/OpenGraph contextualizado por rota.
5. Criar CMS ou Markdown/MDX local com `article.type = engineering | essay` e taxonomias por tema. Artigos técnicos devem comportar fontes e data da última revisão.
6. Implementar `projects/[slug]`, `writing/[slug]`, busca, RSS, filtros e destaque de código.
7. Medir acessibilidade, responsividade, contraste, SEO e desempenho. Verificar se animações têm função e respeitam redução de movimento.
8. Fazer QA com dispositivos reais, então abrir PR para revisão antes de integrar à produção.
