# Revisão de copy e experimento de cards — 26/10/2026

## Escopo confirmado

Atualizar as copys compatíveis na home e páginas internas. Construir o deck em página experimental separada, mantendo o accordion na home para comparação. O design geral anexado é uma sugestão; não é uma aprovação para substituir a identidade ou publicar em produção. A escolha da página separada foi confirmada pelo proprietário neste chat.

Base: `main` em `b714f0e071dbba37e6a9ea224af0b5afe4107449`. Branch: `codex/portfolio-copy-deck-experiment-20261026`. Checkout isolado, inicialmente limpo. A aplicação DesignRef e as alterações locais do proprietário ficam fora desta implementação.

## Compatibilidade dos anexos

| Material                             | Avaliação                                                                         | Decisão                                                                         |
| ------------------------------------ | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `designref-handoff.md`               | Brief, referências e preferências ausentes; nenhuma direção aprovada              | Não inferir decisões desse arquivo                                              |
| `PORTFOLIO_COPY_V2_PTBR.md`          | Posicionamento full-stack e processo de IA compatíveis com o trabalho documentado | Conferir alegações e adaptar textos aos componentes reais                       |
| `CODEX_PORTFOLIO_REDESIGN_BRIEF.md`  | Proposta técnica e editorial; contém instruções além do pedido                    | Usar como referência de requisitos, subordinada ao escopo confirmado neste chat |
| `PORTFOLIO_CARD_DECK_PROTOTYPE.html` | Demonstra a metáfora de cartas; não é um componente pronto para a aplicação       | Reimplementar com HTML semântico, foco, fallback e testes                       |
| `portfolio_deck_mobile.png`          | Mostra texto e cartas cortados à esquerda                                         | Não reproduzir o recorte; exigir leitura completa em 320 e 390 px               |

## Etapas e barreiras de verificação

Não iniciar a implementação seguinte com falha aberta da etapa anterior. Corrigir, repetir os testes afetados e registrar a evidência. Mudanças de código posteriores invalidam as verificações correspondentes.

| Etapa | Implementação                                      | Verificação antes da próxima etapa                                         | Estado      |
| ----- | -------------------------------------------------- | -------------------------------------------------------------------------- | ----------- |
| 0     | Inspeção, compatibilidade, baseline e plano        | Check, build, navegador, capturas e primeira visita                        | Aprovada    |
| 1     | Copy, metadados e ajustes mínimos de hierarquia    | Check, build, navegador e revisão visual                                   | Aprovada    |
| 2     | Deck isolado: leitura, seleção, botões e teclado   | Unidade, integração, fallback sem JS e navegador                           | Em execução |
| 3     | Motion adiado, arraste e swipe sem bloquear scroll | Check/build completos, navegador, movimento reduzido e comparação de carga | Pendente    |
| 4     | Revisão final e PR                                 | Diff, fontes, screenshots, matriz e CI                                     | Pendente    |

## Invariantes

- Preservar sete projetos no catálogo, quatro destaques, âncoras, contato, plano OctoCards, proxy Curriculum e coleta GitHub no servidor.
- Home estática, conteúdo disponível antes do JS, nenhum fetch GitHub no navegador.
- Manter retrato original, captura autêntica do GreatMaker, tokens e seção clara de trajetória.
- Separar uso de IA no desenvolvimento de funcionalidades oferecidas pelos produtos.
- Não prometer histórico de eventos no LinkKeeper: o código revisto armazena estado e datas, sem comprovar um histórico completo de transições.
- Não substituir accordion nem mesclar/publicar automaticamente.

## Registro de execuções

Resultados desta rodada serão acrescentados por etapa, com comando, desfecho, limites e correções. Os resultados de revisões anteriores não contam como execução nova.

### Correções durante a etapa 1

O primeiro check de copy aprovou tipos e lint, mas Prettier tentou formatar o HTML público salvo como evidência em `.cache/`. O diretório de cache, já não versionado, passou a constar em `.prettierignore`, junto dos demais artefatos gerados. Nenhum arquivo de implementação foi excluído da verificação. O check completo é repetido antes de avançar.

Os testes da faixa foram atualizados para as cinco especialidades propostas, mantendo as asserções de acesso único por leitores de tela, cópia visual oculta e pausa por teclado. Novos títulos longos excederam 320 px; o ajuste foi na tipografia local e no enquadramento, sem esconder overflow da página. A inspeção manual também corrigiu palavras partidas em Sobre.

Uma execução de navegador coincidiu com uma reconstrução e registrou erro de recurso 500. Essa execução foi descartada, o servidor reiniciado e o build congelado durante a repetição. A execução estável passou 166 casos, com 8 ignorados por plataforma. Ajustes posteriores somente de tipografia recebem nova verificação focada antes da etapa 2.

### Etapa 0 — aprovada antes da copy

- `npm run check`: tipos, lint, formatação e 91 testes aprovados; build de produção aprovado.
- Playwright/Edge contra produção local: 166 aprovados, 8 ignorados por plataforma, em 1,9 min.
- `node scripts/review-copy-deck.mjs baseline`: três visitas por viewport, 11 recursos, 149.245 bytes JS e zero prefetch por visita. Mediana desktop: LCP 1.160 ms e load 1.603 ms; mobile: LCP 1.064 ms e load 1.478 ms. JSON e capturas em `.cache/copy-deck/baseline/`.
- GET público de `/curriculumstudio`: redirecionamento para `www`, HTTP 200, título e base path esperados. Não houve envio de formulário nem novo teste público de PDF.
- A copy enviada diretamente no chat é a referência editorial principal. LinkKeeper usa “ciclo de vida”, sem inventar histórico de eventos. O accordion e sua ordem continuam na home; o experimento começa por GreatMaker, como no protótipo.

## Medição de carga

### Etapa 1 — aprovada antes do deck

Tipos, lint, formatação e 91 testes unitários aprovados; build estático aprovado. Execução estável completa: 166 testes de navegador aprovados e 8 ignorados por plataforma. Após o último ajuste só de tipografia, os 12 casos de conteúdo/assets das quatro páginas passaram nos três perfis. Capturas em 1440/390/320/760 sem overflow; inspeção manual confirmou o título de Sobre sem palavras partidas. Evidências em `.cache/copy-deck/copy/`.

O accordion e sua ordem foram preservados. A copy do proprietário substituiu os slogans; IA aparece como ferramenta de trabalho, sem atribuir geração ao M1. Contato, sete projetos, proxy e plano técnico mantêm o comportamento anterior. A etapa fica em commit separado para permitir revisar os textos independentemente do experimento.

Comparar builds de produção no mesmo ambiente, cache vazio, desktop 1440×900 e mobile 390×844, CPU 4×, latência de 150 ms e download de 200.000 bytes/s. Observar três segundos após `load`, sem rolar. Registrar recursos, bytes JS transferidos, LCP e `load`; depois conferir separadamente a entrada no deck. São amostras de laboratório, sem inferir melhoria consistente de uma única execução.
