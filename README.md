# SINAGEPE — Sistema Nacional de Gestão de Produtos Essenciais

**Moçambique · Protótipo funcional · Dados exclusivamente públicos**

Site publicado: https://rubentimba15-dot.github.io/SINAGEPE/

---

## O que é

O SINAGEPE reúne, num único painel, o que se sabe publicamente sobre a disponibilidade,
a circulação e o preço dos produtos essenciais em Moçambique — cereais, arroz, óleo,
açúcar, combustíveis e medicamentos.

Não é um sistema de recolha. É um sistema de **confrontação**: pega no que as instituições
moçambicanas já publicam — cadastro de armazenagem, rede viária, preços de mercado,
comércio externo, licenciamento comercial, indicadores agrários — e cruza-o para mostrar
onde a informação existe, onde diverge e onde simplesmente não há.

Construído inteiramente a partir de fontes públicas. Nenhuma instituição foi contactada
para lhe pedir dados.

---

## O que o sistema diz sobre si próprio

Estes números estão no ecrã de entrada e não são defeitos de cálculo. São o retrato:

| Indicador | Estado |
|---|---|
| Fontes que se actualizam automaticamente | **0 de 17** |
| Armazéns que reportam existências | **0 de 30** |
| Unidades com sensor instalado | **0 de 30** |
| Entidades que confirmaram os seus próprios dados | **0** (não existe canal) |
| Metas do PEDSA e do PQG mensuráveis com dados disponíveis | **0 de 9**, uma parcial |

Um país que não sabe o que tem em armazém não pode antecipar uma ruptura. É este o
problema que o sistema torna visível antes de propor resolvê-lo.

---

## O que já se descobriu

**O transporte quase não explica a dispersão de preço.** Na semana de 17 a 23 de Julho de
2023, o feijão manteiga custava 52 MT/kg em Lichinga e 162 MT/kg em Mandimba — 211% de
diferença entre dois mercados da mesma província, na mesma semana, com fluxo do produto
documentado entre eles pelo próprio boletim. O gasóleo dessa viagem custa cerca de
0,37 MT/kg, calculado ao preço mais alto praticado no país e a uma distância de estrada
estimada em 162 km. Explica **menos de meio por cento** da diferença.

A leitura que o sistema tira daqui é deliberadamente contida: não conclui que alguém cobra
a mais. Conclui que o custo de mover o produto não chega para explicar o preço, e que a
explicação está noutro lado.

**A maior dispersão medida é de 341%.** Milho, mesma semana: 17 MT/kg em Mandimba e
75 MT/kg no Búzi. O boletim regista o valor do Búzi e não o explica.

**Duas fontes oficiais divergem 44 vezes sobre o mesmo distrito.** Milange: 220.000 t de
capacidade de armazenagem no relatório de 2024 do ICM da Zambézia, com origem nos serviços
distritais; 5.000 t no quadro do INE de 2022, com origem no ICM. Não é erro de nenhum dos
dois — é definição diferente do que conta como armazém. A divergência está registada, não
resolvida em silêncio.

**A recolha de preços nunca parou; a publicação parou.** O SIMA publica semanalmente desde
1991. O arquivo em linha a que o sistema chega termina em Agosto de 2023. Estão extraídas
oito edições, sete com valores utilizáveis, entre Setembro de 2022 e Julho de 2023 — não é
série contínua, são fotografias em datas diferentes, cada uma com a edição e a ligação ao
PDF original declaradas.

**A insegurança alimentar tem dois números oficiais em simultâneo.** Para Outubro de 2025 a
Março de 2026, a FAO indica 3,5 milhões de pessoas em fase 3 ou acima, a nível nacional; a
classificação IPC indica 1,2 milhões para 47 distritos predominantemente produtivos. A
diferença de 2,3 milhões é de âmbito declarado. Também está registada.

---

## Enquadramento institucional

- **PEDSA 2030** (PEDSA II, 2022-2030) — determina o registo e licenciamento dos operadores
  de mercado, a digitalização da comercialização agrária e a criação de sistemas de
  informação de gestão com base de dados para monitoria dos indicadores estratégicos. É a
  fundamentação directa deste trabalho.
- **PQG 2025-2029** (Resolução n.º 17/2025, Boletim da República, I Série, n.º 90) —
  estabelece a redução da insegurança alimentar crónica de 24% para 14%.
- **Lei n.º 34/2014, do Direito à Informação** — os artigos 10.º, 13.º e 15.º sustentam o uso
  do dado público sem necessidade de autorização prévia nem de demonstração de interesse
  legítimo.

---

## Regras de governação do dado

Escritas no sistema e aplicadas em todos os ecrãs:

1. Dado sem fonte não é evidência.
2. Um zero significa "não temos o dado", nunca "o valor é zero". Existências desconhecidas
   não são existências nulas.
3. Facto, estimativa, previsão e cenário são estados distintos e assinalados.
4. Duas fontes que reproduzem a mesma origem primária não constituem confirmação
   independente. Órgão publicador e origem do dado são campos separados.
5. Nenhum valor é publicado a partir de menos de cinco operadores.
6. Capacidade instalada não é capacidade operacional nem existências.
7. Divergências entre fontes registam-se e devolvem-se à instituição de origem; não se
   resolvem por arbitragem interna.
8. Nenhum campo é preenchido com valor de demonstração. Um campo sem fonte fica a nulo e
   declara quem detém o dado em falta.
9. O sistema assinala desvios; nunca qualifica conduta. A qualificação cabe a quem tem
   competência legal para a fazer.

---

## Limites declarados

- É um sítio estático. **Não tem controlo de acesso real.** Nenhum dado individualizado ou
  sensível pode entrar antes da migração para servidor.
- Não existe qualquer modelo de aprendizagem automática no sistema. O que existe é
  aritmética auditável sobre dados públicos, com os pressupostos declarados no próprio
  código — capacidade do camião, consumo, factor de traçado da estrada e preço do
  combustível estão todos à vista e podem ser trocados por quem discordar.
- O sistema não prevê **quando** ocorrerá uma ruptura — não há série histórica que o permita
  e qualquer probabilidade seria inventada. Diz **onde** a cadeia é estruturalmente frágil.
- Os preços mais recentes que o sistema alcança são de Julho de 2023. Servem para provar o
  método e medir variação real entre datas, não para decidir hoje.
- Moçambique não tem organização-membro da GS1 nem prefixo nacional de país. Zero produtos
  com identificação normalizada.

---

## Organização do repositório

```
/                     ecrãs (.html)
/assets               folhas de estilo, motores de cálculo e camada de acesso a dados
/data                 conjuntos de dados em JSON, cada um com fonte e data declaradas
/docs                 documentação e pedidos formais de informação
```

A camada `assets/fonte-dados.js` intercepta o acesso aos ficheiros JSON. A migração para
servidor é uma alteração de configuração, não uma reescrita.

---

## Fontes

Instituto Nacional de Estatística (www.ine.gov.mz e mozdata.ine.gov.mz) · Sistema de
Informação de Mercados Agrários, MAAP (www.agricultura.gov.mz/sima e www.sima.gov.mz) ·
Administração Nacional de Estradas, via MozGIS (dados de rede viária sob licença de uso não
comercial com citação, ANE 2020) · Autoridade Reguladora de Energia, ARENE (preços regulados
ao abrigo do Decreto n.º 89/2019 e da Lei n.º 11/2017) · Bolsa de Mercadorias de Moçambique ·
Instituto de Cereais de Moçambique · ANARME · Balcão de Atendimento Único · APIEX
(apiex.gov.mz) · CEDSIF (www.cedsif.gov.mz) · UN Comtrade · FAO e classificação IPC.

Cada valor apresentado no sistema traz a sua fonte, a data de recolha e o estado de
verificação. As lacunas estão listadas em ecrã próprio, com identificação da entidade que
detém o dado em falta.

---

## Estado

Protótipo funcional, em desenvolvimento activo. Procura-se financiamento para a passagem a
infraestrutura de servidor, sem a qual não é possível autenticação real, recolha
institucional nem tratamento de dados individualizados.

Contacto: Ruben Timba
