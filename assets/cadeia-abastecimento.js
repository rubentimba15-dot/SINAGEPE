/* ============================================================================
   MOTOR DE ANÁLISE DA CADEIA DE ABASTECIMENTO
   ----------------------------------------------------------------------------
   Calcula, a partir dos dados que o sistema já tem:

     · dependência de origem por praça de destino
     · distância de cada praça ao porto de entrada mais próximo
     · custo de combustível por tonelada em cada rota
     · quanto da diferença de preço entre praças o transporte explica
     · fluxos que atravessam troço com corte registado

   E declara, sem rodeios, o que NÃO calcula e porquê. As quatro coisas
   mais pedidas — previsão de ruptura, periodicidade de importação,
   retenção artificial e necessidade de reabastecimento — não são
   calculáveis com o que existe, e o motor diz o que falta para cada uma.

   Regra que governa este ficheiro: nenhum número sai daqui sem que se
   possa reconstruir como foi obtido. Cada resultado traz os seus
   pressupostos.
   ========================================================================= */
(function (global) {
  'use strict';

  /* ---- portos de entrada ----
     Coordenadas ao nível da cidade portuária. Servem para medir distância,
     não para navegação. */
  var PORTOS = [
    { nome: 'Maputo',    lat: -25.97, lon: 32.57, corredor: 'maputo' },
    { nome: 'Beira',     lat: -19.83, lon: 34.85, corredor: 'beira' },
    { nome: 'Nacala',    lat: -14.54, lon: 40.68, corredor: 'nacala' },
    { nome: 'Quelimane', lat: -17.88, lon: 36.89, corredor: 'zambezia' },
    { nome: 'Pemba',     lat: -12.97, lon: 40.52, corredor: 'norte' }
  ];

  /* Praças com coordenada conhecida. Usadas quando o fluxo não a traz. */
  var PRACAS = {
    'Mandimba': [-14.36, 35.65], 'Panda': [-24.05, 34.72],
    'Lichinga': [-13.31, 35.24], 'Chokwé': [-24.53, 33.00],
    'Maputo': [-25.97, 32.57], 'Nampula': [-15.12, 39.27],
    'Beira': [-19.83, 34.85], 'Tete': [-16.16, 33.59],
    'Quelimane': [-17.88, 36.89], 'Cuamba': [-14.80, 36.54],
    'Nhamatanda': [-19.27, 34.19], 'Xai-Xai': [-25.05, 33.64],
    'Massinga': [-23.33, 35.38], 'Manjacaze': [-24.71, 33.88],
    'Mocuba': [-16.84, 36.99], 'Montepuez': [-13.13, 38.99],
    'Vilanculo': [-22.00, 35.31], 'Maxixe': [-23.86, 35.35],
    'Homoine': [-23.87, 35.13], 'Angónia': [-14.75, 34.35],
    /* Praças que faltavam e impediam o cálculo de três produtos. */
    'Búzi': [-19.84, 34.10], 'Cidade de Maputo': [-25.97, 32.57],
    'Guvuro': [-21.20, 34.90], 'Govuro': [-21.20, 34.90],
    'Vilanculos': [-22.00, 35.31], 'Inhassoro': [-21.53, 35.20],
    'Morrumbene': [-23.65, 35.35], 'Mulevala': [-16.53, 36.60],
    'Namuno': [-13.65, 38.25], 'Gondola': [-19.16, 33.65],
    'Chibabava': [-20.30, 34.10], 'Panga': [-19.10, 34.30]
  };

  /* Pressupostos do cálculo de transporte. Declarados aqui para que
     quem discordar saiba exactamente o que trocar. */
  var TRANSPORTE = {
    capacidadeToneladas: 20,
    consumoLitrosPor100km: 35,
    factorEstrada: 1.30,   /* a estrada não é linha recta */
    nota: 'Camião de 20 toneladas, 35 litros por 100 km em carga, ' +
          'distância em linha recta multiplicada por 1,30 para aproximar o traçado real. ' +
          'Ao preço de gasóleo mais alto do país. Não inclui portagens, ' +
          'salário, amortização, seguro nem retorno em vazio.'
  };

  function haversine(a, b) {
    var R = 6371, p = Math.PI / 180;
    var dla = (b[0] - a[0]) * p, dlo = (b[1] - a[1]) * p;
    var h = Math.sin(dla / 2) * Math.sin(dla / 2) +
            Math.cos(a[0] * p) * Math.cos(b[0] * p) * Math.sin(dlo / 2) * Math.sin(dlo / 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  function coordDe(nome, fluxos) {
    if (PRACAS[nome]) return PRACAS[nome];
    for (var i = 0; i < (fluxos || []).length; i++) {
      var f = fluxos[i];
      if (f.destino === nome && f.destinoCoord) return [f.destinoCoord.lat, f.destinoCoord.lon];
      if (f.origem === nome && f.origemCoord) return [f.origemCoord.lat, f.origemCoord.lon];
    }
    return null;
  }

  function juntarFluxos(sima) {
    var F = [];
    for (var k in sima) {
      if (k.indexOf('fluxos') === 0 && Object.prototype.toString.call(sima[k]) === '[object Array]') {
        F = F.concat(sima[k]);
      }
    }
    return F;
  }

  /* ---- 1. DEPENDÊNCIA DE ORIGEM ----
     Uma praça abastecida por uma só origem documentada está mais exposta
     do que uma abastecida por várias. Não é medida de risco: é contagem
     do que o boletim regista. */
  function dependenciaOrigem(sima) {
    var F = juntarFluxos(sima), mapa = {};
    F.forEach(function (f) {
      if (!f.destino || !f.origem) return;
      if (!mapa[f.destino]) mapa[f.destino] = { origens: {}, produtos: {}, fluxos: 0 };
      mapa[f.destino].origens[f.origem] = true;
      if (f.produto) mapa[f.destino].produtos[f.produto] = true;
      mapa[f.destino].fluxos++;
    });
    return Object.keys(mapa).map(function (d) {
      var o = Object.keys(mapa[d].origens);
      return {
        destino: d,
        origens: o,
        nOrigens: o.length,
        produtos: Object.keys(mapa[d].produtos),
        fluxos: mapa[d].fluxos,
        origemUnica: o.length === 1,
        producaoLocal: o.some(function (x) { return /produ[çc][ãa]o local|circunvizinh/i.test(x); })
      };
    }).sort(function (a, b) { return a.nOrigens - b.nOrigens; });
  }

  /* ---- 2. DISTÂNCIA AO PORTO ---- */
  function distanciaAoPorto(nome, fluxos) {
    var c = coordDe(nome, fluxos);
    if (!c) return null;
    var melhor = null;
    PORTOS.forEach(function (p) {
      var km = haversine(c, [p.lat, p.lon]);
      if (!melhor || km < melhor.km) melhor = { porto: p.nome, corredor: p.corredor, km: km };
    });
    return melhor;
  }

  /* ---- 3. CUSTO DE COMBUSTÍVEL POR TONELADA ---- */
  function custoTransporte(km, precoGasoleo) {
    var kmReal = km * TRANSPORTE.factorEstrada;
    var litros = kmReal * TRANSPORTE.consumoLitrosPor100km / 100;
    var mt = litros * precoGasoleo;
    return {
      kmLinha: km, kmEstimado: kmReal, litros: litros,
      custoTotal: mt,
      custoPorTonelada: mt / TRANSPORTE.capacidadeToneladas,
      custoPorKg: mt / TRANSPORTE.capacidadeToneladas / 1000
    };
  }

  /* ---- 4. O TRANSPORTE EXPLICA A DIFERENÇA DE PREÇO? ----
     O cálculo mais útil do motor, e o que exige mais cuidado a ler.

     Compara a diferença de preço entre a praça mais barata e a mais cara
     com o que custaria levar o produto de uma à outra. Se o transporte
     explica pouco, NÃO se conclui que alguém cobra a mais: conclui-se que
     as duas praças provavelmente não estão ligadas por comércio, e são
     mercados separados. É conclusão diferente e mais provável. */
  function transporteExplica(sima, cascata) {
    var F = juntarFluxos(sima);
    var R = sima.retalho1462 || sima.retalho || [];
    var gas = 0;
    (cascata.regioes || []).forEach(function (r) { if (r.gasoleo > gas) gas = r.gasoleo; });
    if (!gas) return [];

    return R.map(function (r) {
      var ma = r.minimo.mercados[0], mb = r.maximo.mercados[0];
      var ca = coordDe(ma, F), cb = coordDe(mb, F);
      var dif = r.maximo.valor - r.minimo.valor;
      if (!ca || !cb || !dif) {
        return { produto: r.produto, calculavel: false,
                 razao: 'coordenada de uma das praças não conhecida' };
      }
      var km = haversine(ca, cb);
      var t = custoTransporte(km, gas);
      var pct = t.custoPorKg / dif * 100;
      /* Existe fluxo documentado entre as duas praças? */
      var ligadas = F.some(function (f) {
        return (f.origem && f.destino) &&
          ((f.origem.indexOf(ma) >= 0 && f.destino.indexOf(mb) >= 0) ||
           (f.origem.indexOf(mb) >= 0 && f.destino.indexOf(ma) >= 0));
      });
      return {
        produto: r.produto, calculavel: true,
        pracaBarata: ma, pracaCara: mb,
        precoBaixo: r.minimo.valor, precoAlto: r.maximo.valor,
        diferenca: dif,
        km: km, kmEstimado: t.kmEstimado,
        custoPorKg: t.custoPorKg,
        percentagemExplicada: pct,
        ligadasPorFluxo: ligadas,
        leitura: ligadas
          ? 'Existe fluxo documentado entre as duas praças.'
          : 'Não há fluxo documentado entre estas duas praças. ' +
            'A diferença provavelmente não é de arbitragem por realizar: ' +
            'são mercados que não comerciam entre si.'
      };
    });
  }

  /* ---- 5. FLUXOS QUE ATRAVESSAM CORTE ----
     Aproximação grosseira: o fluxo é associado ao corte quando origem ou
     destino estão na província do corte. Não é análise de rota — o sistema
     não tem traçado real das estradas. */
  function fluxosAfectadosPorCorte(sima, redeViaria) {
    var F = juntarFluxos(sima);
    var out = [];
    (redeViaria.interrupcoes || []).forEach(function (c) {
      var afectados = F.filter(function (f) {
        var t = (f.origem || '') + ' ' + (f.destino || '') + ' ' + (f.zona || '');
        return c.provincia && t.toLowerCase().indexOf(String(c.provincia).toLowerCase()) >= 0;
      });
      out.push({
        estrada: c.estrada, troco: c.troco, provincia: c.provincia,
        gravidade: c.gravidade, alternativa: !!c.alternativa,
        fluxosNaProvincia: afectados.length,
        aproximacao: 'Associação por província, não por rota. O sistema não tem traçado ' +
                     'que permita saber se o fluxo passa efectivamente no troço cortado.'
      });
    });
    return out;
  }


  /* ---- 7. COMPARADOR DE CUSTO COLOCADO NO DESTINO ----
     Responde à pergunta que o preço sozinho não responde:
     comprar onde é mais barato compensa depois de pagar o transporte?

     Não sabe se há produto disponível — nenhuma unidade do país declara
     existências. Compara o custo de comprar ao preço observado em cada
     praça, o que é coisa diferente e mais modesta. */
  function pracasComPreco(sima, produto) {
    var R = sima.retalho1462 || sima.retalho || [];
    var linha = null;
    for (var i = 0; i < R.length; i++) if (R[i].produto === produto) linha = R[i];
    if (!linha) return [];
    var out = [];
    function juntar(m, v) {
      if (!m || v == null) return;
      for (var j = 0; j < out.length; j++) if (out[j].praca === m) return;
      out.push({ praca: m, preco: v });
    }
    (linha.minimo.mercados || []).forEach(function (m) { juntar(m, linha.minimo.valor); });
    (linha.maximo.mercados || []).forEach(function (m) { juntar(m, linha.maximo.valor); });
    (linha.outros || []).forEach(function (o) { juntar(o.mercado, o.valor); });
    return out;
  }

  function custoColocado(sima, cascata, produto, quantidadeKg, destino) {
    var F = juntarFluxos(sima);
    var cd = coordDe(destino, F);
    var gas = 0;
    (cascata.regioes || []).forEach(function (r) { if (r.gasoleo > gas) gas = r.gasoleo; });
    if (!cd || !gas) return { calculavel: false, razao: 'destino sem coordenada ou preço de gasóleo em falta' };

    var P = pracasComPreco(sima, produto);
    var linhas = [];
    P.forEach(function (x) {
      var co = coordDe(x.praca, F);
      if (!co) return;
      var km = haversine(co, cd);
      var t = custoTransporte(km, gas);
      var mercadoria = x.preco * quantidadeKg;
      /* O camião transporta até 20 t. Acima disso, mais viagens. */
      var viagens = Math.max(1, Math.ceil(quantidadeKg / 1000 / TRANSPORTE.capacidadeToneladas));
      var transporte = t.custoTotal * viagens;
      var total = mercadoria + transporte;
      linhas.push({
        praca: x.praca, preco: x.preco,
        km: km, kmEstimado: t.kmEstimado, viagens: viagens,
        mercadoria: mercadoria, transporte: transporte,
        total: total, precoEntregue: total / quantidadeKg,
        acrescimo: (total / mercadoria - 1) * 100,
        mesmaPraca: x.praca === destino
      });
    });
    linhas.sort(function (a, b) { return a.total - b.total; });

    /* A ordem inverteu? Isto é o que o comparador existe para mostrar. */
    var porPreco = linhas.slice().sort(function (a, b) { return a.preco - b.preco; });
    var inverteu = linhas.length > 1 && porPreco[0].praca !== linhas[0].praca;

    return {
      calculavel: true, produto: produto, destino: destino,
      quantidadeKg: quantidadeKg, precoGasoleo: gas,
      linhas: linhas, inverteu: inverteu,
      maisBarataNaOrigem: porPreco.length ? porPreco[0].praca : null,
      maisBarataEntregue: linhas.length ? linhas[0].praca : null,
      naoInclui: 'Portagens, salário do motorista, amortização do veículo, seguro, carga e ' +
                 'descarga, e retorno em vazio. E, sobretudo, não inclui saber se há produto ' +
                 'disponível: nenhuma unidade do país declara existências.'
    };
  }


  /* ---- 8. ÍNDICE DE COBERTURA DA FONTE ----
     ATENÇÃO AO NOME. Chamou-se "transparência de mercado" e estava
     errado: media a cobertura de UMA fonte — o boletim do SIMA que o
     sistema carregou — e não a informação económica que existe no país.

     A correcção é de método, não de cálculo. Um zero aqui significa
     "não extraído desta edição deste boletim", e nunca:
       · que o mercado não tem preço
       · que não existe informação noutra fonte
       · que não existe informação noutro período
       · que não existe o produto

     Exemplo concreto: Manhiça, Cidade de Inhambane, Cidade de Quelimane
     e Vilankulo aparecem a zero. Boletins do SIMA de 2022 têm preços
     para essas praças. O zero é da edição carregada, não do país.

     E a capacidade de armazenagem por província existe em publicação do
     INE — quadro 10.1.1 dos Indicadores Básicos de Agricultura e
     Alimentação, com o ICM como fonte. O sistema não a tem, e isso é
     lacuna de integração, não ausência nacional.

     Quatro componentes, todas verificáveis. Nenhuma ponderada por
     juízo: cada uma vale um ponto, e a soma está à vista.

       1. Preço conhecido           — há preço extraído para a praça?
       2. Actualidade               — o dado tem menos de um ciclo da fonte?
       3. Disponibilidade conhecida — sabe-se o que há para vender?
       4. Fluxo documentado         — sabe-se de onde vem o produto?

     A terceira dá zero em todo o país, e isso é o resultado, não um
     defeito do cálculo. */
  var TRANSPARENCIA = {
    componentes: [
      { id: 'preco', nome: 'Preço extraído',
        mede: 'Foi extraído preço desta edição do boletim para esta praça',
        nota: 'Zero pode ser falha de extracção, ausência naquela semana, ou o mercado ' +
              'não ter sido visitado. O sistema não distingue.' },
      { id: 'actualidade', nome: 'Dado actual',
        mede: 'O preço tem menos de um ciclo de publicação da fonte',
        nota: 'Zero em todo o país: a publicação em linha do SIMA parou em Agosto de 2023. ' +
              'A recolha não parou.' },
      { id: 'disponibilidade', nome: 'Disponibilidade nesta fonte',
        mede: 'O boletim declara quantidade disponível',
        nota: 'O SIMA é fonte de preços, não de existências. Zero aqui é o esperado ' +
              'e não diz nada sobre o que existe no país.' },
      { id: 'fluxo', nome: 'Origem documentada',
        mede: 'O boletim regista de onde vem o produto que ali se vende' }
    ],
    escala: [
      { min: 4, rotulo: 'alta',    cor: '#12B981' },
      { min: 3, rotulo: 'média',   cor: '#F0A926' },
      { min: 2, rotulo: 'baixa',   cor: '#EF4444' },
      { min: 0, rotulo: 'mínima',  cor: '#7F1D1D' }
    ],
    nota: 'Cada componente vale um ponto. Não há ponderação: quem discordar ' +
          'da igualdade dos pesos vê o detalhe e tira a sua própria conclusão.',
    aviso: 'Este índice mede a COBERTURA DE UMA FONTE, não a visibilidade económica do país. ' +
           'Um zero significa "não extraído desta edição deste boletim" — nunca "não existe".'
  };

  function transparenciaMercado(sima) {
    var R = sima.retalho1462 || sima.retalho || [];
    var F = juntarFluxos(sima);
    var declarados = sima.mercados || [];

    /* Praças com preço extraído, e para quantos produtos. */
    var comPreco = {};
    R.forEach(function (r) {
      (r.minimo.mercados || []).forEach(function (m) { comPreco[m] = (comPreco[m] || 0) + 1; });
      (r.maximo.mercados || []).forEach(function (m) { comPreco[m] = (comPreco[m] || 0) + 1; });
      (r.outros || []).forEach(function (o) { comPreco[o.mercado] = (comPreco[o.mercado] || 0) + 1; });
    });

    /* Praças com fluxo documentado, como origem ou destino. */
    var comFluxo = {};
    F.forEach(function (f) {
      if (f.destino) comFluxo[f.destino] = true;
      if (f.origem) comFluxo[f.origem] = true;
    });

    /* Universo: mercados declarados no boletim mais praças com preço. */
    var universo = {};
    declarados.forEach(function (m) { universo[m] = true; });
    Object.keys(comPreco).forEach(function (m) { universo[m] = true; });

    var idadeCiclos = null;
    if (sima.meta && sima.meta.dataDados) idadeCiclos = 'ver motor de actualidade';

    var linhas = Object.keys(universo).map(function (m) {
      /* Estado por componente, e não booleano.
         'nd' = não disponível nesta fonte · 'ne' = não extraído
         'ok' = presente · 'hist' = existe noutro período */
      var c = {
        preco: comPreco[m] ? 'ok' : (declarados.indexOf(m) >= 0 ? 'ne' : 'nd'),
        actualidade: 'hist',
        disponibilidade: 'nd',
        fluxo: comFluxo[m] ? 'ok' : 'nd'
      };
      var ESTADOS = {
        ok:   { rotulo: 'presente', conta: true },
        ne:   { rotulo: 'não extraído desta edição', conta: false },
        nd:   { rotulo: 'não disponível nesta fonte', conta: false },
        hist: { rotulo: 'existe, mas de período anterior', conta: false }
      };
      var pontos = 0;
      for (var k in c) if (ESTADOS[c[k]] && ESTADOS[c[k]].conta) pontos++;
      var esc = TRANSPARENCIA.escala.filter(function (e) { return pontos >= e.min; })[0];
      return {
        praca: m, pontos: pontos, de: 4,
        componentes: c, estados: ESTADOS,
        produtosComPreco: comPreco[m] || 0,
        declaradoNoBoletim: declarados.indexOf(m) >= 0,
        nivel: esc.rotulo, cor: esc.cor
      };
    }).sort(function (a, b) {
      return b.pontos - a.pontos || b.produtosComPreco - a.produtosComPreco;
    });

    /* Cobertura: dos mercados que o boletim declara, quantos têm preço? */
    var declaradosSemPreco = declarados.filter(function (m) { return !comPreco[m]; });

    return {
      linhas: linhas,
      universo: linhas.length,
      declaradosNoBoletim: declarados.length,
      declaradosComPreco: declarados.length - declaradosSemPreco.length,
      declaradosSemPreco: declaradosSemPreco,
      cobertura: declarados.length
        ? (declarados.length - declaradosSemPreco.length) / declarados.length * 100 : 0,
      semDisponibilidade: linhas.length,   /* todas */
      componentes: TRANSPARENCIA.componentes,
      nota: TRANSPARENCIA.nota,
      achado: declaradosSemPreco.length
        ? 'O boletim declara ' + declarados.length + ' mercados de recolha e o sistema só ' +
          'conseguiu extrair preço de ' + (declarados.length - declaradosSemPreco.length) + '. ' +
          'Os restantes são nomeados no texto sem valor associado, ou o valor não foi ' +
          'extraído do PDF. É lacuna de extracção ou de publicação — o sistema não distingue.'
        : null
    };
  }

  /* ---- 6. O QUE O MOTOR NÃO CALCULA ----
     Está aqui, em código, para que quem procurar a função não a encontre
     e perceba porquê. */
  var NAO_CALCULA = [
    { pedido: 'Previsão de ruptura por análise de padrões históricos',
      falta: 'Série de preços corrente e série de existências. O sistema tem oito edições ' +
             'do boletim ao longo de dez meses, e a publicação parou em Agosto de 2023.',
      exigiria: 'Publicação corrente do SIMA e declaração periódica de existências',
      quemDetem: 'MAAP · SIMA · armazenistas' },
    { pedido: 'Periodicidade da importação e necessidade de reabastecimento',
      falta: 'Não existe no sistema nenhum dado de importação: nem volumes, nem datas, ' +
             'nem operadores. A única referência é uma observação pública do ICM sobre ' +
             'preço declarado de arroz.',
      exigiria: 'Agregado aduaneiro mensal por produto, com a regra dos cinco operadores',
      quemDetem: 'Alfândegas · Janela Única Electrónica' },
    { pedido: 'Detecção de retenção artificial de produto',
      falta: 'Exige saber o que está em armazém e há quanto tempo. Nenhuma das trinta ' +
             'unidades cadastradas reporta existências.',
      exigiria: 'Declaração de existências com data de entrada',
      quemDetem: 'Armazenistas · ICM',
      nota: 'Ainda que os dados existissem, qualificar uma retenção como artificial é ' +
            'juízo sobre conduta. O sistema pode assinalar tempo de permanência anómalo; ' +
            'a qualificação cabe a quem tem competência.' },
    { pedido: 'Capacidade real de abastecimento por região',
      falta: 'Exige produção regional e existências. A produção que o MAAP publica é ' +
             'nacional por grupo de cultura; a área semeada por província só foi publicada ' +
             'para Sofala e Zambézia, no contexto das cheias.',
      exigiria: 'Inquérito Agrário Integrado por província e declaração de existências',
      quemDetem: 'MAAP · INE · armazenistas' }
  ];

  global.CadeiaAbastecimento = {
    portos: PORTOS,
    pressupostos: TRANSPORTE,
    naoCalcula: NAO_CALCULA,
    distancia: haversine,
    coordDe: coordDe,
    juntarFluxos: juntarFluxos,
    dependenciaOrigem: dependenciaOrigem,
    distanciaAoPorto: distanciaAoPorto,
    custoTransporte: custoTransporte,
    transporteExplica: transporteExplica,
    fluxosAfectadosPorCorte: fluxosAfectadosPorCorte,
    pracasComPreco: pracasComPreco,
    custoColocado: custoColocado,
    transparenciaMercado: transparenciaMercado,
    escalaTransparencia: TRANSPARENCIA
  };
})(window);
