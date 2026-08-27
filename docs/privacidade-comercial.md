# Arquitectura de Privacidade Comercial

**Como o SINAGEPE compara operadores sem expor a identidade de nenhum**

Agosto de 2026

---

## O problema

Um sistema que reúne preços de operadores concorrentes tem duas obrigações contraditórias.

**Tem de comparar**, porque a comparação é o que dá valor: um comerciante que não sabe como está face ao mercado não tem informação nenhuma.

**E não pode expor**, porque publicar o preço de uma empresa concreta numa plataforma acessível aos seus concorrentes é matéria de direito da concorrência — e a ARC é parceira deste sistema.

Este documento descreve como as duas coisas coexistem.

## As quatro camadas

A arquitectura separa quatro tipos de dado, com regras diferentes para cada um.

| Camada | Quem vê | Regra |
|---|---|---|
| **Identidade do operador** | O próprio, e as autoridades autorizadas | Nunca acessível a outros operadores, directa ou indirectamente |
| **Dados do próprio operador** | Só o titular | Preços submetidos, existências, localização, código |
| **Dados do mercado** | Todos os operadores desse mercado | Sempre agregados e anonimizados |
| **Estatística nacional** | Público | Agregada, sem qualquer via de desagregação |

**A regra que atravessa as quatro:** um operador deve poder responder à pergunta *"como estou perante o mercado?"* e nunca à pergunta *"quem é que está a praticar aquele preço?"*.

## Código interno

Cada operador tem um código próprio no sistema. **Conhece o seu; não consegue chegar ao dos outros.**

O código não pode ser reversível para utilizadores comuns. Nas comparações, os concorrentes aparecem como Operador A, B, C — designações rotativas, que não persistem entre consultas. Se persistissem, bastariam duas consultas para cruzar e identificar.

## Limites de anonimização

**Nenhuma comparação com menos de cinco operadores.** É a mesma regra que aplicamos aos pedidos ao MISAU e às Alfândegas.

**E uma regra adicional, específica do contexto moçambicano:** em praças com dois ou três operadores, a comparação não deve existir de todo. Mesmo anonimizada, "Operador B a 92 MT" identifica-o para quem conhece o mercado local. Os limites mínimos não bastam quando o universo é pequeno — nesses casos, mostra-se apenas o agregado provincial ou nada.

**Agrupamento quando necessário.** Se um mercado tem poucos operadores, agrega-se com mercados vizinhos antes de comparar, e declara-se que se fez.

## Detecção de anomalias

O sistema assinala desvios significativos de preço. Três precisões importam.

**Não é inteligência artificial.** Um preço fora de dois desvios-padrão da média da praça é aritmética sobre uma distribuição. Chamar-lhe IA cria expectativa que o sistema não cumpre e enfraquece o que ele faz bem.

**Um desvio de preço não é dumping.** O sistema nunca declara prática anómala a partir de uma diferença de preço. Um preço abaixo da média pode ser eficiência, escala, produto de qualidade inferior, custo logístico menor, ou stock a escoar. O sistema assinala; a qualificação é de quem tem competência para a fazer.

A formulação correcta é **"desvio de preço relevante — análise recomendada"**, nunca "possível dumping".

**O alerta vai à autoridade, não ao operador.** Mostrar a um comerciante que existe alguém a vender 22% abaixo é informação de mercado legítima. Rotular esse alguém como suspeito é outra coisa, e cabe à ARC.

## O que cada perfil vê

**O operador** vê os seus dados completos, a sua posição relativa no mercado, e o agregado anonimizado da sua praça.

**As autoridades** — ARC, MIC, Alfândegas — vêem o detalhe que a respectiva competência legal justifica, e apenas esse.

**O público** vê estatística nacional agregada, sem qualquer caminho de desagregação até um operador.

## O que já é possível sem servidor

A comparação com a média da praça **não exige registo nem base de dados.**

O comerciante já sabe o preço a que vende. O que lhe falta é a média — e essa existe, medida pelo SIMA em treze mercados. Um campo onde ele escreve o seu preço e o sistema responde com a posição relativa resolve a secção do mercado sem guardar nada: **o número dele nunca sai do navegador.**

É a única parte desta arquitectura que funciona hoje. As restantes exigem operadores registados, o que exige servidor.

## Princípio final

O SINAGEPE deve revelar **tendências e anomalias do mercado** sem revelar **a identidade comercial dos concorrentes**.

A transparência que se procura é sobre o mercado, não sobre as empresas.
