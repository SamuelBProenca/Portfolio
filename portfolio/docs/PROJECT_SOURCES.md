# Fontes dos trabalhos selecionados

Revisão dos repositórios públicos em 19/10/2026. Os textos foram resumidos em português para o portfólio; não são citações literais. O conteúdo fica em `src/content/projects.ts` e é passado ao accordion pela página inicial. Não há chamadas à API do GitHub durante a navegação.

| Projeto                                                                      | Evidência consultada                                                                                                                                                              | Conteúdo publicado                                                                                                                                                                                          |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [OpsCLI](https://github.com/SamuelBProenca/OpsCLI)                           | [README](https://github.com/SamuelBProenca/OpsCLI/blob/main/README.md) e diretório raiz                                                                                           | Proposta de CLI modular em Batch para verificar dispositivos, conexões e gerar logs estruturados. O diretório público contém README e licença, sem código da ferramenta; essa maturidade aparece no painel. |
| [OctoCards](https://github.com/SamuelBProenca/OctoCards)                     | [README](https://github.com/SamuelBProenca/OctoCards/blob/main/README.md) e [package.json do backend](https://github.com/SamuelBProenca/OctoCards/blob/main/backend/package.json) | API TypeScript com Express para transformar dados de repositórios em cards, consultas individuais ou em lote e organização em rotas, controllers, serviços e tipos.                                         |
| [Design Patterns Dojo](https://github.com/SamuelBProenca/DesignPatternsDojo) | [readme.md](https://github.com/SamuelBProenca/DesignPatternsDojo/blob/main/readme.md) e árvore de arquivos                                                                        | Exercícios e implementações TypeScript de Adapter, Builder, Decorator, Factory, Observer e Singleton. Apresentado como estudo.                                                                              |

O antigo destaque de automação apontava para [network_monitoring](https://github.com/SamuelBProenca/network_monitoring), cujo README descreve uma proposta de monitoramento de rede. O link foi corrigido para OpsCLI, que corresponde ao escopo de automação operacional. PowerShell e C# foram removidos desse destaque porque não foram confirmados nas fontes de OpsCLI.

Curriculum Service continua no arquivo de projetos com a indicação original de repositório não confirmado. Ele não integra os destaques, pois não foi encontrado entre os repositórios públicos consultados. O endereço `/projetos#curriculum` foi preservado.

As ilustrações dos painéis mostram o escopo, o fluxo da API e os temas de estudo. Não são capturas de execução, métricas de uso ou resultados de testes dos repositórios. Não foi confirmada uma instância pública em produção desses projetos.

## Comportamento do accordion

- OpsCLI abre por padrão. Clicar em outro projeto fecha o anterior e mostra seus detalhes.
- Clicar no projeto aberto recolhe o painel.
- Enter e Espaço alternam o painel; setas, Home e End movem o foco entre os títulos.
- Cada botão expõe `aria-expanded` e `aria-controls`; os painéis possuem nome acessível e os recolhidos ficam ocultos também para navegação por teclado.
- Cada painel possui um link próprio para o repositório; o clique no título seleciona o projeto.

Testes de componente e navegador cobrem seleção, fechamento, foco por teclado, visibilidade e destino dos links, além do layout mobile em 320 px.
