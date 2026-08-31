# Relatório Geral de Upgrade do SINAGEPE

**Ciclo de Agosto de 2026**

Documento de prestação de contas técnica. Regista o que foi implementado, o que foi retirado e porquê, o que ficou por fazer e de quem depende.

---

## 1. Dados necessários

O ciclo assentou em dados publicados por instituições do Estado. Nenhum dado foi criado, estimado ou assumido.

| Fonte | O que forneceu | Como entrou | Estado |
|---|---|---|---|
| **SIMA** — MAAP | Preços a retalho em 13 mercados, fluxos de produto, câmbio, cotação SAFEX | Extracção automática de PDF, accionada por pessoa | 8 edições carregadas, 7 com valores |
| **ARENE** | Preço regulado de combustível por região, cascata de formação de preço | Leitura de despacho, manual | Revisão de Maio de 2026 |
| **Cadastro nacional** | 30 unidades de armazenagem, natureza jurídica, capacidade, proprietário | Recolha documental, unidade a unidade | 30 de 30 com URL de fonte oficial |
| **ANE** | 4 estradas principais, 3 interrupções com causa e alternativa | Comunicado de imprensa, manual | Janeiro de 2026 |
| **ICM** | Meta da reserva estratégica, preços de importação, silos concessionados | Declaração pública, manual | Meta verificada, existências desconhecidas |
| **GS1** | Situação de Moçambique quanto a prefixo de país | Consulta ao GS1 Global Office | Verificado |
| **IMOPETRO / ENAPP** | Volumes de concurso, transição institucional | Concursos públicos | Verificado |

**Total de registos estruturados no sistema: 434**, em 16 ficheiros de dados.

### Dados que se procuraram e não se obtiveram

**Existências em armazém.** Nenhuma unidade do país as comunica, por nenhum meio. É a lacuna central: impede o cálculo de disponibilidade, cobertura, ocupação e taxa de perdas.

**Preços posteriores a Julho de 2023.** O arquivo público do SIMA pára em Agosto de 2023. A recolha continua semanalmente desde 1991; a publicação em linha parou.

**Quantidades importadas por produto.** As declarações aduaneiras existem na Janela Única Electrónica. Não há agregado público.

**Vulnerabilidade alimentar por província.** O SETSAN avalia anualmente e publica em PDF, sem série estruturada.

---

## 2. Instituições envolvidas

Treze entidades estão documentadas no dossier de adesão, cada uma com esforço, impacto, o que já tem, o que ganha e o primeiro passo concreto.

**Com dado já utilizado no sistema:** MAAP e SIMA, ARENE, ANE, ICM, IMOPETRO.

**Com pedido escrito e por entregar:** Alfândegas e MCNet, para o agregado da Janela Única. MISAU, CMAM e ANARME, para o ficheiro piloto de cinco medicamentos.

**Identificadas neste ciclo como lacuna:** SETSAN, cujo mandato é exactamente a segurança alimentar e nunca tinha entrado no sistema. E a classificação IPC.

**Prioridade por esforço e impacto:** a ANE lidera com esforço 1 e impacto 5. É a integração de melhor retorno de toda a lista.

---

## 3. Regras de negócio

Foram estabelecidas e aplicadas de forma transversal.

**Origem declarada em cada número.** Todo o indicador do sistema classifica-se como facto, estimativa ou demonstração. Os dois primeiros abrem a fórmula, os componentes, a fonte e a data. O terceiro diz porque não é real, o que falta e quem detém o dado.

**Um número sem origem não fica parecido com um que tem.** Os indicadores de demonstração aparecem a tracejado, com o valor esbatido, e cada ecrã declara à cabeça quantos são.

**Não se preenche uma casa por adivinhação.** Quando a extracção do SIMA não encontrou um valor, o campo ficou vazio e foi listado como não encontrado.

**Uma divergência entre fontes não acusa ninguém.** Diz que duas contagens do mesmo objecto não coincidem.

**Um desvio de preço não é prova de infracção.** É indicador que justifica verificação documental. A qualificação cabe a quem tem competência.

**Não se atribui probabilidade sem série histórica.** O sistema não apresenta previsões.

**Comparação de preços não sai do navegador.** O comparador do Marketplace calcula localmente: o preço que o comerciante escreve não é enviado, guardado nem partilhado.

**Nenhuma comparação com menos de cinco observações.** E em praças com dois ou três operadores, a comparação individual não deve existir de todo.

---

## 4. Alertas criados

O Centro de Alertas foi reconstruído sobre os dez riscos do Centro de Antecipação, que declaram evidência, gatilho, janela e quem decide.

**Retirados:** o grau de confiança em percentagem — 94%, 82%, 78% — que era escolhido à mão. E o alerta de retenção especulativa, que acusava um operador com província identificada a partir de dados de demonstração.

**Achados gerados pelo motor de consolidação: nove**, dos quais seis críticos. Incluem o sobrepreço de 34% no arroz importado, observação pública do próprio ICM; a reserva estratégica com meta declarada e existências desconhecidas; e a ausência total de reporte de existências.

---

## 5. Indicadores criados

Foram criados ou reconstruídos indicadores em treze ecrãs. Os que assentam em facto verificável:

| Indicador | Valor | Fonte |
|---|---|---|
| Dispersão de preço entre praças | até **341%** | SIMA |
| Milho no Niassa: Lichinga vs Mandimba | **9 vs 34 MT/kg** | SIMA, edição 1449 |
| Variação do câmbio em dez meses | **+0,03%** | SIMA |
| Capacidade sem leitura automática | **30 de 30 unidades** | Cadastro nacional |
| Factura da geografia — gasóleo | **+15,60 MT/L** | ARENE |
| Produtos com identificação nacional | **0 de 12** | GS1 |
| Fontes que se actualizam sozinhas | **0 de 10** | Registo de integração |

### Indicadores retirados

Vinte e três indicadores foram retirados por não terem origem. Todos estão listados nos respectivos ecrãs, com o valor riscado, a razão e o que falta para os calcular.

Entre eles: disponibilidade nacional de 87%, cobertura de 42 dias, importações em trânsito de 28,45 mil toneladas, produção estimada de 2,84 milhões de toneladas, produtores registados de 1,24 milhões, stock de estabelecimento de 68%, lucro estimado de 15%, ocupação média de armazéns, humidade, temperatura e detecção de pragas.

---

## 6. Testes realizados

**Auditoria de regressão automatizada.** 241 verificações sobre 31 ecrãs e ficheiros. Corre antes de cada entrega e falha se uma funcionalidade já conquistada desaparecer.

**Teste de integração por ecrã.** Cada ecrã reconstruído foi carregado num navegador simulado, com os ficheiros de dados reais, e verificado quanto a: dados carregados, indicadores gerados, interacções funcionais, ausência de valores partidos, e presença das declarações de origem.

**Teste de acesso por perfil.** Confirmado com duas contas distintas que a filtragem funciona: o administrador vê 12 relatórios, o transportador vê 3 e não exporta.

**Validação cruzada da extracção.** A ferramenta do SIMA foi testada contra edições cujos valores tinham sido extraídos manualmente. Na edição 1444, os cinco preços conferiram exactamente.

### Erros encontrados pelos testes, antes de chegarem ao sistema

Preços do Marketplace noventa vezes abaixo do real — arroz a 0,64 MT/kg contra 57,22 medidos. Milho a apanhar o preço do feijão nhemba em três edições. Duas secções do Relatório Executivo invisíveis por lista de ficheiros não actualizada. Indicador de Governação a ler uma lista como se fosse objecto.

**Nenhum destes erros chegou ao sistema publicado.**

---

## 7. Resultado

**Trinta e nove ecrãs no menu, todos auditados.** Nenhum permanece com números de origem desconhecida sem que isso esteja declarado.

**Doze ecrãs reconstruídos** neste ciclo: portal de comerciantes, portal público, dashboard de agricultura, cadastro de armazéns, centro de alertas, simulador de importações, inteligência consolidada, administração e auditoria, módulo de logística, marketplace, e os quatro portais financeiros.

**Dois ecrãs consolidados** — mapa nacional e relatórios — que encaminham para os equivalentes com dados verificados e explicam o que se perdeu.

**Dois ecrãs confirmados como já correctos** — fontes nacionais e internacionais — que só precisaram da barra partilhada.

**Um ecrã novo:** indicadores do painel, onde cada número do painel abre a sua origem.

**Uma ferramenta:** extractor automático de boletins do SIMA, testada contra extracção manual, instalada em dois computadores.

**Cinco documentos** em `docs`: integração com a JUE, integração com o MISAU, arquitectura de privacidade comercial, guia do extractor, e argumentário de apresentação.

**Três correcções estruturais:** navegação de telemóvel na fonte partilhada, servindo os 39 ecrãs de uma vez; alargamento de acessos a oito perfis que estavam asfixiados; e separação entre o que se pode abrir e o que aparece no menu.

---

## 8. Pendências

### Bloqueadas por decisão de terceiros

**Pedido à ANE** — ficheiro estruturado com cortes de estrada. Esforço 1, impacto 5. Escrito, por entregar.

**Pedido às Alfândegas** — agregado mensal por produto e posto, com regra dos cinco operadores. Escrito, por entregar.

**Pedido ao MISAU** — ficheiro piloto de cinco medicamentos a nível provincial. Escrito, por entregar.

**Protocolo com o MAAP** — publicação do boletim do SIMA em formato legível, e acesso às edições posteriores a Agosto de 2023.

**Ligação ao SETSAN** — tabela anual de população em privação alimentar, por província e fase.

### Bloqueadas por infraestrutura

Registo de acções de utilizador, contas individuais, publicação de anúncios no Marketplace, actualização automática de qualquer fonte, geração periódica de relatórios.

Todas exigem servidor. Nenhuma é possível num sítio estático.

### Em aberto no sistema

A edição 1446 do boletim ficou sem valores: o documento oficial repete o texto da semana anterior. Registado como anomalia, não corrigido em silêncio.

Ecrãs de detalhe e telas móveis não foram auditados individualmente — são 47 e não estão no menu.

---

## 9. Próxima etapa

**Primeiro: mostrar o sistema.** É o passo de maior retorno de toda a lista e continua por dar. O argumentário está escrito, com os cinco factos, a ordem de apresentação, as perguntas esperadas e o que não dizer.

**Segundo: entregar o pedido à ANE.** É o de melhor rácio esforço-impacto. Transformaria dados de Janeiro em dados correntes.

**Terceiro: obter edições recentes do SIMA.** O contacto está no próprio boletim. Com a ferramenta de extracção, cada edição nova custa segundos.

**Quarto, e só depois:** auditar os ecrãs de detalhe, ligar o SETSAN e o IPC ao dossier de adesão, e consolidar os mapas remanescentes.

---

## Nota final sobre o método

Este ciclo removeu mais do que acrescentou, e foi essa a decisão certa.

O sistema tinha indicadores que pareciam saber coisas que ninguém sabe: sensores em armazéns que não os têm, percentagens de confiança sem estatística, registos de auditoria com nomes de pessoas que nunca praticaram aquelas acções, recomendações atribuídas a inteligência artificial inexistente.

Cada um desses números era um risco. Não porque estivesse errado — porque quem o citasse ficaria exposto, e quem descobrisse a origem deixaria de confiar nos restantes, incluindo os bons.

**O que ficou é menor e é verdadeiro.** E o que é verdadeiro suporta a pergunta seguinte, que numa reunião com quem decide é sempre a mesma: *de onde vem esse número?*
