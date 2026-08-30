/* ============================================================
   INDICADORES DO SINAGEPE — origem declarada em cada número
   ------------------------------------------------------------
   O problema que resolve: os cartões de indicador do sistema
   mostravam números sem dizer de onde vinham. Uns eram calculados
   sobre dados com fonte; outros estavam escritos à mão num ficheiro
   que se declara SIMULADO. Do lado de fora, pareciam iguais.

   A partir daqui, cada indicador declara-se:

     FACTO       — deriva de dados com fonte. Clicável: abre a
                   fórmula, os componentes, a fonte e a data.
     ESTIMATIVA  — calculado com pressupostos declarados.
     DEMONSTRAÇÃO— valor de trabalho, sem origem. Marcado a âmbar,
                   e o clique diz o que falta e quem o detém.

   Um cartão que não consegue dizer de onde vem o seu número não
   deve parecer igual a um que consegue.

   Uso no ecrã (sem os sinais de menor/maior, para este comentário
   não fechar o bloco se o ficheiro for colado dentro de uma página):
     script src="assets/indicadores-sinagepe.js"
     ... IndicadoresSinagepe.cartao({...})
     ... IndicadoresSinagepe.linha([...])   para uma fila de cartões
   ============================================================ */
(function (global) {
  'use strict';

  var COR = {
    FACTO: '#12B981',
    ESTIMATIVA: '#F0A926',
    'DEMONSTRAÇÃO': '#EF4444',
    'POR LIGAR': '#5E7189'
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function num(n) {
    return typeof n === 'number' ? new Intl.NumberFormat('pt-PT').format(n) : esc(n);
  }

  function estilo() {
    if (document.getElementById('ind-css')) return;
    var e = document.createElement('style');
    e.id = 'ind-css';
    e.textContent = [
      '.ind-linha{display:grid;grid-template-columns:repeat(auto-fit,minmax(196px,1fr));gap:12px;margin-bottom:16px}',
      '.ind{position:relative;background:var(--card-bg,#0C1626);border:1px solid var(--card-line,rgba(38,56,86,.75));',
      'border-radius:12px;padding:15px 17px;cursor:pointer;transition:.16s;text-align:left;',
      'font-family:inherit;color:inherit;width:100%;display:block}',
      '.ind:hover{border-color:rgba(201,138,60,.42);transform:translateY(-2px)}',
      '.ind-marca{position:absolute;top:11px;right:12px;font-size:8px;letter-spacing:.11em;',
      'text-transform:uppercase;padding:2px 7px;border-radius:3px;border:1px solid;font-weight:600}',
      '.ind-l{font-size:9.5px;letter-spacing:.15em;text-transform:uppercase;color:var(--t4,#5E7189);',
      'margin-bottom:9px;padding-right:78px;line-height:1.35}',
      '.ind-v{font-size:27px;font-weight:600;letter-spacing:-.025em;line-height:1;',
      'font-family:"IBM Plex Mono",monospace;font-variant-numeric:tabular-nums}',
      '.ind-v small{font-size:12px;margin-left:4px;font-weight:400}',
      '.ind-s{font-size:10.5px;color:var(--t3,#8FA1B8);margin-top:7px;line-height:1.4}',
      '.ind-seta{font-size:9.5px;color:var(--t4,#5E7189);margin-top:9px}',
      '.ind.dem{border-style:dashed;border-color:rgba(239,68,68,.4)}',
      '.ind.dem .ind-v{opacity:.62}',
      /* painel que abre ao clicar */
      '#ind-fundo{position:fixed;inset:0;background:rgba(4,7,18,.74);z-index:99000;display:none;',
      'align-items:center;justify-content:center;padding:6vh 20px;backdrop-filter:blur(2px)}',
      '#ind-fundo.on{display:flex}',
      '#ind-cx{width:100%;max-width:620px;max-height:84vh;overflow-y:auto;background:#0C1626;',
      'border:1px solid rgba(38,56,86,.9);border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,.55)}',
      '.ind-cab{padding:20px 22px;border-bottom:1px solid rgba(38,56,86,.75)}',
      '.ind-cab h3{margin:0 0 5px;font-size:17px;font-weight:600;color:#F3F7FC}',
      '.ind-cab p{margin:0;font-size:12.5px;color:#8FA1B8;line-height:1.6}',
      '.ind-bd{padding:16px 22px}',
      '.ind-row{display:flex;justify-content:space-between;gap:14px;padding:9px 0;',
      'border-bottom:1px solid rgba(38,56,86,.4);font-size:12px}',
      '.ind-row:last-child{border-bottom:none}',
      '.ind-row span:first-child{color:#5E7189}',
      '.ind-row span:last-child{color:#C3D0E0;text-align:right;font-family:"IBM Plex Mono",monospace}',
      '.ind-nota{margin:14px 22px;padding:12px 14px;border-radius:9px;font-size:11.5px;line-height:1.6;border:1px solid}',
      '.ind-nota.i{background:rgba(34,184,240,.07);border-color:rgba(34,184,240,.26);color:#9EDCF7}',
      '.ind-nota.w{background:rgba(240,169,38,.07);border-color:rgba(240,169,38,.26);color:#F0A926}',
      '.ind-nota.r{background:rgba(239,68,68,.07);border-color:rgba(239,68,68,.28);color:#FFB4B4}',
      '.ind-pe{padding:14px 22px;border-top:1px solid rgba(38,56,86,.75);font-size:10.5px;color:#5E7189;',
      'display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap;align-items:center}',
      '.ind-pe a{color:#22B8F0;text-decoration:none}',
      '#ind-fechar{font-family:inherit;font-size:11.5px;padding:7px 14px;border-radius:7px;',
      'border:1px solid rgba(38,56,86,.9);background:#111E31;color:#C3D0E0;cursor:pointer}'
    ].join('');
    document.head.appendChild(e);
  }

  var REGISTO = {};

  /* ---- o cartão ---- */
  function cartao(o) {
    estilo();
    var tipo = o.tipo || 'DEMONSTRAÇÃO';
    var c = COR[tipo] || '#5E7189';
    var id = o.id || ('ind-' + Math.random().toString(36).slice(2, 9));
    REGISTO[id] = o;
    var corValor = o.cor || (tipo === 'DEMONSTRAÇÃO' ? 'var(--t3,#8FA1B8)' : 'var(--ink,#F3F7FC)');
    return '<button class="ind' + (tipo === 'DEMONSTRAÇÃO' ? ' dem' : '') + '" data-ind="' + esc(id) + '">'
      + '<span class="ind-marca" style="color:' + c + ';border-color:' + c + '55;background:' + c + '12">'
      + esc(tipo === 'DEMONSTRAÇÃO' ? 'Demonstração' : tipo.toLowerCase()) + '</span>'
      + '<div class="ind-l">' + o.rotulo + '</div>'
      + '<div class="ind-v" style="color:' + corValor + '">' + num(o.valor)
      + (o.unidade ? '<small>' + esc(o.unidade) + '</small>' : '') + '</div>'
      + (o.estado ? '<div class="ind-s">' + o.estado + '</div>' : '')
      + '<div class="ind-seta">'
      + (tipo === 'DEMONSTRAÇÃO' ? 'Porque n&atilde;o &eacute; real &rarr;' : 'Como se chega a este n&uacute;mero &rarr;')
      + '</div></button>';
  }

  function linha(lista) {
    return '<div class="ind-linha">' + lista.map(cartao).join('') + '</div>';
  }

  /* ---- o painel ---- */
  function painel() {
    if (document.getElementById('ind-fundo')) return;
    var d = document.createElement('div');
    d.id = 'ind-fundo';
    d.innerHTML = '<div id="ind-cx"></div>';
    document.body.appendChild(d);
    d.addEventListener('click', function (e) { if (e.target === d) fechar(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fechar(); });
  }
  function fechar() {
    var f = document.getElementById('ind-fundo');
    if (f) f.classList.remove('on');
  }

  function abrir(id) {
    var o = REGISTO[id];
    if (!o) return;
    painel();
    var tipo = o.tipo || 'DEMONSTRAÇÃO';
    var c = COR[tipo] || '#5E7189';
    var h = '<div class="ind-cab"><h3>' + o.rotulo + '</h3>'
      + '<p>' + (o.resumo || '') + '</p>'
      + '<span class="ind-marca" style="position:static;display:inline-block;margin-top:11px;color:' + c
      + ';border-color:' + c + '55;background:' + c + '12">' + esc(tipo) + '</span></div>';

    if (tipo === 'DEMONSTRAÇÃO') {
      h += '<div class="ind-nota r"><b>Este n&uacute;mero n&atilde;o &eacute; real.</b> '
        + (o.porqueNaoEReal || 'Est&aacute; escrito &agrave; m&atilde;o no ficheiro de demonstra&ccedil;&atilde;o e n&atilde;o deriva de nenhuma fonte.')
        + '</div>';
      if (o.oQueFalta) {
        h += '<div class="ind-bd">'
          + '<div class="ind-row"><span>O que falta para o calcular</span><span style="font-family:Inter,sans-serif;color:#E8BE7A">'
          + o.oQueFalta + '</span></div>'
          + (o.quemDetem ? '<div class="ind-row"><span>Quem det&eacute;m o dado</span><span style="font-family:Inter,sans-serif">'
            + o.quemDetem + '</span></div>' : '')
          + '</div>';
      }
    } else {
      if (o.formula) {
        h += '<div class="ind-bd"><div class="ind-row"><span>C&aacute;lculo</span><span style="font-family:Inter,sans-serif">'
          + o.formula + '</span></div>'
          + (o.componentes || []).map(function (x) {
              return '<div class="ind-row"><span>' + x[0] + '</span><span>' + num(x[1])
                + (x[2] ? ' <span style="color:#5E7189">' + esc(x[2]) + '</span>' : '') + '</span></div>';
            }).join('')
          + '</div>';
      }
      if (o.leitura) h += '<div class="ind-nota i"><b>A leitura.</b> ' + o.leitura + '</div>';
    }

    h += '<div class="ind-pe"><span>'
      + (o.fonte ? '<b style="color:#8FA1B8">Fonte:</b> ' + o.fonte : 'Sem fonte declarada')
      + (o.dataDados ? ' &middot; <b style="color:#8FA1B8">Dados de:</b> ' + o.dataDados : '')
      + (o.ecra ? '<br><a href="' + esc(o.ecra) + '">Abrir o ecr&atilde; onde este indicador vive &rarr;</a>' : '')
      + '</span><button id="ind-fechar">Fechar</button></div>';

    document.getElementById('ind-cx').innerHTML = h;
    document.getElementById('ind-fundo').classList.add('on');
    var b = document.getElementById('ind-fechar');
    if (b) b.addEventListener('click', fechar);
  }

  /* Um só escutador no documento: os cartões podem ser redesenhados
     à vontade sem perder o clique. */
  function iniciar() {
    estilo();
    if (global.__indLigado) return;
    global.__indLigado = true;
    document.addEventListener('click', function (e) {
      var alvo = e.target && e.target.closest ? e.target.closest('[data-ind]') : null;
      if (alvo) { e.preventDefault(); abrir(alvo.dataset.ind); }
    });
  }

  /* Faixa de aviso quando o ecrã mostra indicadores de demonstração.
     Conta-os e diz quantos são, para ninguém ter de adivinhar. */
  function faixaDemonstracao(quantos, total) {
    if (!quantos) return '';
    return '<div style="padding:13px 16px;border-radius:11px;border:1px solid rgba(239,68,68,.35);'
      + 'background:rgba(239,68,68,.07);margin-bottom:15px;font-size:12px;line-height:1.6;color:#FFB4B4">'
      + '<b>' + quantos + ' de ' + total + ' indicadores deste ecr&atilde; s&atilde;o de demonstra&ccedil;&atilde;o.</b> '
      + 'Est&atilde;o marcados a tracejado. Carregue em qualquer um para ver porque n&atilde;o &eacute; real '
      + 'e o que falta para o calcular.</div>';
  }

  global.IndicadoresSinagepe = {
    cartao: cartao, linha: linha, iniciar: iniciar, abrir: abrir,
    fechar: fechar, faixaDemonstracao: faixaDemonstracao, registo: REGISTO
  };
})(window);
