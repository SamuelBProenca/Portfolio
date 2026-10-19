# Validação da migração — 19/10/2026

O relatório mais recente de retrato, contato e progresso está em [REWORK.md](REWORK.md), incluindo os testes atuais e as configurações ainda necessárias. Os registros abaixo preservam as etapas anteriores.

## Atualização dos trabalhos selecionados — 19/10/2026

O destaque fixo foi substituído por um accordion de OpsCLI, OctoCards e Design Patterns Dojo, com informações revistas nos repositórios públicos. As fontes estão em [PROJECT_SOURCES.md](PROJECT_SOURCES.md).

- TypeScript, ESLint, Prettier e build de produção: passaram.
- Vitest: 11 testes passaram, incluindo 4 novos testes do accordion.
- Playwright contra produção: 25 passaram e 1 foi ignorado intencionalmente no desktop por testar somente o menu mobile.
- O accordion foi testado com mouse, Enter, Espaço, setas, Home e End, verificando seleção única, recolhimento, foco e links corretos. O teste mobile também cobre 320 px.
- Capturas da seção foram inspecionadas: [desktop](screenshots/selected-works-desktop.png) e [mobile](screenshots/selected-works-mobile.png).

A porta 3000 já estava ocupada. O servidor temporário de produção foi iniciado na porta 3002 e a suíte executada com `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3002`, com saída normal de código 0. O servidor temporário foi encerrado após a validação.

Os resultados abaixo registram a migração inicial, anterior ao accordion.

## Ambiente

Windows, Node.js 22.14.0 e npm 10.9.2. Dependências instaladas e fixadas no manifest e no lockfile: Next.js 16.4.2, React 19.3.1 e TypeScript 5.9.3. O jsdom foi fixado em 26.1.0 para manter compatibilidade com o Node instalado.

## Protótipo original

Antes da migração, o servidor Python retornou HTTP 200 nas quatro páginas HTML. Uma inspeção dos arquivos com o parser HTML do Python não encontrou referências locais ou âncoras quebradas. `node --check assets/js/main.js` passou. Não havia package.json ou suíte de testes.

Os arquivos originais estão preservados em `legacy/`.

## Resultados

| Verificação                       | Resultado                                                                                                               |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| TypeScript estrito                | Passou, incluindo os arquivos de teste                                                                                  |
| ESLint                            | Passou                                                                                                                  |
| Prettier                          | Passou                                                                                                                  |
| Vitest                            | 7 testes passaram                                                                                                       |
| Build de produção                 | Passou; quatro rotas públicas pré-renderizadas                                                                          |
| Playwright contra produção        | 23 passaram; 1 ignorado intencionalmente                                                                                |
| Playwright contra desenvolvimento | 23 verificações passaram; 1 ignorada; o encerramento automático do servidor travou no ambiente restrito do Windows      |
| Debug Node                        | Servidor iniciado com inspector; comando Runtime.evaluate executado com sucesso via protocolo do debugger na porta 9230 |
| Desenvolvimento via 127.0.0.1     | HTTP 200, WebSocket de hot reload conectado, menu abriu e fechou com Escape; nenhum erro de console ou de execução      |
| Revisão visual                    | Capturas desktop e mobile da home inspecionadas                                                                         |

O teste ignorado verifica Escape no menu mobile e é ignorado somente no projeto desktop, onde esse menu não aparece. Ele passou no projeto mobile. Chromium foi usado em desktop de 1440 px e emulação mobile de 390 px.

Os testes de navegador cobrem as quatro rotas, idioma, títulos e descrições, navegação ativa, retratos carregados, ausência de overflow horizontal, contato por e-mail, destino GitHub, fechamento e foco do menu, redirecionamento dos quatro endereços HTML antigos e preservação de âncoras. Erros de console e de execução fazem a suíte falhar.

## Correções verificadas

- O menu antigo mantinha o rótulo “Fechar menu” após seguir um link. O componente React mantém rótulo e aria-expanded sincronizados, limpa o bloqueio de rolagem e permite fechar por Escape, navegação e mudança para desktop.
- O Next.js bloqueou inicialmente o hot reload quando o navegador acessou 127.0.0.1. `allowedDevOrigins` agora permite esse endereço local; a conexão WebSocket e a interação do menu foram verificadas após reiniciar o servidor.
- O primeiro build encontrou opções inválidas nos tipos dos testes de Testing Library. Os testes foram corrigidos e a checagem completa passou.
- A suíte completa contra o servidor de produção já em execução terminou normalmente. Ao iniciar seu próprio servidor de desenvolvimento, o Playwright executou todas as verificações com sucesso, mas travou na etapa de encerramento do servidor no Windows restrito. Essa execução foi interrompida após os resultados dos testes; ela não deve ser interpretada como um comando que terminou normalmente.
- O código de encerramento do Playwright usa `taskkill` no Windows e aguarda o processo terminar. A tentativa de repetir um teste fora do sandbox foi cancelada pelo usuário; não houve confirmação dessa execução. O caminho com servidor já em execução continua sendo o resultado completo verificado. O relatório HTML preservado corresponde à execução de produção concluída.

## Artefatos e reprodução

- Capturas: [desktop](screenshots/home-desktop.png) e [mobile](screenshots/home-mobile.png).
- Relatório HTML do Playwright: `playwright-report/index.html`, gerado localmente e ignorado pelo Git.
- Configuração do debugger: `.vscode/launch.json`.

```sh
npm ci
npm run check
npm run build
npx playwright install chromium
npm run test:e2e
npm run dev:debug
```

Os servidores temporários de validação foram encerrados. Para navegar localmente, execute `npm run dev`.

## Limites

A emulação Chromium não substitui QA em dispositivos físicos, Safari ou Firefox. Os testes confirmam os destinos dos links externos, mas não a disponibilidade dos repositórios remotos nem o envio de e-mail. Não foi executada auditoria Lighthouse ou de acessibilidade completa. Nenhuma publicação ou integração com o repositório remoto foi realizada; a pasta recebida não continha metadados Git.
