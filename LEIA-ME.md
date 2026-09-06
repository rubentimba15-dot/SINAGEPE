# SINAGEPE — pacote completo

**Setembro de 2026** · 50 ecrãs · 30 ficheiros de dados · 9 módulos · 14 documentos

---

## Instalar
---

## Onde vai cada coisa

O pacote tem duas partes.

### `_fora-do-repositorio/` → para a sua pasta pessoal

**Não descompacte esta pasta dentro do SINAGEPE.**

| Ficheiro | O que é |
|---|---|
| `extractor-sima.py` | Lê os boletins do SIMA e produz o `sima-precos.json` |
| `LEIA-ME-extractor.md` | Como correr o extractor |
| `verificador-pacote.py` | Verifica um pacote antes de o entregar |
| `auditoria-regressao.py` | Testa que nada partiu depois de alterações |

### Tudo o resto → raiz do `SINAGEPE`

Ecrãs na raiz, e as pastas `data`, `assets` e `docs` no sítio.

**Nenhum ficheiro `.py` vai para o repositório.**

---


Descompacte na raiz de `Documents\GitHub\SINAGEPE`, **substituindo o que lá está.** A estrutura é a mesma do repositório.

**Excepção:** o `auditoria-regressao.py` vai para a sua **pasta pessoal**, fora do repositório.

Depois de copiar, corra a auditoria uma vez. Se passar, está tudo no sítio.

---

## Verificado antes de entregar

Zero links mortos · Zero JSON inválidos · Zero erros de sintaxe · Auditoria completa sem falhas · Camada de servidor nos 50 ecrãs


---

## Dois avisos antes de descompactar

### O `assets/access-control.js` NÃO vai neste pacote

É carregado por 49 ecrãs e **não existe do lado de quem preparou o pacote.** No seu repositório está — se não estivesse, nenhum ecrã abriria.

**Descompactar por cima não o apaga**, porque o pacote não contém esse ficheiro. O seu fica intacto.

Convém, porém, guardar uma cópia à parte: é a guarda de sessão de todo o sistema.

### O `credenciais-sinagepe.md` também não vai

Tem as chaves dos dezoito perfis. **Não deve estar no repositório público** nem em pacote nenhum. Guarde-o na sua pasta pessoal.

---

---

## Antes de qualquer entrega futura

Corra o **`verificador-pacote.py`**:

```
python3 verificador-pacote.py .
```

Verifica quatro coisas: se falta alguma coisa, se vai algum segredo, se as dependências críticas estão declaradas, e se há links mortos. **Sai com erro se houver problema.**

Existe por causa de um pacote entregue como completo que tinha quatro ficheiros a menos. Da primeira vez que correu, apanhou outro erro que ninguém sabia: dois ecrãs referiam um módulo que não existe.

---

## As três cartas, prontas para assinar

Em `docs/`. **É o que falta fazer, e não é código.**

### `pedido-ane.md`
Confirmação de uso dos serviços geográficos que a ANE já publica, e se as interrupções passam a camada actualizável.
**Esforço 1 · Impacto 5**

### `pedido-bau.md`
Contagem agregada de alvarás por distrito e tipo de actividade. **Não se pedem dados de empresas — pede-se contagem.** O e-BAU já é digital, pelo que o dado existe em formato electrónico.
**Esforço 2 · Impacto 5**

### `pedido-setsan.md`
Classificação IPC por distrito em formato estruturado, e a definição de insegurança alimentar crónica usada na meta do PQG. Leva como anexo o relatório de cruzamento que o sistema gera.
**Esforço 2 · Impacto 5**

As três invocam o PEDSA e a Lei n.º 34/2014. **Nenhuma pede autorização** — informam e solicitam.

---

## Dois pedidos que dependem de si

**O quadro do INE.** Em `www.ine.gov.mz`, duas publicações na mesma visita: *Estatísticas de Comércio Externo de Bens*, e o quadro **10.1.1** dos *Indicadores Básicos de Agricultura e Alimentação*, página 56.

**A lista dos SDAE da Zambézia.** Ao ICM, IP — Delegação Provincial da Zambézia. Transforma os 733 armazéns num cadastro individualizável, e replica-se às outras dez províncias.

---

## O que este pacote traz

### Motores

**`cadeia-abastecimento.js`** — dependência de origem, distância ao porto, custo colocado no destino, quanto o transporte explica da diferença de preço, índice de cobertura da fonte.

**`fonte-dados.js`** — camada que permite migrar para servidor mudando uma linha. Nos 50 ecrãs.

**Oito de dez motores activos.** Faltam o de previsão, que exige série que não há, e o de comércio espelho, que exige ligação.

### Dados novos

`catalogo-fontes` · `estados-stock` · `comercio-espelho` · `motores` · `pqg-metas` · `pedsa-enquadramento` · `comercio-externo` · `infraestrutura-armazenagem-serie` · `bau-licenciamento` · `campanha-agraria-maap` · `fontes-internacionais`

### Documentos

`politica-dado-reportado.md` — política, procedimentos e estratégia
`preparacao-servidor.md` — as quatro fases da migração
`cadastro-produtores-desenho.md` — inscrição em vez de descoberta

---

## Os números que o sistema declara sobre si próprio

**Zero de dezasseis** fontes actualizam-se sozinhas
**Zero de trinta** unidades de armazenagem reportam existências
**Zero entidades** confirmadas pelo titular — não existe canal
**Zero de sete** metas do PEDSA e do PQG medíveis hoje

**Nenhum destes zeros é defeito de cálculo. São o retrato.**

---

## Ficheiros

**Ecrãs** · `actualidade-dados.html` · `adesao-institucional.html` · `administracao-auditoria.html` · `alertas.html` · `apresentacao.html` · `armazens-nacionais-ouro.html` · `armazens-nacionais.html` · `balanco-visual.html` · `cadastro-armazens.html` · `centro-antecipacao.html` · `comercio-externo.html` · `dashboard-agricultura.html` · `dashboard-arc.html` · `dashboard-banco-central.html` · `dashboard-igsae.html` · `diagnostico-credencial.html` · `ficha-detalhe.html` · `fontes-internacionais.html` · `fontes-nacionais.html` · `governanca-dado.html` · `index.html` · `indicadores-painel.html` · `inflacao-cobertura.html` · `inteligencia-consolidada.html` · `lista-de-acessos.html` · `mapa-integrado.html` · `mapa-nacional.html` · `marketplace-b2b.html` · `medicamentos-cadeia.html` · `modulo-logistica.html` · `monitorizacao-em-falta.html` · `painel-nacional.html` · `ponto-cego-duplo.html` · `portal-bancos.html` · `portal-comerciantes.html` · `portal-empresas.html` · `portal-investidores.html` · `portal-produtores.html` · `portal-publico.html` · `portal-transportadores.html` · `propostas-layout.html` · `rede-logistica.html` · `relatorio-executivo.html` · `relatorios-central.html` · `relatorios.html` · `sandbox-rastreabilidade.html` · `series-precos.html` · `simulador-importacoes.html` · `simulador-preditivo.html` · `verificador-ecras.html`

**Dados** · `adesao-institucional` · `antecipacao` · `armazens-nacionais` · `bau-licenciamento` · `campanha-agraria-maap` · `cascata-precos` · `catalogo-fontes` · `comercio-espelho` · `comercio-externo` · `estados-stock` · `farmacias-anarme` · `fontes-externas` · `fontes-internacionais` · `governanca-dado` · `identificacao-gs1` · `indicadores-painel` · `indicadores-provinciais-ine` · `infraestrutura-armazenagem-serie` · `ipc-ine` · `medicamentos-cadeia` · `motores` · `pedsa-enquadramento` · `pqg-metas` · `produtores-agrarios` · `rede-comercial` · `rede-logistica` · `rede-viaria` · `sandbox-rastreabilidade` · `sima-precos` · `sinagepe-data`

**Módulos** · `cadeia-abastecimento.js` · `fonte-dados.js` · `independencia-fontes.js` · `indicadores-sinagepe.js` · `nav-sinagepe.js` · `pesquisa-sinagepe.js` · `produtos-visual.js` · `selo-proveniencia.js` · `sinagepe.js`

**Documentos** · `argumentario-apresentacao.md` · `auditoria-geral-agosto-2026.md` · `cadastro-produtores-desenho.md` · `integracao-jue-alfandegas.md` · `integracao-medicamentos-misau-anarme.md` · `matriz-fontes-dados.md` · `pedido-ane.md` · `pedido-bau.md` · `pedido-setsan.md` · `piloto-rede-observadores.md` · `politica-dado-reportado.md` · `preparacao-servidor.md` · `privacidade-comercial.md` · `relatorio-upgrade-agosto-2026.md`
