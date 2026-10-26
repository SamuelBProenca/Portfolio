# Diagnóstico de primeira visita — 26/10/2026

## Falha de conexão e correção aplicada no DNS

O proprietário relatou que o navegador excedia o tempo de conexão antes de exibir o site. O HTML publicado é estático, atendido pelo cache da Vercel; os testes não identificaram uma função Next.js lenta na home.

Google e Cloudflare retornaram endereços nas faixas `64.29.17.*` e `216.198.79.*` para `samuelproenca.com` e `www.samuelproenca.com`. Testando os IPs individualmente, com SNI e hostname preservados, os endereços `64.29.17.1` e `64.29.17.65` responderam em cerca de 30–50 ms. Os endereços `216.198.79.1` e `216.198.79.65` excederam o limite de conexão de cinco segundos antes do TLS, nos dois hostnames. O resultado identifica uma rota problemática a partir da rede testada; não comprova indisponibilidade global desses IPs.

A configuração autenticada da Vercel indicava `ipStatus: required-change`, com `recommendedIPv4` de prioridade 1 igual a `76.76.21.21`. Esse endereço respondeu com TLS válido e HTTP 200 para `www`, e com o redirecionamento esperado para o domínio sem `www`.

Foram criados dois registros explícitos, seguindo essa recomendação:

| Nome  | Tipo | Valor         | TTL         |
| ----- | ---- | ------------- | ----------- |
| `@`   | A    | `76.76.21.21` | 60 segundos |
| `www` | A    | `76.76.21.21` | 60 segundos |

Os servidores autoritativos confirmaram ambos os registros. A Vercel passou a retornar `configuredBy: A`, `ipStatus: no-change`, `misconfigured: false` e nenhum conflito para os dois nomes. Os ALIAS automáticos e os registros de certificado existentes foram preservados; os registros A explícitos prevalecem para esses nomes. Não foram alterados nameservers, certificados ou outros subdomínios.

Os caches recursivos anteriores tinham TTL de até 1.800 segundos. Algumas redes podem continuar usando a resposta antiga por aproximadamente 30 minutos depois da alteração. O teste de uma conexão bem-sucedida não garante que uma rota alternativa também funcione.

Para reverter somente esta mitigação, remova os dois registros A explícitos `@` e `www` criados nesta intervenção; os ALIAS automáticos anteriores continuam registrados. Consulte novamente a recomendação atual da Vercel antes de futuras mudanças.

## Melhorias complementares no aplicativo

- O indicador de leitura calcula a proporção nativa da rolagem, usando `requestAnimationFrame` e `ResizeObserver`, sem baixar GSAP para pintar a barra.
- GSAP e ScrollTrigger continuam nas entradas das seções. O download começa na primeira rolagem, quando essa melhoria passa a ser útil. O conteúdo já está visível no HTML; se o download falhar, ele permanece disponível.
- Movimento reduzido evita o download da biblioteca enquanto não houver uma preferência explícita por movimento completo.
- Os links do cabeçalho e os dois botões principais não antecipam o download de outras páginas na abertura. A navegação continua funcionando normalmente, inclusive sem JavaScript.
- `npm run site:check` verifica os IPs separadamente para evitar que um destino saudável esconda outro com timeout.

Essas mudanças reduzem trabalho no cliente, mas não substituem a correção de DNS: código de aplicação não executa antes de a conexão HTTPS ser estabelecida.

## Medições locais comparáveis

Builds de produção da mesma base, Chromium com cache vazio, CPU limitada a 4×, latência de 150 ms e download de 200.000 bytes/s. Amostras de laboratório, sem representar percentis de usuários reais. A janela observada inclui três segundos após o evento `load`, antes de qualquer rolagem.

| Métrica                            | Antes, desktop | Depois, desktop | Antes, mobile | Depois, mobile |
| ---------------------------------- | -------------- | --------------- | ------------- | -------------- |
| Recursos solicitados, além do HTML | 20             | 9               | 18            | 9              |
| JavaScript transferido, comprimido | 199.685 bytes  | 149.292 bytes   | 199.685 bytes | 149.292 bytes  |
| Requisições antecipadas de páginas | 8              | 0               | 6             | 0              |
| LCP                                | 1.328 ms       | 1.516 ms        | 1.248 ms      | 1.240 ms       |
| Evento `load`                      | 1.611 ms       | 1.714 ms        | 1.740 ms      | 1.713 ms       |

O JavaScript observado antes da interação caiu cerca de 25%, com 50.393 bytes adiados ou evitados. As amostras não demonstram melhora consistente de LCP ou do evento `load`; o principal defeito de disponibilidade estava na conexão, separadamente confirmado e corrigido no DNS.

## Verificação

TypeScript, ESLint, Prettier, 75 testes unitários e build de produção aprovados. Os 51 testes focados em primeira visita, animações de seção e indicador de leitura passaram nos três perfis: desktop, desktop com touch e mobile. Eles verificam ausência de downloads opcionais na abertura, movimento reduzido, falha nos chunks de animação, navegação sem JavaScript, entradas de 300 ms, foco e rolagem nativa.

O checkout isolado preserva as alterações locais ainda não publicadas do proprietário. A correção de DNS foi aplicada diretamente na Vercel; a otimização do aplicativo é entregue separadamente por Pull Request.

## Repetir o diagnóstico

Dentro de `portfolio/`:

```sh
npm run site:check
# Testar uma rota específica, sem alterar DNS ou o arquivo hosts:
npm run site:check -- --ip=76.76.21.21
```

O script usa validação TLS normal, preserva o cabeçalho Host e tem limite de cinco segundos por conexão. Ele não limpa caches do sistema nem modifica a rede. Falhas devem ser comparadas com os valores recomendados na conta Vercel e repetidas em outra rede.

Referências: [configuração de domínio e IPs recomendados](https://vercel.com/docs/rest-api/domains/get-a-domain-s-configuration), [configuração de domínio personalizado](https://vercel.com/docs/domains/set-up-custom-domain) e [diagnóstico de domínios](https://vercel.com/docs/domains/troubleshooting).
