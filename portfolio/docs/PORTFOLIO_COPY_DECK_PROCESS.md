# Revisão de copy e experimento de cards — 26/10/2026

## Escopo confirmado

Retomada em 27/10/2026: o proprietário exige ver as capturas e aprovar antes de enviar a branch ao GitHub, abrir PR ou publicar. A entrega desta rodada termina com a versão local testada e a solicitação dessa aprovação; CI remoto permanece pendente do envio autorizado.

Finalização local em 28/10/2026: o relatório da última suíte, concluída em 27/10, foi conferido antes de retomar. Capturas, comparação de carga e documentação foram concluídas sobre o mesmo código de aplicação. Nenhum push, PR ou deployment foi executado.

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

| Etapa | Implementação                                      | Verificação antes da próxima etapa                                         | Estado                                                        |
| ----- | -------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 0     | Inspeção, compatibilidade, baseline e plano        | Check, build, navegador, capturas e primeira visita                        | Verificada                                                    |
| 1     | Copy, metadados e ajustes mínimos de hierarquia    | Check, build, navegador e revisão visual                                   | Verificada                                                    |
| 2     | Deck isolado: leitura, seleção, botões e teclado   | Unidade, integração, fallback sem JS e navegador                           | Verificada                                                    |
| 3     | Motion adiado, arraste e swipe sem bloquear scroll | Check/build completos, navegador, movimento reduzido e comparação de carga | Verificada                                                    |
| 4     | Revisão final e apresentação local                 | Diff, fontes, capturas, matriz e aprovação do proprietário                 | Revisão técnica concluída; aprovação do proprietário pendente |

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

### Correções durante a etapa 3

O primeiro ensaio de interação encontrou dois problemas reais: Motion mini conserva os valores finais em estilos inline, e a perda de captura implícita de um elemento filho no toque cancelava o swipe do palco. A limpeza agora remove somente as propriedades animadas ao concluir ou interromper; a perda de captura de um filho não cancela a nova captura do palco. Os casos de mouse e toque passaram após as correções. O novo teste de troca rápida também encontrou um seletor de teste ambíguo para os quatro `summary`; o seletor foi limitado ao artigo ativo, sem alterar o comportamento da aplicação.

Tipos, lint, formatação, 102 testes unitários e build de produção aprovados após as correções. A primeira suíte completa com Motion passou 195 casos de navegador, com 9 ignorados por perfil. O build fica congelado durante testes e capturas.

### Etapa 2 — deck estático aprovado

Quatro testes unitários aprovados para seleção, limites, foco e links. Nove testes de navegador aprovados nos três perfis: teclado, 320/390/760/1440 e leitura dos quatro projetos sem JavaScript. Build estático e verificação de tipos aprovados. A revisão visual removeu a altura compartilhada excessiva: somente a carta ativa determina a altura do deck. A mesma matriz de nove testes passou após o ajuste. Capturas em `.cache/copy-deck/deck-static/`; a linha fixa de progresso é omitida apenas nas capturas da seção, para não atravessar a composição ao fotografar uma região maior que o viewport.

### Etapa 1 — aprovada antes do deck

Tipos, lint, formatação e 91 testes unitários aprovados; build estático aprovado. Execução estável completa: 166 testes de navegador aprovados e 8 ignorados por plataforma. Após o último ajuste só de tipografia, os 12 casos de conteúdo/assets das quatro páginas passaram nos três perfis. Capturas em 1440/390/320/760 sem overflow; inspeção manual confirmou o título de Sobre sem palavras partidas. Evidências em `.cache/copy-deck/copy/`.

O accordion e sua ordem foram preservados. A copy do proprietário substituiu os slogans; IA aparece como ferramenta de trabalho, sem atribuir geração ao M1. Contato, sete projetos, proxy e plano técnico mantêm o comportamento anterior. A etapa fica em commit separado para permitir revisar os textos independentemente do experimento.

## Medição de carga

Comparar builds de produção no mesmo ambiente, cache vazio, desktop 1440×900 e mobile 390×844, CPU 4×, latência de 150 ms e download de 200.000 bytes/s. Observar três segundos após `load`, sem rolar. Registrar recursos, bytes JS transferidos, LCP e `load`; depois conferir separadamente a entrada no deck. São amostras de laboratório, sem inferir melhoria consistente de uma única execução.

### Resultado final de carga

| Página / rodada     | Recursos | JS transferido | Prefetch | LCP mediano desktop / mobile | Load mediano desktop / mobile |
| ------------------- | -------- | -------------- | -------- | ---------------------------- | ----------------------------- |
| Home / base         | 11       | 149.245 bytes  | 0        | 1.160 / 1.064 ms             | 1.603 / 1.478 ms              |
| Home / final        | 11       | 149.365 bytes  | 0        | 1.120 / 1.056 ms             | 1.566 / 1.471 ms              |
| Experimento / final | 12       | 149.789 bytes  | 0        | 1.176 / 1.088 ms             | 1.451 / 1.438 ms              |

São três visitas frias por página e viewport, com `transferSize` incluindo cabeçalhos. A home cresceu 120 bytes de JavaScript na rodada inteira de copy/deck; o experimento manteve Motion fora da carga inicial. As pequenas diferenças de tempo não provam melhoria para visitantes reais. Evidências reproduzíveis: `scripts/review-copy-deck.mjs`, JSON em `.cache/copy-deck/baseline/measurements.json` e `.cache/copy-deck/deck-reviewed/measurements.json`.

Uma medição separada focou o deck com `preventScroll`, após a página estabilizar: somente um chunk adicional de 5.186 bytes foi solicitado, com `scrollY=0`. As amostras a cada 65 ms mostram transformação, opacidade e altura progredindo e zero animações restantes na amostra de 325 ms. A duração configurada é 300 ms. O resultado está em `.cache/copy-deck/deck-reviewed/interaction.json`; ele mede o download opcional e a transição, sem atribuir o download de GSAP ao deck.

### Etapa 4 — revisão visual e lote de correções

A revisão independente da skill Impeccable emitiu `fix` com dois pontos materiais: a introdução deixava o deck muito abaixo da primeira tela, e os novos rótulos anteriores aos títulos contrariavam sua regra de hierarquia. O lote removeu o rótulo da introdução, tornou o cabeçalho local mais compacto e colocou a categoria depois do nome do projeto. O componente compartilhado de páginas internas e a estrutura da home foram preservados.

O teste de viewport passou a exigir a carta inicial inteira em 1440×900 e o resumo útil na primeira tela em 320×900, 390×844 e 760×1000. Tipos, lint, formatação, 102 unitários e build passaram depois desse lote. A rodada completa final teve 204 casos: 195 aprovados, 9 ignorados por perfil, zero falhas e zero casos marcados como instáveis. O relatório HTML salvo e `.last-run.json` foram conferidos na retomada.

Uma reinicialização da sessão de ferramentas interrompeu a execução seguinte antes de produzir resultado final. Ela foi descartada, e o servidor restaurado usando o mesmo build. A repetição identificou um chunk inicial do Next/Image fora das tags `script` do HTML; o teste passou a comparar os downloads antes e depois da intenção de interação, exigindo um novo download para ativar Motion, em vez de confundir esse código inicial de imagem com animação opcional. Dois testes antigos perderam a janela intermediária de animação sob carga simultânea; a rodada final usa um worker, sem alargar seus limites nem alterar as animações existentes.

O carregador de contexto/detector da skill não estava disponível neste ambiente. A revisão leu diretamente `PRODUCT.md`, `DESIGN.md`, contrato, fontes e capturas; não representa uma execução do detector nem uma avaliação automática completa de design.

As quatro capturas finais aguardam a decodificação da imagem antes da fotografia, evitando confundir um asset ainda carregando com conteúdo ausente. A revisão inicial pediu dois ajustes; o parecer de retorno marcou ambos como resolvidos, com `disposition: ship` restrito a esses itens. Parecer em `PROJECT_DECK_REVIEW.md`; conferência do sistema visual em `PROJECT_DECK_SYSTEM_CHECK.md`. O `DESIGN.md` existente foi preservado. Essa revisão técnica não substitui a aprovação do proprietário para envio ou publicação.

## Como comparar e usar

1. Abrir `http://127.0.0.1:3400/` para ler a copy atualizada e experimentar o accordion existente.
2. Abrir `http://127.0.0.1:3400/experimentos/cards` para comparar o deck separado. O link “Comparar com a home” retorna à seção de projetos.
3. Usar os botões anterior/próximo ou 01–04. No palco focado, `←`/`→` avançam uma carta e `Home`/`End` vão aos extremos. Não há rotação automática nem retorno circular.
4. No toque ou sobre a imagem com mouse, arrastar horizontalmente por uma distância deliberada. Arrastes curtos voltam à posição original; o scroll vertical e o zoom continuam nativos. Arrastar a partir de um link não troca o projeto nem abre o destino.
5. Abrir “Detalhes do projeto” para ler o contexto e as limitações. Os links levam ao repositório, plano técnico ou aplicação conforme a disponibilidade real de cada projeto.
6. Com movimento reduzido, a seleção acontece sem animação. Sem JavaScript, os quatro projetos aparecem como uma lista vertical com links e detalhes nativos. Se o chunk opcional falhar, os controles continuam funcionando.

## Retomada e limites de validação

O commit local `9cdefaf` separa as copys do experimento. Antes de enviar qualquer branch, abrir PR ou publicar, apresentar esta rodada ao proprietário e receber aprovação explícita. O envio ainda não foi autorizado. CI remoto e validação de deployment continuam pendentes desse envio.

Navegadores nesta rodada: Edge/Chromium com três perfis (desktop, desktop com toque e mobile emulado). Não houve teste em aparelho físico, Safari ou Firefox. O GET público de Curriculum foi conferido na etapa inicial; formulário e PDF públicos não receberam submissões nesta rodada. Os testes de contato e proxy usam os cenários locais controlados da suíte.

Para reproduzir, usar o build local na porta 3400, `npm run check`, `npm run build` e Playwright com `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3400` e `PLAYWRIGHT_CHANNEL=msedge`. Nunca reconstruir o build durante uma suíte de navegador ou medição. Corrigir falhas, repetir a etapa afetada e só então avançar. Capturas de revisão são evidências locais e não novas imagens de produto.
