# Rework: retrato, contato e progresso de engenharia

Implementação local de 19/10/2026, mantendo Next.js App Router, React, TypeScript e os tokens CSS existentes. Não houve reconstrução, instalação de dependências, publicação ou alteração de repositórios remotos. A pasta recebida não contém metadados Git; não foi possível obter um diff Git de alterações anteriores, e os arquivos não relacionados foram preservados.

## Entregas

### Retrato

A imagem indicada pelo proprietário, `samuel hero.png`, já contém somente o retrato de camisa preta. Não existe retrato esquerdo ou divisor para remover nesse arquivo. Foi feita apenas codificação WebP com qualidade 90, sem recorte, redimensionamento, filtros, reconstrução ou retoque. As dimensões permanecem 1122 × 1402; o arquivo final tem 96.974 bytes.

- Fonte SHA-256: `459425be88b0f9dc749b84750e40c7e025e0e7c2154af1826b53cce2c8b7a100`.
- WebP SHA-256: `d65889d3c823e6ea8146789092d8a322e50cf9032716e4eeb75bda74058815e3`.
- Asset: `public/images/samuel-approved.webp`.

Hero com dimensões intrínsecas, `preload`, `sizes` responsivo e `object-fit: contain`, mantendo o rosto e o enquadramento completos. Os retratos antigos foram retirados das referências da home e da página Sobre. Os arquivos antigos e screenshots históricos foram preservados; não são usados pelo site atual.

### Contato

O fluxo principal agora é um formulário em `/#contato`, com nome completo, e-mail, assunto e mensagem. GitHub, o LinkedIn fornecido pelo proprietário e e-mail direto ficam como alternativas.

`ContactForm` usa validação compartilhada com o endpoint, foco no primeiro campo inválido, mensagens associadas aos controles, feedback anunciado, bloqueio durante envio e preservação do texto em caso de falha. A confirmação significa aceitação pelo provedor, não entrega comprovada na caixa de entrada.

O endpoint Node `POST /api/contact` usa a [API REST oficial do Resend](https://resend.com/docs/api-reference/emails/send-email). A integração não adiciona SDKs. Credenciais e entrega permanecem no servidor; `reply_to` recebe o e-mail validado do visitante. O corpo é texto simples, sem interpolação HTML. A API só retorna sucesso quando recebe uma resposta positiva com ID da mensagem.

Há limite de corpo de 16 KiB, limites de campos, normalização de texto, rejeição de quebras de linha em cabeçalhos, honeypot e rejeição de origens de navegador diferentes. Nenhum dado pessoal ou erro bruto do provedor é registrado pela aplicação.

Quotas: até 3 tentativas por e-mail e 30 tentativas globais a cada janela de 10 minutos. O limite global impede que a simples troca de e-mail contorne toda a proteção. Não se confia em cabeçalhos de IP enviados pelo visitante; as chaves usam HMAC e não contêm e-mails em texto puro. Tentativas de envio rejeitadas pelo provedor também consomem quota. Redis executa incremento e TTL em um script atômico.

| Condição                                       | HTTP |
| ---------------------------------------------- | ---- |
| Dados inválidos / honeypot / JSON inválido     | 400  |
| Origem de navegador não permitida              | 403  |
| Corpo excede 16 KiB                            | 413  |
| Content-Type inesperado                        | 415  |
| Quota excedida, com Retry-After                | 429  |
| Recusa, falha ou resposta inválida do provedor | 502  |
| Configuração ausente ou limitador indisponível | 503  |
| Provedor aceitou e retornou ID                 | 200  |

### Progresso

Há uma apresentação compacta e secundária na home e um plano detalhado em `/projetos/octocards`, acessível também pelo accordion e pelo arquivo de projetos. Grupos e tarefas usam disclosures nativos, com suporte a teclado, subtarefas, dependências navegáveis, descrições e referências a código, documentação, issues, commits e PRs. Dependências abrem os grupos necessários e transferem o foco para a tarefa relacionada.

O plano atual registra 3 etapas concluídas e 9 planejadas, contando apenas folhas; 25% refere-se a este plano revisado, não à maturidade total do projeto. Nenhum progresso ativo ou bloqueio foi inventado. A fonte é uma revisão do commit [55bc8e8](https://github.com/SamuelBProenca/OctoCards/commit/55bc8e8c9c01a193df87f57d631c7071fccfc7fc), incluindo a [PR #5 integrada](https://github.com/SamuelBProenca/OctoCards/pull/5).

As consultas ao GitHub, as rotas individual/em lote e os fallbacks estão implementados no código revisado. Validação, confiabilidade HTTP, cache, testes automatizados, ajustes da documentação e consumo ao vivo pelo portfólio são propostas. O teste de serviço encontrado no repositório está vazio; o script `test` é placeholder. Não foram executados testes do repositório OctoCards nem declarada uma implantação pública dele.

O arquivo `agent-plan.tsx` citado no briefing não estava anexado. O componente foi implementado a partir dos requisitos escritos, sem simulação aleatória, nomes ilustrativos de ferramentas ou edição pública dos status. A transição de expansão é curta e respeita `prefers-reduced-motion`.

## Arquitetura

```text
src/components/contact-section.tsx          Seção, formulário e alternativas
src/components/contact-form.tsx             Estado e interação do formulário
src/lib/contact/validation.ts               Contrato e validação compartilhada
src/app/api/contact/route.ts                Endpoint HTTP e configuração privada
src/lib/contact/delivery.server.ts          Adaptador Resend REST
src/lib/contact/rate-limit.server.ts        Quotas Redis / memória

src/types/project-progress.ts              Tipos de plano, tarefas, referências e fonte
src/content/project-progress/octocards.ts   Plano editorial com evidências
src/content/project-progress/index.ts       Fonte local assíncrona
src/lib/project-progress.ts                Cálculo e integridade das dependências
src/lib/github/project-progress.ts         Adaptador puro de snapshots de issues
src/components/project-progress/
  EngineeringProgress.tsx                  Resumo compacto
  ProjectPlan.tsx                          Grupos e navegação de dependências
  ProjectTask.tsx                          Tarefa e subtarefas recursivas
  StatusIndicator.tsx                      Os quatro estados com texto e símbolo
  ProjectProgressSummary.tsx               Contadores e barra acessível
src/app/projetos/octocards/page.tsx         Demonstração detalhada
```

O adaptador GitHub não faz sincronização hoje. Uma fonte futura pode implementar `ProjectProgressSource.load` e fornecer o mesmo `ProjectPlan` sem reescrever os componentes. Um issue fechado só é tratado como concluído quando `state_reason` informa `completed`; estados ativos exigem rótulos explícitos. Issues encerrados como `not_planned` são sinalizados para revisão, nunca como entrega concluída.

## Configuração para envio real

Copie `.env.example` para `.env.local` somente se esse arquivo ainda não existir; em hospedagem, configure as variáveis no painel do provedor. Não publique valores reais.

```env
RESEND_API_KEY=
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
CONTACT_RATE_LIMIT_MODE=
```

1. Crie uma chave de envio no Resend e preencha `RESEND_API_KEY`.
2. Faça a [verificação do domínio remetente no Resend](https://resend.com/docs/dashboard/domains/introduction), com os registros DNS fornecidos pelo serviço. Use em `CONTACT_FROM_EMAIL` um endereço simples desse domínio, sem nome de exibição. Defina o destinatário em `CONTACT_TO_EMAIL`.
3. Em serverless ou múltiplas instâncias, configure `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN` de um banco Redis com permissão para EVAL/INCR/PEXPIRE/PTTL. A integração usa a [API REST documentada do Upstash](https://upstash.com/docs/redis/features/restapi). Não inclua tokens na URL.
4. Como alternativa explícita, em **um único processo Node persistente**, defina `CONTACT_RATE_LIMIT_MODE=memory`. Esse modo perde quotas no reinício e não compartilha estado entre processos. Não é adequado a serverless ou múltiplas réplicas. Em desenvolvimento/teste ele é o fallback local.
5. Reinicie o servidor e faça um envio de verificação após configurar os serviços. Nenhum envio real foi realizado nesta implementação; faltam credenciais e confirmação de domínio.

Em produção, sem Redis configurado e sem escolha explícita do modo memória, o endpoint retorna 503. Falhas do Redis também impedem o envio. A aplicação precisa de hospedagem com runtime Node e saída HTTPS para Resend e Redis; `next start` é suportado. Um export estático não comporta esse endpoint. Proxies devem preservar host e protocolo públicos para a verificação de origem.

Os limites globais são conservadores para um portfólio. Ajuste-os conforme tráfego real. Sob abuso mais intenso, uma proteção de borda e/ou desafio anti-bot pode complementar as quotas; não foi apresentada uma solução de CAPTCHA inexistente.

## Arquivos criados e modificados

Criados: os 17 arquivos de componentes, contratos, dados, helpers e rotas listados na arquitetura; `.env.example`; `src/styles/rework.css`; `public/images/samuel-approved.webp`; `tests/unit/contact-form.test.tsx`; `tests/unit/contact-route.test.ts`; `tests/unit/project-progress.test.ts`; este relatório; nove screenshots `docs/screenshots/rework-*.png`.

Modificados:

- `src/app/page.tsx`: retrato, contato e progresso compacto.
- `src/app/layout.tsx`: importação dos estilos adicionais.
- `src/app/sobre/page.tsx`: retirada do retrato antigo.
- `src/app/projetos/page.tsx`: link para o plano OctoCards.
- `src/components/selected-works.tsx`: link contextual para o plano.
- `src/content/projects.ts`: destino interno opcional de detalhes.
- `src/styles/tokens.css`, `src/styles/styles.css`, `src/styles/responsive.css`: estados e apresentação das imagens.
- `tests/e2e/portfolio.spec.ts`: novas verificações e ajuste do seletor do link do repositório.
- `README.md`: orientação de uso e configuração.

## Validação executada

| Verificação                                          | Resultado                                                                                                                 |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| TypeScript estrito                                   | Passou                                                                                                                    |
| ESLint                                               | Passou                                                                                                                    |
| Prettier                                             | Passou                                                                                                                    |
| Vitest                                               | 34 testes passaram                                                                                                        |
| Build Next.js de produção                            | Passou, incluindo `/api/contact` dinâmico e `/projetos/octocards`                                                         |
| Playwright Chromium desktop/mobile                   | 33 passaram; 1 ignorado intencionalmente por testar menu mobile no desktop                                                |
| Tablet 820 px                                        | Rotas, imagem e ausência de overflow verificadas nos dois projetos do Playwright                                          |
| Segredos no navegador                                | Busca nos assets de `.next/static` não encontrou identificadores das credenciais privadas nem o token fictício dos testes |
| Referências de imagens antigas e progresso aleatório | Busca em `src` não encontrou referências às fotos antigas ou `Math.random`                                                |

Os testes do endpoint usam respostas simuladas de Resend/Redis e verificam aceitação com ID, recusa, falha de rede, limites, sanitização, honeypot, origem, configuração ausente e falha do limitador. O teste de sucesso da interface no navegador intercepta o endpoint: não comprova entrega externa. O Playwright também exercita respostas reais de validação do endpoint local.

Os testes do progresso verificam cálculo sem contagem dupla, dependências existentes/sem ciclos, expansão de grupos/subtarefas, teclado, foco da dependência, link da PR e preferência por movimento reduzido. Não é uma auditoria completa com leitores de tela ou dispositivos físicos.

O servidor temporário foi usado na porta 3002 com `PLAYWRIGHT_BASE_URL`; os servidores e processos preexistentes não foram interrompidos. O relatório HTML da última suíte fica em `playwright-report/index.html`.

## Screenshots

Além da suíte, uma verificação adicional em 320, 390, 820 e 1440 px confirmou zero overflow na home e no plano, a palavra “construir” sem quebra no título de contato e contraste de 5,27:1 entre os rótulos do formulário e seu fundo. As capturas foram atualizadas e revisadas após o ajuste desse título.

| Seção   | Desktop                                           | Mobile                                          | Tablet                                          |
| ------- | ------------------------------------------------- | ----------------------------------------------- | ----------------------------------------------- |
| Hero    | [1440 px](screenshots/rework-hero-desktop.png)    | [390 px](screenshots/rework-hero-mobile.png)    | [820 px](screenshots/rework-hero-tablet.png)    |
| Contato | [1440 px](screenshots/rework-contact-desktop.png) | [390 px](screenshots/rework-contact-mobile.png) | [820 px](screenshots/rework-contact-tablet.png) |
| Plano   | [1440 px](screenshots/rework-plan-desktop.png)    | [390 px](screenshots/rework-plan-mobile.png)    | [820 px](screenshots/rework-plan-tablet.png)    |

A revisão seguiu as orientações de [melhorar um design existente](https://impeccable.style/docs/improve-design/) e [trabalhar dentro do sistema visual](https://impeccable.style/docs/design-system/): tipografia e tokens existentes, disclosures simples, sem efeitos decorativos ou cartões de dashboard.

## Futuro, não entregue

- Configurar domínio, credenciais e quotas na hospedagem escolhida e testar envio real.
- Sincronizar Issues, Milestones e Pull Requests com revisão editorial dos status.
- Atualizar o plano com o avanço real de OctoCards e implementar as melhorias no próprio repositório quando solicitado.
- Medir acessibilidade com leitor de tela e desempenho em dispositivos físicos.
- Considerar proteção de borda anti-abuso conforme o tráfego observado.
