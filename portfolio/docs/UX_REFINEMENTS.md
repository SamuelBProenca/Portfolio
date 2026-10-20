# Refinamentos de experiência, conteúdo e testes

Validação local em 20/10/2026.

## Inspeção e convenções preservadas

O aplicativo atual está em `portfolio/`; as versões em `legacy/` foram mantidas. A inspeção precedeu as alterações e incluiu `AGENTS.md`, os guias locais do Next.js para CSS, navegação e Vitest, componentes, conteúdo tipado, estilos, testes e os documentos de direção visual e fontes dos projetos.

A arquitetura usa Next.js App Router, TypeScript, componentes compartilhados e arquivos de conteúdo separados. Os estilos globais seguem tokens de cor, fontes, composição editorial e breakpoints existentes. Foram preservados o fundo escuro, o contraste em papel, a cor terra, o retrato e a assinatura “MENOS RUÍDO. MAIS SISTEMA.”. Nenhuma dependência foi adicionada.

Os testes seguem Vitest com jsdom e Testing Library em `tests/unit`, além de Playwright com Chromium desktop e emulação mobile em `tests/e2e`.

## UI e interações

- Navegação desktop e mobile: sublinhado com expansão a partir da esquerda e retração suave, ativado por hover ou foco de teclado. A marca permanece na página ativa. Páginas internas, como `/projetos/octocards`, identificam a seção Projetos com `aria-current="location"`; destinos exatos usam `page`.
- CTA principal, contato do cabeçalho e envio do formulário: preenchimento da esquerda para a direita, foco visível e deslocamento visual de 1px ao pressionar. A cor do texto permanece estável; os contrastes do fundo inicial e do preenchimento foram verificados no navegador com mínimo de 4,5:1.
- Links editoriais: a seta se desloca sem alterar o espaçamento nem a posição de elementos vizinhos. Menu, accordion e controles do plano técnico compartilham feedback visual e timing de 280ms.
- As animações usam CSS e tokens compartilhados. Hover novo se aplica apenas a dispositivos com ponteiro preciso e suporte a hover. Estados ativos e foco permanecem disponíveis em touch e teclado.
- A preferência por movimento reduzido desativa as transições perceptíveis e os deslocamentos decorativos. O sublinhado e o preenchimento continuam indicando estado.
- O título da home foi ajustado para caber em 320px. O texto secundário da linha do tempo passou a usar uma cor legível sobre papel. O texto alternativo do retrato não faz mais referência à cor da camisa.
- Os links de repositório na lista de projetos e o botão do menu têm área mínima de 44px. Cards da página Escrita passaram de links para si mesmos a blocos com nome acessível e status de futuras publicações; os IDs de âncora foram preservados.
- O formulário agora restaura o foco no campo inválido depois que o React reabilita os campos após erro do servidor. Respostas JSON nulas ou sem a estrutura esperada geram feedback recuperável, preservando o rascunho.

## Conteúdo

As revisões abrangem a apresentação e os CTAs da home, introduções de trabalhos e escrita, descrições de OctoCards e Design Patterns Dojo, resumo de OpsCLI, páginas Projetos, Sobre e Escrita, seção de contato, instrução do formulário e descrição global dos metadados.

| Antes                                                                                                                | Depois                                                                                                                                     | Motivo                                                                                                          |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| “Desenvolvo ferramentas, automações e soluções backend a partir de problemas que precisam funcionar fora da teoria.” | “Desenvolvo APIs, ferramentas e automações para organizar dados e simplificar rotinas. Minha base em infraestrutura orienta cada decisão.” | Explicita entregas, benefícios e a base profissional já documentada.                                            |
| “Projetos que existem por um motivo.”                                                                                | “Cada projeto, um problema para resolver.”                                                                                                 | Introduz o trabalho pelo problema; o texto de apoio orienta a leitura de contexto, código disponível e estágio. |
| “Vamos construir algo bom.”                                                                                          | “Vamos falar do próximo projeto.”                                                                                                          | Faz um convite concreto, acompanhado de espaço para projetos e oportunidades em equipe.                         |
| “Explorar a categoria”                                                                                               | “Conheça a proposta”                                                                                                                       | Alinha a expectativa à página de temas futuros, que ainda não contém artigos.                                   |
| Promessa de futuras páginas para todos os projetos                                                                   | Convite para explorar o plano técnico existente do OctoCards                                                                               | Conduz a uma evidência disponível agora.                                                                        |

Nenhuma experiência, certificação, cliente, resultado ou métrica foi acrescentada. OpsCLI continua identificado como proposta com README público e código indisponível; Design Patterns Dojo continua apresentado como estudo. Escrita continua sem artigos publicados. As decisões e etapas técnicas do plano do OctoCards não foram reescritas.

## Testes e resultados

Antes das alterações, `npm test` executou **36 testes em 5 arquivos**, todos aprovados. Depois das alterações, executou **59 testes em 6 arquivos**, todos aprovados: **23 casos adicionais**. Não foi medida cobertura percentual; o projeto não configura um provedor de cobertura.

Cobertura funcional adicionada:

- **Cabeçalho, 4 casos:** página inicial, destino exato, seção de página interna e rejeição de prefixos parecidos.
- **Formulário, 5 casos:** associação de erro do servidor ao campo, foco e reenvio com sucesso; três respostas malformadas ou incompletas; timeout com preservação do rascunho. O teste de validação existente também verifica a descrição acessível.
- **Validação compartilhada, 14 casos:** normalização Unicode, quebras de linha e caracteres de controle; limites exatos e excesso nos quatro campos; payloads inválidos; injeção de quebras em cabeçalhos; honeypot e tipos inesperados.
- **Navegador, 7 cenários novos nos dois perfis:** título em 320/390/820/1440px; seção ativa e destino do CTA de Sobre; expansão e retração do sublinhado por hover e teclado; preenchimento, contraste e geometria dos CTAs; movimento reduzido; foco e reenvio após erro do servidor; âncoras e semântica das coleções de escrita.

| Verificação executada                                              | Resultado final                                                                                           |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `npm run check`                                                    | Aprovado: TypeScript, ESLint, Prettier e Vitest                                                           |
| `npm test` (incluído em `check`)                                   | 59 aprovados, nenhum falhando                                                                             |
| `npm run build`                                                    | Build de produção aprovado; 8 páginas geradas                                                             |
| `npm run test:e2e` com `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3107` | 45 aprovados, 3 ignorados intencionalmente, nenhum falhando                                               |
| `git diff --check`                                                 | Aprovado                                                                                                  |
| Inspeção visual com Chromium                                       | Home e contato em desktop, tablet e mobile; Sobre e Escrita em mobile; correções finais revistas em 320px |

Os três casos ignorados são dois testes de hover no perfil touch e o teste de menu mobile no perfil desktop. O navegador usou o servidor de produção iniciado com `node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3107`, encerrado após a validação.

A primeira execução de navegador encontrou ambiguidade no seletor antigo de contato após a inclusão do CTA de Sobre. O seletor foi limitado ao cabeçalho, e a suíte completa passou na execução seguinte. A tentativa inicial de iniciar o servidor por `npm run start -- --hostname ... --port ...` perdeu as flags neste PowerShell/npm; a invocação direta do Next.js acima funcionou.

## Arquivos alterados

Todos os caminhos abaixo são relativos à pasta do aplicativo:

| Arquivo                                        | Alteração                                                                             |
| ---------------------------------------------- | ------------------------------------------------------------------------------------- |
| `src/app/layout.tsx`                           | Importação dos estilos compartilhados de interação e metadados                        |
| `src/app/page.tsx`                             | Apresentação, introduções, CTAs e texto alternativo                                   |
| `src/app/projetos/page.tsx`                    | Introdução e convite para o plano existente                                           |
| `src/app/sobre/page.tsx`                       | Introdução, CTAs e texto alternativo                                                  |
| `src/app/escrita/page.tsx`                     | Expectativas de publicação e coleções sem links para si mesmas                        |
| `src/components/site-header.tsx`               | Estado de seção para rotas internas                                                   |
| `src/components/contact-section.tsx`           | Convite de contato                                                                    |
| `src/components/contact-form.tsx`              | Instruções, foco após erro e respostas inesperadas                                    |
| `src/content/projects.ts`                      | Resumos e descrições com contexto e benefícios                                        |
| `src/styles/tokens.css`                        | Tokens de timing, preenchimento e texto sobre papel                                   |
| `src/styles/interactions.css` (novo)           | Interações compartilhadas, foco, touch e movimento reduzido                           |
| `src/styles/styles.css`                        | Remoção de hovers conflitantes, estilos das coleções e legibilidade da linha do tempo |
| `src/styles/responsive.css`                    | Título em telas estreitas                                                             |
| `src/styles/rework.css`                        | Timing do plano e remoção de hover conflitante do envio                               |
| `tests/unit/site-header.test.tsx`              | Regressões de navegação                                                               |
| `tests/unit/contact-form.test.tsx`             | Erros, acessibilidade e recuperação                                                   |
| `tests/unit/contact-validation.test.ts` (novo) | Validação compartilhada                                                               |
| `tests/e2e/portfolio.spec.ts`                  | Seletor de contato limitado ao cabeçalho                                              |
| `tests/e2e/interactions.spec.ts` (novo)        | Interações, acessibilidade e responsividade                                           |
| `docs/UX_REFINEMENTS.md` (novo)                | Relatório desta implementação                                                         |

As alterações de imagens já presentes no início da tarefa (`samuel-about.webp`, `samuel-approved.webp` e `samuel-reproved.webp`) foram preservadas sem edição dos arquivos binários.

## Limites e próximos passos

- O build e o servidor emitem um aviso sobre `C:\Users\samue\package-lock.json`, externo ao repositório e ignorado pelo Next.js. Isso não impediu build, execução ou testes. O arquivo externo e a configuração de publicação não foram alterados.
- Os fluxos de sucesso, falha e reenvio de e-mail usam respostas simuladas nos testes. Não foi enviado e-mail real; a entrega continua dependendo das credenciais e da configuração de provedor já documentadas no projeto.
- A validação de navegador cobre Chromium desktop e mobile emulado. Safari/WebKit, Firefox, dispositivos físicos e leitura manual com leitor de tela permanecem verificações complementares recomendadas.
- A estabilidade geométrica dos controles foi testada; não foi executado um benchmark de desempenho ou uma auditoria completa de conformidade WCAG.
