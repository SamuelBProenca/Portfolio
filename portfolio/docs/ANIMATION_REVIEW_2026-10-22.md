# Revisão das animações — 22/10/2026

Revisão da etapa de ScrollTrigger aprovada pelo proprietário em 22/10/2026 após testar `http://localhost:3000`, com autorização para atualização no GitHub. Os registros anteriores estão em [SCROLL_PROGRESS.md](SCROLL_PROGRESS.md) e [ANIMATION_AUDIT_2026-10-21.md](ANIMATION_AUDIT_2026-10-21.md).

## O que o diagnóstico permite concluir

O resultado fornecido pelo proprietário veio do Edge 155, sem automação: preferência de movimento reduzido ativa, escolha anterior do site salva como `true`, `data-motion="full"`, indicador pronto, transições de botão e sublinhado em `0.3s`, marquee em execução e deslocamento efetivamente detectado. Portanto, essa sessão de diagnóstico não estava com as animações desabilitadas pela preferência de movimento. Isso não comprova, isoladamente, a aparência do preenchimento nem explica a percepção de ausência dos efeitos na página principal.

O arquivo encontrado inicialmente no disco era de uma verificação automatizada anterior. Ele não foi tratado como evidência do navegador do proprietário. A rota temporária `src/app/api/dev-motion-check/route.ts` foi removida após o recebimento do resultado; não integra a build final.

As entradas das seções durante a rolagem realmente ainda não existiam: a primeira implementação de ScrollTrigger controlava apenas o indicador superior. Elas foram implementadas nesta revisão. Não houve uma nova correção nos seletores de hover ou na restauração da preferência: os testes no Edge não reproduziram o desaparecimento desses efeitos.

## Implementação e decisões

| Arquivo e linha                                                                                             | Alteração e motivo                                                                                                                                                                                                                                  |
| ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/scroll-reveals.tsx:1`                                                                       | Novo componente cliente sem interface ou wrappers: aplica as entradas e limpa os recursos por rota.                                                                                                                                                 |
| `src/components/scroll-reveals.tsx:30`                                                                      | Combina a preferência do sistema com a ativação explícita já salva, usando a mesma regra dos efeitos CSS existentes. Observa mudanças durante a sessão.                                                                                             |
| `src/components/scroll-reveals.tsx:39`                                                                      | Seleciona somente elementos marcados; preserva o conteúdo inicialmente visível e acessado por âncoras ou restauração de scroll.                                                                                                                     |
| `src/components/scroll-reveals.tsx:47`                                                                      | Opacidade de 0 a 1 e deslocamento vertical de 20 a 0 px, em 300 ms, com `power2.out`. Cada entrada acontece uma vez, quando o topo alcança 92% da altura da janela. Os estilos temporários são removidos ao concluir.                               |
| `src/components/scroll-reveals.tsx:65`                                                                      | Foco em um link dentro da área revela imediatamente seu conteúdo, evitando foco invisível pelo teclado.                                                                                                                                             |
| `src/components/scroll-reveals.tsx:76`                                                                      | Limpeza de listeners, observer, animações e triggers. Sem JavaScript ou sem carregar GSAP, o conteúdo permanece visível por padrão.                                                                                                                 |
| `src/app/layout.tsx:8` e `:35`                                                                              | Monta o controlador global de entradas depois da restauração da preferência, com reinicialização por `usePathname`.                                                                                                                                 |
| `src/app/page.tsx:69`, `:75`, `:93`, `:100`, `:109`, `:148`, `:152`, `:156`, `:160`, `:173`, `:181`, `:195` | Marca introduções, foto/texto sobre, linhas de tecnologias e prévias da escrita, preservando a estrutura e os estilos existentes. A hero permanece imediatamente visível.                                                                           |
| `src/app/projetos/page.tsx:30` e `:67`                                                                      | Marca itens de projetos e chamada editorial.                                                                                                                                                                                                        |
| `src/app/escrita/page.tsx:30` e `:44`                                                                       | Marca coleções e chamada editorial.                                                                                                                                                                                                                 |
| `src/app/sobre/page.tsx:24`, `:66`, `:74`                                                                   | Marca retrato e linhas da trajetória.                                                                                                                                                                                                               |
| `src/components/contact-section.tsx:14`                                                                     | Marca a apresentação do contato. O formulário mantém seu comportamento existente.                                                                                                                                                                   |
| `src/components/project-progress/EngineeringProgress.tsx:14`                                                | Marca a apresentação do plano de engenharia.                                                                                                                                                                                                        |
| `src/components/scroll-progress.tsx:25`                                                                     | Mantém a atualização do indicador durante mudanças de altura e agenda o recálculo global dos triggers 100 ms após a altura estabilizar. Evita recalcular todas as entradas em cada frame do acordeão. Cancela também esse agendamento ao desmontar. |
| `tests/e2e/scroll-reveals.spec.ts:1`                                                                        | Seis cenários em três perfis: progressão real com movimento automático e ativação salva; mudança da preferência; foco; navegação; ausência de JavaScript.                                                                                           |
| `tests/e2e/scroll-progress.spec.ts:130`                                                                     | Regressão conjunta dos efeitos anteriores após inicialização, mudança de altura e navegação com ScrollTrigger.                                                                                                                                      |
| `tests/e2e/fluidity.spec.ts:26`                                                                             | Aguarda a entrada da seção antes de medir a estabilidade do link durante o sublinhado, mantendo a comparação de geometria.                                                                                                                          |

Sem mudanças de copy, paleta ou novas dependências nesta revisão. GSAP `3.15.0` já havia sido adicionado na etapa local anterior, a pedido do proprietário. Os efeitos CSS anteriores continuam em 300 ms; o marquee mantém seu ciclo linear de 24 s.

## Verificação visual e limites

Edge instalado, versão `155.0.4283.62`, executado por automação com movimento reduzido e ativação salva, reproduzindo as preferências informadas pelo proprietário. O preenchimento apresentou valores intermediários durante 300 ms. Um quadro pausado aos 150 ms mostrou `scaleX(0.5)` e exatamente a metade esquerda do botão preenchida; a camada e o texto estavam visíveis na captura.

As duas prévias, `http://localhost:3000` e `http://127.0.0.1:3107`, foram verificadas no Edge em 1440 × 1000 e 390 × 844. Houve quadros intermediários na entrada da seção sobre, conclusão em opacidade 1, altura de documento preservada, zero overflow horizontal e nenhum erro JavaScript observado. As capturas foram inspecionadas visualmente. Essa verificação não controla a sessão pessoal do proprietário nem substitui sua aprovação.

Não foram executados Firefox, Safari, aparelhos físicos ou benchmark de desempenho. Não há métricas novas de cobertura de linhas.

## Checks

- `npm run check`: TypeScript, ESLint, Prettier e **66 testes unitários aprovados**.
- `npm run build`: aprovado; a rota temporária de diagnóstico não aparece na build. Aviso existente sobre `C:\Users\samue\package-lock.json` fora do repositório, sem impedir a compilação.
- Testes focados iniciais das entradas: **18 aprovados** contra a prévia de desenvolvimento.
- A primeira execução de regressão teve **49 aprovados, 2 ignorados e 3 falhas**: o mesmo teste de sublinhado em três perfis comparava a posição antes e depois da entrada vertical da seção. A medição agora começa após essa entrada; o teste separado verifica a progressão e a altura do documento.
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3107 npx playwright test --workers=1 --reporter=list --output=test-results/final-scroll-review`: **142 aprovados, 8 ignorados conforme o perfil, nenhuma falha**, em 2,8 minutos. São 50 cenários executados em três perfis (desktop Chromium, desktop Chromium com toque e mobile Chromium emulado); a multiplicação por perfil não representa novas funcionalidades. A execução inclui os testes de sublinhados ajustados e todas as regressões anteriores.
- `git diff --check` e conferência de formatação dos relatórios: aprovados para código e Markdown. Ao incluir os patches históricos da auditoria no índice, a checagem também sinalizou seus espaços de contexto em linhas vazias: esses espaços pertencem ao formato do diff e foram preservados para manter as cópias exatas. A checagem final exclui somente esses três arquivos `.patch` de documentação.

A auditoria de dependências da etapa anterior registrou cinco alertas altos em dependências de desenvolvimento preexistentes; esta revisão não executou atualização de dependências nem uma nova auditoria. O resultado anterior não deve ser descrito como auditoria aprovada.

## Aprovação e diferença entre os endereços

Após a revisão, o proprietário confirmou que `http://localhost:3000` estava funcionando como desejado e autorizou atualizar o GitHub. As prévias executam o mesmo código: a porta 3000 em desenvolvimento e a 3107 com a build de produção.

Uma reprodução adicional no Edge isolado, com movimento reduzido ativo, salvou `portfolio:full-motion=true` somente no localhost e abriu ambos os endereços no mesmo contexto. Resultado: localhost com `data-motion=full`, transição de `0.3s` e marquee; 127.0.0.1 com preferência ausente, `data-motion=system`, transição de `0.01ms` e marquee desativado. As preferências são separadas por origem (protocolo, host e porta). Essa reprodução explica como a diferença pode ocorrer sem remover os efeitos do código; não leu o armazenamento da sessão pessoal do proprietário em 127.0.0.1.

O domínio público também tem armazenamento próprio: a escolha salva no localhost não é transferida automaticamente. A regra aprovada de respeitar o movimento reduzido do sistema, salvo ativação anterior explícita do site, foi preservada.

## Referências consultadas

- [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [Preferências e limpeza com GSAP](<https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/>)
- Guias locais do Next.js instalado: `use-client.md` e `use-pathname.md`.
