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

   ------------------------------------------------------------
   REVISÃO DE 18 SET 2026 — auditoria de navegação
   ------------------------------------------------------------
   Contagem verificada: o repositório tem 110 ecrãs .html; o
   NIVEIS_ACESSO autoriza 92; o menu mostrava 43. O verificador de
   ecrãs correu sobre o sítio publicado: 91 dos 92 abrem, zero com
   erro, zero vazios, nenhum sem access-control.js.

   O problema não era menu a mais. Era menu a menos: dezanove ecrãs
   autorizados não estavam no menu nem declarados como acessíveis
   só por ligação. Simplesmente não tinham porta.

   Alterações desta revisão:
   1. Removido o item 'logistica' (modulo-logistica.html). O ficheiro
      NÃO EXISTE no repositório e era o único link morto do menu.
      ATENÇÃO: falta remover a mesma página do NIVEIS_ACESSO e a
      ligação directa que o index.html ainda tem para ela.
   2. Devolvidos ao menu os ecrãs de conteúdo que estavam invisíveis:
      painel-nacional, painel-provincial, painel-kpis-executivo,
      balanco-nacional-vivo, clima-desastres, assistente-ia, irae e
      os cinco dashboard-* sectoriais.
   3. Criado o grupo ADMIN com os sete ecrãs de administração que
      ninguém conseguia abrir sem escrever o endereço à mão. O filtro
      de acessos mostra-os só a quem os tem autorizados — na prática,
      administrador e governo.
   4. Grupos reduzidos de nove para sete, por áreas de utilização.

   FICHEIROS QUE EXISTEM E NÃO ESTÃO EM NENHUM NÍVEL DE ACESSO.
   Não entram neste menu porque o filtro os removeria de qualquer
   forma. Para os publicar é preciso decidir um a um e acrescentá-los
   ao NIVEIS_ACESSO, dentro do index.html:
     portal-pme.html, portal-universidades.html, portal-parceiros.html,
     armazens-nacionais-ouro.html, propostas-layout.html,
     onboarding-boas-vindas.html, onboarding-selecionar-perfil.html,
     onboarding-configurar-provincias.html, onboarding-conclusao.html.
   Os restantes sem nível — acesso-negado, sessao-expirada,
   estado-sem-conexao, detalhe-provincia e os quatro loading-* — são
   ecrãs de sistema, abrem por redireccionamento e ficam como estão.
   ============================================================ */
(function (global) {
  'use strict';

  var ITENS = [
    /* --- Painel ------------------------------------------------ */
    { key: 'painel',        icon: '\u25A6', label: 'PAINEL',                href: 'index.html', grupo: 'PAINEL' },
    { key: 'portas',        icon: '\u229E', label: 'Portas',                href: 'portas.html', grupo: 'PAINEL' },
    { key: 'indicadores',   icon: '\u25EB', label: 'Indicadores do Painel', href: 'indicadores-painel.html', grupo: 'PAINEL' },
    { key: 'apresentacao',  icon: '\u25C8', label: 'Apresenta\u00e7\u00e3o', href: 'apresentacao.html', grupo: 'PAINEL' },

    /* --- Visão nacional e território --------------------------- */
    { key: 'painel-nacional',   icon: '\u25A0', label: 'Painel Nacional',    href: 'painel-nacional.html', grupo: 'TERRITORIO' },
    { key: 'painel-provincial', icon: '\u25A1', label: 'Painel Provincial',  href: 'painel-provincial.html', grupo: 'TERRITORIO' },
    { key: 'kpis-exec',         icon: '\u25F0', label: 'KPIs Executivos',    href: 'painel-kpis-executivo.html', grupo: 'TERRITORIO' },
    { key: 'balanco-vivo',      icon: '\u25D1', label: 'Balan\u00e7o Nacional Vivo', href: 'balanco-nacional-vivo.html', grupo: 'TERRITORIO' },
    { key: 'balanco-visual',    icon: '\u25A3', label: 'Balan\u00e7o Visual', href: 'balanco-visual.html', grupo: 'TERRITORIO' },
    { key: 'mapa',              icon: '\u25CE', label: 'Mapa Nacional',      href: 'mapa-nacional.html', grupo: 'TERRITORIO' },
    { key: 'mapa-integrado',    icon: '\u25C9', label: 'Mapa Integrado',     href: 'mapa-integrado.html', grupo: 'TERRITORIO' },
    { key: 'ficha-detalhe',     icon: '\u26AF', label: 'Ficha de Detalhe',   href: 'ficha-detalhe.html', grupo: 'TERRITORIO' },

    /* --- Cadeia de abastecimento ------------------------------- */
    { key: 'armazens',      icon: '\u25A4', label: 'Armaz\u00e9ns',         href: 'cadastro-armazens.html', grupo: 'CADEIA' },
    { key: 'armazens-nac',  icon: '\u25EB', label: 'Armaz\u00e9ns Nacionais', href: 'armazens-nacionais.html', grupo: 'CADEIA' },
    { key: 'monitorizacao', icon: '\u25CE', label: 'Monitoriza\u00e7\u00e3o em falta', href: 'monitorizacao-em-falta.html', grupo: 'CADEIA' },
    { key: 'sandbox-epcis', icon: '\u223E', label: 'Sandbox EPCIS',         href: 'sandbox-rastreabilidade.html', grupo: 'CADEIA' },
    { key: 'medicamentos',  icon: '\u2695', label: 'Cadeia de Medicamentos', href: 'medicamentos-cadeia.html', grupo: 'CADEIA' },
    { key: 'rede-logistica',icon: '\u2318', label: 'Rede Log\u00edstica',   href: 'rede-logistica.html', grupo: 'CADEIA' },

    /* --- Análise e inteligência -------------------------------- */
    { key: 'antecipacao',   icon: '\u2609', label: 'Centro de Antecipa\u00e7\u00e3o', href: 'centro-antecipacao.html', grupo: 'INTELIGENCIA' },
    { key: 'alertas',       icon: '\u26A0', label: 'Alertas',               href: 'alertas.html', grupo: 'INTELIGENCIA' },
    { key: 'ponto-cego',    icon: '\u25CE', label: 'Ponto Cego Duplo',      href: 'ponto-cego-duplo.html', grupo: 'INTELIGENCIA' },
    { key: 'inteligencia',  icon: '\u25C8', label: 'Intelig\u00eancia',     href: 'inteligencia-consolidada.html', grupo: 'INTELIGENCIA' },
    { key: 'simulador',     icon: '\u224B', label: 'Simulador',             href: 'simulador-importacoes.html', grupo: 'INTELIGENCIA' },
    { key: 'preditivo',     icon: '\u25AD', label: 'Simulador Preditivo',   href: 'simulador-preditivo.html', grupo: 'INTELIGENCIA' },
    { key: 'clima',         icon: '\u2602', label: 'Clima e Desastres',     href: 'clima-desastres.html', grupo: 'INTELIGENCIA' },
    { key: 'assistente',    icon: '\u2726', label: 'Assistente',            href: 'assistente-ia.html', grupo: 'INTELIGENCIA' },
    { key: 'combustiveis',  icon: '\u26FD', label: 'Motor de Combust\u00edveis', href: 'motor-combustiveis.html', grupo: 'INTELIGENCIA' },
    { key: 'inflacao',      icon: '\u25E7', label: 'Onde a infla\u00e7\u00e3o n\u00e3o chega', href: 'inflacao-cobertura.html', grupo: 'INTELIGENCIA' },
    { key: 'series',        icon: '\u25E9', label: 'S\u00e9rie de pre\u00e7os', href: 'series-precos.html', grupo: 'INTELIGENCIA' },
    { key: 'comercio',      icon: '\u2691', label: 'Com\u00e9rcio externo',  href: 'comercio-externo.html', grupo: 'INTELIGENCIA' },

    /* --- Painéis sectoriais e portais --------------------------
       Cada conta vê apenas o que lhe está autorizado: a conta
       'financas' vê o painel das Finanças e mais nenhum. Só o
       administrador e o governo vêem a lista completa. */
    { key: 'dash-agricultura',  icon: '\u2618', label: 'Painel da Agricultura',  href: 'dashboard-agricultura.html', grupo: 'SECTORES' },
    { key: 'dash-financas',     icon: '\u25C7', label: 'Painel das Finan\u00e7as', href: 'dashboard-financas.html', grupo: 'SECTORES' },
    { key: 'dash-transportes',  icon: '\u26DF', label: 'Painel dos Transportes', href: 'dashboard-transportes.html', grupo: 'SECTORES' },
    { key: 'dash-igsae',        icon: '\u2696', label: 'Painel do IGSAE',        href: 'dashboard-igsae.html', grupo: 'SECTORES' },
    { key: 'dash-arc',          icon: '\u25D4', label: 'Painel da ARC',          href: 'dashboard-arc.html', grupo: 'SECTORES' },
    { key: 'banco-central',     icon: '\u2696', label: 'Banco Central \u2014 regulador', href: 'dashboard-banco-central.html', grupo: 'SECTORES' },
    { key: 'irae',              icon: '\u25F1', label: 'IRAE',                   href: 'irae.html', grupo: 'SECTORES' },
    { key: 'portal-produtores', icon: '\u2618', label: 'Portal do Produtor',     href: 'portal-produtores.html', grupo: 'SECTORES' },
    { key: 'portal-transportadores', icon: '\u26DF', label: 'Portal do Transportador', href: 'portal-transportadores.html', grupo: 'SECTORES' },
    { key: 'portal-comerciantes', icon: '\u2696', label: 'Portal do Comerciante', href: 'portal-comerciantes.html', grupo: 'SECTORES' },
    { key: 'portal-empresas',   icon: '\u25A0', label: 'Portal das Empresas',    href: 'portal-empresas.html', grupo: 'SECTORES' },
    { key: 'portal-bancos',     icon: '\u26C3', label: 'Portal dos Bancos',      href: 'portal-bancos.html', grupo: 'SECTORES' },
    { key: 'portal-investidores', icon: '\u25C6', label: 'Portal dos Investidores', href: 'portal-investidores.html', grupo: 'SECTORES' },
    { key: 'portal-publico',    icon: '\u25CB', label: 'Portal P\u00fablico',    href: 'portal-publico.html', grupo: 'SECTORES' },
    { key: 'marketplace',       icon: '\u2B21', label: 'Marketplace B2B',        href: 'marketplace-b2b.html', grupo: 'SECTORES' },

    /* --- Relatórios, governação e fontes ----------------------- */
    { key: 'relatorio-exec',     icon: '\u25A4', label: 'Relat\u00f3rio Executivo', href: 'relatorio-executivo.html', grupo: 'GOVERNACAO' },
    { key: 'relatorios-central', icon: '\u2637', label: 'Central de Relat\u00f3rios', href: 'relatorios-central.html', grupo: 'GOVERNACAO' },
    { key: 'relatorios',         icon: '\u25A7', label: 'Relat\u00f3rios',       href: 'relatorios.html', grupo: 'GOVERNACAO' },
    { key: 'governanca',         icon: '\u2696', label: 'Governa\u00e7\u00e3o do Dado', href: 'governanca-dado.html', grupo: 'GOVERNACAO' },
    { key: 'actualidade',        icon: '\u25F4', label: 'Actualidade dos dados', href: 'actualidade-dados.html', grupo: 'GOVERNACAO' },
    { key: 'fontes-nac',         icon: '\u2B23', label: 'Fontes Nacionais',      href: 'fontes-nacionais.html', grupo: 'GOVERNACAO' },
    { key: 'fontes-int',         icon: '\u2B22', label: 'Fontes Internacionais', href: 'fontes-internacionais.html', grupo: 'GOVERNACAO' },
    { key: 'adesao',             icon: '\u2638', label: 'Ades\u00e3o Institucional', href: 'adesao-institucional.html', grupo: 'GOVERNACAO' },

    /* --- Administração -----------------------------------------
       Estes sete estavam autorizados e sem porta: só se chegava lá
       escrevendo o endereço. O filtro mostra-os apenas a quem os tem
       na sua lista de acesso. */
    { key: 'config',            icon: '\u2699', label: 'Administra\u00e7\u00e3o e Auditoria', href: 'administracao-auditoria.html', grupo: 'ADMIN' },
    { key: 'config-sistema',    icon: '\u2692', label: 'Configura\u00e7\u00f5es',  href: 'configuracoes.html', grupo: 'ADMIN' },
    { key: 'gestao-utilizadores', icon: '\u263A', label: 'Gest\u00e3o de Utilizadores', href: 'gestao-utilizadores.html', grupo: 'ADMIN' },
    { key: 'lista-acessos',     icon: '\u2637', label: 'Lista de Acessos',      href: 'lista-de-acessos.html', grupo: 'ADMIN' },
    { key: 'importacao',        icon: '\u2913', label: 'Importa\u00e7\u00e3o de Dados', href: 'importacao-dados.html', grupo: 'ADMIN' },
    { key: 'historico',         icon: '\u21BA', label: 'Hist\u00f3rico de Actividade', href: 'historico-actividade.html', grupo: 'ADMIN' },
    { key: 'notificacoes',      icon: '\u2709', label: 'Centro de Notifica\u00e7\u00f5es', href: 'centro-notificacoes.html', grupo: 'ADMIN' },
    { key: 'ajuda',             icon: '\u003F', label: 'Ajuda',                 href: 'painel-ajuda.html', grupo: 'ADMIN' },

    /* --- Por decidir ---------------------------------------------
       Estes nove existem no repositório e, até 20 Set 2026, não estavam
       autorizados a conta nenhuma: ninguém os conseguia abrir, nem o
       administrador. Foram acrescentados à conta de administrador para
       poderem ser vistos e decididos, um a um: abrir a mais contas,
       corrigir, ou arquivar. Enquanto estiverem neste grupo, NÃO são
       parte da navegação normal do sistema — o rótulo diz isso a quem
       os vir. Decidido o destino de cada um, sai daqui. */
    { key: 'rev-portal-pme',       icon: '\u2691', label: 'Portal das PME',        href: 'portal-pme.html', grupo: 'REVISAO' },
    { key: 'rev-portal-univ',      icon: '\u2691', label: 'Portal das Universidades', href: 'portal-universidades.html', grupo: 'REVISAO' },
    { key: 'rev-portal-parc',      icon: '\u2691', label: 'Portal dos Parceiros',  href: 'portal-parceiros.html', grupo: 'REVISAO' },
    { key: 'rev-armazens-ouro',    icon: '\u2691', label: 'Armaz\u00e9ns Nacionais (vers\u00e3o ouro)', href: 'armazens-nacionais-ouro.html', grupo: 'REVISAO' },
    { key: 'rev-propostas',        icon: '\u2691', label: 'Propostas de Layout',   href: 'propostas-layout.html', grupo: 'REVISAO' },
    { key: 'rev-onb-1',            icon: '\u2691', label: 'Onboarding 1 \u2014 Boas-vindas', href: 'onboarding-boas-vindas.html', grupo: 'REVISAO' },
    { key: 'rev-onb-2',            icon: '\u2691', label: 'Onboarding 2 \u2014 Perfil', href: 'onboarding-selecionar-perfil.html', grupo: 'REVISAO' },
    { key: 'rev-onb-3',            icon: '\u2691', label: 'Onboarding 3 \u2014 Prov\u00edncias', href: 'onboarding-configurar-provincias.html', grupo: 'REVISAO' },
    { key: 'rev-onb-4',            icon: '\u2691', label: 'Onboarding 4 \u2014 Conclus\u00e3o', href: 'onboarding-conclusao.html', grupo: 'REVISAO' }
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
    'estado-erro.html','estado-sucesso.html','estado-vazio-armazens.html','estado-sem-conexao.html',
    'loading-mapa.html','loading-marketplace.html','loading-painel-nacional.html','loading-relatorios.html',
    'app-consumidor.html','app-consumidor-home.html','app-consumidor-precos.html',
    'app-consumidor-mapa.html','app-consumidor-alertas.html','app-consumidor-perfil.html',
    'app-consumidor-comparador.html','app-consumidor-produto-detalhe.html',
    'app-consumidor-loja-detalhe.html','app-consumidor-alerta-detalhe.html',
    'mobile-painel-nacional.html','mobile-centro-alertas.html','mobile-marketplace.html',
    'mobile-notificacoes.html','mobile-configuracoes.html',
    'tablet-painel-nacional.html','tablet-centro-alertas.html','tablet-cadastro-armazens.html',
    'acesso-negado.html','sessao-expirada.html',
    'gerar-credencial.html','diagnostico-credencial.html','verificador-ecras.html'
  ];

  var ROTULOS = {
    PAINEL: null,
    TERRITORIO: 'Vis\u00e3o nacional e territ\u00f3rio',
    CADEIA: 'Cadeia de abastecimento',
    INTELIGENCIA: 'An\u00e1lise e intelig\u00eancia',
    SECTORES: 'Pain\u00e9is sectoriais e portais',
    GOVERNACAO: 'Relat\u00f3rios, governa\u00e7\u00e3o e fontes',
    ADMIN: 'Administra\u00e7\u00e3o',
    REVISAO: '\u2691 Por decidir \u2014 fora do sistema'
  };

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

    /* Sete famílias, pela ordem em que se usam: onde estou, onde é o quê,
       por onde passa, o que vai acontecer, quem recebe e quem regula, como
       se presta contas, e quem administra a casa. A última só aparece a
       quem tem esses ecrãs autorizados. */
    var ORDEM = ['PAINEL','TERRITORIO','CADEIA','INTELIGENCIA','SECTORES','GOVERNACAO','ADMIN','REVISAO'];
    var ROTULO = ROTULOS;
    var nav = '';
    ORDEM.forEach(function (g) {
      var doGrupo = itens.filter(function (i) {
        return (i.grupo || 'GOVERNACAO') === g && SO_POR_LIGACAO.indexOf(i.href) < 0;
      });
      if (!doGrupo.length) return;
      if (ROTULO[g]) nav += '<div class="nav-grupo' + (g === 'REVISAO' ? ' rev' : '') + '">' + ROTULO[g] + '</div>';
      nav += doGrupo.map(function (i) {
        var act = i.key === activeKey ? ' active' : '';
        if (i.grupo === 'REVISAO') act += ' rev';
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
      /* Os rotulos de grupo passam a bronze (20 Set 2026). Em azul acinzentado
         eram da mesma familia dos itens e a barra lia-se como uma lista unica;
         em bronze passam a ler-se como cabecalhos, e a barra ganha estrutura. */
      + 'color:#EDB86E;padding:14px 14px 6px;font-weight:600}'
      + '.nav-grupo:first-child{padding-top:4px}'
      + '.nav-grupo.rev{color:#F5DDB8}'
      + '.nav-item.rev{border:1px dashed rgba(201,138,60,.55);border-radius:7px;margin:2px 8px;opacity:.85}'
      + '@media(max-width:1080px){'
      + '#nav-abrir{display:flex !important}'
      + '.sidebar,#nav-mount{display:block !important;position:fixed !important;top:0;left:0;bottom:0;'
      + 'width:270px;max-width:84vw;z-index:99000;overflow-y:auto;'
      + 'transform:translateX(-102%);transition:transform .22s ease;'
      + 'box-shadow:14px 0 40px rgba(0,0,0,.55)}'
      + '.sidebar.nav-aberta,#nav-mount.nav-aberta{transform:translateX(0)}'
      + '#nav-veu{position:fixed;inset:0;background:rgba(4,7,18,.68);z-index:98000;display:none}'
      + '#nav-veu.on{display:block}'
      + 'main{padding-top:56px !important}'
      + '#nav-fechar{display:block;width:calc(100% - 24px);margin:10px 12px 4px;padding:9px;'
      + 'border-radius:8px;border:1px solid rgba(38,56,86,.9);background:#111E31;color:#8FA1B8;'
      + 'font-family:Inter,sans-serif;font-size:11.5px;cursor:pointer}'
      + '}'
      + '#nav-abrir{display:none;position:fixed;top:11px;left:11px;z-index:99500;'
      + 'align-items:center;gap:8px;padding:9px 14px;border-radius:9px;'
      + 'border:1px solid rgba(201,138,60,.42);background:#0C1626;color:#E8BE7A;'
      + 'font-family:Inter,sans-serif;font-size:12.5px;cursor:pointer;'
      + 'box-shadow:0 4px 16px rgba(0,0,0,.4)}'
      + '#nav-fechar{display:none}';
    document.head.appendChild(e);
  }

  /* ---- Telemovel ----
     Abaixo de 1080px os ecras escondiam a barra lateral, e quem entrava pelo
     telemovel ficava sem forma de navegar. Passa a haver um botao fixo no
     canto, que faz deslizar a mesma barra sobre o conteudo. E a mesma lista
     e a mesma filtragem por acesso: muda so a apresentacao. */
  function montarTelemovel(alvo) {
    if (!alvo || document.getElementById('nav-abrir')) return;
    var b = document.createElement('button');
    b.id = 'nav-abrir';
    b.setAttribute('aria-label', 'Abrir menu');
    b.innerHTML = '<span style="font-size:15px">\u2630</span><span>Menu</span>';
    var v = document.createElement('div');
    v.id = 'nav-veu';
    function abrir() { alvo.classList.add('nav-aberta'); v.classList.add('on'); }
    function fechar() { alvo.classList.remove('nav-aberta'); v.classList.remove('on'); }
    b.addEventListener('click', abrir);
    v.addEventListener('click', fechar);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fechar(); });
    alvo.addEventListener('click', function (e) {
      if (e.target && e.target.closest && e.target.closest('.nav-item')) fechar();
    });
    document.body.appendChild(v);
    document.body.appendChild(b);
    var f = document.createElement('button');
    f.id = 'nav-fechar';
    f.textContent = 'Fechar menu';
    f.addEventListener('click', fechar);
    alvo.appendChild(f);
  }

  /* Devolve apenas os itens do menu, já filtrados e agrupados, sem a marca
     nem o botão de sair. Serve para invólucros que já desenham a sua própria
     marca e rodapé — caso do mountShell() no assets/sinagepe.js. Assim existe
     uma só lista de navegação no sistema, e não duas. */
  function htmlItens(activeKey) {
    estilo();
    var lista = permitidas();
    var itens = ITENS.filter(function (i) {
      return !lista || i.href === 'index.html' || lista.indexOf(i.href) >= 0;
    });
    var ORDEM = ['PAINEL','TERRITORIO','CADEIA','INTELIGENCIA','SECTORES','GOVERNACAO','ADMIN','REVISAO'];
    var out = '';
    ORDEM.forEach(function (g) {
      var doGrupo = itens.filter(function (i) {
        return (i.grupo || 'GOVERNACAO') === g && SO_POR_LIGACAO.indexOf(i.href) < 0;
      });
      if (!doGrupo.length) return;
      if (ROTULOS[g]) out += '<div class="nav-grupo' + (g === 'REVISAO' ? ' rev' : '') + '">' + ROTULOS[g] + '</div>';
      out += doGrupo.map(function (i) {
        var act = i.key === activeKey ? ' active' : '';
        if (i.grupo === 'REVISAO') act += ' rev';
        return '<a class="nav-item' + act + '" href="' + esc(i.href) + '">'
             + '<span class="nav-icon">' + i.icon + '</span>'
             + '<span class="nav-label">' + esc(i.label) + '</span></a>';
      }).join('');
    });
    return out;
  }

  function montar(activeKey, idAlvo) {
    estilo();
    var alvo = document.getElementById(idAlvo || 'nav-mount');
    if (!alvo) return false;
    alvo.innerHTML = html(activeKey);
    montarTelemovel(alvo);
    var sair = document.getElementById('btn-logout');
    if (sair) sair.addEventListener('click', function (e) {
      e.preventDefault();
      try { sessionStorage.clear(); } catch (err) {}
      location.href = 'index.html';
    });
    return true;
  }

  global.SinagepeNav = { itens: ITENS, html: html, htmlItens: htmlItens, estilo: estilo, montar: montar };
})(window);
