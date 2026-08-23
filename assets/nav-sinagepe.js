/* ============================================================
   NAVEGAÇÃO ÚNICA DO SINAGEPE
   ------------------------------------------------------------
   Cada ecrã tinha a barra lateral escrita à mão. Resultado: seis
   barras diferentes, entre 12 e 19 itens, contra 23 no Painel —
   quem entrava num ecrã perdia metade do sistema do menu.

   A partir daqui existe uma só lista. Para acrescentar um ecrã,
   acrescenta-se UMA linha aqui e mais nada em lado nenhum.

   Uso no ecrã (sem os sinais de menor/maior, para este comentário
   não fechar o bloco se o ficheiro for colado dentro de uma página):
     aside class="sidebar" id="nav-mount"
     script src="assets/nav-sinagepe.js"
     script  SinagepeNav.montar('chave-do-ecra');

   A marcação usa as classes .nav-item / .nav-icon / .nav-label,
   que são as que os ecrãs já têm no CSS.
   ============================================================ */
(function (global) {
  'use strict';

  var ITENS = [
    { key: 'painel',        icon: '\u25A6', label: 'PAINEL',                href: 'index.html' },
    { key: 'mapa-integrado',icon: '\u25C9', label: 'Mapa Integrado',        href: 'mapa-integrado.html' },
    { key: 'antecipacao',   icon: '\u2609', label: 'Centro de Antecipa\u00e7\u00e3o', href: 'centro-antecipacao.html' },
    { key: 'adesao',        icon: '\u2638', label: 'Ades\u00e3o Institucional', href: 'adesao-institucional.html' },
    { key: 'alertas',       icon: '\u26A0', label: 'Alertas',               href: 'alertas.html' },
    { key: 'mapa',          icon: '\u25CE', label: 'Mapa Nacional',         href: 'mapa-nacional.html' },
    { key: 'simulador',     icon: '\u224B', label: 'Simulador',             href: 'simulador-importacoes.html' },
    { key: 'preditivo',     icon: '\u25AD', label: 'Simulador Preditivo',   href: 'simulador-preditivo.html' },
    { key: 'portal-produtores', icon: '\u2618', label: 'Portal do Produtor',  href: 'portal-produtores.html' },
    { key: 'pme',           icon: '\u26C1', label: 'PMEs',                  href: 'portal-pme.html' },
    { key: 'armazens',      icon: '\u25A4', label: 'Armaz\u00e9ns',         href: 'cadastro-armazens.html' },
    { key: 'armazens-nac',  icon: '\u25EB', label: 'Armaz\u00e9ns Nacionais', href: 'armazens-nacionais.html' },
    { key: 'ponto-cego',    icon: '\u25CE', label: 'Ponto Cego Duplo',      href: 'ponto-cego-duplo.html' },
    { key: 'sandbox-epcis', icon: '\u223E', label: 'Sandbox EPCIS',         href: 'sandbox-rastreabilidade.html' },
    { key: 'logistica',     icon: '\u21C4', label: 'Log\u00edstica',        href: 'modulo-logistica.html' },
    { key: 'rede-logistica',icon: '\u2318', label: 'Rede Log\u00edstica',   href: 'rede-logistica.html' },
    { key: 'relatorio-exec',icon: '\u25A4', label: 'Relat\u00f3rio Executivo', href: 'relatorio-executivo.html' },
    { key: 'relatorios',    icon: '\u25A7', label: 'Relat\u00f3rios',       href: 'relatorios.html' },
    { key: 'config',        icon: '\u2699', label: 'Configura\u00e7\u00f5es', href: 'administracao-auditoria.html' },
    { key: 'marketplace',   icon: '\u2B21', label: 'Marketplace B2B',       href: 'marketplace-b2b.html' },
    { key: 'inteligencia',  icon: '\u25C8', label: 'Intelig\u00eancia',     href: 'inteligencia-consolidada.html' },
    { key: 'fontes-nac',    icon: '\u2B23', label: 'Fontes Nacionais',      href: 'fontes-nacionais.html' },
    { key: 'fontes-int',    icon: '\u2B22', label: 'Fontes Internacionais', href: 'fontes-internacionais.html' }
  ];

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* Só mostra os ecrãs a que a sessão tem direito. Sem sessão
     (ou sem lista de páginas), mostra tudo — o access-control.js
     é que decide se a pessoa pode lá entrar. */
  function permitidas() {
    try {
      var bruto = sessionStorage.getItem('sinagepe_nivel');
      if (!bruto) return null;
      var n = JSON.parse(bruto);
      if (n && Array.isArray(n.paginas) && n.paginas.length) return n.paginas;
    } catch (e) { /* sessão ilegível: mostra tudo */ }
    return null;
  }

  function html(activeKey) {
    var lista = permitidas();
    var itens = ITENS.filter(function (i) {
      return !lista || i.href === 'index.html' || lista.indexOf(i.href) >= 0;
    });

    var nav = itens.map(function (i) {
      var act = i.key === activeKey ? ' active' : '';
      return '<a class="nav-item' + act + '" href="' + esc(i.href) + '">'
           + '<span class="nav-icon">' + i.icon + '</span>'
           + '<span class="nav-label">' + esc(i.label) + '</span></a>';
    }).join('');

    return '<div class="brand"><div class="brand-t">SINAGEPE</div>'
         + '<div class="brand-s">Torre de Controlo</div></div>'
         + nav
         + '<a class="nav-item" href="#" id="btn-logout" style="margin-top:8px;'
         + 'border-top:1px solid var(--gold-line);border-radius:0;padding-top:13px">'
         + '<span class="nav-icon">\u21A9</span>'
         + '<span class="nav-label" style="color:#EF4444">Sair (Logout)</span></a>';
  }

  function montar(activeKey, idAlvo) {
    var alvo = document.getElementById(idAlvo || 'nav-mount');
    if (!alvo) return false;
    alvo.innerHTML = html(activeKey);
    var sair = document.getElementById('btn-logout');
    if (sair) sair.addEventListener('click', function (e) {
      e.preventDefault();
      try { sessionStorage.clear(); } catch (err) {}
      location.href = 'index.html';
    });
    return true;
  }

  global.SinagepeNav = { itens: ITENS, html: html, montar: montar };
})(window);
