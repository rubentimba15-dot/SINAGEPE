/* ============================================================
   SINAGEPE — helpers partilhados por todos os ecrãs
   ============================================================ */
const SINAGEPE = (() => {

  async function load() {
    const res = await fetch('data/sinagepe-data.json');
    if (!res.ok) throw new Error('Não foi possível carregar os dados de demonstração.');
    return res.json();
  }

  function fmt(n) {
    return new Intl.NumberFormat('pt-PT').format(n);
  }

  // Estado -> classe de cor (usado em badges/pills/tags)
  const ESTADO_TIPO = {
    'Excelente': 'ok', 'Estável': 'ok', 'Normal': 'ok', 'Regular': 'warn',
    'Atenção': 'warn', 'Adequado': 'info', 'Crítico': 'crit',
  };

  function stateTag(estado) {
    const tipo = ESTADO_TIPO[estado] || 'info';
    const bg = { ok: 'var(--ok-bg)', warn: 'var(--warn-bg)', crit: 'var(--crit-bg)', info: 'var(--info-bg)' }[tipo];
    const fg = { ok: 'var(--ok)', warn: 'var(--warn)', crit: 'var(--crit)', info: 'var(--info)' }[tipo];
    return `<span class="state-tag" style="background:${bg};color:${fg}">${estado}</span>`;
  }

  function kpiCard({ label, valor, estado, tipo }) {
    return `<div class="card">
      <div class="kpi-label">${label}</div>
      <div class="kpi-value-row">
        <div class="kpi-value">${valor}</div>
        <span class="pill pill-${tipo}">${estado}</span>
      </div>
    </div>`;
  }

  function renderUserFooter(data) {
    const u = data.utilizador;
    if (u) {
      const initials = u.nome.split(' ').filter(w => w.length > 1 || /[A-Z]/.test(w)).map(w => w[0]).join('').slice(0, 2).toUpperCase();
      const initialsEl = document.getElementById('user-initials');
      const nomeEl = document.getElementById('user-nome');
      const cargoEl = document.getElementById('user-cargo');
      if (initialsEl) initialsEl.textContent = initials || 'U';
      if (nomeEl) nomeEl.textContent = u.nome;
      if (cargoEl) cargoEl.textContent = `${u.instituicao} — ${u.direccao || u.cargo}`;
    }
    // contagens da sidebar — mesma fonte de dados em todos os 31 ecrãs, nunca hardcoded
    const alertasEl = document.getElementById('nav-alertas-count');
    const armazensEl = document.getElementById('nav-armazens-count');
    const corredoresEl = document.getElementById('nav-corredores-count');
    if (alertasEl && data.alertasDetalhe) alertasEl.textContent = `(${data.alertasDetalhe.length})`;
    if (armazensEl && data.armazens) armazensEl.textContent = `(${data.armazens.length})`;
    if (corredoresEl && data.corredores) corredoresEl.textContent = `(${data.corredores.length})`;
  }

  // ---------------------------------------------------------------
  // LISTA DE RECURSO (18 Set 2026)
  //
  // A navegação do sistema é agora UMA só: assets/nav-sinagepe.js, que
  // filtra os ecrãs pelo perfil da sessão. Esta lista só é usada se esse
  // ficheiro não carregar, para a barra lateral nunca ficar vazia.
  //
  // Enquanto foi a lista principal, mostrava a mesma coisa a toda a gente:
  // a conta das Finanças via Sandbox EPCIS e Ponto Cego Duplo sem os ter
  // autorizados. Tinha ainda 'modulo-logistica.html', que não existe no
  // repositório, e 'portal-pme.html', que não está autorizado a ninguém.
  // Ambos removidos aqui.
  // ---------------------------------------------------------------
  const NAV_ITEMS = [
    { key: 'painel',     label: 'Painel',      icon: '▦', href: 'index.html' },
    { key: 'alertas',    label: 'Alertas',     icon: '⚠', href: 'alertas.html', countId: 'nav-alertas-count' },
    { key: 'mapa',       label: 'Mapa',        icon: '◎', href: 'mapa-nacional.html' },
    { key: 'simulador',  label: 'Simulador',   icon: '≋', href: 'simulador-importacoes.html' },
    { key: 'preditivo',  label: 'Simulador Preditivo', icon: '◭', href: 'simulador-preditivo.html' },
    { key: 'armazens',   label: 'Armazéns',    icon: '▤', href: 'cadastro-armazens.html', countId: 'nav-armazens-count' },
    { key: 'armazens-nac', label: 'Armazéns Nacionais', icon: '◫', href: 'armazens-nacionais.html' },
    { key: 'ponto-cego', label: 'Ponto Cego Duplo', icon: '◉', href: 'ponto-cego-duplo.html' },
    { key: 'sandbox-epcis', label: 'Sandbox EPCIS', icon: '⇞', href: 'sandbox-rastreabilidade.html' },
    { key: 'mapa-integrado', label: 'Mapa Integrado', icon: '◉', href: 'mapa-integrado.html' },
    { key: 'antecipacao', label: 'Centro de Antecipação', icon: '☉', href: 'centro-antecipacao.html' },
    { key: 'governanca', label: 'Governação do Dado', icon: '⚖', href: 'governanca-dado.html' },
    { key: 'portal-produtores', label: 'Portal do Produtor', icon: '☘', href: 'portal-produtores.html' },
    { key: 'portal-transportadores', label: 'Portal do Transportador', icon: '⛟', href: 'portal-transportadores.html' },
    { key: 'relatorio-exec', label: 'Relatório Executivo', icon: '▤', href: 'relatorio-executivo.html' },
    { key: 'adesao', label: 'Adesão Institucional', icon: '☸', href: 'adesao-institucional.html' },
    { key: 'rede',       label: 'Rede Logística', icon: '⌘', href: 'rede-logistica.html' },
    { key: 'relatorios', label: 'Relatórios',  icon: '▧', href: 'relatorios.html' },
    { key: 'config',     label: 'Configurações', icon: '⚙', href: 'administracao-auditoria.html' },
    { key: 'marketplace', label: 'Marketplace B2B', icon: '⬡', href: 'marketplace-b2b.html' },
    { key: 'inteligencia', label: 'Inteligência', icon: '◈', href: 'inteligencia-consolidada.html' },
    { key: 'nacionais',    label: 'Fontes Nacionais', icon: '⬣', href: 'fontes-nacionais.html' },
    { key: 'fontes', label: 'Fontes Internacionais', icon: '⬢', href: 'fontes-internacionais.html' },
  ];

  function listaDeRecurso(activeKey) {
    return NAV_ITEMS.map(item => {
      const cls = item.key === activeKey ? 'nav-item active' : 'nav-item';
      const href = item._built === false ? '#' : item.href;
      const count = item.countId ? ` <span id="${item.countId}"></span>` : '';
      return `<a class="${cls}" href="${href}"><span class="nav-icon">${item.icon}</span> ${item.label}${count}</a>`;
    }).join('');
  }

  /* A barra lateral vem do menu único (assets/nav-sinagepe.js), que já traz
     os grupos e mostra a cada perfil apenas o que lhe está autorizado. Se
     esse ficheiro não estiver carregado, usa-se a lista de recurso acima. */
  function renderSidebar(activeKey) {
    const nav = (window.SinagepeNav && window.SinagepeNav.htmlItens)
      ? window.SinagepeNav.htmlItens(activeKey)
      : listaDeRecurso(activeKey);
    const logout = `<a class="nav-item" href="index.html" onclick="sessionStorage.removeItem('sinagepe_nivel')" style="margin-top:8px;border-top:1px solid var(--border-card);border-radius:0;padding-top:14px"><span class="nav-icon">↩</span> <span style="color:var(--crit)">Sair (Logout)</span></a>`;

    return `
      <div class="sidebar-top">
        <div class="brand">
          <div class="brand-mark">S</div>
          <div class="brand-text">
            <div class="brand-title">SINAGEPE</div>
            <div class="brand-sub">Moçambique</div>
          </div>
        </div>
        <nav class="nav-list">${nav}${logout}</nav>
      </div>
      <div class="sidebar-footer">
        <div class="avatar-dot" id="user-initials">—</div>
        <div class="sidebar-footer-text">
          <div class="sidebar-footer-name" id="user-nome">—</div>
          <div class="sidebar-footer-role" id="user-cargo">—</div>
        </div>
      </div>`;
  }

  function mountShell(activeKey, topbarTitle, topbarBadge) {
    const shellRoot = document.getElementById('app-shell');
    shellRoot.innerHTML = `
      <aside class="sidebar" id="sidebar-mount"></aside>
      <div class="main">
        <div class="topbar">
          <div class="topbar-title-group">
            <div class="topbar-title">${topbarTitle}</div>
            <div class="topbar-badge">${topbarBadge}</div>
          </div>
          <div style="display:flex;align-items:center;gap:16px">
            <a href="assistente-ia.html" style="font-size:11.5px;font-weight:600;color:var(--bronze-light);display:flex;align-items:center;gap:5px">✦ Assistente IA</a>
            <div class="live-indicator"><span class="live-dot"></span> Dados em tempo real</div>
          </div>
        </div>
        <div class="content" id="content-mount"></div>
        <div class="footer">
                <span>© 2026 SINAGEPE — protótipo independente</span>
          <span style="display:flex;gap:18px;align-items:center">
            <a href="portal-publico.html" style="color:var(--ink-faint)">Portal Público ↗</a>
            <span id="footer-updated">Última actualização: —</span>
            <span style="color:var(--ok);font-weight:600;font-size:11px">● DADOS REAIS EM TEMPO REAL (DADOS DEMONSTRATIVOS)</span>
          </span>
        </div>
      </div>`;
    document.getElementById('sidebar-mount').innerHTML = renderSidebar(activeKey);

    /* Muitos ecrãs antigos não declaram o assets/nav-sinagepe.js no <head>.
       Em vez de os editar um a um, carrega-se aqui e redesenha-se a barra
       quando chegar. Se já estiver carregado, não faz nada. */
    if (!window.SinagepeNav) {
      const js = document.createElement('script');
      js.src = 'assets/nav-sinagepe.js';
      js.onload = () => {
        const alvo = document.getElementById('sidebar-mount');
        if (alvo) alvo.innerHTML = renderSidebar(activeKey);
      };
      document.head.appendChild(js);
    }
  }

  // ---------------------------------------------------------------
  // IPL e INCL — fórmulas de trabalho para o MVP (secção 14 do
  // documento de especificação). Pesos calibráveis, a afinar com
  // dados reais mais tarde; calculados aqui, não hardcoded, para
  // nunca desalinharem dos dados-base.
  // ---------------------------------------------------------------
  function calcIPL(data) {
    const cs = data.corredores;
    const total = cs.length;
    const operacionais = cs.filter(c => c.estado === 'Operacional').length;
    const interrompidos = cs.filter(c => c.estado === 'Interrompido').length;
    const custosValidos = cs.map(c => c.custoTKm).filter(v => v !== null);
    const custoMedio = custosValidos.reduce((a, b) => a + b, 0) / custosValidos.length;
    const custoMaxRef = data.infraestrutura.custoMaximoReferenciaTKm;
    const capacidadeRodoviaria = (data.utilizacaoModal.find(u => u.modal.startsWith('Rodoviário')).percentagem) / 100;

    const ipl = 0.40 * (1 - operacionais / total)
              + 0.30 * (custoMedio / custoMaxRef)
              + 0.20 * (1 - capacidadeRodoviaria)
              + 0.10 * (interrompidos / total);
    return Math.min(1, Math.max(0, ipl));
  }

  function calcINCL(data) {
    const cs = data.corredores;
    const kmTotais = cs.reduce((a, c) => a + c.distanciaKm, 0);
    const kmTransitaveis = cs.filter(c => c.estado !== 'Interrompido').reduce((a, c) => a + c.distanciaKm, 0);
    const portos = data.infraestrutura.portosOperacionais;
    const custoMedio = cs.map(c => c.custoTKm).filter(v => v !== null).reduce((a, b, _, arr) => a + b / arr.length, 0);
    const custoMaxRef = data.infraestrutura.custoMaximoReferenciaTKm;
    const modosDisponiveis = 3; // rodoviário, ferroviário, marítimo têm dados; aéreo ainda não modelado
    const totalModos = 4;

    const incl = 0.35 * (kmTransitaveis / kmTotais)
               + 0.25 * (portos.activos / portos.total)
               + 0.25 * (1 - custoMedio / custoMaxRef)
               + 0.15 * (modosDisponiveis / totalModos);
    return Math.min(1, Math.max(0, incl));
  }

  return { load, fmt, stateTag, kpiCard, renderUserFooter, mountShell, calcIPL, calcINCL };
})();
