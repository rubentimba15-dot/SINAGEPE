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
    { key: 'painel',        icon: '\u25A6', label: 'PAINEL',                href: 'index.html', grupo: 'PAINEL' },
    { key: 'balanco-visual', icon: '\u25A3', label: 'Balan\u00e7o Visual', href: 'balanco-visual.html', grupo: 'TERRITORIO' },
    { key: 'ficha-detalhe', icon: '\u26AF', label: 'Ficha de Detalhe', href: 'ficha-detalhe.html', grupo: 'TERRITORIO' },
    { key: 'mapa-integrado',icon: '\u25C9', label: 'Mapa Integrado',        href: 'mapa-integrado.html', grupo: 'TERRITORIO' },
    { key: 'antecipacao',   icon: '\u2609', label: 'Centro de Antecipa\u00e7\u00e3o', href: 'centro-antecipacao.html', grupo: 'INTELIGENCIA' },
    { key: 'adesao',        icon: '\u2638', label: 'Ades\u00e3o Institucional', href: 'adesao-institucional.html', grupo: 'GOVERNACAO' },
    { key: 'alertas',       icon: '\u26A0', label: 'Alertas',               href: 'alertas.html', grupo: 'INTELIGENCIA' },
    { key: 'mapa',          icon: '\u25CE', label: 'Mapa Nacional',         href: 'mapa-nacional.html', grupo: 'TERRITORIO' },
    { key: 'simulador',     icon: '\u224B', label: 'Simulador',             href: 'simulador-importacoes.html', grupo: 'INTELIGENCIA' },
    { key: 'preditivo',     icon: '\u25AD', label: 'Simulador Preditivo',   href: 'simulador-preditivo.html', grupo: 'INTELIGENCIA' },
    { key: 'portal-produtores', icon: '\u2618', label: 'Portal do Produtor',  href: 'portal-produtores.html', grupo: 'PORTAIS' },
    { key: 'portal-transportadores', icon: '\u26DF', label: 'Portal do Transportador', href: 'portal-transportadores.html', grupo: 'PORTAIS' },
    { key: 'portal-comerciantes', icon: '\u2696', label: 'Portal do Comerciante', href: 'portal-comerciantes.html', grupo: 'PORTAIS' },
    { key: 'portal-parceiros', icon: '\u2723', label: 'Portal dos Parceiros', href: 'portal-parceiros.html', grupo: 'PORTAIS' },
    { key: 'portal-publico', icon: '\u25CB', label: 'Portal P\u00fablico', href: 'portal-publico.html', grupo: 'PORTAIS' },
    { key: 'portal-universidades', icon: '\u2637', label: 'Portal das Universidades', href: 'portal-universidades.html', grupo: 'PORTAIS' },
    { key: 'pme',           icon: '\u26C1', label: 'PMEs',                  href: 'portal-pme.html', grupo: 'PORTAIS' },
    { key: 'armazens',      icon: '\u25A4', label: 'Armaz\u00e9ns',         href: 'cadastro-armazens.html', grupo: 'CADEIA' },
    { key: 'armazens-nac',  icon: '\u25EB', label: 'Armaz\u00e9ns Nacionais', href: 'armazens-nacionais.html', grupo: 'CADEIA' },
    { key: 'ponto-cego',    icon: '\u25CE', label: 'Ponto Cego Duplo',      href: 'ponto-cego-duplo.html', grupo: 'INTELIGENCIA' },
    { key: 'sandbox-epcis', icon: '\u223E', label: 'Sandbox EPCIS',         href: 'sandbox-rastreabilidade.html', grupo: 'CADEIA' },
    { key: 'medicamentos', icon: '\u2695', label: 'Cadeia de Medicamentos', href: 'medicamentos-cadeia.html', grupo: 'CADEIA' },
    { key: 'logistica',     icon: '\u21C4', label: 'Log\u00edstica',        href: 'modulo-logistica.html', grupo: 'CADEIA' },
    { key: 'rede-logistica',icon: '\u2318', label: 'Rede Log\u00edstica',   href: 'rede-logistica.html', grupo: 'CADEIA' },
    { key: 'relatorio-exec',icon: '\u25A4', label: 'Relat\u00f3rio Executivo', href: 'relatorio-executivo.html', grupo: 'RELATORIOS' },
    { key: 'relatorios-central', icon: '\u2637', label: 'Central de Relat\u00f3rios', href: 'relatorios-central.html', grupo: 'RELATORIOS' },
    { key: 'relatorios',    icon: '\u25A7', label: 'Relat\u00f3rios',       href: 'relatorios.html', grupo: 'RELATORIOS' },
    { key: 'governanca',    icon: '\u2696', label: 'Governa\u00e7\u00e3o do Dado', href: 'governanca-dado.html', grupo: 'GOVERNACAO' },
    { key: 'config',        icon: '\u2699', label: 'Configura\u00e7\u00f5es', href: 'administracao-auditoria.html', grupo: 'GOVERNACAO' },
    { key: 'marketplace',   icon: '\u2B21', label: 'Marketplace B2B',       href: 'marketplace-b2b.html', grupo: 'PORTAIS' },
    { key: 'portal-bancos', icon: '\u26C3', label: 'Portal dos Bancos', href: 'portal-bancos.html', grupo: 'FINANCIAMENTO' },
    { key: 'portal-investidores', icon: '\u25C6', label: 'Portal dos Investidores', href: 'portal-investidores.html', grupo: 'FINANCIAMENTO' },
    { key: 'portal-empresas', icon: '\u25A0', label: 'Portal das Empresas', href: 'portal-empresas.html', grupo: 'FINANCIAMENTO' },
    { key: 'banco-central', icon: '\u2696', label: 'Banco Central \u2014 regulador', href: 'dashboard-banco-central.html', grupo: 'GOVERNACAO' },
    { key: 'inteligencia',  icon: '\u25C8', label: 'Intelig\u00eancia',     href: 'inteligencia-consolidada.html', grupo: 'INTELIGENCIA' },
    { key: 'fontes-nac',    icon: '\u2B23', label: 'Fontes Nacionais',      href: 'fontes-nacionais.html', grupo: 'GOVERNACAO' },
    { key: 'fontes-int',    icon: '\u2B22', label: 'Fontes Internacionais', href: 'fontes-internacionais.html' }
  ];

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* Só mostra os ecrãs a que a sessão tem direito. Sem sessão
     (ou sem lista de páginas), mostra tudo — o access-control.js
     é que decide se a pessoa pode lá entrar. */
  /* Ecrãs a que se chega clicando dentro de outro ecrã, nunca pelo menu.
     Continuam acessíveis a quem tem permissão — apenas não ocupam
     espaço na barra lateral, que é para navegação e não para inventário. */
  var SO_POR_LIGACAO = [
    'detalhe-alerta.html','detalhe-armazem.html','detalhe-corredor.html','detalhe-kpi.html',
    'detalhe-oferta-marketplace.html','detalhe-produto.html','detalhe-provincia.html',
    'perfil-empresa.html','formulario-registar-armazem.html','modal-confirmacao-accao.html',
    'estado-erro.html','estado-sucesso.html','estado-vazio-armazens.html',
    'loading-mapa.html','loading-marketplace.html','loading-painel-nacional.html',
    'app-consumidor.html','app-consumidor-home.html','app-consumidor-precos.html',
    'app-consumidor-mapa.html','app-consumidor-alertas.html','app-consumidor-perfil.html',
    'app-consumidor-comparador.html','app-consumidor-produto-detalhe.html',
    'app-consumidor-loja-detalhe.html','app-consumidor-alerta-detalhe.html',
    'mobile-painel-nacional.html','mobile-centro-alertas.html','mobile-marketplace.html',
    'mobile-notificacoes.html','mobile-configuracoes.html',
    'tablet-painel-nacional.html','tablet-centro-alertas.html','tablet-cadastro-armazens.html',
    'gerar-credencial.html','diagnostico-credencial.html','verificador-ecras.html'
  ];

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

    /* Vinte e cinco itens numa lista plana não se lêem. Agrupam-se em famílias,
       pela ordem em que se usam: onde estou, onde é, o que vai acontecer,
       por onde passa, quem recebe, o que levo, e como se governa isto. */
    var ORDEM = ['PAINEL','TERRITORIO','INTELIGENCIA','CADEIA','PORTAIS','FINANCIAMENTO','RELATORIOS','GOVERNACAO'];
    var ROTULO = {
      PAINEL: null,
      TERRITORIO: 'Territ\u00f3rio',
      INTELIGENCIA: 'Intelig\u00eancia',
      CADEIA: 'Cadeia de abastecimento',
      PORTAIS: 'Portais por perfil',
      FINANCIAMENTO: 'Financiamento',
      RELATORIOS: 'Relat\u00f3rios',
      GOVERNACAO: 'Governa\u00e7\u00e3o e fontes'
    };
    var nav = '';
    ORDEM.forEach(function (g) {
      var doGrupo = itens.filter(function (i) {
        return (i.grupo || 'GOVERNACAO') === g && SO_POR_LIGACAO.indexOf(i.href) < 0;
      });
      if (!doGrupo.length) return;
      if (ROTULO[g]) nav += '<div class="nav-grupo">' + ROTULO[g] + '</div>';
      nav += doGrupo.map(function (i) {
        var act = i.key === activeKey ? ' active' : '';
        return '<a class="nav-item' + act + '" href="' + esc(i.href) + '">'
             + '<span class="nav-icon">' + i.icon + '</span>'
             + '<span class="nav-label">' + esc(i.label) + '</span></a>';
      }).join('');
    });

    return '<div class="brand"><div class="brand-t">SINAGEPE</div>'
         + '<div class="brand-s">Torre de Controlo</div></div>'
         + nav
         + '<a class="nav-item" href="#" id="btn-logout" style="margin-top:8px;'
         + 'border-top:1px solid var(--gold-line);border-radius:0;padding-top:13px">'
         + '<span class="nav-icon">\u21A9</span>'
         + '<span class="nav-label" style="color:#EF4444">Sair (Logout)</span></a>';
  }

  /* O CSS dos cabeçalhos é injectado aqui, para nenhum ecrã ter de o declarar. */
  function estilo() {
    if (document.getElementById('nav-sinagepe-css')) return;
    var e = document.createElement('style');
    e.id = 'nav-sinagepe-css';
    e.textContent = '.nav-grupo{font-size:8.5px;letter-spacing:.18em;text-transform:uppercase;'
      + 'color:#5E7189;padding:14px 14px 6px;font-weight:600}'
      + '.nav-grupo:first-child{padding-top:4px}';
    document.head.appendChild(e);
  }

  function montar(activeKey, idAlvo) {
    estilo();
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
