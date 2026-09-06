> ## Estado deste documento — ler antes de usar
>
> **Natureza:** documento de ANÁLISE, não especificação normativa.
> Descreve a lógica **inferida** a partir do protótipo Figma, olhando para os
> ecrãs desenhados e deduzindo as regras. Não foi escrito por quem definiu o
> sistema — foi escrito por quem tentou perceber o que o sistema fazia.
>
> **Cobertura:** quatro ecrãs (Painel Nacional, Mapa Nacional, Módulo de
> Logística, Detalhe de Corredor). O sistema tem hoje 81 ecrãs.
>
> **O que NÃO fixa:** as fórmulas do IPL e do INCL. O próprio texto diz, sobre o
> IPL, que *"não sabemos a fórmula exacta"*, e sobre o INCL que *"parece ser"*.
> Essas fórmulas foram definidas depois, em `assets/sinagepe.js`, que é a fonte
> de verdade actual. Há catorze declarações de incerteza ao longo do documento e
> cinco secções inteiras de perguntas em aberto.
>
> **O que foi criado depois e não consta aqui:** índice de exposição por
> província, ponto cego duplo (identificação × telemetria), cascata de preços dos
> combustíveis, cadastro nacional de armazenagem com 29 unidades, e a projecção
> do mapa recalibrada por mínimos quadrados.
>
> **Porque se mantém:** valor histórico, e porque as cinco secções de perguntas
> em aberto continuam por responder. Muitas dessas perguntas são boas.
>
> **Nome:** o documento hesita entre SIGENAPE e SINAGEPE. Ficou confirmado desde
> então — o sistema chama-se **SINAGEPE**. O ficheiro foi renomeado; o texto
> original abaixo não foi alterado.
>
> *Cabeçalho acrescentado em Agosto de 2026, ao arquivar o documento em `docs/`.*

---

# SIGENAPE — Lógica do Painel Nacional de Abastecimento Essencial

*(Nome a confirmar: o PDF usa "SIGENAPE", o Figma usa "SINAGEPE")*

Este documento descreve a lógica por trás do ecrã "painel-nacional" do protótipo Figma. Serve de base — o modelo de dados aqui definido vai ser reutilizado nos outros 27 ecrãs da plataforma, por isso vale a pena termos isto bem assente antes de avançar.

---

## 1. Modelo de dados

Entidades centrais que sustentam este ecrã:

**Produto**
- id, nome (ex: Arroz, Trigo, Óleo Alimentar, Farinha de Milho, Fertilizantes)
- categoria (alimentar / insumo agrícola)
- unidade de medida (tonelada)

**Província**
- id, nome (as 11 províncias de Moçambique + Cidade de Maputo)
- posição no mapa (coordenadas ou grelha, para o mapa ilustrado)

**StockProvincial** (a "fotografia" do stock num dado momento)
- produtoId, provinciaId
- quantidade em stock
- data/hora da última actualização

**Movimento** (os fluxos que alimentam o Balanço Nacional Vivo)
- produtoId, tipo (produção / importação / exportação / consumo)
- quantidade
- data
- origem/destino (armazém, província, posto fronteiriço)

**PreçoCommodity**
- produtoId, preço (MZN/kg), mercado de referência, data

**Alerta**
- produtoId e/ou provinciaId (pode ser nacional, provincial ou por produto)
- severidade (Crítico / Atenção / Normal)
- tipo (ruptura de stock, variação de preço, risco climático, etc.)
- mensagem, data de criação, estado (activo/resolvido)

**Utilizador**
- nome, cargo, instituição (ex: "Dr. A. Muthemba, Analista Sénior, MIST/MIC")
- perfil de acesso (ver secção 5)

---

## 2. Como os KPIs do topo são calculados

O ecrã mostra seis indicadores. Aqui está a lógica de cada um, com base nos números do protótipo:

| KPI | Fórmula proposta | Nota |
|---|---|---|
| **Disponibilidade Nacional** (87%) | Stock actual total ÷ stock de referência nacional (buffer-alvo definido por produto) | Precisa de decisão tua: qual é o "stock de referência" — uma meta fixa do Governo, ou uma média histórica? |
| **Dias de Cobertura** (42 dias) | Stock actual ÷ consumo diário médio | No protótipo aparece como número único nacional — provavelmente uma média ponderada entre produtos, não o pior caso |
| **Alertas Activos** (12) | Contagem de alertas com estado = activo | Directo |
| **Produtos Críticos** (3) | Contagem de produtos cujo estado calculado = "Crítico" | Ver limiares na secção 3 |
| **Importações em Trânsito** (28.45k ton) | Soma de Movimentos tipo="importação" ainda não confirmados como entregues | Precisa de um campo de estado no Movimento (em trânsito / entregue) |
| **Índice Logístico** (0.72) | Não está explícito no design | **Preciso que me digas o que entra aqui** — pontualidade de transporte? Tempo médio armazém→mercado? Disponibilidade de camiões? |

---

## 3. Regras de estado e alertas (por produto)

A tabela "Balanço Nacional Vivo" classifica cada produto num de quatro estados, com base nos dias de cobertura. Pelos exemplos no protótipo:

- **Fertilizantes — 9 dias → Crítico**
- **Trigo — 14 dias → Atenção**
- **Arroz — 38 dias → Estável**
- **Óleo Alimentar — 29 dias → Estável**
- **Farinha de Milho — 52 dias → Excelente**

Isto sugere limiares aproximados:
- < 10 dias → **Crítico**
- 10–19 dias → **Atenção**
- 20–49 dias → **Estável**
- ≥ 50 dias → **Excelente**

**Estes limiares são a minha leitura dos exemplos do protótipo, não uma regra oficial** — precisam de validação tua ou de quem definiu os números do design, porque a fronteira entre "Estável" (Óleo, 29 dias) e "Atenção" (Trigo, 14 dias) implica que o corte ronda os 20 dias, mas só com mais exemplos é que se confirma com segurança.

Regra de geração automática de alertas, a partir destes estados:
- Produto passa a **Crítico** → gera alerta de severidade Crítica automaticamente
- Disponibilidade provincial cai abaixo de 50% → gera alerta de ruptura nessa província
- Variação de preço acima de um limiar (ex: 15% em 7 dias) → gera alerta de mercado
- Previsão climática (do módulo de Dados Climáticos) indica risco de seca/cheia/ciclone → gera alerta de Alerta Precoce, com 30 a 90 dias de antecedência, conforme descrito na apresentação do SIGENAPE

---

## 4. Mapa de disponibilidade provincial

Cada província é colorida segundo a mesma lógica de limiares, mas aplicada à disponibilidade (%), não aos dias de cobertura:
- Verde — Normal (> 80%)
- Laranja — Aviso (50–80%)
- Vermelho — Ruptura (< 50%)

Isto é o mesmo padrão de "semáforo" usado no resto do painel — vale a pena manter esta lógica consistente em todos os ecrãs que mostrem estado (é mais fácil de perceber para quem usa o sistema pela primeira vez).

---

## 5. Perfis de utilizador (inferido a partir dos 28 ecrãs)

O utilizador mostrado no protótipo ("Direcção de Inteligência", MIST/MIC) sugere que este painel é a vista de nível **Governo/Analista**. Dado que existem portais separados para PMEs, Bancos, Produtores, Comerciantes, Transportadores, Investidores, Universidades e Parceiros, a plataforma parece estar desenhada para **múltiplos perfis de acesso**, cada um vendo só os dados e módulos relevantes ao seu papel — e não o painel nacional completo.

Isto tem impacto directo na arquitectura: precisamos de um sistema de autenticação com papéis (roles), não só um login único.

---

## 6. Perguntas em aberto (ecrã 1)

1. ~~Nome oficial: SIGENAPE ou SINAGEPE?~~ → **Confirmado: SINAGEPE**
2. Fórmula exacta do Índice Logístico nacional → parcialmente respondida no ecrã 2, ver secção 8
3. "Stock de referência" para a Disponibilidade Nacional — meta do Governo ou média histórica?
4. Confirmação dos limiares de dias de cobertura (Crítico/Atenção/Estável/Excelente)

---

# Ecrã 2 — Mapa Nacional ("Atlas de Monitoria de Mercadorias e Corredores")

## 7. O que este ecrã acrescenta ao modelo de dados

Além das entidades já definidas, este ecrã introduz:

**CorredorLogístico**
- id, nome (ex: "Corredor da Beira", "Corredor de Nacala", "Corredor de Maputo")
- modal (rodoviário / ferroviário / marítimo)
- proviníciasLigadas, portoDestino
- capacidadeUtilizada (%) — no protótipo: Rodoviário 78%, Ferroviário 42%, Marítimo 91%

**Porto**
- id, nome (Porto da Beira, Porto de Nacala, Porto de Maputo)
- posição no mapa
- provínciasServidas

**IndiceAcessibilidade (IAM)** — por província
- provinciaId, valor (0 a 1), classificação
- descrito no protótipo como "relação infraestrutura vs. custo frete"

**CamadaDoMapa** (controla o que aparece visualmente)
- nome (Cobertura Provincial, Corredores Logísticos, Armazéns e Silos, Zonas de Produção, Condições Climáticas)
- visível (sim/não) — no protótipo, as duas primeiras vêm activas por definição, "Zonas de Produção" e "Condições Climáticas" vêm desligadas

## 8. Lógica de cores e classificações

**Disponibilidade provincial** (mesma regra do painel principal, agora com valor exacto por província):
- Verde ≥ 80% — visto em Cabo Delgado (94%), Niassa (88%), Nampula (91%), Manica (85%), Inhambane (89%), Gaza (87%), Maputo (96%)
- Laranja 50–79% — Zambézia (72%), Sofala (68%)
- Vermelho < 50% — Tete (42%)

Isto confirma os limiares já vistos no painel principal — bom sinal de consistência no design.

**IAM (Índice de Acessibilidade Municipal)** — indicador por província, "relação infraestrutura vs. custo frete":
- ≥ 0.90 → Excelente (Maputo, 0.92)
- 0.80–0.89 → Alto (Nampula, 0.85)
- 0.70–0.79 → Adequado (Manica, 0.78)
- 0.50–0.69 → Moderado (Sofala, 0.64)
- < 0.50 → Crítico (Tete, 0.41)

**Importante: o IAM não é o mesmo que o Índice Logístico Nacional do painel principal.** O Índice Logístico Nacional é um indicador composto próprio, que pondera:
- estado das estradas
- estado das pontes
- estado dos terminais
- custo médio de frete

O IAM é uma leitura por província (infraestrutura vs. custo de frete); o Índice Logístico Nacional agrega estes factores a nível país, com pesos próprios. Ainda não temos os pesos exactos de cada factor — fica como pergunta em aberto para quando desenharmos o módulo de Logística.

Reparei também numa correlação que faz sentido mostrar: Tete tem a pior Disponibilidade (42%) **e** o pior IAM (0.41) — sugere que o modelo deve tratar estes dois indicadores como ligados (más acessibilidades tendem a causar rupturas de stock), o que pode ser útil para a lógica de alertas mais tarde.

## 9. Lógica das camadas do mapa

Os cinco toggles ("Camadas do Sistema") ligam/desligam sobreposições visuais independentes sobre o mesmo mapa base:

| Camada | Fonte de dados | Estado por definição |
|---|---|---|
| Cobertura Provincial | StockProvincial agregado por província | Ligada |
| Corredores Logísticos | CorredorLogístico | Ligada |
| Armazéns e Silos | Armazém (localização + capacidade) | Ligada |
| Zonas de Produção | dados agrícolas/geográficos (zonas de cultivo por produto) | Desligada |
| Condições Climáticas | módulo de Dados Climáticos (satélites/estações) | Desligada |

Isto é puramente uma questão de UI — cada camada activa/desactiva um conjunto de elementos visuais no mapa, sem alterar os dados subjacentes.

## 10. Barra de capacidade dos corredores (rodapé do mapa)

Três barras, uma por modal de transporte, mostrando "% Cap." — **confirmado: é percentagem de utilização**, não capacidade livre. Quanto mais alto, mais congestionado o corredor está.

- Rodoviário (N1/Corredores): 78% → amarelo (zona de atenção)
- Ferroviário (Sena/Limpopo): 42% → verde (operacional, folga)
- Marítimo (Cabotagem Nacional): 91% → vermelho (congestionado)

Regra de cor confirmada:
- **Verde** — utilização < 70% (corredor com folga)
- **Amarelo** — utilização 70–85% (atenção, a aproximar-se do limite)
- **Vermelho** — utilização > 85% (congestionado, risco de atraso nas entregas)

Nota: isto significa que a barra "91% Cap." no protótipo (Marítimo) devia aparecer a vermelho, não a verde como está desenhada agora — vale a pena sinalizar isto a quem estiver a ajustar o Figma, para a cor bater certo com a regra de negócio.

## 11. Corredores logísticos — natureza fixa

As linhas desenhadas no mapa (Tete↔Beira, Nampula↔Nacala, Maputo↔porto, etc.) são **corredores logísticos fixos** — as principais rotas nacionais, que não mudam dinamicamente. O que muda em tempo real é apenas o **estado/cor** de cada corredor:
- Verde = operacional
- Vermelho = ruptura (corredor bloqueado, inacessível, ou com incidente grave)

Isto simplifica bastante o modelo: a entidade `CorredorLogístico` tem uma rota fixa (definida uma vez, por exemplo pelo MASA ou pela Direcção de Estradas), e só o campo de estado é actualizado a partir dos dados em tempo real (sensores, relatórios de campo, alertas de incidentes).

## 12. Perguntas em aberto (ecrã 2)

1. ~~Quais são os pesos exactos de cada factor no Índice Logístico Nacional?~~ → **Respondido**: Estradas 35%, Pontes 25%, Terminais/aeroportos 20%, Custo médio de frete 20% (proposta fase 1, configurável, a validar pelo Ministério dos Transportes)
2. ~~A cor do corredor Marítimo...~~ → **Corrigido no Figma**

### Glossário oficial de siglas (para evitar confusões futuras no código)

| Sigla | Nome completo | O que mede | Módulo |
|---|---|---|---|
| **Disponibilidade Nacional** | — | % do stock mínimo estratégico coberto | Abastecimento/stock |
| **IAM** | Índice de Acessibilidade Municipal | Infraestrutura vs. custo de frete, por província/município | Transportes |
| **Índice Logístico Nacional** | — | Saúde geral da rede de transportes (estradas, pontes, terminais, frete) | Transportes |
| **IPL** | Índice de Pressão Logística | Pressão/congestionamento actual sobre a rede | Transportes |
| **INCL** | Índice Nacional de Capacidade Logística | Capacidade total disponível vs. utilizada | Transportes |

São cinco métricas genuinamente distintas — a Disponibilidade Nacional é sobre stock de produtos; as outras quatro são todas sobre a rede de transportes, mas medem ângulos diferentes (acesso local, saúde geral, pressão actual, capacidade). Vale a pena manter este glossário visível no código (ex: num ficheiro `constantes.js` com comentários), para qualquer developer novo não confundir as siglas.

---

# Ecrã 3 — Módulo de Logística

**Nota importante antes de começar**: pediste um ecrã de "detalhe de corredor individual, aberto ao clicar num corredor no mapa". O Figma não tem exactamente isso — tem antes este **módulo dedicado de Logística**, com uma tabela de todos os corredores e um simulador de impacto. É o mais próximo do que descreveste, mas a interacção não é "clique no mapa → abre ecrã"; é "navega para o módulo de Logística → selecciona um corredor no simulador". Sinalizo isto como pergunta em aberto no final — pode ser que valha a pena pedir a quem fez o Figma para desenhar mesmo um painel de detalhe por clique, ou aceitarmos este módulo como está.

## 13. Modelo de dados — o que este ecrã acrescenta

**Corredor** (mais completo do que a versão simplificada do ecrã 2)
- nome, origem, destino
- estado: **Operacional / Condicionado / Interrompido** (três estados, não dois)
- nível de tráfego: **Nenhum / Moderado / Alto / Extremo**
- distância (km), tempo de viagem (h), custo por tonelada-km (USD)
- modal (rodoviário / ferroviário / marítimo / aéreo — os quatro separados por abas no topo)

**SimulaçãoRuptura**
- corredorId, tipo de incidente (ex: "Bloqueio Parcial")
- produtosAfectados (lista)
- tonelagemEmRisco (t/semana)
- projecçãoVariaçãoPreço (%)
- rotaAlternativaRecomendada

## 14. KPIs do topo — leitura dos números

| KPI | Valor no protótipo | Nota |
|---|---|---|
| Índice de Pressão Logística (IPL) | 0.64 — "Pressão Estável" | Provavelmente mede o quão perto os corredores estão da saturação; não sabemos a fórmula exacta |
| INCL (Capacidade Nacional) | 0.71 — "Capacidade Adequada" | Parece ser a capacidade de transporte disponível a nível nacional, agregada entre modais |
| Custo Médio por Tonelada | 42 USD — "Normal" | Média ponderada do custo t/km de todos os corredores activos |
| Corredores Críticos | 5 Eixos — "Atenção" | Contagem de corredores em estado Condicionado ou Interrompido |

**IPL e INCL parecem ser indicadores diferentes do Índice Logístico Nacional do painel principal e do IAM do mapa** — três métricas de logística distintas (Índice Logístico Nacional, IAM provincial, IPL/INCL deste módulo). Isto é normal em sistemas deste porte, mas vale a pena, quando fizermos o módulo de Relatórios, decidirmos qual destes números é "a" métrica oficial mostrada a um Ministro, para não confundir quem usa o sistema com três índices de logística parecidos mas diferentes.

## 15. Tabela de corredores — dados reais do protótipo

| Corredor | Origem | Destino | Estado | Distância | Tempo | Custo t/km | Tráfego |
|---|---|---|---|---|---|---|---|
| Corredor da Beira (N6) | Porto da Beira | Fronteira Machipanda | Operacional | 288 km | 6.5h | 1.2 USD | Alto |
| Corredor de Nacala | Porto de Nacala | Fronteira Entre-Lagos | Operacional | 610 km | 12h | 0.9 USD | Moderado |
| Corredor de Maputo (N4) | Porto de Maputo | Fronteira Ressano Garcia | Operacional | 88 km | 2h | 1.5 USD | Extremo |
| Eixo Norte-Sul (N1) | Maputo | Pemba | Condicionado | 2.400 km | 48h | 2.4 USD | Moderado |
| Ligação Tete-Zambézia | Tete | Quelimane | **Interrompido** | 420 km | — | — | Nenhum |
| Via Beira-Tete (N7) | Beira | Tete | Operacional | 590 km | 9h | 1.1 USD | Alto |

Regra observável: um corredor **Interrompido** não tem tempo nem custo (mostra "--"), porque não há tráfego a passar — faz sentido a lógica não calcular estes campos quando o estado é Interrompido.

## 16. Balanço de Custo Logístico Total

Distribuição percentual do custo total de transporte, por categoria:
- Frete de Longo Curso — 45%
- Combustível — 25%
- Portagens & Taxas — 12%
- Carga e Descarga — 10%
- Seguros & Perdas — 8%

Isto é uma média nacional agregada, não por corredor — útil para o Governo perceber onde é que o dinheiro do custo logístico está realmente a ir.

## 17. Simulador de Ruptura de Eixos Críticos — a lógica de "what-if"

Este é o mecanismo mais parecido com o que descreveste. Funciona assim:
1. O utilizador selecciona um corredor (ex: "Corredor da Beira (N6) - Bloqueio Parcial")
2. O sistema calcula, a partir dos dados de Movimento e StockProvincial:
   - **Produtos Afectados** — que produtos passam por aquele corredor (Trigo, Milho, Adubo, no exemplo)
   - **Tonelagem em Risco** — quanto normalmente passa por semana naquele corredor (15.200 t/semana)
   - **Projecção de Preços** — estimativa de subida de preço se o corredor ficar bloqueado (+18% MZN/kg)
   - **Rota Alternativa Recomendada** — o sistema sugere automaticamente um desvio (ex: "Via Chimoio-Senga + Ferroviário")

Isto implica que o motor analítico precisa de saber, para cada corredor, que percentagem do fluxo de cada produto passa por ali — dado que ainda não temos no modelo de dados. Vou acrescentar isto:

**FluxoPorCorredor**
- corredorId, produtoId
- percentagemDoFluxoNacional (quanto deste produto passa tipicamente por este corredor)

## 18. Perguntas em aberto (ecrã 3)

1. ~~A mais importante: queres mesmo um ecrã de detalhe por clique no mapa...~~ → **Respondido: sim, ecrã separado.** Ver secção 19.
2. ~~Fórmulas exactas do IPL e do INCL...~~ → **Respondido**: são quatro métricas de transporte genuinamente distintas (ver glossário na secção 12) — IAM (acesso local), Índice Logístico Nacional (saúde geral), IPL (pressão actual), INCL (capacidade disponível vs. utilizada)
3. ~~Como é que o sistema decide a rota alternativa recomendada...~~ → **Respondido**: cálculo dinâmico por menor custo entre rotas com capacidade livre (excluir >90% utilização), considerando custo USD/ton e tempo; utilizador pode ajustar pesos custo vs. tempo; fase 1 = custo mínimo simples, fase 2 = optimização multi-critério
4. Qual ecrã desenhamos a seguir? → **Respondido**: ordem de prioridade definida — 1) Detalhe de Corredor, 2) Gestão de Alertas, 3) Painel Provincial, 4) Relatórios e Exportação

---

# Ecrã 4 — Detalhe de Corredor (drill-down)

Este ecrã existe mesmo no Figma (node `149:4`, "detalhe-corredor") — a minha primeira versão desta secção foi escrita antes de o encontrar, por isso está agora substituída pela leitura real do design.

## 19. Uma revisão importante ao modelo de dados

O ecrã não usa "troços" genéricos — usa dois conceitos mais precisos:

**PontoDeTrânsito** (os nós ao longo do corredor)
- código (ex: PE-01, CD-04, CD-05, PT-08, TE-01)
- nome (Porto da Beira, Chimoio, Gondola, Rio Luenha, Tete Centro)
- estado: **Livre / Lento-Atenção / Bloqueado**
- observação (ex: "Gondola (Obras)")

**SegmentoCorredor** (a ligação entre dois pontos consecutivos)
- pontoOrigemId, pontoDestinoId
- estado: **Livre / Lento-Atenção / Bloqueado** (independente do estado dos pontos que liga)

No exemplo do protótipo: o segmento entre Gondola e Rio Luenha aparece a vermelho (Bloqueado) por causa do corte de estrada na ponte do Rio Luenha — mas o ponto de Gondola em si está só em Atenção (obras). Isto confirma a regra que já tínhamos previsto: **o estado do corredor como um todo ("Fluxo Condicionado", no topo do ecrã) deriva do pior estado entre todos os pontos e segmentos** — mas agora sabemos que há duas camadas a avaliar (pontos E segmentos), não uma.

## 20. Índice de Acessibilidade (IAM) — agora também por corredor

O ecrã mostra "ÍNDICE DE ACESSIBILIDADE (IAM): 72%" para este corredor específico — o mesmo indicador que já tínhamos visto por província no Mapa Nacional (secção 8), mas aqui calculado ao nível do corredor. Faz sentido que seja uma agregação dos IAM das províncias/municípios que o corredor atravessa (Sofala, Manica, Tete, neste caso) — **mas isto precisa da tua confirmação**, é a minha leitura, não algo explícito no design.

## 21. Cartões de estado agregado

Três indicadores, cada um com uma fracção "bom/total" e uma barra de progresso:

| Indicador | Valor | Classificação | Nota |
|---|---|---|---|
| Estradas (km) | 412 / 520 km (79%) | Atenção (amarelo) | "Transitável com segurança" |
| Pontes Críticas | 6 / 8 pontes | Atenção (amarelo) | "2 pontes condicionadas" |
| Terminais Logísticos | 4 / 4 terminais | Normal (verde) | "Operação regular sem atrasos" |

Regra de classificação por inferir: parece que abaixo de 100% mas acima de um certo limiar dá "Atenção" (amarelo), e 100% dá "Normal" (verde) — mas não há exemplo de "Crítico" (vermelho) neste ecrã para confirmar onde esse limiar cai.

## 22. Utilização e histórico

- **Ocupação actual**: 85% (mostrado como anel/donut)
- **Tendência de Fluxo (últimos 30 dias)**: gráfico de linha simples, tonelagem transportada por dia

Isto usa a mesma entidade `RegistoUtilizaçãoCorredor` que já tínhamos previsto na secção 21 do ecrã 3 — não precisa de nada novo no modelo de dados.

## 23. Alertas activos do corredor

Cada alerta mostra: título em maiúsculas, tempo relativo ("Há 2 horas") ou estado ("Activo"), e uma descrição em linguagem natural. Cores por severidade:
- Vermelho — "CORTE DE ESTRADA (Rio Luenha)" — inundações, impede passagem de pesados
- Amarelo — "OBRAS EM GONDOLA" — atraso médio de 45 min

Isto usa a entidade `Alerta` já definida na secção 1, filtrada por corredorId.

## 24. Rota alternativa recomendada — e uma funcionalidade nova: acção do utilizador

Aqui há algo que ainda não tínhamos: não é só uma recomendação passiva, é uma **acção que o utilizador pode accionar** — o botão "SOLICITAR DESVIO DE CARGA".

A recomendação mostra:
- Nome da rota alternativa (ex: "Bypass Ferroviário CFM")
- Tempo Estimado, como diferença (ex: "-4 Horas" face à rota actual)
- Custo de Frete, como poupança (ex: "Poupe 12% por ton")

**Isto implica uma nova entidade**, porque um botão de acção como este não pode só mostrar uma sugestão — tem de gerar um registo:

**SolicitaçãoDesvioCarga**
- corredorOrigemId, rotaAlternativaId
- utilizadorId (quem pediu)
- data do pedido
- estado (pendente / aprovado / rejeitado / concluído)
- tonelagem envolvida

Isto é um ponto onde o sistema deixa de ser só "leitura" (dashboards e mapas) e passa a ter um **fluxo de aprovação operacional real** — alguém do lado da logística (talvez o Ministério dos Transportes, dado que este ecrã pertence a esse ministério, não ao MIC) tem de decidir o que fazer com este pedido. Precisamos de decidir quem aprova, e o que acontece depois de aprovado.

## 25. Nota sobre perfis de utilizador

Reparei que este ecrã pertence a um perfil diferente dos anteriores: o rodapé diz "Ministério dos Transportes e Comunicações" e o utilizador mostrado é "Gabinete Técnico, MTC Moçambique" — não o "Dr. A. Muthemba, MIST/MIC" que víamos nos ecrãs anteriores. Isto confirma o que já tínhamos previsto na secção 5: a plataforma tem mesmo múltiplos perfis por instituição, cada um a ver os módulos relevantes ao seu mandato (MIC vê abastecimento; Transportes vê corredores e logística).

## 26. Perguntas em aberto (ecrã 4)

1. O IAM por corredor (72%) é uma agregação do IAM das províncias que atravessa, ou é calculado de outra forma? — **por confirmar**
2. Onde fica exactamente o limiar entre "Atenção" (amarelo) e "Crítico" (vermelho) nos cartões de Estradas/Pontes/Terminais? — **por confirmar**
3. ~~Quem aprova o pedido de Desvio de Carga?~~ → **Respondido: precisa de coordenação/aprovação conjunta entre o Ministério dos Transportes e o MIC**, não é decisão unilateral de um só ministério. Isto significa que `SolicitaçãoDesvioCarga` precisa de um campo de aprovação dupla (ex: `aprovaçãoTransportes` e `aprovaçãoMIC`, ambos necessários antes do estado passar a "aprovado").
4. ~~Ordem a seguir?~~ → **Confirmado: Gestão de Alertas**

---

# Ecrã 5 — Gestão de Alertas (Centro de Inteligência de Alertas Nacionais)

Node `52:273`, "centro-de-alertas" — já existia no ficheiro original, não precisei de pedir link novo.

## 27. Revisão à entidade Alerta

O ecrã mostra uma taxonomia de tipos de alerta mais rica do que a que tínhamos previsto na secção 1:

- **Ruptura** — falta de stock (ex: "Ruptura de Stock de Fertilizantes NPK")
- **Retenção** — retenção especulativa de produto por um agente (ex: "Retenção Especulativa de Óleo de Cozinha")
- **Divergência** — inconsistência entre dados esperados e reais (ex: "Divergência de Preço de Trigo Importado")
- **Dumping** — suspeita de dumping de produto estrangeiro
- **Logística** — bloqueios/incidentes de transporte (liga-se directamente aos corredores dos ecrãs 3 e 4)

Cada alerta tem também:
- **Grau de Confiança** (%) — o sistema não trata todos os alertas como certezas; mostra a confiança do modelo (94%, 82%, 78%, 65%, 98% nos exemplos)
- **Estado do ciclo de vida**: Novo → Em verificação → Confirmado (não é só "activo/resolvido" como eu tinha simplificado antes)

**Alerta** (versão revista)
- id (ex: #ALT-09432), tipo, severidade (Crítico/Atenção/Normal)
- produtoId, provinciaId (ou corredorId, se for do tipo Logística), instituiçãoResponsável
- grauConfiança (%)
- estadoCicloVida (Novo / Em verificação / Confirmado)
- descrição (texto em linguagem natural)
- fontesDados (lista — ex: "Declarações de Trânsito aduaneiro MIC", "Sensores de Armazém de Chimoio")
- regraDecisão (texto — ex: "Stock actual < 15% da média de consumo regional trimestral")

## 28. Explicabilidade — "Por que recebi este alerta?"

Esta secção expansível é importante: o sistema não gera só o alerta, explica **porquê** — as fontes de dados que cruzou e a regra de decisão exacta que disparou. Isto é bom para credibilidade institucional (um Ministro tem de conseguir justificar uma decisão tomada com base num alerta automático) e implica que cada `regraDecisão` configurada no sistema precisa de gerar automaticamente este texto explicativo, não pode ser um alerta "caixa preta".

## 29. Medidas de Contingência — cada uma com responsável institucional

Cada alerta sugere medidas concretas, e cada medida tem um responsável claro:
- "Canal Verde Logístico (Porto da Beira)" — Responsável: Alfândegas/MIC
- "Subsidiação Temporária PMEs" — Responsável: Ministério da Agricultura

**MedidaContingência**
- alertaId, descrição, instituiçãoResponsável

## 30. Duas acções operacionais — precisam de definição

Tal como no ecrã de Detalhe de Corredor, aqui há botões que disparam acções reais, não são apenas informativos:
- **"Mitigar Rápido"** — o que faz exactamente? Aplica automaticamente a primeira medida de contingência? Notifica a instituição responsável? Abre um formulário?
- **"Disparar Ofício"** — presumivelmente gera um documento oficial (carta/memorando) endereçado à instituição responsável, mas não sabemos se isto é automático (gera PDF e envia por email) ou se abre um formulário para o utilizador preencher antes de enviar.

## 31. Perguntas em aberto (ecrã 5)

1. **"Mitigar Rápido"** — *assunção de trabalho, por confirmar*: notifica a instituição responsável pela medida de contingência, sem aplicar nada automaticamente — mantém-se um humano a decidir a acção final. Esta é a opção mais segura para um sistema governamental (evita que o software tome decisões operacionais sozinho), mas precisa da tua confirmação antes de ser considerada definitiva.
2. **"Disparar Ofício"** — *assunção de trabalho, por confirmar*: gera um rascunho do ofício para revisão humana antes de enviar, em vez de enviar automaticamente. Pela mesma razão — um documento oficial do Governo não deve sair sem revisão de alguém.
3. Confirma-se que os filtros (Produto/Província/Instituição/Confiança) funcionam todos em conjunto (E lógico)? — **por confirmar**

---

# Ecrã 6 — Painel Provincial

Terceiro da lista de prioridades. Se já tiveres o node no Figma, passa-me o link (como fizeste com o Detalhe de Corredor); caso contrário, digo-te se o encontro sozinho na próxima pesquisa ao ficheiro.
