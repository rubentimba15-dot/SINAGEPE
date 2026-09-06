# Preparação para servidor

**O que muda, o que não muda, e o que só se pode fazer depois**

Setembro de 2026

---

## O estado actual, sem rodeios

O SINAGEPE é **HTML e JSON num sítio estático.** Cinquenta ecrãs, vinte e quatro ficheiros de dados, tudo servido do GitHub Pages.

Isto tem duas consequências que importa nomear.

**O controlo de acesso é decorativo.** As credenciais e os perfis são JavaScript no navegador. Quem abrir as ferramentas de programador contorna-os em segundos. Pior: **os ficheiros de dados são directamente descarregáveis** por quem souber o endereço, sem passar por ecrã nenhum.

**E nada disso é defeito de construção.** É o que um sítio estático é. O problema começa se alguém puser lá dentro dados que não podem ser públicos.

---

## O que já ficou feito

**A camada de abstracção da fonte de dados** — `assets/fonte-dados.js`, carregada nos cinquenta ecrãs.

Intercepta os pedidos a `data/*.json` e nada mais. Nenhum ecrã foi alterado, e nenhum partiu: cinquenta testados, zero erros.

### Como se muda para servidor

Uma linha, antes dos outros scripts:

```
window.SINAGEPE_FONTE = {
  modo: 'api',
  base: 'https://api.exemplo.mz/v1',
  token: function(){ return sessionStorage.getItem('sinagepe_token'); }
};
```

A partir daí, `data/armazens-nacionais.json` passa a `https://api.exemplo.mz/v1/armazens-nacionais`, com cabeçalho de autorização. **Os ecrãs não sabem a diferença.**

Sem esta camada, a migração exigiria alterar cinquenta ficheiros à mão.

---

## O que o servidor tem de servir

Vinte e quatro recursos, com o nome do ficheiro sem extensão. Estão declarados em `fonte-dados.js` e são o contrato mínimo:

`armazens-nacionais` · `farmacias-anarme` · `rede-viaria` · `rede-comercial` · `sima-precos` · `cascata-precos` · `antecipacao` · `adesao-institucional` · `governanca-dado` · `identificacao-gs1` · `medicamentos-cadeia` · `produtores-agrarios` · `fontes-externas` · `fontes-internacionais` · `indicadores-painel` · `indicadores-provinciais-ine` · `ipc-ine` · `campanha-agraria-maap` · `bau-licenciamento` · `comercio-externo` · `pedsa-enquadramento` · `infraestrutura-armazenagem-serie` · `rede-logistica` · `sinagepe-data`

Cada um devolve o mesmo JSON que hoje está no ficheiro. **Nenhuma transformação é necessária na primeira fase** — o servidor pode começar por servir os ficheiros tal como estão.

---

## O que só se pode fazer depois de migrar

Está aqui porque a tentação de fazer antes é grande.

**Dados individualizados de qualquer espécie.** NUIT, declarações aduaneiras, existências por operador, preços de venda por produtor. Enquanto for estático, isso fica num ficheiro público.

**Perfis de acesso a sério.** Hoje os dezoito perfis controlam o que aparece no menu. Não controlam o que se pode descarregar.

**Registo de consultas.** Não há forma de saber quem viu o quê, e sem isso não há responsabilização.

**Confirmação pelo titular.** Um proprietário confirmar os seus dados exige escrita, e escrita exige servidor. É a razão de termos zero entidades confirmadas.

**Reporte de existências.** A lacuna central do sistema. Um armazenista declarar o que tem exige autenticação e escrita.

---

## O que se ganha, por ordem

**Primeiro, escrita.** Confirmação pelo titular e reporte de existências. **É a maior transformação possível** — o sistema deixa de só ler e passa a receber.

**Segundo, controlo de acesso real.** Torna possíveis os dados que hoje não podem entrar.

**Terceiro, actualização automática.** Um trabalho no servidor que vai buscar as fontes com periodicidade declarada resolve o que hoje é zero de dez fontes automáticas.

**Quarto, histórico.** Guardar a evolução de cada indicador, em vez de só o estado actual.

---

## O que não se ganha

**Nada disto traz dados que não existem.** Nenhuma unidade de armazenagem passa a reportar existências por haver servidor: passa a poder reportar, se lhe for exigido e se lhe for útil.

**O servidor é condição, não causa.** A obrigação de reporte é decisão de política, e está no relatório sobre o dado reportado.

---

## Sequência recomendada

**Fase 0 — Separar os dados do código.** Os ficheiros de dados saem do repositório público, mesmo antes de haver interface programática. É a medida de segurança mais barata que existe.

**Fase 1 — Servidor de leitura.** Serve os vinte e quatro recursos tal como estão. Muda-se uma linha de configuração. **Nada mais é alterado.**

**Fase 2 — Autenticação real.** Os perfis passam a ser verificados no servidor. Aí, e só aí, podem entrar dados que não sejam públicos.

**Fase 3 — Escrita.** Confirmação pelo titular, e depois reporte de existências.

**Fase 4 — Recolha automática.** Trabalhos periódicos que vão buscar as fontes.

---

## Uma nota sobre custo

**As fases 0 e 1 são baratas** — um servidor pequeno serve ficheiros JSON sem esforço.

A fase 2 exige decisão sobre quem gere credenciais. A fase 3 exige enquadramento legal para o reporte.

**A parte difícil não é técnica.**

---

## O que verificar antes de migrar

A auditoria de regressão tem hoje verificações para os cinquenta ecrãs e para os ficheiros de dados. **Deve correr depois da migração e passar na íntegra.**

Se passar, a migração não partiu nada. Se não passar, diz exactamente o quê.
