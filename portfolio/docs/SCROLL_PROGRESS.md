# Etapa 2 — ScrollTrigger e indicador de rolagem

**Atualização de 26/10/2026:** o indicador agora calcula a proporção nativa de rolagem com `requestAnimationFrame` e `ResizeObserver`, sem baixar GSAP. As entradas das seções mantêm GSAP/ScrollTrigger, carregados somente após a primeira rolagem e respeitando movimento reduzido. O comportamento visual do indicador foi preservado; a implementação abaixo é o registro histórico da primeira versão. Diagnóstico de rede e medições estão em [FIRST_LOAD_REVIEW_2026-10-26.md](FIRST_LOAD_REVIEW_2026-10-26.md).

Atualização de 22/10: a revisão com entradas das seções, diagnóstico recebido do proprietário e novos checks está em [ANIMATION_REVIEW_2026-10-22.md](ANIMATION_REVIEW_2026-10-22.md). Os números abaixo registram a primeira versão desta etapa.

Implementação inicial em 21/10/2026, após aprovação da etapa de animações automáticas de 300 ms. A revisão de 22/10 foi aprovada para atualização no GitHub; os detalhes e resultados finais estão no relatório vinculado acima.

## Comportamento

O indicador é uma linha fixa de 4px no topo. A trilha usa `--surface` e o preenchimento usa o terracota `--accent`. O espaço da faixa superior anterior foi reaproveitado, preservando a posição do cabeçalho. O preenchimento acompanha a proporção efetivamente percorrida da página por `scaleX`, sem renderizações React por frame.

Um `ScrollTrigger` acompanha a janela. Seu limite é calculado com `ScrollTrigger.maxScroll(window)`; um `ResizeObserver` agenda atualização quando a altura do corpo muda, inclusive durante abertura/fechamento do acordeão, carregamento de conteúdo e navegação. A instância permanece no layout compartilhado. `gsap.context().revert()` e a limpeza do observer cancelam os recursos ao desmontar.

GSAP e ScrollTrigger são carregados no cliente após a montagem. A barra lateral só fica visualmente transparente depois da inicialização bem-sucedida. Seu espaço é mantido para não mudar a largura do conteúdo. A rolagem continua nativa por mouse, teclado e toque. Sem JavaScript, ou se a melhoria não inicializar, a barra nativa permanece disponível; em alto contraste, ela também permanece visível.

O indicador é decorativo e recebe `aria-hidden`, evitando anúncios contínuos do progresso. Ele acompanha diretamente a posição escolhida pelo usuário, inclusive com movimento reduzido, sem interpolação atrasada ou movimento autônomo. As preferências de animação aprovadas na etapa anterior permanecem intactas.

## Arquivos desta etapa

| Arquivo e linha                        | Alteração e motivo                                                                                                                      |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/scroll-progress.tsx:1` | Novo componente: carregamento do GSAP, ScrollTrigger, observação de altura e limpeza de recursos.                                       |
| `src/app/layout.tsx:7` e `:28`         | Importação e montagem global do indicador antes do cabeçalho, preservando-o entre rotas.                                                |
| `src/components/site-header.tsx`       | Remoção da antiga linha 65 com a faixa superior; o espaço passa ao novo indicador.                                                      |
| `src/styles/styles.css:46`             | Trilho fixo, preenchimento por transform, cores do tema e ocultação visual da barra nativa com fallback.                                |
| `package.json:26`                      | Dependência direta `gsap` fixada em `3.15.0`, necessária ao ScrollTrigger solicitado.                                                   |
| `package-lock.json`                    | Registro da mesma dependência; nenhum pacote existente foi atualizado.                                                                  |
| `tests/e2e/scroll-progress.spec.ts:1`  | Cinco cenários novos: rolagem/teclado/geometria; altura dinâmica/navegação; movimento reduzido; alto contraste; ausência de JavaScript. |

## Validação

TypeScript, ESLint, Prettier, 66 testes de componentes e build de produção passaram. Os 30 testes focados em progresso e preferência de movimento passaram nos três perfis (desktop, desktop com touch e mobile emulado).

Suíte completa contra o servidor de produção em `http://127.0.0.1:3107`: **121 testes de navegador aprovados e 8 ignorados conforme o dispositivo**, usando `npx playwright test --workers=1`. São 43 casos em três perfis, incluindo cinco casos novos de progresso; a multiplicação por perfil não representa funcionalidades adicionais.

Conferência visual adicional nas portas 3107 e 3000, em 1440 × 1000 e 390 × 844: o indicador atingiu 0%, aproximadamente 50% e 100% nas posições correspondentes. Não houve overflow horizontal nem erros de JavaScript observados nessas verificações. As capturas de desktop e mobile no meio da página foram inspecionadas.

A primeira execução completa registrou três falhas pelo mesmo seletor ambíguo no novo teste de navegação, corrigido com nome acessível exato. Também registrou uma falha no teste de preferência quando o Chromium não carregou um chunk: o trace registrou `net::ERR_NO_BUFFER_SPACE`. A validação foi repetida com um worker, sem aumentar timeouts ou remover as verificações. Uma tentativa de passar o parâmetro pelo script npm perdeu a opção neste PowerShell e foi interrompida; a execução final usa a CLI do Playwright diretamente.

O build mantém o aviso preexistente sobre `C:\Users\samue\package-lock.json`, fora do repositório. `npm audit` terminou com código 1 e informou cinco pacotes com severidade alta: `@next/eslint-plugin-next`, `eslint-config-next`, `braces`, `fast-glob` e `micromatch`. Comparei os registros com o lockfile anterior: todos já estavam nas mesmas versões antes da inclusão do GSAP. Não foi aplicado `audit fix --force` nem atualização fora do escopo.

Não foram executados Safari, Firefox, dispositivos físicos ou um benchmark de desempenho/Core Web Vitals. A etapa implementa o progresso de rolagem; os efeitos de entrada das seções dependem das referências e da aprovação seguinte.

## Documentação consultada

- [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [Contexto e limpeza no GSAP](<https://gsap.com/docs/v3/GSAP/gsap.context()/>)
- [GSAP com React](https://gsap.com/resources/React/)
