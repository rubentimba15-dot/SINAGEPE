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

  function defs(id, t) {
    return '<defs>'
      + '<linearGradient id="g' + id + '" x1="0" y1="0" x2="1" y2="1">'
      + '<stop offset="0" stop-color="' + t.a + '"/><stop offset=".55" stop-color="' + t.saco + '"/>'
      + '<stop offset="1" stop-color="' + t.b + '"/></linearGradient>'
      + '<linearGradient id="m' + id + '" x1="0" y1="0" x2="1" y2="0">'
      + '<stop offset="0" stop-color="#000" stop-opacity=".30"/>'
      + '<stop offset=".35" stop-color="#fff" stop-opacity=".16"/>'
      + '<stop offset="1" stop-color="#000" stop-opacity=".34"/></linearGradient>'
      + '<radialGradient id="s' + id + '" cx=".5" cy=".5" r=".5">'
      + '<stop offset="0" stop-color="#000" stop-opacity=".45"/>'
      + '<stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>'
      + '</defs>';
  }

  /* ---- SACO DE CEREAL: costura no topo, vincos, textura de tecido ---- */
  function saco(id, t, rotulo) {
    return defs(id, t)
      + '<ellipse cx="100" cy="176" rx="58" ry="11" fill="url(#s' + id + ')"/>'
      + '<path d="M62 58c0-6 4-9 9-11l8-3h42l8 3c5 2 9 5 9 11v96c0 9-7 16-16 16H78c-9 0-16-7-16-16V58Z" fill="url(#g' + id + ')"/>'
      + '<path d="M62 58c0-6 4-9 9-11l8-3h42l8 3c5 2 9 5 9 11v96c0 9-7 16-16 16H78c-9 0-16-7-16-16V58Z" fill="url(#m' + id + ')"/>'
      + '<path d="M79 44c4-6 10-9 21-9s17 3 21 9c-6 3-13 4-21 4s-15-1-21-4Z" fill="' + t.c + '"/>'
      + '<path d="M82 40h36" stroke="' + t.c + '" stroke-width="2.5" stroke-dasharray="3 4" opacity=".8"/>'
      + '<path d="M70 74c12 4 48 4 60 0M70 96c12 4 48 4 60 0M70 118c12 4 48 4 60 0" stroke="' + t.c + '" stroke-width="1" opacity=".28" fill="none"/>'
      + '<path d="M72 60v104M128 60v104" stroke="#000" stroke-width="1" opacity=".12"/>'
      + (rotulo
        ? '<rect x="76" y="96" width="48" height="34" rx="3" fill="#FFF" opacity=".82"/>'
          + '<text x="100" y="112" text-anchor="middle" font-family="Inter,sans-serif" font-size="9.5"'
          + ' font-weight="700" fill="' + t.c + '">' + rotulo + '</text>'
          + '<text x="100" y="123" text-anchor="middle" font-family="Inter,sans-serif" font-size="7"'
          + ' fill="' + t.c + '" opacity=".8">50 kg</text>'
        : '');
  }

  /* ---- GARRAFA DE ÓLEO ---- */
  function garrafa(id, t) {
    return defs(id, t)
      + '<ellipse cx="100" cy="176" rx="40" ry="9" fill="url(#s' + id + ')"/>'
      + '<rect x="88" y="30" width="24" height="20" rx="3" fill="' + t.c + '"/>'
      + '<rect x="86" y="26" width="28" height="9" rx="2.5" fill="' + t.c + '"/>'
      + '<path d="M88 50c0 8-14 14-14 28v78c0 9 7 16 16 16h20c9 0 16-7 16-16V78c0-14-14-20-14-28H88Z" fill="url(#g' + id + ')"/>'
      + '<path d="M88 50c0 8-14 14-14 28v78c0 9 7 16 16 16h20c9 0 16-7 16-16V78c0-14-14-20-14-28H88Z" fill="url(#m' + id + ')"/>'
      + '<rect x="76" y="96" width="48" height="42" rx="3" fill="#FFF" opacity=".85"/>'
      + '<text x="100" y="114" text-anchor="middle" font-family="Inter,sans-serif" font-size="9"'
      + ' font-weight="700" fill="' + t.c + '">ÓLEO</text>'
      + '<text x="100" y="127" text-anchor="middle" font-family="Inter,sans-serif" font-size="7.5"'
      + ' fill="' + t.c + '" opacity=".85">1 litro</text>'
      + '<path d="M80 62c6 3 34 3 40 0" stroke="#FFF" stroke-width="2" opacity=".35" fill="none"/>';
  }

  /* ---- BIDÃO DE COMBUSTÍVEL ---- */
  function bidao(id, t, rotulo) {
    return defs(id, t)
      + '<ellipse cx="100" cy="176" rx="46" ry="10" fill="url(#s' + id + ')"/>'
      + '<rect x="60" y="40" width="80" height="130" rx="7" fill="url(#g' + id + ')"/>'
      + '<rect x="60" y="40" width="80" height="130" rx="7" fill="url(#m' + id + ')"/>'
      + '<ellipse cx="100" cy="42" rx="40" ry="8" fill="' + t.a + '"/>'
      + '<ellipse cx="100" cy="42" rx="40" ry="8" fill="#FFF" opacity=".14"/>'
      + '<rect x="88" y="30" width="24" height="12" rx="3" fill="' + t.c + '"/>'
      + '<path d="M60 74h80M60 136h80" stroke="' + t.c + '" stroke-width="4" opacity=".55"/>'
      + '<rect x="72" y="88" width="56" height="34" rx="3" fill="#0D1420" opacity=".78"/>'
      + '<text x="100" y="103" text-anchor="middle" font-family="Inter,sans-serif" font-size="9"'
      + ' font-weight="700" fill="' + t.a + '">' + (rotulo || 'COMB.') + '</text>'
      + '<text x="100" y="115" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="7.5"'
      + ' fill="' + t.a + '" opacity=".8">200 L</text>';
  }

  /* ---- BOTIJA DE GÁS ---- */
  function botija(id, t) {
    return defs(id, t)
      + '<ellipse cx="100" cy="176" rx="40" ry="9" fill="url(#s' + id + ')"/>'
      + '<path d="M68 74c0-14 8-22 32-22s32 8 32 22v82c0 9-6 14-14 14H82c-8 0-14-5-14-14V74Z" fill="url(#g' + id + ')"/>'
      + '<path d="M68 74c0-14 8-22 32-22s32 8 32 22v82c0 9-6 14-14 14H82c-8 0-14-5-14-14V74Z" fill="url(#m' + id + ')"/>'
      + '<rect x="90" y="34" width="20" height="20" rx="3" fill="' + t.c + '"/>'
      + '<path d="M78 34c0-7 10-11 22-11s22 4 22 11" stroke="' + t.c + '" stroke-width="5" fill="none" stroke-linecap="round"/>'
      + '<rect x="76" y="98" width="48" height="30" rx="3" fill="#FFF" opacity=".82"/>'
      + '<text x="100" y="118" text-anchor="middle" font-family="Inter,sans-serif" font-size="12"'
      + ' font-weight="700" fill="' + t.c + '">GPL</text>'
      + '<path d="M68 148h64" stroke="' + t.c + '" stroke-width="3" opacity=".45"/>';
  }

  /* ---- CAIXA DE MEDICAMENTOS ---- */
  function caixa(id, t) {
    return defs(id, t)
      + '<ellipse cx="100" cy="172" rx="52" ry="10" fill="url(#s' + id + ')"/>'
      + '<path d="M52 66l48-22 48 22v78l-48 22-48-22V66Z" fill="url(#g' + id + ')"/>'
      + '<path d="M100 44l48 22-48 22-48-22 48-22Z" fill="' + t.a + '"/>'
      + '<path d="M100 88v78l48-22V66l-48 22Z" fill="#000" opacity=".16"/>'
      + '<path d="M100 112v34M84 129h32" stroke="#FFF" stroke-width="6" stroke-linecap="round" opacity=".9"/>'
      + '<path d="M52 66l48 22 48-22" stroke="' + t.c + '" stroke-width="1.4" fill="none" opacity=".6"/>';
  }

  /* ---- ESPIGA DE MILHO ---- */
  function espiga(id, t) {
    var g = '';
    for (var r = 0; r < 9; r++) {
      for (var c = 0; c < 4; c++) {
        g += '<circle cx="' + (88 + c * 8) + '" cy="' + (68 + r * 10) + '" r="4" fill="' + t.a + '" opacity="' + (0.72 + (c % 2) * 0.24) + '"/>';
      }
    }
    return defs(id, t)
      + '<ellipse cx="100" cy="176" rx="34" ry="8" fill="url(#s' + id + ')"/>'
      + '<path d="M100 40c16 6 24 20 24 40v70c0 12-10 20-24 20s-24-8-24-20V80c0-20 8-34 24-40Z" fill="url(#g' + id + ')"/>'
      + g
      + '<path d="M76 76c-14-10-22-26-22-26s18 0 28 10M124 76c14-10 22-26 22-26s-18 0-28 10" fill="' + t.c + '" opacity=".7"/>';
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
    else if (s === 'cimento') corpo = saco(id, t, 'CIMENTO');
    else if (s === 'arroz') corpo = saco(id, t, 'ARROZ');
    else if (s === 'trigo') corpo = saco(id, t, 'TRIGO');
    else if (s === 'farinha-milho') corpo = saco(id, t, 'FARINHA');
    else if (s === 'acucar') corpo = saco(id, t, 'AÇÚCAR');
    else if (s === 'feijao') corpo = saco(id, t, 'FEIJÃO');
    else if (s === 'fertilizantes') corpo = saco(id, t, 'ADUBO');
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
