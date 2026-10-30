# Samuel Proença — Portfólio

Portfólio em português com Next.js App Router e TypeScript. A migração preserva a direção visual e o conteúdo do protótipo original.

Para publicar o repositório `SamuelBProenca/Portfolio` no Vercel e ativar os e-mails, siga [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). A pasta do app no repositório preparado é `portfolio/`.

## Requisitos e instalação

- Node.js 22.14 ou superior e npm.
- O projeto fixa a versão principal Node `22.x` para manter consistência entre local, GitHub Actions e Vercel.
- Instale as dependências com `npm ci` após baixar o projeto. O `package-lock.json` fixa as versões utilizadas.

```sh
npm ci
npm run dev
```

Abra http://localhost:3000. Para validar a versão de produção:

```sh
npm run build
npm start
```

## Debug no VS Code

Execute a configuração **Next.js: debug server** na aba Run and Debug, ou use `npm run dev:debug`. O processo inicia com o inspector do Node e permite depurar o código do servidor. Com o servidor em execução, **Next.js: debug browser** abre o Microsoft Edge para depurar os componentes no navegador. Selecione o navegador instalado na configuração caso prefira outro.

## Verificações

```sh
npm run check
npm run build
npx playwright install chromium
npm run test:e2e
```

`check` executa TypeScript, ESLint, Prettier e os testes de componentes. Os testes de navegador usam Chromium em desktop e mobile. A instalação do Chromium é necessária apenas na primeira execução ou após atualizar o Playwright.

No ambiente restrito do Windows usado nesta migração, o Playwright travou ao encerrar o servidor iniciado automaticamente. Para repetir o caminho validado, execute `npm run build` e `npm start` em um terminal e `npm run test:e2e` em outro. A suíte reutiliza esse servidor e terminou normalmente nessa configuração. Encerre o servidor com Ctrl+C ao terminar.

Para testar um servidor que já esteja em outra porta, defina `PLAYWRIGHT_BASE_URL`. No PowerShell, por exemplo: `$env:PLAYWRIGHT_BASE_URL = 'http://127.0.0.1:3002'`, seguido de `npm run test:e2e`. Com essa variável, a suíte usa apenas o servidor indicado e não inicia nem encerra um servidor próprio.

Outros comandos: `npm run test:watch`, `npm run test:e2e:ui`, `npm run format` e `npm run format:check`.

## Dados públicos e destaques

A landing page destaca Curriculum Studio, GreatMaker, OctoCards e LinkKeeper por curadoria explícita. O catálogo inclui também IcarusRoc, OpsCLI e Design Patterns Dojo, com o estágio de cada projeto identificado. Seus dados técnicos vêm do GitHub no servidor, com cache e referência local para falhas; o contrato permite consumir a API OctoCards quando houver uma instância publicada.

Use `npm run projects:sync` para renovar a referência salva e revise o diff. O comando preserva o arquivo anterior se alguma coleta falhar. Configuração, limites e operação estão em [docs/PROJECT_DATA.md](docs/PROJECT_DATA.md). Para testar com Edge já instalado no Windows, defina `PLAYWRIGHT_CHANNEL=msedge` antes da suíte de navegador.

## Organização

```text
src/app/                  Rotas, layout e metadados do App Router
src/components/           Componentes React compartilhados
src/content/              Conteúdo tipado
src/lib/                  Validação, entrega de e-mail e cálculos de progresso
src/types/                Contratos do plano de engenharia
src/styles/               Tokens e estilos responsivos
public/images/            Retrato aprovado e assets preservados
legacy/                   HTML, CSS e JavaScript anteriores à migração
tests/                    Testes de componentes e de navegador
.vscode/launch.json        Configurações de debug
docs/                     Direção visual, produto, roadmap e resultados de validação
```

Rotas principais: `/`, `/projetos`, `/sobre` e `/escrita`. Os endereços antigos terminados em `index.html` redirecionam para as novas rotas. Os IDs das seções foram preservados para links com âncoras.

O plano técnico do OctoCards está em `/projetos/octocards`. Seus dados ficam em `src/content/project-progress/octocards.ts`, com status baseados em evidências e próximos passos explicitamente planejados.

Os trabalhos selecionados da home usam um accordion com um projeto aberto por vez. Para editar a seleção, os textos e as ilustrações, altere `selectedProjects` em `src/content/projects.ts`. As fontes e os critérios de publicação estão em `docs/PROJECT_SOURCES.md`.

Curriculum Studio abre como primeiro destaque, com contexto do produto e botão de acesso a `/curriculumstudio`. O arquivo de projetos compartilha esse conteúdo; seu código permanece privado. A ativação do proxy e as capturas desktop/mobile estão em [docs/CURRICULUM_STUDIO.md](docs/CURRICULUM_STUDIO.md).

## Conteúdo e escopo

Os textos vieram do protótipo local, originalmente ancorado no repositório público `SamuelBProenca/Portfolio`, com ajustes editoriais. O design de `portfolio-design-v1` foi promovido para esta pasta, preservando o histórico Git. A versão anterior fica em `../legacy/pre-rework/portfolio/`.

O retrato atual foi fornecido pelo proprietário em `samuel hero.png` e convertido para `public/images/samuel-approved.webp` sem geração, retoque ou alteração de proporções. As imagens anteriores não são usadas pela home ou pela página Sobre. A seção de escrita continua indicando publicações futuras, sem artigos ou métricas inventados.

## Contato e hospedagem

The contact section at `/#contato` is prepared for a short project questionnaire hosted in Google Forms, with direct email for recruitment and professional contacts. Set `PROJECT_INTAKE_FORM_URL` to the real published responder link and rebuild. Until the owner creates that form, the section offers the approved email directly. No WhatsApp number is displayed in the section and neither channel calls the email API. See [the implementation and verification record](docs/CONTACT_INTAKE_2026-10-30.md) and [the ready-to-copy form template](docs/GOOGLE_FORMS_MODELO_PTBR.md).

The email form and `POST /api/contact` implementation are retained for future activation, but the home page no longer renders the form. To restore it, configure `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` using `.env.example`, verify the sender domain in Resend, and complete delivery testing before exposing the form.

Em serverless ou múltiplas instâncias, configure também `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`. Em um único processo Node persistente, é possível escolher explicitamente `CONTACT_RATE_LIMIT_MODE=memory`; esse modo não é adequado a serverless. Sem configuração válida, o endpoint retorna erro, nunca uma confirmação falsa de envio. A aplicação precisa de runtime Node; não use export estático para o contato.

O envio real ainda depende dessas credenciais e da verificação do remetente. Consulte [docs/REWORK.md](docs/REWORK.md) para configuração completa, arquitetura, arquivos alterados, fontes, testes e screenshots do retrato, contato e progresso.

Use `npm run contact:check` para diagnosticar a configuração local sem imprimir segredos, ou `npm run contact:check:vercel` para conferir os requisitos de Vercel. Nesse ambiente, Redis compartilhado é obrigatório mesmo que o modo memória esteja definido.

Consulte `docs/VALIDATION.md` para os testes efetivamente executados nesta migração e suas limitações.
