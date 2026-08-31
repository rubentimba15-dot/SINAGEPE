# Rede de Observadores — Especificação de Piloto

**Como testar a hipótese central antes de construir a aplicação completa**

Agosto de 2026

---

## O que se vai testar

A proposta da rede nacional rotativa de observadores assenta numa hipótese que ninguém verificou ainda:

> **As pessoas participam?**

Tudo o resto — a rotação, os créditos, a detecção de conteúdo artificial, o motor antifraude, a integração com operadoras — só faz sentido se a resposta for sim. E se for não, poupa-se um projecto inteiro.

**Este piloto testa essa hipótese e mais nada.** É deliberadamente pequeno.

---

## O que se constrói

**Um distrito.** Não uma província, não o país. Um distrito com mercado activo e cobertura de rede razoável.

**Três funções, e só três:**

Registar o preço de um produto num estabelecimento, com fotografia da etiqueta.

Consultar onde esse produto está mais barato no distrito, com a data e hora da última confirmação.

Ver quantas pessoas confirmaram o mesmo preço no mesmo sítio.

**Nada mais.** Sem vídeo, sem validade, sem condições do estabelecimento, sem mapa, sem alertas, sem carteira de créditos.

---

## O que fica de fora, e porquê

| Componente | Porque fica de fora do piloto |
|---|---|
| **Créditos e recompensas** | No momento em que uma contribuição vale dinheiro ou dados móveis, cria-se incentivo para a fabricar. Todo o motor antifraude existe por causa dos créditos. Sem eles, o piloto mede participação genuína. |
| **Detecção de conteúdo gerado por IA** | É um problema não resolvido: os melhores detectores erram, e erram mais à medida que os geradores melhoram. A defesa que funciona é outra — ver abaixo. |
| **Vídeo** | Custa largura de banda, armazenamento e processamento. Uma fotografia de etiqueta chega para verificar um preço. |
| **Condições do estabelecimento** | É a parte mais sensível: uma observação sobre uma farmácia pode prejudicar um negócio. Só depois de a rede provar que funciona, e com validação técnica definida. |
| **Validade e lote** | Exige leitura fiável de datas em embalagens, que é problema de OCR difícil. Fica para fase seguinte. |
| **Acordos com operadoras** | Só faz sentido quando houver volume que justifique a negociação. |
| **Rotação de trinta dias** | Num piloto de um distrito, com poucas dezenas de participantes, não há população suficiente para rodar. A rotação entra quando houver por onde escolher. |

---

## A defesa contra dados falsos, no piloto

Não é um detector. **É a confirmação independente.**

Um preço reportado por uma pessoa é uma observação. O mesmo preço, no mesmo estabelecimento, reportado por três pessoas diferentes em dias diferentes, é um facto.

O piloto mostra sempre **quantas confirmações independentes existem**, e a data da mais recente. Um preço com uma única observação aparece marcado como tal.

**Três regras simples, que não precisam de inteligência artificial:**

Uma fotografia idêntica submetida duas vezes é rejeitada — comparação directa do ficheiro.

Uma localização incompatível com o estabelecimento declarado é assinalada.

Um preço fora do intervalo já observado nesse distrito exige segunda confirmação antes de aparecer.

Isto apanha a fraude oportunista, que é a que existe quando não há dinheiro em jogo. A fraude organizada só aparece quando há recompensa — e o piloto não tem.

---

## O que se aprende, e como se mede

O piloto tem quatro perguntas e cada uma tem uma medida.

**As pessoas instalam?** Número de instalações no distrito, ao fim de trinta dias.

**As pessoas contribuem mais do que uma vez?** Percentagem de utilizadores com duas ou mais submissões. É a medida que interessa: uma pessoa que contribui uma vez está a experimentar; uma que contribui cinco está a usar.

**A informação é utilizável?** Percentagem de submissões com fotografia legível e preço coerente. Se for baixa, o problema é de interface, não de vontade.

**A informação chega a ser confirmada?** Percentagem de preços com duas ou mais observações independentes. É esta que determina se a rede pode funcionar como fonte.

**Se a segunda medida ficar abaixo de um quarto dos utilizadores, a hipótese falhou** — e é melhor sabê-lo com um distrito do que com o país.

---

## O que este piloto resolve, que nenhum protocolo resolve

O sistema não tem existências em armazém porque nenhum armazenista as declara, e isso depende de decisão institucional que não controlamos.

**Uma prateleira vazia fotografada por um consumidor é informação de disponibilidade** — obtida sem pedir nada a instituição nenhuma.

É a única via de dados do sistema que não depende de terceiros dizerem que sim. Vale a pena por isso, mesmo que só funcione em parte.

---

## Princípios que se mantêm desde já

Estes não são adiáveis, mesmo num piloto.

**Dado observado, opinião e conclusão técnica são três coisas.** Uma fotografia de uma etiqueta é dado observado. *"Está caro"* é opinião. *"Este preço viola o tabelamento"* é conclusão técnica, e o sistema nunca a produz.

**Nada é publicado sobre um estabelecimento sem confirmação independente.** Um preço com uma só observação aparece a quem o submeteu, não ao público.

**A localização recolhida é a do estabelecimento, não a do utilizador.** Guarda-se onde está a loja, não por onde a pessoa andou.

**O participante pode apagar as suas contribuições e a sua conta.** Sem pedir, sem justificar.

**Nenhuma observação identifica quem a fez, no que é mostrado ao público.**

---

## Faseamento

**Fase 0 — Antes de escrever código.** Enquadramento de protecção de dados pessoais, autorização da autoridade competente, e escolha do distrito com o critério declarado.

**Fase 1 — Piloto.** As três funções, um distrito, trinta dias, sem créditos.

**Fase 2 — Decisão.** Com as quatro medidas na mão: continuar, ajustar ou parar. Esta fase existe e é obrigatória. Um piloto que não pode terminar em "parar" não é um piloto.

**Fase 3 — Se continuar.** Segundo distrito, com contraste deliberado: se o primeiro for urbano, o segundo é rural. É aí que se descobre se a hipótese vale fora de onde foi testada.

**Fase 4 — Rotação e créditos.** Só quando houver população suficiente para rodar e volume que justifique negociar com operadoras. É a fase que traz o motor antifraude, e ela vem junta.

---

## O que se preserva do documento original

A especificação completa que motivou este piloto continua válida como destino, e tem três coisas que devem sobreviver a qualquer redução de âmbito.

**A regra de não criar clientela.** *"A elevada qualidade de um observador não deverá, por si só, criar direito permanente à participação."* Um grupo permanente de informadores torna-se, com o tempo, um grupo com interesses.

**A amostragem estratificada.** Aleatória dentro de cada estrato territorial, não aleatória no país inteiro — senão as cidades dominam e os distritos rurais desaparecem da amostra.

**O exemplo da farmácia.** Uma observação sobre a ausência de ar condicionado fica classificada como observação do consumidor, e nunca se converte automaticamente numa afirmação sobre violação de condições legais. Protege o estabelecimento e protege a credibilidade da rede.

---

## Nota final

Um piloto pequeno que responde a uma pergunta vale mais do que um sistema grande que responde a nenhuma.

Se as pessoas participarem, esta rede resolve a lacuna central do SINAGEPE e faz o que nenhum protocolo institucional faria. Se não participarem, ficou-se a saber cedo, num distrito, e sem ter construído a detecção de deepfakes, a carteira de créditos e os acordos com operadoras.

**As duas respostas são úteis. É isso que faz dele um piloto.**
