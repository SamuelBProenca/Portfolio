# Refinamento de animações

## Atualização de 21/10/2026: mouse em desktops com touch

O domínio principal informado pelo proprietário é `https://www.samuelproenca.com/`. A PR #8 foi integrada à `main` para disponibilizar as animações dessa revisão em produção.

A inspeção desse domínio também reproduziu um bloqueio de hover: em um desktop emulado com touch e mouse, `:hover` estava ativo, mas a condição `(hover: hover) and (pointer: fine)` impedia o preenchimento e os sublinhados. Esse cenário reproduzível não confirma o hardware do proprietário.

As regras agora respondem ao dispositivo usado no evento de ponteiro. O componente compartilhado `PointerInput` registra mouse, toque ou caneta em `data-input`, inclusive após alternar os dispositivos. O hover fica desabilitado durante o toque para evitar estados presos; foco por teclado, pressão e movimento reduzido continuam disponíveis. As animações permanecem em CSS, sem dependências novas, loops de JavaScript ou alterações de layout.

Arquivos desta correção: `src/components/pointer-input.tsx`, `src/app/layout.tsx`, `src/styles/interactions.css`, `playwright.config.ts`, `tests/e2e/desktop-pointer.spec.ts` e este relatório. A configuração do Playwright acrescenta um desktop com touch aos perfis existentes.

Validação local contra o servidor de produção: **66 testes de unidade/integração aprovados; 97 testes de navegador aprovados e 8 ignorados conforme o dispositivo**. Os dois novos cenários verificam frames intermediários reais do preenchimento e sublinhado com mouse, incluindo ponteiro principal coarse, e a alternância toque → mouse sem hover preso. A suíte completa também valida faixa contínua, acordeão nas duas direções, teclado, movimento reduzido, contraste, geometria e ausência de overflow. TypeScript, ESLint, Prettier e build de produção passaram. O build emitiu apenas um aviso sobre um `package-lock.json` externo ao repositório, ignorado pelo Next.js.

## Atualização: movimento visível e preferência do navegador

A revisão seguinte reproduziu o comportamento instantâneo ao emular `prefers-reduced-motion: reduce`: as regras existentes reduziam as transições a 0,01ms e removiam a animação da faixa. Isso é uma reprodução do sintoma, não uma confirmação da configuração do navegador do proprietário.

O novo `MotionControl`, no layout compartilhado, oferece **Ativar animações** quando essa preferência está presente. A escolha explícita aplica `data-motion="full"`, persiste no armazenamento local, funciona entre páginas e pode ser desfeita em **Reduzir movimento**. Se o armazenamento estiver bloqueado, o controle continua funcionando durante a visita. A preferência do sistema permanece sendo o padrão.

O preenchimento e os sublinhados usam 500ms com `cubic-bezier(0.45, 0, 0.55, 1)`, evitando que quase toda a mudança aconteça no início. A cor do preenchimento principal foi escurecida para tornar a progressão mais perceptível mantendo o contraste. O acordeão usa 750ms; a faixa de Backend, Automação, Arquitetura e Infraestrutura usa um loop linear de 24 segundos. O rótulo estático duplicado dentro da hero foi removido.

Validação atual: **66 testes de unidade/integração aprovados**, **61 testes de navegador aprovados e 5 ignorados por dispositivo**. TypeScript, ESLint, Prettier, build de produção e verificação de whitespace passaram. Os novos testes verificam a preferência do sistema, ativação explícita, persistência, restauração, armazenamento indisponível e estados intermediários reais do preenchimento sob movimento reduzido. A inspeção visual confirmou o preenchimento intermediário em desktop e a faixa no mobile sem overflow horizontal.

Arquivos novos desta revisão: `src/components/motion-control.tsx`, `tests/unit/motion-control.test.tsx` e `tests/e2e/motion-preference.spec.ts`. A integração fica em `src/app/layout.tsx`; as condições de movimento reduzido nos três arquivos de estilos agora respeitam a escolha explícita.

## Registro da implementação anterior

Implementação e validação local em 20/10/2026. A inspeção incluiu os componentes atuais, estilos e tokens, testes, `AGENTS.md` e os guias locais do Next.js. “Reader” foi confirmado pelo proprietário como a navegação do cabeçalho.

## Alterações

| Interação                       | Implementação                                                                                                                                                                                                                                                                      |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accordion de projetos           | Expansão e recolhimento por CSS Grid de `0fr` a `1fr`, com altura intrínseca, opacidade e easing compartilhado em 440ms. O conteúdo permanece montado para permitir a animação de saída.                                                                                           |
| Acessibilidade do accordion     | Painéis recolhidos recebem `aria-hidden` e `inert` imediatamente após a atualização de estado. Links em fechamento deixam de participar da navegação por teclado. A visibilidade visual termina depois da transição.                                                               |
| Interrupção e conteúdo dinâmico | As transições CSS revertem a partir da posição atual, sem timers ou travas. A altura acompanha o conteúdo e a largura disponível, sem limites fixos em pixels. O recorte fica no contêiner externo para evitar uma faixa vazia durante a interpolação das linhas do grid.          |
| Ícone do accordion              | A haste vertical gira e desaparece progressivamente, preservando os estados de mais e menos.                                                                                                                                                                                       |
| Seleção no cabeçalho            | Os links permanecem montados ao trocar de rota, permitindo a transição real entre os estados. O sublinhado usa `scaleX`, origem à esquerda e 320ms; `@starting-style` também fornece um estado inicial na primeira renderização e ao abrir o menu mobile.                          |
| Botões                          | O preenchimento usa um pseudo-elemento com `scaleX` de 0 a 1 e duração de 320ms, no lugar de animar `background-size`. Texto e setas ficam sobre o preenchimento, com cores e contraste preservados. Hover, foco, pressão e reversão continuam disponíveis conforme o dispositivo. |
| Faixa de especialidades         | Duas cópias idênticas formam um track com movimento de `translateX(0)` a `translateX(-50%)`, linear, infinito e com período de 38 segundos. O conteúdo repetido fica oculto para tecnologia assistiva.                                                                             |
| Pausa e movimento reduzido      | Um botão de 44px permite pausar e retomar a faixa sem reiniciar a posição, inclusive por teclado. Com movimento reduzido, a animação e a cópia são removidas; todos os temas aparecem em uma faixa estática que quebra linhas no mobile.                                           |

As cores, a tipografia, os textos e a direção visual foram preservados. Não foram adicionadas dependências, medições de altura por JavaScript ou loops de animação no React. A alteração de altura do accordion exige layout durante a expansão; o preenchimento e a faixa usam transforms.

## Verificações executadas

| Comando/verificação                              | Resultado final                                                                                                                                             |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run check`                                  | TypeScript, ESLint, Prettier e Vitest aprovados                                                                                                             |
| Vitest                                           | 63 testes aprovados em 7 arquivos; antes desta etapa eram 59 em 6 arquivos                                                                                  |
| `npm run build`                                  | Produção compilada com sucesso; 8 páginas geradas                                                                                                           |
| `npm run test:e2e` contra o servidor de produção | 55 aprovados, 5 ignorados por dispositivo, nenhum falhando                                                                                                  |
| `git diff --check`                               | Aprovado                                                                                                                                                    |
| Inspeção visual                                  | Desktop em 1440px, mobile em 390px e 320px; preenchimento e accordion também inspecionados em estados intermediários                                        |
| Geometria e loop                                 | Continuidade da faixa em 320/820/1440px, grupos idênticos, continuidade de pausa/retomada, ausência de overflow horizontal e geometria estável dos CTAs     |
| Amostra de desempenho                            | Uma janela de 35 frames da faixa em movimento registrou 0 layouts e 35 recálculos de estilo no Chromium; não equivale a um benchmark completo de desempenho |

Os novos testes de componente cobrem retenção dos painéis durante o fechamento, exclusão de conteúdo recolhido da interação, seleção repetida, conteúdo acessível sem duplicação e pausa/retomada por teclado. O teste de mudança de rota agora verifica que os links mantêm a identidade do DOM.

Os seis novos cenários de navegador verificam altura e opacidade intermediárias nas duas direções, foco, interrupções rápidas, conteúdo dinâmico e redimensionamento, desenho progressivo da seleção, preenchimento progressivo e reverso, continuidade do loop e comportamento estático com movimento reduzido. Os testes de contraste e estados dos CTAs existentes foram adaptados para o novo pseudo-elemento.

Os cinco casos ignorados são específicos a dispositivos: quatro verificações de hover/continuidade desktop no perfil mobile e o menu mobile no perfil desktop. A seleção e navegação touch continuam verificadas pela suíte.

Na primeira execução, os testes detectaram uma largura incorreta da faixa estática no mobile, corrigida antes da validação final. Também foram corrigidos pontos do próprio teste: leitura de `inert` antes do commit do React, isolamento de overrides de timeline usados na inspeção do loop e seleção do botão pelo nome atualizado após pausar. Todas as falhas foram resolvidas; a suíte completa passou após a última alteração de CSS.

## Arquivos desta etapa

Todos os caminhos são relativos à pasta `portfolio/` do aplicativo:

- `src/app/page.tsx`
- `src/components/intro-strip.tsx` (novo)
- `src/components/selected-works.tsx`
- `src/components/site-header.tsx`
- `src/styles/tokens.css`
- `src/styles/styles.css`
- `src/styles/responsive.css`
- `src/styles/interactions.css`
- `tests/unit/intro-strip.test.tsx` (novo)
- `tests/unit/selected-works.test.tsx`
- `tests/unit/site-header.test.tsx`
- `tests/e2e/fluidity.spec.ts` (novo)
- `tests/e2e/interactions.spec.ts`
- `docs/ANIMATION_REFINEMENTS.md` (novo)

## Limites

Na revisão para commit, foram removidas 22 regras CSS sem consumidores, regras redundantes de interação, retratos antigos sem uso na aplicação e o adaptador experimental de issues do GitHub que só era chamado por seu próprio teste. A imagem aprovada atual e os arquivos históricos em `legacy/` foram preservados. O teste exclusivo do adaptador removido também saiu; a suíte atual tem 62 testes de unidade/integração.

O Next.js continua emitindo o aviso já existente sobre `C:\Users\samue\package-lock.json`, externo ao repositório e ignorado. Isso não impediu build ou execução. O servidor de produção local usado nos testes foi encerrado ao final.

A validação de navegador usa Chromium desktop e mobile emulado. Safari/WebKit, Firefox e dispositivos físicos não foram executados. Em navegadores sem suporte a `@starting-style`, a animação inicial do sublinhado pode não ocorrer; as transições de seleção em links já montados continuam disponíveis.
