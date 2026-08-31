# Matriz Nacional de Fontes de Dados

**Inventário das fontes de informação sobre abastecimento, comércio externo e produtos essenciais**

Agosto de 2026 · Anexo técnico aos pedidos de integração institucional

---

## Para que serve este documento

Um pedido de dados que chega sozinho é um pedido. Um pedido que chega acompanhado do inventário do que já se conhece, do que se usa e do que falta é uma proposta de trabalho.

Esta matriz regista, para cada fonte: **quem a detém, o que produz, em que formato, com que periodicidade, e o que o SINAGEPE já consegue usar.** Serve de anexo aos pedidos à ANE, às Alfândegas, ao MAAP e ao MISAU.

**Regra que atravessa o documento:** só se declara conhecido o que foi verificado numa publicação. Onde não há verificação, escreve-se que não há.

---

## 1. Fontes em uso

Dados que já entram no sistema e produzem indicadores.

| Entidade | O que produz | Formato | Periodicidade real | Como entra | Utilidade |
|---|---|---|---|---|---|
| **SIMA** — MAAP | Preços a retalho e a grosso em mercados de referência; fluxos de produto entre praças; câmbio; cotação SAFEX | PDF | Semanal desde 1991; publicação em linha parou em Agosto de 2023 | Extracção automática, accionada por pessoa | Única série de preços por praça do país |
| **ARENE** | Preço regulado de combustíveis por região; cascata de formação do preço | Despacho publicado | A cada revisão | Leitura manual | Único produto com estrutura de preço pública por lei |
| **ANE** | Estradas principais; interrupções com causa e alternativa | Comunicado de imprensa | Quando ocorre | Transcrição manual | Estado da rede que serve o abastecimento |
| **ICM** | Meta da reserva estratégica; preços de importação; silos concessionados | Declaração pública | Irregular | Recolha documental | Referência de reserva e de preço de importação |
| **IMOPETRO** | Volumes de concurso para importação de combustíveis | Concurso público internacional | Semestral | Recolha documental | Volume real de importação de combustível |
| **GS1 Global** | Situação de Moçambique quanto a prefixo de país | Consulta ao registo | Estável | Consulta directa | Determina se há identificação nacional de produto |

**Total de registos estruturados no sistema: 434.**

---

## 2. Fontes identificadas e não integradas

Dados que existem, são produzidos por instituições, e não entram no sistema.

| Entidade | O que produz | Porque não entra | O que se pede | Esforço / Impacto |
|---|---|---|---|---|
| **ANE** | Cortes de estrada em formato actualizável | Publica em comunicado, não em ficheiro | Ficheiro estruturado, actualizado quando há corte | **1 / 5** |
| **Alfândegas · JUE** | Declarações, manifestos, quantidades e valores por posto | Sigilo fiscal e comercial | Agregado mensal por produto e posto, com regra dos cinco operadores | 5 / 5 |
| **MAAP · SIMA** | Preços posteriores a Agosto de 2023; preço ao grossista; quantidade disponível | Publicação em linha interrompida | Retoma da publicação e formato legível | 2 / 5 |
| **SETSAN** | População em privação alimentar aguda, por província e fase | Publica em PDF anual | Tabela estruturada por província | 2 / 5 |
| **MISAU · CMAM** | Existências e distribuição de medicamentos | Sem protocolo | Ficheiro piloto de cinco medicamentos, nível provincial | 4 / 5 |
| **INE** | Índice de preços; inquérito agrário; censo agro-pecuário | Sem API; carregamento manual não verificado | Publicação estruturada ou API | 3 / 4 |
| **Armazenistas** | Existências em armazém | Nenhuma unidade as comunica | Declaração mensal, ainda que em papel | 3 / 5 |
| **Banco de Moçambique** | Câmbio; balança comercial | Publicado, não integrado | Série estruturada | 2 / 3 |

---

## 3. Confidencialidade

Nem todos os dados podem ser pedidos da mesma forma. Esta classificação determina o que se pede a quem.

**Público.** Preços do SIMA, despachos da ARENE, comunicados da ANE, publicações do INE e do Banco de Moçambique. Pedem-se em formato, não em conteúdo.

**Institucional, mediante protocolo.** Existências em armazém, agregados aduaneiros, avaliação do SETSAN, dados do MISAU. Exigem acordo escrito e finalidade declarada.

**Sensível, não pedido.** Declarações aduaneiras individualizadas, identidade de importadores, valores por operação, processos de fiscalização.

**Este último grupo não é pedido pelo SINAGEPE, e é uma decisão deliberada.** Um pedido que inclua dados individualizados de operadores tem probabilidade elevada de ser recusado — e a recusa fecha a porta ao agregado, que é o que basta para o sistema funcionar.

A regra que se aplica: **pedir o mínimo que resolve o problema.**

---

## 4. O que o sistema faz com cada tipo de dado

| Tipo | Tratamento | Exemplo |
|---|---|---|
| Preço por praça | Comparação entre mercados, dispersão, série temporal | Feijão nhemba: 30 MT/kg em Panda, 121 em Mandimba |
| Preço regulado | Cascata de custo, diferencial por região | Gasóleo: +15,60 MT/L em Mueda face ao terminal |
| Cadastro físico | Contagem, natureza jurídica, cobertura territorial | 30 unidades, todas com fonte oficial citada |
| Estado da rede | Identificação de troços cortados e alternativas | 3 interrupções, uma sem alternativa indicada |
| Agregado de importação | Confronto com referência internacional | Sobrepreço de 34% no arroz, observação do ICM |

**Nenhum destes tratamentos exige inteligência artificial.** São contagem, comparação e aritmética sobre distribuições. É deliberado: um método simples e verificável suporta a pergunta *de onde vem esse número*, que é a única que importa numa reunião com quem decide.

---

## 5. Estado actual da integração

**Zero de dez fontes se actualizam automaticamente.**

Seis entram por carregamento manual — quatro delas com ferramenta que reduz o trabalho a segundos, mas que continua a ser accionada por uma pessoa.

Quatro não têm qualquer ligação: Alfândegas, SETSAN, MISAU e telemetria de armazém.

Este número não é um defeito a esconder. **É a medida exacta do que o financiamento e os protocolos resolvem**, e a razão pela qual esta matriz existe.

---

## 6. Sequência recomendada

**Primeiro, a ANE.** Esforço 1, impacto 5 — o melhor rácio da lista. Um ficheiro estruturado com os cortes de estrada transformaria dados de Janeiro em dados correntes. É também o pedido de menor sensibilidade: nada do que se pede é confidencial.

**Segundo, o MAAP.** A retoma da publicação do boletim do SIMA em formato legível. O dado já é produzido semanalmente; muda o formato, não o trabalho.

**Terceiro, o SETSAN.** A tabela anual de população em privação alimentar. O dado já é publicado; falta a estrutura.

**Quarto, as Alfândegas.** O agregado mensal. É o de maior impacto e o de maior esforço institucional — convém chegar com os três anteriores já conseguidos, como demonstração de que o sistema usa o que recebe.

**Quinto, o MISAU.** O piloto de medicamentos, que é o mais sensível de todos e exige as salvaguardas já escritas no documento próprio.

---

## 7. O que esta matriz não cobre

**Dados de que não temos conhecimento.** A matriz regista o que foi identificado; é provável que existam fontes relevantes ainda não mapeadas, sobretudo a nível provincial e distrital.

**Sistemas operacionais das instituições.** A Janela Única, o sistema de gestão aduaneira e os sistemas do Banco de Moçambique produzem muito mais do que aqui consta. O que consta é o que seria pedido, não o que existe.

**Periodicidade prometida versus real.** Onde se escreve "semanal" ou "anual", refere-se ao que a instituição declara produzir. A periodicidade com que o dado chega efectivamente ao público é frequentemente outra — o SIMA é o caso mais claro: recolhe semanalmente desde 1991 e a última publicação em linha é de 2023.

---

*Documento de trabalho do SINAGEPE. Actualizar sempre que uma fonte mudar de estado.*
