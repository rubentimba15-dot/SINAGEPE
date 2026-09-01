/* ============================================================
   ILUSTRAÇÕES DE PRODUTO — SINAGEPE
   ------------------------------------------------------------
   Estratégia fotografia-primeiro: se existir o ficheiro
   assets/img/produtos/<slug>.jpg, é essa a imagem usada. Se não
   existir, entra a ilustração vectorial — com volume, sombra e
   textura, não um ícone de linha.

   Para pôr fotografias reais basta copiar os ficheiros para a
   pasta. Não é preciso tocar em código.

   Uso (sem os sinais de menor/maior, para este comentário não
   fechar o bloco se o ficheiro for colado dentro de uma página):
     script src="assets/produtos-visual.js"
     ... ProdutosVisual.render('Arroz', 180)
   ============================================================ */
(function (global) {
  'use strict';

  var SLUG = {
    'arroz': 'arroz', 'trigo': 'trigo', 'farinha de milho': 'farinha-milho',
    'farinha': 'farinha-milho', 'milho': 'milho', 'óleo alimentar': 'oleo-alimentar',
    'oleo alimentar': 'oleo-alimentar', 'açúcar': 'acucar', 'acucar': 'acucar',
    'feijão': 'feijao', 'feijao': 'feijao', 'fertilizantes': 'fertilizantes',
    'medicamentos': 'medicamentos', 'cimento nacional': 'cimento', 'cimento': 'cimento',
    'gasóleo (diesel)': 'gasoleo', 'gasóleo': 'gasoleo', 'gasoleo': 'gasoleo',
    'gasolina': 'gasolina', 'jet a-1': 'jet', 'gpl': 'gpl', 'gás de cozinha (gpl)': 'gpl'
  };

  function slug(nome) {
    var k = String(nome || '').toLowerCase().trim();
    if (SLUG[k]) return SLUG[k];
    var achado = null;
    Object.keys(SLUG).forEach(function (x) { if (!achado && k.indexOf(x) >= 0) achado = SLUG[x]; });
    return achado || 'generico';
  }

  /* Paleta por família, para o produto ter cor própria sem ser aleatória. */
  var TOM = {
    arroz:        { a:'#E8DCC4', b:'#C9B896', c:'#9A8A6B', saco:'#D9CBAE' },
    trigo:        { a:'#E5C98F', b:'#C9A961', c:'#967C3E', saco:'#DDBE7E' },
    'farinha-milho': { a:'#F0DFA8', b:'#D6C078', c:'#A3904E', saco:'#E9D796' },
    milho:        { a:'#F2CE5C', b:'#D4A72C', c:'#9E7A18', saco:'#EAC44E' },
    feijao:       { a:'#C88B6A', b:'#A26746', c:'#74472C', saco:'#BE7F5E' },
    acucar:       { a:'#F2EDE4', b:'#D8D0C2', c:'#A79E8E', saco:'#EBE4D8' },
    fertilizantes:{ a:'#A8C8B0', b:'#7BA487', c:'#517A5D', saco:'#9BBEA4' },
    cimento:      { a:'#C6C3BC', b:'#9C9890', c:'#6E6A63', saco:'#B8B4AC' },
    'oleo-alimentar': { a:'#F5C542', b:'#D9A21F', c:'#9E7412', saco:'#EDBB38' },
    medicamentos: { a:'#BFD9EC', b:'#8FB6D4', c:'#5A87A8', saco:'#B0CFE5' },
    gasoleo:      { a:'#D9A05B', b:'#B07835', c:'#7D521F', saco:'#CE9550' },
    gasolina:     { a:'#8FB8D9', b:'#6390B4', c:'#3F6684', saco:'#83AECF' },
    jet:          { a:'#B9B0D6', b:'#8F84B4', c:'#635A84', saco:'#AEA4CD' },
    gpl:          { a:'#E09A8C', b:'#BC7062', c:'#8A4A3E', saco:'#D68F80' },
    generico:     { a:'#C3D0E0', b:'#8FA1B8', c:'#5E7189', saco:'#B5C4D6' }
  };

  /* ============================================================
     ILUSTRAÇÕES
     ------------------------------------------------------------
     Cada peça é desenhada com três camadas: sombra projectada,
     corpo com gradiente, e detalhe por cima. O gradiente dá volume;
     sem ele o desenho fica com aspecto de ícone.

     A caixa é sempre 200x190 para que os produtos alinhem quando
     aparecem lado a lado numa tabela ou numa grelha.
     ============================================================ */

  function defs(id, t, extra) {
    return '<defs>'
      + '<linearGradient id="g' + id + '" x1="0" y1="0" x2="1" y2="1">'
      +   '<stop offset="0" stop-color="' + t.a + '"/>'
      +   '<stop offset=".55" stop-color="' + t.b + '"/>'
      +   '<stop offset="1" stop-color="' + t.c + '"/>'
      + '</linearGradient>'
      + '<linearGradient id="l' + id + '" x1="0" y1="0" x2="1" y2="0">'
      +   '<stop offset="0" stop-color="#FFFFFF" stop-opacity=".38"/>'
      +   '<stop offset=".35" stop-color="#FFFFFF" stop-opacity=".06"/>'
      +   '<stop offset="1" stop-color="#000000" stop-opacity=".22"/>'
      + '</linearGradient>'
      + '<radialGradient id="s' + id + '" cx=".5" cy=".5" r=".5">'
      +   '<stop offset="0" stop-color="#000000" stop-opacity=".42"/>'
      +   '<stop offset="1" stop-color="#000000" stop-opacity="0"/>'
      + '</radialGradient>'
      + (extra || '')
      + '</defs>';
  }

  function chao(cx, cy, rx) {
    return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + (rx * 0.19)
         + '" fill="url(#sSOMBRA)"/>';
  }

  /* ---------- SACO DE CEREAL ----------
     Um saco cheio assenta, não é um rectângulo: tem a base larga,
     os cantos superiores dobrados e vinco no meio. */
  function saco(id, t, rotulo, grao) {
    /* ------------------------------------------------------------
       Um saco de cereal cheio, visto de frente.
       As coordenadas vão do topo (y=34) à base (y=158) e a largura
       cresce com a altura: 22 de raio nos ombros, 46 na base.
       A tentativa anterior tinha os números ao contrário e o saco
       saía em forma de sino.
       ------------------------------------------------------------ */
    var sombra = '<defs><radialGradient id="sm' + id + '" cx=".5" cy=".5" r=".5">'
      + '<stop offset="0" stop-color="#000" stop-opacity=".45"/>'
      + '<stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>'
      + '<ellipse cx="100" cy="163" rx="56" ry="11" fill="url(#sm' + id + ')"/>';

    /* Contorno calculado ponto a ponto: nos ombros a meia-largura é 20,
       na base é 46. Cada par de números abaixo foi verificado antes de
       ser escrito — as duas versões anteriores tinham a curva invertida
       e o saco saía em forma de sino. */
    var forma = 'M80 50'
      + 'C80 50 120 50 120 50'          /* ombro direito */
      + 'C126 66 131 84 134 101'
      + 'C137 118 141 135 146 148'
      + 'C147 155 141 160 132 160'      /* canto inferior direito */
      + 'L68 160'
      + 'C59 160 53 155 54 148'         /* canto inferior esquerdo */
      + 'C59 135 63 118 66 101'
      + 'C69 84 74 66 80 50Z';

    var corpo =
        '<path d="' + forma + '" fill="url(#g' + id + ')"/>'
      + '<path d="' + forma + '" fill="url(#l' + id + ')"/>';

    /* base assente: faixa mais escura onde o saco toca o chão */
    var base =
        '<path d="M56 140c-1 3-2 6-2 8-1 7 5 12 14 12h64c9 0 15-5 14-12 0-2-1-5-2-8'
      + 'c-10 6-27 9-44 9s-34-3-44-9Z" fill="' + t.c + '" opacity=".30"/>';

    /* boca amarrada */
    var boca =
        '<path d="M84 42c5-4 10-6 16-6s11 2 16 6c-4 4-10 6-16 6s-12-2-16-6Z" fill="' + t.c + '"/>'
      + '<path d="M88 36c4-3 7-4 12-4s8 1 12 4c-3 3-7 5-12 5s-9-2-12-5Z" fill="' + t.b + '"/>'
      + '<path d="M94 33c0-4 2-6 6-6s6 2 6 6" fill="none" stroke="' + t.c
      + '" stroke-width="2.4" stroke-linecap="round"/>';

    /* vinco central e as duas costuras laterais */
    var pano =
        '<path d="M100 54v102" stroke="#000" stroke-opacity=".09" stroke-width="2"/>'
      + '<path d="M84 54c-6 32-12 66-16 92" stroke="#FFF" stroke-opacity=".17"'
      + ' stroke-width="2" fill="none"/>'
      + '<path d="M116 54c6 32 12 66 16 92" stroke="#000" stroke-opacity=".13"'
      + ' stroke-width="2" fill="none"/>';

    var etiqueta = rotulo
      ? '<rect x="70" y="96" width="60" height="28" rx="4" fill="#FFFFFF" opacity=".93"/>'
        + '<rect x="70" y="96" width="60" height="28" rx="4" fill="none" stroke="' + t.c
        + '" stroke-width="1.4" opacity=".65"/>'
        + '<text x="100" y="115" text-anchor="middle" font-family="Inter,sans-serif" font-size="11.5"'
        + ' font-weight="700" letter-spacing=".4" fill="' + t.c + '">' + rotulo + '</text>'
      : '';

    return sombra + defs(id, t) + corpo + base + boca + pano + (grao || '') + etiqueta;
  }

  /* grão derramado à frente do saco — muda por produto */
  function graos(t, forma) {
    var p = [[70,150],[82,156],[94,152],[108,157],[120,151],[132,155],
             [76,161],[90,163],[104,162],[118,164],[128,160]];
    var out = '';
    for (var i = 0; i < p.length; i++) {
      var x = p[i][0], y = p[i][1], r = 3 + (i % 3);
      if (forma === 'longo')
        out += '<ellipse cx="' + x + '" cy="' + y + '" rx="' + (r + 1.6) + '" ry="' + (r * 0.55)
             + '" fill="' + (i % 2 ? t.a : t.b) + '" transform="rotate(' + ((i * 37) % 70 - 35)
             + ' ' + x + ' ' + y + ')"/>';
      else if (forma === 'rim')
        out += '<path d="M' + (x - r) + ' ' + y + 'a' + r + ' ' + (r * 0.8) + ' 0 0 1 ' + (r * 2)
             + ' 0 ' + r + ' ' + (r * 0.6) + ' 0 0 1 ' + (-r * 2) + ' 0Z" fill="'
             + (i % 2 ? t.a : t.b) + '"/>';
      else
        out += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + (i % 2 ? t.a : t.b) + '"/>';
    }
    return out;
  }

  /* ---------- ESPIGA DE MILHO ----------
     Grãos em fiadas alternadas, que é o que a torna reconhecível. */
  function espiga(id, t) {
    var g = '';
    for (var f = 0; f < 13; f++) {
      for (var c = 0; c < 5; c++) {
        var desloc = (f % 2) * 5.5;
        var x = 82 + c * 11 + desloc;
        var y = 46 + f * 8.4;
        var estreita = (c === 0 || c === 4) ? 0.72 : 1;
        g += '<ellipse cx="' + x + '" cy="' + y + '" rx="' + (5.2 * estreita) + '" ry="4.4" fill="'
           + (((f + c) % 3 === 0) ? t.b : t.a) + '"/>';
      }
    }
    return '<defs><radialGradient id="sm' + id + '" cx=".5" cy=".5" r=".5">'
      + '<stop offset="0" stop-color="#000" stop-opacity=".4"/>'
      + '<stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>'
      + '<ellipse cx="100" cy="172" rx="46" ry="10" fill="url(#sm' + id + ')"/>'
      + defs(id, t)
      /* folhas atrás */
      + '<path d="M76 68c-20-14-30-34-28-46 14 2 32 14 40 30" fill="#7FA84E" opacity=".95"/>'
      + '<path d="M124 68c20-14 30-34 28-46-14 2-32 14-40 30" fill="#8DB858" opacity=".95"/>'
      + '<path d="M74 100c-22-6-34-22-36-34 16-2 34 6 44 20" fill="#6E9642" opacity=".9"/>'
      /* sabugo */
      + '<path d="M100 34c18 0 30 16 30 44s-6 62-30 78c-24-16-30-50-30-78s12-44 30-44Z"'
      + ' fill="url(#g' + id + ')"/>'
      + g
      + '<path d="M100 34c18 0 30 16 30 44s-6 62-30 78c-24-16-30-50-30-78s12-44 30-44Z"'
      + ' fill="url(#l' + id + ')" opacity=".55"/>'
      /* barbas */
      + '<path d="M96 32c-2-10-6-16-10-20M100 30c0-10 1-18 3-22M104 32c3-9 8-15 12-18"'
      + ' stroke="#C9A227" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".85"/>';
  }

  /* ---------- GARRAFA DE ÓLEO ---------- */
  function garrafa(id, t) {
    return '<defs><radialGradient id="sm' + id + '" cx=".5" cy=".5" r=".5">'
      + '<stop offset="0" stop-color="#000" stop-opacity=".42"/>'
      + '<stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>'
      + '<ellipse cx="100" cy="174" rx="38" ry="9" fill="url(#sm' + id + ')"/>'
      + defs(id, t)
      /* gargalo e tampa */
      + '<rect x="88" y="20" width="24" height="9" rx="3" fill="#2F4A63"/>'
      + '<rect x="88" y="27" width="24" height="4" rx="1.5" fill="#22384C"/>'
      + '<path d="M90 31h20l4 16H86Z" fill="' + t.b + '" opacity=".85"/>'
      /* corpo */
      + '<path d="M86 47h28c10 0 16 8 16 20v78c0 12-6 20-16 20H86c-10 0-16-8-16-20V67c0-12 6-20 16-20Z"'
      + ' fill="url(#g' + id + ')"/>'
      /* nível do líquido */
      + '<path d="M74 74h52v76c0 8-4 12-12 12H86c-8 0-12-4-12-12Z" fill="' + t.b + '" opacity=".55"/>'
      /* rótulo */
      + '<rect x="74" y="88" width="52" height="42" rx="3" fill="#FFFFFF" opacity=".92"/>'
      + '<text x="100" y="105" text-anchor="middle" font-family="Inter,sans-serif" font-size="10"'
      + ' font-weight="700" fill="' + t.c + '">ÓLEO</text>'
      + '<line x1="80" y1="112" x2="120" y2="112" stroke="' + t.c + '" stroke-width="1.4" opacity=".5"/>'
      + '<line x1="80" y1="119" x2="112" y2="119" stroke="' + t.c + '" stroke-width="1.4" opacity=".35"/>'
      /* brilho */
      + '<path d="M86 47h28c10 0 16 8 16 20v78c0 12-6 20-16 20H86c-10 0-16-8-16-20V67c0-12 6-20 16-20Z"'
      + ' fill="url(#l' + id + ')"/>'
      + '<rect x="79" y="56" width="7" height="94" rx="3.5" fill="#FFFFFF" opacity=".26"/>';
  }

  /* ---------- BIDÃO DE COMBUSTÍVEL ---------- */
  function bidao(id, t, rotulo) {
    return '<defs><radialGradient id="sm' + id + '" cx=".5" cy=".5" r=".5">'
      + '<stop offset="0" stop-color="#000" stop-opacity=".45"/>'
      + '<stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>'
      + '<ellipse cx="100" cy="170" rx="52" ry="11" fill="url(#sm' + id + ')"/>'
      + defs(id, t)
      /* pega */
      + '<path d="M78 38h44v10H78Z" fill="' + t.c + '"/>'
      + '<path d="M88 26h24c4 0 6 3 6 7v5h-9v-4H91v4h-9v-5c0-4 2-7 6-7Z" fill="' + t.c + '"/>'
      /* bocal */
      + '<rect x="120" y="30" width="14" height="14" rx="3" fill="' + t.c + '"/>'
      + '<rect x="122" y="26" width="10" height="6" rx="2" fill="#2A3A48"/>'
      /* corpo */
      + '<rect x="62" y="48" width="76" height="106" rx="10" fill="url(#g' + id + ')"/>'
      /* nervuras, que é o que distingue um bidão de uma caixa */
      + '<rect x="70" y="58" width="60" height="30" rx="5" fill="#000" opacity=".10"/>'
      + '<rect x="70" y="116" width="60" height="30" rx="5" fill="#000" opacity=".10"/>'
      + '<rect x="62" y="48" width="76" height="106" rx="10" fill="url(#l' + id + ')"/>'
      /* rótulo */
      + '<rect x="70" y="94" width="60" height="20" rx="3" fill="#FFFFFF" opacity=".93"/>'
      + '<text x="100" y="108" text-anchor="middle" font-family="Inter,sans-serif" font-size="9.5"'
      + ' font-weight="700" letter-spacing=".4" fill="' + t.c + '">' + rotulo + '</text>';
  }

  /* ---------- BOTIJA DE GÁS ---------- */
  function botija(id, t) {
    return '<defs><radialGradient id="sm' + id + '" cx=".5" cy=".5" r=".5">'
      + '<stop offset="0" stop-color="#000" stop-opacity=".45"/>'
      + '<stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>'
      + '<ellipse cx="100" cy="168" rx="46" ry="10" fill="url(#sm' + id + ')"/>'
      + defs(id, t)
      /* válvula e aro */
      + '<rect x="94" y="20" width="12" height="12" rx="2" fill="#5A6470"/>'
      + '<path d="M76 34c0-6 4-10 10-10h28c6 0 10 4 10 10v8H76Z" fill="#6B7480"/>'
      + '<path d="M80 26h40" stroke="#8A939E" stroke-width="3" stroke-linecap="round"/>'
      /* corpo */
      + '<path d="M70 66c0-14 8-24 30-24s30 10 30 24v66c0 12-8 20-30 20s-30-8-30-20Z"'
      + ' fill="url(#g' + id + ')"/>'
      + '<path d="M70 66c0-14 8-24 30-24s30 10 30 24v66c0 12-8 20-30 20s-30-8-30-20Z"'
      + ' fill="url(#l' + id + ')"/>'
      /* aro da base */
      + '<path d="M70 132h60v10c0 8-10 12-30 12s-30-4-30-12Z" fill="' + t.c + '"/>'
      /* faixa de segurança */
      + '<rect x="70" y="86" width="60" height="22" fill="#FFFFFF" opacity=".9"/>'
      + '<text x="100" y="101" text-anchor="middle" font-family="Inter,sans-serif" font-size="10.5"'
      + ' font-weight="700" fill="' + t.c + '">GPL</text>'
      + '<rect x="79" y="52" width="8" height="76" rx="4" fill="#FFFFFF" opacity=".22"/>';
  }

  /* ---------- CAIXA DE MEDICAMENTO ----------
     Com cartela de comprimidos à frente, que é o que a identifica. */
  function caixa(id, t) {
    var comp = '';
    for (var i = 0; i < 8; i++) {
      var x = 76 + (i % 4) * 14, y = 140 + Math.floor(i / 4) * 13;
      comp += '<rect x="' + (x - 5) + '" y="' + (y - 4.5) + '" width="10" height="9" rx="4.5"'
            + ' fill="#E8EDF3"/>'
            + '<circle cx="' + x + '" cy="' + y + '" r="3.2" fill="' + t.b + '"/>';
    }
    return '<defs><radialGradient id="sm' + id + '" cx=".5" cy=".5" r=".5">'
      + '<stop offset="0" stop-color="#000" stop-opacity=".42"/>'
      + '<stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>'
      + '<ellipse cx="100" cy="170" rx="52" ry="10" fill="url(#sm' + id + ')"/>'
      + defs(id, t)
      /* caixa em perspectiva */
      + '<path d="M62 46l38-14 38 14v82l-38 14-38-14Z" fill="url(#g' + id + ')"/>'
      + '<path d="M62 46l38 14v82l-38-14Z" fill="#000" opacity=".14"/>'
      + '<path d="M100 32l38 14-38 14-38-14Z" fill="' + t.a + '" opacity=".9"/>'
      /* cruz */
      + '<rect x="92" y="70" width="16" height="44" rx="2" fill="#FFFFFF" opacity=".92"/>'
      + '<rect x="78" y="84" width="44" height="16" rx="2" fill="#FFFFFF" opacity=".92"/>'
      /* código de barras */
      + '<g fill="' + t.c + '" opacity=".55">'
      + '<rect x="72" y="120" width="2" height="12"/><rect x="76" y="120" width="1" height="12"/>'
      + '<rect x="79" y="120" width="3" height="12"/><rect x="84" y="120" width="1" height="12"/>'
      + '<rect x="87" y="120" width="2" height="12"/><rect x="91" y="120" width="1" height="12"/>'
      + '</g>'
      + comp;
  }

  /* ---------- SACO DE CIMENTO ----------
     Deitado, com papel kraft — não se confunde com cereal. */
  function cimento(id, t) {
    return '<defs><radialGradient id="sm' + id + '" cx=".5" cy=".5" r=".5">'
      + '<stop offset="0" stop-color="#000" stop-opacity=".45"/>'
      + '<stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>'
      + '<ellipse cx="100" cy="148" rx="66" ry="12" fill="url(#sm' + id + ')"/>'
      + defs(id, t)
      + '<path d="M46 76c0-6 6-10 14-11l72-8c10-1 20 4 22 12l8 44c2 9-5 17-15 18l-72 8'
      + 'c-10 1-19-5-20-13Z" fill="url(#g' + id + ')"/>'
      + '<path d="M46 76c0-6 6-10 14-11l72-8c10-1 20 4 22 12l8 44c2 9-5 17-15 18l-72 8'
      + 'c-10 1-19-5-20-13Z" fill="url(#l' + id + ')"/>'
      /* dobras das pontas */
      + '<path d="M48 74l16-2 3 62-16 2Z" fill="#000" opacity=".13"/>'
      + '<path d="M150 62l12 44-14 2-11-44Z" fill="#000" opacity=".10"/>'
      /* rótulo */
      + '<rect x="72" y="86" width="66" height="32" rx="3" fill="#FFFFFF" opacity=".9"'
      + ' transform="rotate(-6 105 102)"/>'
      + '<text x="105" y="107" text-anchor="middle" font-family="Inter,sans-serif" font-size="12"'
      + ' font-weight="700" fill="' + t.c + '" transform="rotate(-6 105 102)">CIMENTO</text>'
      + '<text x="105" y="118" text-anchor="middle" font-family="Inter,sans-serif" font-size="7.5"'
      + ' fill="' + t.c + '" opacity=".7" transform="rotate(-6 105 102)">50 kg</text>';
  }

  function svg(nome, tamanho) {
    var s = slug(nome), t = TOM[s] || TOM.generico;
    var id = s.replace(/[^a-z]/g, '');
    var corpo;
    if (s === 'oleo-alimentar') corpo = garrafa(id, t);
    else if (s === 'gasoleo') corpo = bidao(id, t, 'GASÓLEO');
    else if (s === 'gasolina') corpo = bidao(id, t, 'GASOLINA');
    else if (s === 'jet') corpo = bidao(id, t, 'JET A-1');
    else if (s === 'gpl') corpo = botija(id, t);
    else if (s === 'medicamentos') corpo = caixa(id, t);
    else if (s === 'milho') corpo = espiga(id, t);
    else if (s === 'cimento') corpo = cimento(id, t);
    else if (s === 'arroz') corpo = saco(id, t, 'ARROZ', graos(t, 'longo'));
    else if (s === 'trigo') corpo = saco(id, t, 'TRIGO', graos(t, 'longo'));
    else if (s === 'farinha-milho') corpo = saco(id, t, 'FARINHA');
    else if (s === 'acucar') corpo = saco(id, t, 'A\u00c7\u00daCAR', graos(t, 'redondo'));
    else if (s === 'feijao') corpo = saco(id, t, 'FEIJ\u00c3O', graos(t, 'rim'));
    else if (s === 'fertilizantes') corpo = saco(id, t, 'ADUBO', graos(t, 'redondo'));
    else corpo = saco(id, t, null);
    return '<svg viewBox="0 0 200 190" width="' + tamanho + '" height="' + Math.round(tamanho * 0.95)
      + '" role="img" aria-label="Ilustração de ' + String(nome).replace(/"/g, '') + '">' + corpo + '</svg>';
  }

  /* Fotografia primeiro; se o ficheiro não existir, a ilustração entra sozinha. */
  function render(nome, tamanho) {
    var s = slug(nome), tam = tamanho || 160;
    var alt = String(nome).replace(/"/g, '&quot;');
    return '<span class="pv-wrap" style="display:inline-flex;align-items:center;justify-content:center;'
      + 'width:' + tam + 'px;height:' + Math.round(tam * 0.95) + 'px">'
      + '<img src="assets/img/produtos/' + s + '.jpg" alt="' + alt + '" '
      + 'style="width:100%;height:100%;object-fit:cover;border-radius:10px" '
      + 'onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'block\'">'
      + '<span style="display:none">' + svg(nome, tam) + '</span></span>';
  }

  global.ProdutosVisual = { render: render, svg: svg, slug: slug, tons: TOM };
})(window);
