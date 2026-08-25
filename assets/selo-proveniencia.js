/* ============================================================
   SELO DE PROVENIÊNCIA — SINAGEPE
   ------------------------------------------------------------
   Problema que resolve: o data/sinagepe-data.json declara-se
   "modo": "SIMULADO" no cabeçalho, mas essa declaração nunca
   chegava aos ecrãs. Quem abria o Portal de Bancos via 2,1 mil
   milhões de meticais de crédito e o nome de uma empresa, sem
   qualquer indicação de que os números eram de demonstração.

   A honestidade estava no ficheiro e perdia-se na apresentação.

   A partir daqui, qualquer ecrã que carregue este ficheiro ganha
   uma faixa no topo enquanto a fonte estiver em modo simulado.
   Quando os dados passarem a reais, muda-se uma palavra no JSON
   e a faixa desaparece de todos os ecrãs ao mesmo tempo.

   Uso no ecrã (sem os sinais de menor/maior, para este comentário
   não fechar o bloco se o ficheiro for colado dentro de uma página):
     script src="assets/selo-proveniencia.js"
     ... SeloProveniencia.aplicar();            (lê sinagepe-data.json)
     ... SeloProveniencia.aplicar({modo:'SIMULADO', bloco:'portalBancos'});
   ============================================================ */
(function (global) {
  'use strict';

  var ID = 'selo-proveniencia';

  /* Rótulo por bloco, para a faixa dizer o que em concreto é simulado. */
  var BLOCOS = {
    portalBancos: 'crédito, empresas candidatas e classificação de risco',
    dashboardBancoCentral: 'pressão cambial, reservas e intervenções propostas',
    portalInvestidores: 'oportunidades, retorno estimado e simulador',
    portalEmpresas: 'quotas, benchmarks e recomendações de compra',
    portalProdutores: 'indicadores do produtor',
    portalComerciantes: 'indicadores do comerciante',
    portalTransportadores: 'indicadores do transportador',
    marketplace: 'ofertas e procuras',
    dashboardFinancas: 'execução e receita',
    dashboardAgricultura: 'produção e campanha',
    dashboardTransportes: 'fluxos e frota',
    dashboardIGSAE: 'inspecções',
    dashboardARC: 'concorrência e preços',
    balancoNacional: 'existências e cobertura por produto',
    alertasDetalhe: 'alertas activos'
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function estilo() {
    if (document.getElementById(ID + '-css')) return;
    var e = document.createElement('style');
    e.id = ID + '-css';
    e.textContent = [
      '#' + ID + '{position:sticky;top:0;z-index:9000;display:flex;align-items:center;gap:12px;',
      'padding:9px 18px;background:linear-gradient(90deg,rgba(240,169,38,.16),rgba(240,169,38,.07));',
      'border-bottom:1px solid rgba(240,169,38,.42);color:#F0A926;font-family:Inter,sans-serif;',
      'font-size:11.5px;line-height:1.5;flex-wrap:wrap}',
      '#' + ID + ' b{letter-spacing:.13em;text-transform:uppercase;font-size:10px;',
      'border:1px solid rgba(240,169,38,.5);padding:3px 9px;border-radius:3px;flex-shrink:0}',
      '#' + ID + ' span{flex:1;min-width:200px;color:#F3D9A6}',
      '#' + ID + ' i{font-style:normal;color:#B99248;font-size:10.5px;flex-shrink:0}',
      '@media print{#' + ID + '{position:static;background:#fff;color:#8C2F22;border-color:#8C2F22}}'
    ].join('');
    document.head.appendChild(e);
  }

  function desenhar(modo, bloco, quando) {
    if (document.getElementById(ID)) return;
    estilo();
    var d = document.createElement('div');
    d.id = ID;
    var oque = BLOCOS[bloco];
    d.innerHTML = '<b>Dados simulados</b>'
      + '<span>Os números deste ecrã' + (oque ? ' &mdash; ' + esc(oque) + ' &mdash;' : '')
      + ' são de demonstração e não devem ser citados nem usados para decidir. '
      + 'A fonte declara-se em modo <span style="font-family:IBM Plex Mono,monospace">'
      + esc(modo) + '</span>.</span>'
      + (quando ? '<i>Actualização declarada: ' + esc(quando) + '</i>' : '');
    /* Antes de tudo o resto, para ser a primeira coisa que se lê. */
    if (document.body.firstChild) document.body.insertBefore(d, document.body.firstChild);
    else document.body.appendChild(d);
  }

  function remover() {
    var d = document.getElementById(ID);
    if (d && d.parentNode) d.parentNode.removeChild(d);
  }

  /* Modos que contam como "não é real". Qualquer outro valor não gera faixa. */
  function eSimulado(modo) {
    var m = String(modo || '').toUpperCase();
    return m === 'SIMULADO' || m === 'DEMONSTRACAO' || m === 'DEMONSTRAÇÃO' || m === 'TESTE' || m === 'DEMO';
  }

  /* Se lhe passarem o modo, usa-o. Senão vai lê-lo ao ficheiro central. */
  function aplicar(opcoes) {
    var o = opcoes || {};
    if (o.modo != null) {
      if (eSimulado(o.modo)) desenhar(o.modo, o.bloco, o.quando);
      return Promise.resolve(eSimulado(o.modo));
    }
    return fetch('data/sinagepe-data.json', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        var m = j && j.meta ? j.meta.modo : null;
        if (eSimulado(m)) { desenhar(m, o.bloco, j.meta.ultimaActualizacao); return true; }
        return false;
      })
      .catch(function () { return false; });
  }

  global.SeloProveniencia = { aplicar: aplicar, remover: remover, eSimulado: eSimulado, blocos: BLOCOS };
})(window);
