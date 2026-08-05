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

  return { load, fmt, stateTag, kpiCard, renderUserFooter };
})();
