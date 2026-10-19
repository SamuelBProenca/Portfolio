# Validação da migração para Vercel

Executada em 19/10/2026, Windows, Node.js 22.14.0 e npm 10.9.2, no app `portfolio/` do repositório `SamuelBProenca/Portfolio`.

O design de `portfolio-design-v1/` foi copiado para o app ativo. O app anterior, incluindo as alterações locais existentes, foi preservado em `legacy/pre-rework/portfolio/`. A cópia de autoria permanece local e ignorada pelo Git. O histórico Git foi mantido.

| Verificação                                | Resultado                                                                          |
| ------------------------------------------ | ---------------------------------------------------------------------------------- |
| Instalação limpa com `npm ci`              | 435 pacotes instalados                                                             |
| `npm run check`                            | TypeScript, ESLint e Prettier aprovados                                            |
| Vitest                                     | 5 arquivos; 36 testes aprovados                                                    |
| `npm run build`                            | Aprovado; páginas estáticas e `/api/contact` dinâmico                              |
| Playwright contra `next start`, porta 3002 | 33 aprovados; 1 ignorado por ser exclusivo de menu mobile                          |
| `npm audit --omit=dev`                     | Nenhuma vulnerabilidade de produção reportada                                      |
| `npm audit`                                | 5 achados altos na cadeia de desenvolvimento do ESLint/Next, causados por `braces` |
| `npm run contact:check:vercel`             | Falha esperada: credenciais privadas ausentes                                      |

O audit sugere um downgrade incompatível de `eslint-config-next` para corrigir a cadeia `braces` → `micromatch` → `fast-glob` → `@next/eslint-plugin-next` → `eslint-config-next`. As versões fixadas foram mantidas nesta migração. O achado é [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).

Os testes de navegador cobrem desktop, mobile e tablet, navegação, imagens, ausência de overflow, redirects antigos, accordion, contato simulado e o plano técnico do OctoCards. Não comprovam entrega real de e-mail.

O app versionado contém somente `.env.example`. Configure `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN` no Vercel para ativar o formulário. Nenhum e-mail real foi enviado durante esta validação.

O Next.js avisou sobre um lockfile externo em `C:/Users/samue`; usou a raiz Git correta e concluiu o build. Esse arquivo externo não integra o repositório ou o deploy Vercel.

O workflow da raiz executa instalação, verificações, build e testes de navegador contra o servidor de produção no GitHub. Seus resultados remotos e o preview Vercel devem ser consultados no Pull Request. A configuração de publicação está em [DEPLOYMENT.md](DEPLOYMENT.md).
