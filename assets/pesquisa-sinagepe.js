/* ============================================================
   PESQUISA GLOBAL DO SINAGEPE
   ------------------------------------------------------------
   Com vinte e cinco ecrãs e doze ficheiros de dados, encontrar
   uma coisa passou a custar mais do que lê-la. Isto resolve.

   Procura em três sítios ao mesmo tempo:
     ECRÃS      — pelo nome e pelo que fazem
     ENTIDADES  — dentro dos ficheiros de dados publicados
     CONCEITOS  — pelo vocabulário do sistema

   Respeita o nível de acesso: quem não pode abrir um ecrã não o
   encontra, e as entidades desse ecrã também não aparecem.

   Uso no ecrã (sem os sinais de menor/maior, para este comentário
   não fechar o bloco se o ficheiro for colado dentro de uma página):
     script src="assets/pesquisa-sinagepe.js"
     script  SinagepePesquisa.iniciar();

   Abre com a barra / ou com Ctrl+K. Fecha com Esc.
   ============================================================ */
(function (global) {
  'use strict';

  /* ---- 1. ECRÃS: nome, o que faz, e palavras por que se procura ---- */
  var ECRAS = [
    { h:'index.html', n:'Painel Executivo', d:'Balanço nacional, mapa, alertas e tendência de preços',
      t:'painel dashboard inicio principal kpi balanço executivo torre controlo' },
    { h:'ficha-detalhe.html', n:'Ficha de Detalhe', d:'Tudo o que o sistema sabe sobre uma unidade, produto ou província, cruzando os onze ficheiros',
      t:'ficha detalhe drill dossier cruzamento unidade produto provincia aprofundar' },
    { h:'balanco-visual.html', n:'Balanço Visual', d:'Galeria de produtos com imagem, gráficos de preço, capacidade e exposição',
      t:'visual balanco galeria imagem foto grafico produto saco arroz cimento combustivel' },
    { h:'mapa-integrado.html', n:'Mapa Integrado', d:'Seis camadas: estradas, interrupções, armazéns, rede comercial, produção, corredores',
      t:'mapa camadas estradas ane interrupcoes corredores territorio geografia' },
    { h:'centro-antecipacao.html', n:'Centro de Antecipação', d:'Dez riscos com gatilho, janela de calendário e mitigações',
      t:'risco antecipacao mitigacao calendario gatilho crise ruptura prevencao' },
    { h:'ponto-cego-duplo.html', n:'Ponto Cego Duplo', d:'Cruza identificação de produto com telemetria de armazém',
      t:'cego identificacao telemetria sensor gs1 gtin matriz pares' },
    { h:'armazens-nacionais.html', n:'Armazéns Nacionais', d:'Cadastro de 29 unidades com fonte oficial, natureza e estado',
      t:'armazem cadastro silo terminal porto capacidade natureza estatal ppp concessao' },
    { h:'rede-logistica.html', n:'Rede Logística', d:'Corredores nacionais e unidades do cadastro',
      t:'corredor logistica rede beira nacala maputo sena transporte' },
    { h:'sandbox-rastreabilidade.html', n:'Sandbox EPCIS', d:'Nove eventos GS1 EPCIS 2.0, com idempotência e rejeição',
      t:'epcis rastreabilidade evento lote gtin sscc gs1 sandbox demonstracao' },
    { h:'portal-produtores.html', n:'Portal do Produtor', d:'O que o produtor recebe sem se registar: comparação, custos e armazéns',
      t:'produtor agricultor exploracao cultura colheita reciprocidade portal' },
    { h:'portal-transportadores.html', n:'Portal do Transportador', d:'Preço do gasóleo por região, cortes de estrada e calculadora de viagem',
      t:'transportador camiao viagem gasoleo combustivel rota corte estrada portal' },
    { h:'relatorio-executivo.html', n:'Relatório Executivo', d:'Documento imprimível em A4, com exportação CSV e JSON',
      t:'relatorio pdf imprimir exportar csv json executivo documento' },
    { h:'governanca-dado.html', n:'Governação do Dado', d:'Cinco regras de disciplina e classificação de cada número do sistema',
      t:'governanca dado regra facto estimativa previsao linhagem fonte auditoria' },
    { h:'adesao-institucional.html', n:'Adesão Institucional', d:'Dossier por entidade e matriz esforço × impacto',
      t:'adesao instituicao entidade parceiro ane icm bmm cedsif apiex cta esforco impacto' },
    { h:'simulador-preditivo.html', n:'Simulador Preditivo', d:'Sete cenários com parâmetros ajustáveis',
      t:'simulador cenario preditivo chuva praga ciclone combustivel divisas choque' },
    { h:'inteligencia-consolidada.html', n:'Inteligência Consolidada', d:'Cruzamento de fontes e índice de confiança do dado',
      t:'inteligencia cruzamento confianca divergencia consolidada' },
    { h:'fontes-nacionais.html', n:'Fontes Nacionais', d:'INE, ICM, IMOPETRO/ENAPP e CTA',
      t:'fonte nacional ine icm imopetro enapp cta' },
    { h:'fontes-internacionais.html', n:'Fontes Internacionais', d:'FAO, PAM e GS1',
      t:'fonte internacional fao pam wfp gs1 faostat hungermap' },
    { h:'alertas.html', n:'Centro de Alertas', d:'Ocorrências por severidade', t:'alerta ocorrencia severidade critico aviso' },
    { h:'mapa-nacional.html', n:'Mapa Nacional', d:'Vista territorial por província', t:'mapa nacional provincia territorio' },
    { h:'cadastro-armazens.html', n:'Cadastro de Armazéns', d:'Registo operacional de armazéns', t:'cadastro armazem registo' },
    { h:'modulo-logistica.html', n:'Logística', d:'Módulo logístico', t:'logistica modulo transporte' },
    { h:'portal-bancos.html', n:'Portal dos Bancos', d:'Cadeia de valor, empresas candidatas a garantia e risco sectorial',
      t:'banco credito financiamento garantia risco score candidata' },
    { h:'portal-investidores.html', n:'Portal dos Investidores', d:'Oportunidades, hotspots e simulador de retorno',
      t:'investidor investimento oportunidade retorno roi hotspot' },
    { h:'portal-empresas.html', n:'Portal das Empresas', d:'Benchmarks, quotas e custos logísticos',
      t:'empresa operador quota benchmark margem custo logistico' },
    { h:'dashboard-banco-central.html', n:'Banco Central — regulador', d:'Pressão cambial, reservas e intervenções propostas',
      t:'banco central regulador cambio divisas reservas intervencao' },
    { h:'marketplace-b2b.html', n:'Marketplace B2B', d:'Transacções entre empresas', t:'marketplace b2b oferta procura empresa negocio' },
    { h:'portal-pme.html', n:'Portal PME', d:'Pequenas e médias empresas', t:'pme pequena media empresa' },
    { h:'relatorios.html', n:'Relatórios', d:'Relatórios do sistema', t:'relatorio' },
    { h:'administracao-auditoria.html', n:'Configurações', d:'Administração e auditoria', t:'configuracao administracao auditoria definicoes utilizador' },
    { h:'simulador-importacoes.html', n:'Simulador de Importações', d:'Simulação de importação', t:'simulador importacao' },
    { h:'lista-de-acessos.html', n:'Lista de Acessos', d:'Estrutura de acessos por parceiro', t:'acesso parceiro pin credencial permissao' }
  ];

  /* ---- 2. CONCEITOS: vocabulário do sistema e onde ele vive ---- */
  var CONCEITOS = [
    { n:'Capacidade cega', d:'Fatia da capacidade sem leitura automática. Hoje: 100%.', h:'ponto-cego-duplo.html', t:'cega cego sensor telemetria' },
    { n:'Certificado de depósito', d:'Título negociável da BMM. A via legal para o cadastro de armazenagem privada.', h:'adesao-institucional.html', t:'certificado deposito bmm colateral bolsa' },
    { n:'Factura da geografia', d:'Diferença de preço do gasóleo entre regiões. Mueda paga mais 15,60 MT/L.', h:'portal-transportadores.html', t:'factura geografia gasoleo diferencial arene preco regiao' },
    { n:'Prefixo GS1 602', d:'Por atribuir. Moçambique não tem organização-membro GS1.', h:'ponto-cego-duplo.html', t:'602 prefixo gs1 gtin codigo barras' },
    { n:'Ponto cego duplo', d:'Produto sem identificação em armazém sem telemetria. 82 de 119 pares.', h:'ponto-cego-duplo.html', t:'ponto cego duplo par grau' },
    { n:'SIMA — Quente-Quente', d:'Boletim semanal de preços agrícolas, quatro níveis, desde 1991.', h:'portal-produtores.html', t:'sima quente boletim preco mercado agricola maap' },
    { n:'Índice de exposição', d:'Índice provincial com pesos declarados. Cabo Delgado no topo, 0,77.', h:'centro-antecipacao.html', t:'exposicao indice provincia vulnerabilidade' },
    { n:'Cascata de preço', d:'Nove etapas da formação do preço dos combustíveis, pública por lei.', h:'portal-transportadores.html', t:'cascata preco combustivel arene decreto 89/2019' },
    { n:'Regra de ouro dos dados', d:'Campo sem fonte fica a null e declara quem o detém.', h:'governanca-dado.html', t:'regra ouro null fonte porobter inventado' },
    { n:'Facto, estimativa, cenário', d:'Classificação de cada número que o sistema mostra.', h:'governanca-dado.html', t:'facto estimativa previsao cenario recomendacao classificacao' },
    { n:'Reserva estratégica', d:'Meta de 20.000 t declarada pelo ICM. Existências actuais não conhecidas.', h:'centro-antecipacao.html', t:'reserva estrategica icm 20000 cereais' },
    { n:'Aprovação dupla', d:'Intervenções que movem stock exigem duas aprovações.', h:'simulador-preditivo.html', t:'aprovacao dupla cadeia decisao ministerial' }
  ];

  var ST = { dados: {}, carregado: false, aberto: false };

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  /* Sem acentos e em minúsculas: procurar "Zambezia" tem de encontrar "Zambézia". */
  function norm(s) {
    return String(s == null ? '' : s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  function permitidas() {
    try {
      var b = sessionStorage.getItem('sinagepe_nivel');
      if (!b) return null;
      var n = JSON.parse(b);
      if (n && Array.isArray(n.paginas) && n.paginas.length) return n.paginas;
    } catch (e) {}
    return null;
  }
  function podeVer(href) {
    var lista = permitidas();
    return !lista || href === 'index.html' || lista.indexOf(href) >= 0;
  }

  /* ---- 3. ENTIDADES: lidas dos ficheiros de dados publicados ---- */
  var FICHEIROS = [
    { f:'armazens-nacionais.json', chave:'armazens', h:'armazens-nacionais.html',
      map:function(a){ return { n:a.nome, d:[a.provincia, a.natureza, a.estado].filter(Boolean).join(' · '), tipo:'Armazém' }; } },
    { f:'rede-comercial.json', chave:'unidades', h:'mapa-integrado.html',
      map:function(u){ return { n:u.nome, d:[u.cidade, u.papel].filter(Boolean).join(' · '), tipo:'Rede comercial' }; } },
    { f:'rede-viaria.json', chave:'estradas', h:'mapa-integrado.html',
      map:function(e){ return { n:e.designacao + ' — ' + e.nome, d:e.liga, tipo:'Estrada' }; } },
    { f:'rede-viaria.json', chave:'interrupcoes', h:'mapa-integrado.html',
      map:function(i){ return { n:i.estrada + ' · ' + i.troco, d:i.provincia + ' · ' + i.causa, tipo:'Interrupção' }; } },
    { f:'produtores-agrarios.json', chave:'provincias', h:'portal-produtores.html',
      map:function(p){ return { n:p.nome, d:(p.culturas||[]).join(', ') + ' · ' + p.distanciaMediaArmazemKm + ' km ao armazém', tipo:'Província' }; } },
    { f:'identificacao-gs1.json', chave:'produtos', h:'ponto-cego-duplo.html',
      map:function(p){ return { n:p.nome, d:p.formaCirculacao + ' · identificação ' + p.identificacao, tipo:'Produto' }; } },
    { f:'antecipacao.json', chave:'riscos', h:'centro-antecipacao.html',
      map:function(r){ return { n:r.titulo, d:'Gravidade ' + r.gravidade + '/5 · ' + r.janela, tipo:'Risco' }; } },
    { f:'adesao-institucional.json', chave:'entidades', h:'adesao-institucional.html',
      map:function(e){ return { n:e.sigla + ' — ' + e.nome, d:'Esforço ' + e.esforco + ' · impacto ' + e.impacto, tipo:'Entidade' }; } }
  ];

  function carregar() {
    if (ST.carregado) return Promise.resolve();
    var vistos = {};
    return Promise.all(FICHEIROS.map(function (d) {
      if (vistos[d.f]) return vistos[d.f];
      vistos[d.f] = fetch('data/' + d.f, { cache: 'no-store' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .catch(function () { return null; });
      return vistos[d.f];
    })).then(function (res) {
      FICHEIROS.forEach(function (d, i) {
        var j = res[i];
        if (!j || !j[d.chave] || !Array.isArray(j[d.chave])) return;
        ST.dados[d.f + ':' + d.chave] = j[d.chave].map(function (x) {
          var m = d.map(x); m.h = d.h; return m;
        });
      });
      ST.carregado = true;
    });
  }

  function procurar(q) {
    var t = norm(q).trim();
    if (t.length < 2) return { ecras: [], conceitos: [], entidades: [] };
    var partes = t.split(/\s+/);
    function bate(txt) {
      var n = norm(txt);
      return partes.every(function (p) { return n.indexOf(p) >= 0; });
    }
    var ecras = ECRAS.filter(function (e) {
      return podeVer(e.h) && bate(e.n + ' ' + e.d + ' ' + e.t);
    }).slice(0, 6);

    var conceitos = CONCEITOS.filter(function (c) {
      return podeVer(c.h) && bate(c.n + ' ' + c.d + ' ' + c.t);
    }).slice(0, 5);

    var entidades = [];
    Object.keys(ST.dados).forEach(function (k) {
      ST.dados[k].forEach(function (x) {
        if (entidades.length >= 40) return;
        if (podeVer(x.h) && bate(x.n + ' ' + x.d + ' ' + x.tipo)) entidades.push(x);
      });
    });
    entidades = entidades.slice(0, 12);
    return { ecras: ecras, conceitos: conceitos, entidades: entidades };
  }

  function marcar(txt, q) {
    var partes = norm(q).trim().split(/\s+/).filter(function (p) { return p.length > 1; });
    var out = esc(txt);
    partes.forEach(function (p) {
      var i = norm(out).indexOf(p);
      if (i < 0) return;
      out = out.slice(0, i) + '<mark>' + out.slice(i, i + p.length) + '</mark>' + out.slice(i + p.length);
    });
    return out;
  }

  function estilo() {
    if (document.getElementById('pesq-css')) return;
    var e = document.createElement('style');
    e.id = 'pesq-css';
    e.textContent = [
      '#pesq-fundo{position:fixed;inset:0;background:rgba(4,7,18,.72);z-index:99998;display:none;',
      'align-items:flex-start;justify-content:center;padding:9vh 20px 20px;backdrop-filter:blur(2px)}',
      '#pesq-fundo.on{display:flex}',
      '#pesq-cx{width:100%;max-width:660px;background:#0C1626;border:1px solid rgba(38,56,86,.9);',
      'border-radius:14px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.5)}',
      '#pesq-in{width:100%;padding:17px 19px;background:transparent;border:none;border-bottom:1px solid rgba(38,56,86,.75);',
      'color:#F3F7FC;font-family:Inter,sans-serif;font-size:16px;outline:none}',
      '#pesq-in::placeholder{color:#5E7189}',
      '#pesq-res{max-height:58vh;overflow-y:auto}',
      '.pesq-g{font-size:8.5px;letter-spacing:.18em;text-transform:uppercase;color:#5E7189;',
      'padding:13px 19px 6px;font-weight:600}',
      '.pesq-i{display:flex;gap:12px;align-items:baseline;padding:9px 19px;cursor:pointer;text-decoration:none;color:inherit}',
      '.pesq-i:hover,.pesq-i.sel{background:#111E31}',
      '.pesq-n{font-size:13px;font-weight:600;color:#F3F7FC}',
      '.pesq-d{font-size:11px;color:#8FA1B8;margin-top:2px;line-height:1.45}',
      '.pesq-t{font-size:8.5px;letter-spacing:.1em;text-transform:uppercase;color:#C98A3C;',
      'border:1px solid rgba(201,138,60,.3);padding:2px 7px;border-radius:3px;flex-shrink:0}',
      '.pesq-v{flex:1;min-width:0}',
      '#pesq-res mark{background:rgba(201,138,60,.28);color:#E8BE7A;border-radius:2px;padding:0 1px}',
      '.pesq-vazio{padding:26px 19px;color:#5E7189;font-size:12.5px;line-height:1.6;text-align:center}',
      '.pesq-pe{padding:10px 19px;border-top:1px solid rgba(38,56,86,.75);font-size:10px;color:#5E7189;',
      'display:flex;gap:14px;flex-wrap:wrap}',
      '#pesq-btn{display:flex;align-items:center;gap:9px;width:100%;padding:8px 13px;margin-bottom:10px;',
      'border-radius:8px;border:1px solid rgba(38,56,86,.75);background:#080F1C;color:#5E7189;',
      'font-family:Inter,sans-serif;font-size:12px;cursor:pointer;text-align:left}',
      '#pesq-btn:hover{border-color:rgba(201,138,60,.3);color:#8FA1B8}',
      '#pesq-btn kbd{margin-left:auto;font-family:IBM Plex Mono,monospace;font-size:9.5px;',
      'border:1px solid rgba(38,56,86,.9);border-radius:3px;padding:2px 5px}'
    ].join('');
    document.head.appendChild(e);
  }

  function render(q) {
    var r = procurar(q), h = '', n = 0;
    function grupo(titulo, itens, fn) {
      if (!itens.length) return;
      h += '<div class="pesq-g">' + titulo + '</div>';
      itens.forEach(function (x) { h += fn(x); n++; });
    }
    grupo('Ecrãs', r.ecras, function (e) {
      return '<a class="pesq-i" href="' + esc(e.h) + '"><span class="pesq-v">'
        + '<span class="pesq-n">' + marcar(e.n, q) + '</span>'
        + '<div class="pesq-d">' + marcar(e.d, q) + '</div></span>'
        + '<span class="pesq-t">Ecrã</span></a>';
    });
    grupo('Conceitos', r.conceitos, function (c) {
      return '<a class="pesq-i" href="' + esc(c.h) + '"><span class="pesq-v">'
        + '<span class="pesq-n">' + marcar(c.n, q) + '</span>'
        + '<div class="pesq-d">' + marcar(c.d, q) + '</div></span>'
        + '<span class="pesq-t">Conceito</span></a>';
    });
    grupo('Entidades e dados', r.entidades, function (x) {
      return '<a class="pesq-i" href="' + esc(x.h) + '"><span class="pesq-v">'
        + '<span class="pesq-n">' + marcar(x.n, q) + '</span>'
        + '<div class="pesq-d">' + marcar(x.d || '', q) + '</div></span>'
        + '<span class="pesq-t">' + esc(x.tipo) + '</span></a>';
    });
    if (!n) {
      h = '<div class="pesq-vazio">Nada encontrado para <b style="color:#8FA1B8">' + esc(q) + '</b>.'
        + '<br><br>Procure por um ecrã, uma unidade do cadastro, uma província, um produto,'
        + ' uma entidade ou um conceito do sistema.</div>';
    }
    document.getElementById('pesq-res').innerHTML = h;
  }

  function abrir() {
    estilo();
    var f = document.getElementById('pesq-fundo');
    f.classList.add('on');
    ST.aberto = true;
    var i = document.getElementById('pesq-in');
    i.value = ''; i.focus();
    document.getElementById('pesq-res').innerHTML =
      '<div class="pesq-vazio">Escreva pelo menos duas letras.<br><br>'
      + 'Procura em ecrãs, entidades do cadastro e conceitos do sistema — só no que a sua conta pode abrir.</div>';
    carregar().then(function () { if (i.value) render(i.value); });
  }
  function fechar() {
    var f = document.getElementById('pesq-fundo');
    if (f) f.classList.remove('on');
    ST.aberto = false;
  }

  function iniciar(opcoes) {
    estilo();
    if (!document.getElementById('pesq-fundo')) {
      var d = document.createElement('div');
      d.id = 'pesq-fundo';
      d.innerHTML = '<div id="pesq-cx">'
        + '<input id="pesq-in" type="text" autocomplete="off" spellcheck="false"'
        + ' placeholder="Procurar ecrãs, armazéns, produtos, entidades, conceitos…">'
        + '<div id="pesq-res"></div>'
        + '<div class="pesq-pe"><span>Enter abre o primeiro</span><span>↑ ↓ navega</span>'
        + '<span>Esc fecha</span><span style="margin-left:auto">Só mostra o que a sua conta pode abrir</span>'
        + '</div></div>';
      document.body.appendChild(d);
      d.addEventListener('click', function (e) { if (e.target === d) fechar(); });
      document.getElementById('pesq-in').addEventListener('input', function (e) { render(e.target.value); });
    }

    /* botão na barra lateral, se houver onde o pôr */
    var alvo = document.getElementById(opcoes && opcoes.alvo ? opcoes.alvo : 'nav-mount');
    if (alvo && !document.getElementById('pesq-btn')) {
      var b = document.createElement('button');
      b.id = 'pesq-btn';
      b.innerHTML = '<span>&#9906;</span><span>Procurar…</span><kbd>Ctrl K</kbd>';
      b.addEventListener('click', abrir);
      var marca = alvo.querySelector('.brand');
      if (marca && marca.nextSibling) alvo.insertBefore(b, marca.nextSibling);
      else alvo.insertBefore(b, alvo.firstChild);
    }

    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); abrir(); return; }
      if (e.key === '/' && !ST.aberto) {
        var a = document.activeElement, tag = a ? a.tagName : '';
        if (tag === 'INPUT' || tag === 'TEXTAREA' || (a && a.isContentEditable)) return;
        e.preventDefault(); abrir(); return;
      }
      if (!ST.aberto) return;
      if (e.key === 'Escape') { fechar(); return; }
      var itens = Array.prototype.slice.call(document.querySelectorAll('#pesq-res .pesq-i'));
      if (!itens.length) return;
      var i = itens.findIndex(function (x) { return x.classList.contains('sel'); });
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (i >= 0) itens[i].classList.remove('sel');
        var j = e.key === 'ArrowDown' ? (i + 1) % itens.length : (i <= 0 ? itens.length - 1 : i - 1);
        itens[j].classList.add('sel');
        itens[j].scrollIntoView({ block: 'nearest' });
      }
      if (e.key === 'Enter') { e.preventDefault(); (itens[i >= 0 ? i : 0]).click(); }
    });
    return true;
  }

  global.SinagepePesquisa = { iniciar: iniciar, abrir: abrir, fechar: fechar, procurar: procurar, ecras: ECRAS, conceitos: CONCEITOS };
})(window);
