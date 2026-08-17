/* ============================================================
   SINAGEPE — imagens de produto, partilhadas por todos os ecrãs
   ------------------------------------------------------------
   Estratégia: fotografia primeiro, ilustração como recurso.
   Se existir assets/img/produtos/<slug>.jpg, é essa que aparece.
   Se não existir, entra automaticamente a ilustração vectorial —
   sem ecrã partido e sem imagem em falta.
   Para pôr fotografias reais: coloque os ficheiros na pasta
   assets/img/produtos/ com os nomes de slug listados abaixo.
   ============================================================ */
var PRODUTOS = (() => {

  const META = {
    'arroz':            { slug:'arroz',            forma:'saco',    cor:'#E8BE7A', grao:'#F1E3C6' },
    'trigo':            { slug:'trigo',            forma:'espiga',  cor:'#D9A441', grao:'#E9C877' },
    'farinha de milho': { slug:'farinha-milho',    forma:'saco',    cor:'#F0C64A', grao:'#F6E1A0' },
    'milho':            { slug:'milho',            forma:'espiga',  cor:'#F0C64A', grao:'#F6E1A0' },
    'óleo alimentar':   { slug:'oleo-alimentar',   forma:'garrafa', cor:'#F2C14E', grao:'#FBE7A8' },
    'oleo alimentar':   { slug:'oleo-alimentar',   forma:'garrafa', cor:'#F2C14E', grao:'#FBE7A8' },
    'açúcar':           { slug:'acucar',           forma:'cubo',    cor:'#DCE6F2', grao:'#FFFFFF' },
    'acucar':           { slug:'acucar',           forma:'cubo',    cor:'#DCE6F2', grao:'#FFFFFF' },
    'feijão':           { slug:'feijao',           forma:'grao',    cor:'#C0703A', grao:'#8C4A22' },
    'feijao':           { slug:'feijao',           forma:'grao',    cor:'#C0703A', grao:'#8C4A22' },
    'fertilizantes':    { slug:'fertilizantes',    forma:'saco',    cor:'#5FB98A', grao:'#9BD9B8' },
    'medicamentos':     { slug:'medicamentos',     forma:'caixa',   cor:'#7EC4F5', grao:'#C9E7FB' },
    'cimento nacional': { slug:'cimento',          forma:'cimento', cor:'#9FB0C4', grao:'#C3D0E0' },
    'cimento':          { slug:'cimento',          forma:'cimento', cor:'#9FB0C4', grao:'#C3D0E0' }
  };

  const meta = nome => META[String(nome||'').trim().toLowerCase()]
    || { slug:'generico', forma:'caixa', cor:'#C98A3C', grao:'#E8BE7A' };

  /* ---------- ilustrações com volume (sombra, luz, textura) ---------- */
  function ilustracao(nome, tamanho) {
    const m = meta(nome), s = tamanho || 108;
    const id = 'p' + Math.random().toString(36).slice(2, 8);
    const defs = `<defs>
      <linearGradient id="c${id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${m.grao}"/><stop offset="55%" stop-color="${m.cor}"/><stop offset="100%" stop-color="${m.cor}" stop-opacity=".55"/></linearGradient>
      <linearGradient id="f${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0E1A2C"/><stop offset="100%" stop-color="#070E1A"/></linearGradient>
      <radialGradient id="l${id}" cx="30%" cy="22%" r="72%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity=".22"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
    </defs>`;
    const fundo = `<rect width="120" height="120" rx="14" fill="url(#f${id})"/>
      <rect width="120" height="120" rx="14" fill="url(#l${id})"/>
      <ellipse cx="60" cy="104" rx="34" ry="6" fill="#000" opacity=".45"/>`;
    const C = `url(#c${id})`;
    let corpo = '';

    if (m.forma === 'saco') {
      corpo = `<path d="M40 44c0-6 3-10 6-13l-3-8h34l-3 8c3 3 6 7 6 13v46a8 8 0 0 1-8 8H48a8 8 0 0 1-8-8V44Z" fill="${C}"/>
        <path d="M43 23h34l-3 8H46l-3-8Z" fill="${m.cor}" opacity=".75"/>
        <path d="M46 52h28M46 62h28" stroke="#0A1220" stroke-width="2.4" opacity=".38" stroke-linecap="round"/>
        <rect x="48" y="70" width="24" height="15" rx="2" fill="#0A1220" opacity=".3"/>
        <path d="M60 31v67" stroke="#fff" stroke-width="1" opacity=".14"/>`;
    } else if (m.forma === 'cimento') {
      corpo = `<path d="M34 42c0-5 4-8 8-9l-2-9h40l-2 9c4 1 8 4 8 9v44a9 9 0 0 1-9 9H43a9 9 0 0 1-9-9V42Z" fill="${C}"/>
        <path d="M40 24h40l-2 9H42l-2-9Z" fill="${m.cor}" opacity=".7"/>
        <rect x="44" y="50" width="32" height="19" rx="2" fill="#0A1220" opacity=".34"/>
        <path d="M48 57h24M48 63h16" stroke="${m.grao}" stroke-width="2" opacity=".65" stroke-linecap="round"/>
        <path d="M42 78h36M42 85h28" stroke="#0A1220" stroke-width="2" opacity=".28" stroke-linecap="round"/>`;
    } else if (m.forma === 'garrafa') {
      corpo = `<path d="M52 22h16v12l8 11v45a8 8 0 0 1-8 8H52a8 8 0 0 1-8-8V45l8-11V22Z" fill="${C}"/>
        <rect x="50" y="16" width="20" height="8" rx="2" fill="${m.cor}"/>
        <rect x="46" y="58" width="28" height="22" rx="3" fill="#0A1220" opacity=".35"/>
        <path d="M51 66h18M51 73h12" stroke="${m.grao}" stroke-width="2" opacity=".7" stroke-linecap="round"/>
        <path d="M56 26v70" stroke="#fff" stroke-width="2.5" opacity=".2"/>`;
    } else if (m.forma === 'espiga') {
      corpo = `<path d="M60 100V38" stroke="${m.cor}" stroke-width="3.5" stroke-linecap="round"/>
        <g fill="${C}">
          <path d="M60 42c6-8 18-9 18-9s-1 12-8 16-10-7-10-7Z"/><path d="M60 42c-6-8-18-9-18-9s1 12 8 16 10-7 10-7Z"/>
          <path d="M60 58c6-8 18-9 18-9s-1 12-8 16-10-7-10-7Z"/><path d="M60 58c-6-8-18-9-18-9s1 12 8 16 10-7 10-7Z"/>
          <path d="M60 74c6-8 18-9 18-9s-1 12-8 16-10-7-10-7Z"/><path d="M60 74c-6-8-18-9-18-9s1 12 8 16 10-7 10-7Z"/>
        </g>
        <path d="M60 30c0-8 4-12 4-12s4 6 1 12-5 0-5 0Z" fill="${m.grao}"/>`;
    } else if (m.forma === 'grao') {
      corpo = `<g fill="${C}">
        <ellipse cx="46" cy="72" rx="14" ry="10" transform="rotate(-18 46 72)"/>
        <ellipse cx="74" cy="70" rx="14" ry="10" transform="rotate(14 74 70)"/>
        <ellipse cx="60" cy="52" rx="15" ry="11" transform="rotate(-6 60 52)"/>
        <ellipse cx="60" cy="86" rx="15" ry="10" transform="rotate(4 60 86)"/></g>
        <g stroke="#0A1220" stroke-width="1.6" opacity=".4" fill="none">
        <path d="M38 70c5-3 11-3 16 0M64 68c5-3 11-3 16 0M52 50c5-3 11-3 16 0M52 85c5-3 11-3 16 0"/></g>`;
    } else if (m.forma === 'cubo') {
      corpo = `<path d="M60 22l34 17v42L60 98 26 81V39l34-17Z" fill="${C}"/>
        <path d="M26 39l34 17 34-17M60 56v42" stroke="#0A1220" stroke-width="2" opacity=".35" fill="none"/>
        <path d="M26 39l34 17 34-17L60 22 26 39Z" fill="#fff" opacity=".12"/>`;
    } else {
      corpo = `<rect x="32" y="34" width="56" height="56" rx="6" fill="${C}"/>
        <rect x="42" y="46" width="36" height="20" rx="3" fill="#0A1220" opacity=".33"/>
        <path d="M32 52h56" stroke="#0A1220" stroke-width="2" opacity=".3"/>
        <path d="M60 34v56" stroke="#fff" stroke-width="1" opacity=".13"/>`;
    }
    return `<svg width="${s}" height="${s}" viewBox="0 0 120 120" role="img" aria-label="Ilustração de ${nome}">${defs}${fundo}${corpo}
      <path d="M1 16V7a6 6 0 0 1 6-6h9" stroke="#C98A3C" stroke-width="1.4" fill="none" opacity=".8"/>
      <path d="M119 104v9a6 6 0 0 1-6 6h-9" stroke="#C98A3C" stroke-width="1.4" fill="none" opacity=".8"/></svg>`;
  }

  /* ---------- fotografia com recurso automático à ilustração ---------- */
  let n = 0;
  function imagem(nome, tamanho) {
    const m = meta(nome), s = tamanho || 108, id = 'img-prod-' + (++n);
    const svg = ilustracao(nome, s).replace(/"/g, '&quot;');
    return `<span class="prod-img" style="width:${s}px;height:${s}px;display:inline-block;flex:none">
      <img id="${id}" src="assets/img/produtos/${m.slug}.jpg" alt="${nome}" width="${s}" height="${s}"
        style="width:${s}px;height:${s}px;object-fit:cover;border-radius:14px;display:block"
        onerror="this.outerHTML=this.getAttribute('data-fb')" data-fb="${svg}"></span>`;
  }

  return { meta, ilustracao, imagem };
})();
