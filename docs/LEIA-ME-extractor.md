# Extractor de Boletins do SIMA

**Instalação e uso — para si e para o seu parceiro**

---

## O que esta ferramenta resolve

O SIMA publica o boletim Quente-Quente todas as sextas-feiras, em PDF. Até agora, cada boletim exigia ler o documento, apontar os preços e escrever os dados à mão. Demora perto de uma hora e não se pode fazer todas as semanas.

**Esta ferramenta faz o mesmo em segundos.** Lê o PDF, extrai os preços médios, os mínimos e máximos por mercado, os fluxos de produto, as cotações da SAFEX e o câmbio, e acrescenta tudo ao ficheiro de dados do sistema.

É o que transforma uma série de cinco pontos numa série contínua.

## Instalação — dez minutos, uma vez só

**1. Instale o Python.**

Vá a `python.org`, secção Downloads, e descarregue a versão para Windows.

Na primeira janela do instalador, **marque a caixa "Add Python to PATH"** antes de continuar. É o passo que as pessoas esquecem e que obriga a repetir tudo.

**2. Instale o leitor de PDF.**

Abra o Terminal — tecla Windows, escrever `cmd`, Enter — e escreva:

```
pip install pdfplumber
```

Espere que termine. É a única biblioteca obrigatória.

**3. Copie a ferramenta.**

Ponha o `extractor-sima.py` dentro de `Documents\GitHub\SINAGEPE`. Tem de estar na mesma pasta que a subpasta `data`, porque é lá que escreve.

## Usar

**1. Descarregue o boletim.** O SIMA publica em `agricultura.gov.mz`. Guarde o PDF na pasta do repositório.

**2. Abra o Terminal nessa pasta.** No Explorer, com a pasta aberta, clique na barra de endereço, escreva `cmd` e carregue Enter.

**3. Corra:**

```
python extractor-sima.py nome-do-boletim.pdf
```

Ou, se tiver o endereço:

```
python extractor-sima.py https://www.agricultura.gov.mz/...QQ-1470.pdf
```

**4. Leia o resumo.** A ferramenta mostra o que encontrou, produto a produto, e lista o que **não** encontrou.

**5. Publique** o `data/sima-precos.json` actualizado, como faz com qualquer ficheiro.

## O que a ferramenta nunca faz

**Não inventa valores.** Se um número não estiver no PDF, fica vazio e aparece na lista de "não encontrado" no fim do resumo. Preencher à mão é decisão de quem revê.

**Não substitui edições já registadas.** Se correr duas vezes o mesmo boletim, avisa e não altera nada.

**Não apaga o que lá está.** Só acrescenta.

## A parte de inteligência artificial

A ferramenta funciona sem IA nenhuma, e é assim que a recomendo usar. A leitura directa acerta em todos os campos que testámos.

Se quiser a confirmação por modelo — útil se o boletim mudar de formato — defina a chave antes de correr:

```
set ANTHROPIC_API_KEY=a-sua-chave
pip install anthropic
```

O modelo **confirma; não substitui.** Se divergir da leitura directa, mostra as duas e deixa a decisão a quem está a rever. E só preenche o que ficou vazio.

Custa cêntimos por boletim. Sem chave definida, tudo funciona na mesma.

## Instalar no computador do parceiro

Exactamente os mesmos passos. Precisa de três coisas:

O **Python** instalado com "Add Python to PATH".

O comando **`pip install pdfplumber`**.

E o repositório clonado, para haver a pasta `data` onde escrever. No GitHub Desktop: `File` → `Clone repository` → separador GitHub.com → escolher `SINAGEPE`.

**Não precisa da chave de API.** Só se quiserem a confirmação por modelo, e nesse caso cada um deve ter a sua — chaves não se partilham.

## Se alguma coisa correr mal

**"python não é reconhecido"** — o Python não foi instalado com "Add Python to PATH". Reinstale e marque a caixa.

**"Nenhum leitor de PDF disponível"** — falta o `pip install pdfplumber`.

**"Não encontro data/sima-precos.json"** — está a correr a partir da pasta errada. Tem de ser a raiz do repositório.

**Erro 403 ao descarregar** — o sítio do ministério recusou. Descarregue o PDF pelo browser e corra a ferramenta sobre o ficheiro.

**A ferramenta não encontrou um preço** — o boletim escreveu essa frase de forma diferente. Verifique no PDF e corrija à mão no JSON. Se acontecer com frequência, o formato mudou e a ferramenta precisa de ajuste.

## Onde guardar

**Na pasta do repositório**, para ter acesso à pasta `data`.

Mas **não a publique** — acrescente `extractor-sima.py` ao `.gitignore`. É ferramenta de trabalho, como a auditoria de regressão. Não faz parte do sistema e não serve a quem abre o site.

---

## Uma nota sobre o que isto vale

Numa demonstração a doadores, isto diz mais do que um chat com inteligência artificial: **o sistema lê o boletim oficial de sexta-feira e actualiza-se.**

É um problema que quem financia reconhece — dados que envelhecem — e uma solução que se vê a funcionar em segundos.
