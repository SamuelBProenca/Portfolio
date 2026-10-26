# Fontes dos trabalhos selecionados

Curadoria inicial dos repositórios públicos em 19/10/2026, atualizada para a alpha do OctoCards em 26/10/2026. Os textos editoriais de `src/content/projects.ts` preservam contexto e maturidade; a home destaca Curriculum Studio e OctoCards. OpsCLI e Design Patterns Dojo continuam no catálogo.

O catálogo e a página técnica consultam o GitHub no servidor, com validação, cache de uma hora e fallback independente por projeto. O navegador não recebe credenciais nem chama a API do GitHub. A home não depende dessas consultas. O contrato também aceita uma instância OctoCards quando sua origem for configurada. Veja [dados dos projetos e curadoria](PROJECT_DATA.md).

| Projeto                                                                      | Evidência consultada                                                                                                                                                              | Conteúdo publicado                                                                                                                                                                                          |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [OpsCLI](https://github.com/SamuelBProenca/OpsCLI)                           | [README](https://github.com/SamuelBProenca/OpsCLI/blob/main/README.md) e diretório raiz                                                                                           | Proposta de CLI modular em Batch para verificar dispositivos, conexões e gerar logs estruturados. O diretório público contém README e licença, sem código da ferramenta; essa maturidade aparece no painel. |
| [OctoCards](https://github.com/SamuelBProenca/OctoCards)                     | [README](https://github.com/SamuelBProenca/OctoCards/blob/main/README.md) e [package.json do backend](https://github.com/SamuelBProenca/OctoCards/blob/main/backend/package.json) | API TypeScript com Express para transformar dados de repositórios em cards, consultas individuais ou em lote e organização em rotas, controllers, serviços e tipos.                                         |
| [Design Patterns Dojo](https://github.com/SamuelBProenca/DesignPatternsDojo) | [readme.md](https://github.com/SamuelBProenca/DesignPatternsDojo/blob/main/readme.md) e árvore de arquivos                                                                        | Exercícios e implementações TypeScript de Adapter, Builder, Decorator, Factory, Observer e Singleton. Apresentado como estudo.                                                                              |

O antigo destaque de automação apontava para [network_monitoring](https://github.com/SamuelBProenca/network_monitoring), cujo README descreve uma proposta de monitoramento de rede. O link foi corrigido para OpsCLI, que corresponde ao escopo de automação operacional. PowerShell e C# foram removidos desse destaque porque não foram confirmados nas fontes de OpsCLI.

Em 23/10/2026, Curriculum Studio foi incluído como primeiro destaque após revisão do produto privado e teste local de análise, revisão e PDF. O painel explica o vínculo entre requisitos da vaga e fatos do perfil, o processamento em memória e a preservação dos textos das experiências. O botão abre `/curriculumstudio`; não há link para o código privado. O endereço `/projetos#curriculum` foi preservado e usa o mesmo conteúdo. A publicação depende dos deploys e da configuração descrita em [CURRICULUM_STUDIO.md](CURRICULUM_STUDIO.md).

As ilustrações dos dois destaques mostram o fluxo da API e o editor de currículo. Não são capturas de execução, métricas de uso ou resultados de testes dos repositórios. A ilustração do Curriculum Studio é feita em HTML/CSS, sem dados de candidatos. As propostas e os estudos continuam acessíveis no catálogo. Nenhuma instância pública da API OctoCards foi confirmada nesta revisão.

## Comportamento do accordion

- Curriculum Studio abre por padrão. Clicar em outro projeto fecha o anterior e mostra seus detalhes.
- Clicar no projeto aberto recolhe o painel.
- Enter e Espaço alternam o painel; setas, Home e End movem o foco entre os títulos.
- Cada botão expõe `aria-expanded` e `aria-controls`; os painéis possuem nome acessível e os recolhidos ficam ocultos também para navegação por teclado.
- Curriculum Studio possui um link direto para o produto. Os demais painéis possuem links para seus repositórios públicos; o clique no título seleciona o projeto.

Testes de componente e navegador cobrem seleção, fechamento, foco por teclado, visibilidade e destino dos links, além do layout mobile em 320 px.
