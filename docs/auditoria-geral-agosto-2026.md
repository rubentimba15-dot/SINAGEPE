# Auditoria Geral do SINAGEPE

**31 de Agosto de 2026 · sem indulgência**

Varrimento de 48 ecrãs, 18 ficheiros de dados e 6 ficheiros partilhados. Cada ecrã foi carregado num navegador com os dados reais e inspeccionado.

---

## Veredicto

**O sistema está bom onde foi trabalhado, e mau onde não foi.**

Quinze ecrãs foram reconstruídos nas últimas sessões e estão sólidos: cada número declara a origem, cada indicador sem fonte está marcado, cada limite está escrito. **Trinta e três não foram**, e vários continuam a mostrar os mesmos números inventados que retirámos dos outros.

O problema mais grave está na porta de entrada.

---

## 1. O ecrã de entrada — grave

O `index.html` é a primeira coisa que qualquer pessoa vê. Diz:

> **"Monitoria Nacional do Abastecimento em Tempo Real"**
> **"Garantindo a estabilidade de preços, fluxo de bens essenciais e resiliência logística"**

Duas afirmações falsas, na porta.

**Nenhuma fonte se actualiza sozinha.** Zero de dez — é o número que o próprio sistema publica no ecrã de Administração. Não há tempo real em lado nenhum.

**E o sistema não garante coisa alguma.** Não tem mandato, não tem dados de existências, não tem ligação a nenhuma instituição. "Garantindo" é uma promessa que nada sustenta.

Pior ainda: o `index.html` **usa `disponibilidadeNacional`, `diasCobertura`, `importacoesTransito` e `balancoNacional`** — exactamente os quatro indicadores que retirámos do Painel Nacional na sessão anterior. Foram retirados de um ecrã e continuam na entrada.

**Prioridade máxima.** É o ecrã que determina a primeira impressão, e é o mais errado do sistema.

---

## 2. Simulador de Retorno (IA) — grave

No `portal-investidores.html`. Um cartão intitulado **"Simulador de Retorno (IA)"**, com projecção de retorno.

Não existe IA no sistema. E uma projecção de retorno apresentada a investidores é matéria com consequências: quem decidir com base nela decide com um número que ninguém calculou.

---

## 3. Simulador Preditivo — grave

O `simulador-preditivo.html` corre sobre `D.balancoNacional` — o stock inventado. Projecta a partir de um número que não existe.

E o nome promete o que o sistema não pode fazer: **não há série histórica que sustente previsão**, e isso está escrito na própria Governação do Dado.

---

## 4. Cobertura da declaração de origem — o número que mais interessa

| | |
|---|---|
| Ecrãs no sistema | **48** |
| Com indicadores de origem declarada | **15** |
| Sem qualquer declaração | **33** |

**Trinta e um por cento do sistema declara a origem dos seus números. Sessenta e nove por cento não declara.**

Dos 78 indicadores declarados, 24 estão marcados como demonstração — o que é bom sinal: significa que quando se olha com atenção, um em cada três números do sistema não tem origem.

Nos 33 ecrãs por auditar, essa proporção é desconhecida. **Provavelmente é pior**, porque foram escritos antes da regra existir.

---

## 5. O que está bem, e vale registar

**Todos os 30 armazéns têm fonte oficial citada.** Cada unidade pode ser confirmada na publicação de origem.

**As 14 estradas nacionais têm fonte.** As 3 interrupções também, e uma tem divergência registada em vez de corrigida em silêncio.

**Os 10 riscos do Centro de Antecipação têm evidência.** Nenhum tem probabilidade inventada.

**As 13 entidades do dossier de adesão têm fonte.**

**Nenhum ficheiro de dados é órfão.** Os 18 são lidos por pelo menos um ecrã.

**41 dos 48 ecrãs carregam sem erro** com os dados reais.

E dois casos que pareciam problema e não são: o `sandbox-rastreabilidade` diz que os identificadores são simulados — é declaração honesta. O `identificacao-gs1.json` não tem fonte por produto porque **declara explicitamente que a cobertura não é medida em Moçambique**.

---

## 6. Ecrãs por auditar, por prioridade

**Alta — mostram números a decisores:**
`index.html`, `portal-investidores.html`, `simulador-preditivo.html`, `balanco-visual.html`, `dashboard-banco-central.html`, `portal-bancos.html`, `portal-empresas.html`.

**Média — mostram dados mas com público mais restrito:**
`armazens-nacionais.html`, `armazens-nacionais-ouro.html`, `centro-antecipacao.html`, `medicamentos-cadeia.html`, `ponto-cego-duplo.html`, `rede-logistica.html`, `portal-produtores.html`, `portal-transportadores.html`, `ficha-detalhe.html`, `mapa-nacional.html`.

**Baixa — utilitários e documentos:**
`apresentacao.html`, `relatorio-executivo.html`, `relatorios-central.html`, `governanca-dado.html`, `indicadores-painel.html`, `adesao-institucional.html`, `mapa-integrado.html`, `verificador-ecras.html`, `lista-de-acessos.html`, `diagnostico-credencial.html`, `propostas-layout.html`, `sandbox-rastreabilidade.html`, `fontes-nacionais.html`, `fontes-internacionais.html`, `marketplace-b2b.html`, `relatorios.html`.

Seis ecrãs não têm barra de navegação, alguns por desenho próprio.

---

## 7. Duplicação por resolver

**Dois ecrãs de armazéns:** `armazens-nacionais.html` e `armazens-nacionais-ouro.html`, além do `cadastro-armazens.html` já reconstruído. Três ecrãs para o mesmo cadastro.

**Dois de relatórios:** `relatorios.html` já encaminha para `relatorios-central.html`, mas o `relatorio-executivo.html` é um terceiro.

**Dois de mapas:** `mapa-nacional.html` encaminha para `mapa-integrado.html`. Resolvido.

---

## 8. O que recomendo, por ordem

**Primeiro: o `index.html`.** Trocar as duas frases falsas e retirar os quatro indicadores inventados. É o ecrã de maior impacto e o mais errado.

**Segundo: os dois simuladores.** Retirar o rótulo de IA do portal de investidores e reconstruir o simulador preditivo sobre o que existe — ou consolidá-lo, como fizemos com o mapa nacional.

**Terceiro: os cinco de alta prioridade que faltam.** Bancos, empresas, banco central, balanço visual.

**Quarto: consolidar as duplicações.** Três ecrãs de armazéns não servem ninguém.

---

## Nota final

A auditoria de regressão que corre a cada entrega tem hoje **241 verificações sobre 31 ecrãs**. Não apanhou nada disto, e a razão é simples: **só vigia o que já foi corrigido.**

Um ecrã que nunca foi auditado não tem verificações, e por isso nunca falha. Isso não é defeito da ferramenta — é o que ela é. Mas convém saber que **"nenhuma regressão" significa que o que estava certo continua certo, não que o sistema está certo.**
