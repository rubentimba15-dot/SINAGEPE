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
    if (!u) return;
    const initials = u.nome.split(' ').filter(w => w.length > 1 || /[A-Z]/.test(w)).map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const initialsEl = document.getElementById('user-initials');
    const nomeEl = document.getElementById('user-nome');
    const cargoEl = document.getElementById('user-cargo');
    if (initialsEl) initialsEl.textContent = initials || 'U';
    if (nomeEl) nomeEl.textContent = u.nome;
    if (cargoEl) cargoEl.textContent = `${u.instituicao} — ${u.direccao || u.cargo}`;
  }

  // ---------------------------------------------------------------
  // Navegação partilhada — fonte única da sidebar, para todos os ecrãs.
  // Qualquer alteração aqui aplica-se a TODOS os ecrãs de uma vez,
  // evitando as inconsistências que já vimos no protótipo Figma.
  // ---------------------------------------------------------------
  const NAV_ITEMS = [
    { key: 'painel',     label: 'Painel',      icon: '▦', href: 'index.html' },
    { key: 'alertas',    label: 'Alertas',     icon: '⚠', href: 'alertas.html' },
    { key: 'mapa',       label: 'Mapa',        icon: '◎', href: 'mapa-nacional.html' },
    { key: 'simulador',  label: 'Simulador',   icon: '≋', href: 'simulador-importacoes.html' },
    { key: 'pmes',       label: 'PMEs',        icon: '⛁', href: 'portal-pme.html' },
    { key: 'armazens',   label: 'Armazéns',    icon: '▤', href: 'cadastro-armazens.html' },
    { key: 'logistica',  label: 'Logística',   icon: '⇄', href: 'modulo-logistica.html' },
    { key: 'relatorios', label: 'Relatórios',  icon: '▧', href: 'relatorios.html' },
  ];

  function renderSidebar(activeKey) {
    const nav = NAV_ITEMS.map(item => {
      const cls = item.key === activeKey ? 'nav-item active' : 'nav-item';
      // Ecrãs ainda não construídos apontam para "#" e ficam visualmente
      // acessíveis, mas não navegáveis, até existirem.
      const href = item._built === false ? '#' : item.href;
      return `<a class="${cls}" href="${href}"><span class="nav-icon">${item.icon}</span> ${item.label}</a>`;
    }).join('');

    return `
      <div class="sidebar-top">
        <div class="brand">
          <div class="brand-mark">S</div>
          <div class="brand-text">
            <div class="brand-title">SINAGEPE</div>
            <div class="brand-sub">Moçambique</div>
          </div>
        </div>
        <nav class="nav-list">${nav}</nav>
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
          <div class="live-indicator"><span class="live-dot"></span> Dados em tempo real</div>
        </div>
        <div class="content" id="content-mount"></div>
        <div class="footer">
          <span>© 2026 SINAGEPE Moçambique — Ministério da Indústria e Comércio</span>
          <span id="footer-updated">Última actualização: —</span>
        </div>
      </div>`;
    document.getElementById('sidebar-mount').innerHTML = renderSidebar(activeKey);
  }

  return { load, fmt, stateTag, kpiCard, renderUserFooter, mountShell };
})();
