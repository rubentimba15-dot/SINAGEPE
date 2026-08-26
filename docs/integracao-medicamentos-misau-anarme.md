# Integração SINAGEPE — Cadeia Nacional de Medicamentos

**Pedido de partilha de dados agregados de disponibilidade e rastreabilidade**

MISAU · CMAM · ANARME · Agosto de 2026

---

## 1. O princípio

**O SINAGEPE é o cérebro de integração. O MISAU, a CMAM, o SIGLUS, o SIMAM, o MACS e a ANARME continuam a ser os produtores oficiais dos dados operacionais.**

Isto não é uma formalidade de cortesia. É a arquitectura, e determina tudo o resto:

O SINAGEPE **não recolhe** dados nas unidades sanitárias. **Não substitui** o SIGLUS nem o SIMAM. **Não gere** stock, não emite requisições, não regista movimentos.

Lê agregados e cruza-os com o que mais nenhum sistema tem: capacidade de armazenagem cadastrada, estado da rede viária, corredores logísticos, custo do combustível por região e calendário de risco.

O problema histórico do sector é a fragmentação. Criar mais uma plataforma isolada agravava-o.

## 2. O que se pede

Um ficheiro periódico com, para cada medicamento essencial e cada nível da cadeia:

| Campo | Exemplo |
|---|---|
| Período | 2026-07 |
| Medicamento | Amoxicilina 500 mg cápsula |
| Código | Item do catálogo CMAM |
| Nível | Depósito distrital |
| Província | Nampula |
| Distrito | Ribáuè |
| Existência | 14 200 |
| Unidade | cápsulas |
| Consumo médio no período | 3 100 |
| Dias de cobertura | 137 |
| Lotes com validade inferior a 6 meses | 1 800 |
| N.º de unidades sanitárias no agregado | 12 |

E, do lado da ANARME, o agregado de rastreabilidade: **volume selado, por medicamento e por mês**, e **número de anomalias detectadas por província** — sem identificar operador nem lote.

## 3. O que NÃO se pede

**Nenhum dado de doente.** Nem número de utente, nem diagnóstico, nem prescrição, nem qualquer campo que permita chegar a uma pessoa. Este ponto não admite excepção.

**Nenhum dado que identifique profissional de saúde.**

**Nenhum lote individual** nem número de selo do Track & Trace.

**Nenhuma identificação de operador privado** — fabricante, importador, distribuidor ou farmácia.

**Nenhum acesso ao SIGLUS, ao SIMAM ou ao sistema da ANARME.** Não é preciso conta nem ligação técnica.

O número de unidades sanitárias no agregado pede-se apenas para saber se há base suficiente. **Quando for inferior a cinco, a existência não deve ser publicada** — numa zona com poucas unidades, o agregado revela cada uma delas.

## 4. Estados propostos

Seis estados, com definição fixa:

| Estado | Definição |
|---|---|
| **Disponível** | Cobertura acima do mínimo definido pela CMAM |
| **Stock crítico** | Cobertura abaixo do mínimo, ainda com existência |
| **Ruptura** | Existência zero |
| **Em trânsito** | Expedido e ainda não recebido |
| **Próximo da validade** | Lotes a expirar dentro do prazo definido pela CMAM |
| **Bloqueado ou recall** | Retirado de circulação por decisão da ANARME |

Os limiares são da CMAM, não do SINAGEPE. **O sistema não inventa critérios clínicos nem logísticos** — aplica os que a autoridade competente definir, e declara qual usou.

## 5. Redistribuição — a função que justifica tudo

Se uma unidade tiver excesso e outra estiver em ruptura do mesmo medicamento, **o sistema assinala e recomenda transferência antes de nova aquisição.**

É a única funcionalidade de todo o projecto que **poupa dinheiro em vez de o gastar**, e é medível em meticais: cada transferência evitada de compra é a diferença entre o custo de aquisição e o custo de transporte.

Não exige inteligência artificial. É aritmética sobre dois números — dias de cobertura na origem e no destino — mais a distância, que o SINAGEPE já tem no cadastro de armazenagem e na rede viária.

**Recomenda; não ordena.** Cada sugestão sai com a origem, o destino, a quantidade, a distância, o estado da estrada nesse troço e quem tem de aprovar. A decisão é do MISAU e da CMAM.

**E declara o que não sabe.** Se o troço entre as duas unidades tiver corte registado pela ANE, a recomendação di-lo em vez de a esconder.

## 6. Sobre previsões

Este documento **não pede nem produz previsões de ruptura a 7, 30 ou 90 dias.**

Uma previsão exige série histórica que permita estimar probabilidade. O que se pode fazer com rigor, e se propõe, é outra coisa:

**Dias de cobertura ao ritmo actual** — existência a dividir pelo consumo médio registado. É extrapolação declarada, não previsão. Diz "ao ritmo das últimas semanas, esta existência dura 41 dias", e não "há 67% de probabilidade de ruptura".

A diferença não é semântica. Um número com percentagem de confiança que ninguém consegue calcular destrói a credibilidade de todos os outros.

## 7. O que o MISAU e a ANARME ganham

**Cruzamento que nenhum dos sistemas actuais faz.** O SIGLUS sabe o que há em cada unidade. Não sabe se a estrada que lá chega está cortada, quanto custa o gasóleo naquela região, nem se o armazém provincial mais próximo tem espaço. O SINAGEPE tem as três coisas.

**Redistribuição antes de aquisição.** Poupança directa e demonstrável.

**Leitura territorial da ruptura.** Mapa nacional que mostra onde falta o quê, cruzado com exposição provincial e cortes de via.

**Ligação do Track & Trace à logística.** O sistema de rastreabilidade sabe onde está cada lote. Cruzado com capacidade de armazenagem e estado das vias, passa a dizer também **porque** está parado.

## 8. Primeiro passo proposto

**Um período, cinco medicamentos essenciais, nível provincial apenas.** Existência e consumo médio. Sem validade, sem trânsito, sem distrito.

Cinco linhas por província, cinquenta linhas no total. Serve para verificar se o cruzamento produz recomendações de transferência que façam sentido a quem conhece o terreno.

Se não produzir, encerra-se sem custo. Se produzir, discute-se o alargamento.

## 9. Regras que o SINAGEPE assume

**Nunca receber, armazenar ou apresentar dado de doente**, ainda que venha por erro no ficheiro. Se aparecer, o ficheiro é rejeitado inteiro e a ocorrência comunicada.

**Nunca mostrar agregado de menos de cinco unidades sanitárias.**

**Nunca aplicar limiar clínico ou logístico próprio.** Os critérios são da CMAM e vêm declarados no ecrã.

**Nunca apresentar recomendação como ordem.** Toda a sugestão de transferência identifica quem decide.

**Declarar a fonte, o período e a data de recolha** em cada indicador.

---

## Nota sobre o que já existe

O SIGLUS recolhe nas unidades sanitárias e sincroniza com o SIMAM nos depósitos distritais. O Sistema Nacional de Rastreabilidade de Medicamentos e Produtos de Saúde foi lançado oficialmente a 30 de Julho de 2025, com selo aplicado do fabrico ao paciente. A ANARME instalou a sala de controlo em Junho de 2026.

**A infraestrutura de dados existe.** O que falta é a ligação — e a ligação é um ficheiro, não um sistema.
