# DESIGN — Direção editorial / engenharia

## Premissa

Portfólio pessoal de engenharia de software com linguagem editorial, não template genérico de SaaS. Principal objetivo: dar personalidade aos trabalhos e criar uma ponte entre projetos, contexto e decisões técnicas.

## Paleta

- Canvas: `#141414` e `#1b1b1b`
- Texto: `#f2f0ea`
- Base clara (uma seção de contraste): `#f0eee8`
- Vermelho-terra acentuado: `#c94e37`
- Cinza secundário: `#a6a49f`

## Tipografia

- Display: Roboto Condensed / Arial Narrow (fallback), alto contraste de peso.
- Texto: Lato / Helvetica Neue / Arial (fallback).
- Detalhes técnicos: IBM Plex Mono / Courier New (fallback).
- Usar caixa alta somente em títulos editoriais e rótulos curtos.
- Evitar texto minúsculo em controles importantes.

## Composição

- Assimetria baseada no conteúdo, foto hero ocupando uma coluna vertical inteira.
- Linhas separadoras finas, cards apenas onde houver função estrutural.
- Seção About clara para transição de ritmo.
- Uma única cor de ação, aplicada seletivamente.
- Fotografia deve ser reconhecível e fiel. Evitar cenários de luxo falsos e renderização excessiva.

## Impeccable-style review

Evitar: gradientes ornamentais, sombras brilhantes, glassmorphism, 3 ou mais camadas de cartão, badges repetidos, painéis com bordas exageradamente redondas, brilho ciano/roxo, títulos de estoque, movimento automático, ícones genéricos de features e estatísticas inventadas.

## Estados responsivos

- Desktop: duas colunas, tipografia marcante e divisão editorial.
- Mobile: seções empilhadas, menu com botão acessível, no horizontal overflow.
- Respeitar `prefers-reduced-motion`.

## Content integrity

- Cases não são provas de métricas sem fonte verificável.
- Blog técnico separado de ensaios e hipóteses.
- Não publicar títulos de artigos que ainda não existem.
