/* ============================================================================
   FONTE DE DADOS — camada de abstracção
   ----------------------------------------------------------------------------
   O sistema tem 49 ecrãs e cada um vai buscar os seus dados directamente a
   ficheiros JSON, com fetch('data/x.json'). Isso funciona num sítio estático
   e impede a passagem para servidor: mudar a origem obrigaria a alterar os
   49 ecrãs, um a um.

   Este ficheiro resolve isso interceptando o fetch. Nenhum ecrã precisa de
   ser alterado. Quando houver servidor, muda-se a configuração aqui e todo
   o sistema passa a consumir a interface programática.

   COMO SE MUDA PARA SERVIDOR
   --------------------------
   Basta definir, antes de carregar os outros ficheiros:

       window.SINAGEPE_FONTE = {
         modo: 'api',
         base: 'https://api.exemplo.mz/v1',
         token: function(){ return sessionStorage.getItem('sinagepe_token'); }
       };

   E o pedido a data/armazens-nacionais.json passa a ir a
   https://api.exemplo.mz/v1/armazens-nacionais, com o cabeçalho de
   autorização. Os ecrãs não sabem a diferença.

   O QUE ESTA CAMADA NÃO RESOLVE
   -----------------------------
   Não torna o sistema seguro. Enquanto for um sítio estático, o controlo de
   acesso é JavaScript no navegador e qualquer pessoa pode descarregar os
   ficheiros de dados directamente. Segurança real exige que os dados deixem
   de estar no repositório público — e isso é a migração, não esta camada.

   Esta camada só garante que a migração é uma mudança de configuração e não
   a reescrita de 49 ecrãs.
   ========================================================================= */
(function (global) {
  'use strict';

  var CFG = global.SINAGEPE_FONTE || { modo: 'estatico' };

  /* Contrato: cada ficheiro de dados corresponderá a um recurso da interface
     programática. O nome é o mesmo, sem extensão. Quando o servidor existir,
     estes são os recursos que tem de servir. */
  var RECURSOS = [
    'armazens-nacionais', 'farmacias-anarme', 'rede-viaria', 'rede-comercial',
    'sima-precos', 'cascata-precos', 'antecipacao', 'adesao-institucional',
    'governanca-dado', 'identificacao-gs1', 'medicamentos-cadeia',
    'produtores-agrarios', 'fontes-externas', 'fontes-internacionais',
    'indicadores-painel', 'indicadores-provinciais-ine', 'ipc-ine',
    'campanha-agraria-maap', 'bau-licenciamento', 'comercio-externo',
    'pedsa-enquadramento', 'infraestrutura-armazenagem-serie',
    'rede-logistica', 'sinagepe-data'
  ];

  /* Recursos que, num servidor, exigiriam autenticação por perfil.
     Hoje não exigem nada, porque não há servidor — e é por isso que
     nenhum dado individualizado deve entrar no sistema antes da migração. */
  var POR_PERFIL = {
    'comercio-externo': 'público — apenas agregados',
    'rede-comercial': 'público — entidades identificadas, sem relações comerciais',
    'adesao-institucional': 'institucional',
    'governanca-dado': 'público'
  };

  var fetchOriginal = global.fetch ? global.fetch.bind(global) : null;

  function recursoDe(url) {
    var m = String(url).match(/data\/([a-z0-9\-]+)\.json/);
    return m ? m[1] : null;
  }

  function urlDe(recurso) {
    if (CFG.modo === 'api' && CFG.base) {
      return String(CFG.base).replace(/\/+$/, '') + '/' + recurso;
    }
    return 'data/' + recurso + '.json';
  }

  function cabecalhos() {
    var h = { 'Accept': 'application/json' };
    if (CFG.modo === 'api' && typeof CFG.token === 'function') {
      var t = CFG.token();
      if (t) h['Authorization'] = 'Bearer ' + t;
    }
    return h;
  }

  /* Intercepta apenas os pedidos a data/*.json. Tudo o resto passa
     intacto — tipos de letra, imagens, qualquer outra coisa. */
  if (fetchOriginal) {
    global.fetch = function (url, opcoes) {
      var r = recursoDe(url);
      if (!r) return fetchOriginal(url, opcoes);
      var o = opcoes || {};
      if (CFG.modo === 'api') {
        o = { method: 'GET', headers: cabecalhos(), cache: 'no-store' };
      }
      return fetchOriginal(urlDe(r), o);
    };
  }

  /* Diagnóstico: permite a qualquer ecrã saber em que modo está,
     e permite ao verificador confirmar que a camada está activa. */
  global.FonteDados = {
    modo: CFG.modo,
    base: CFG.base || null,
    recursos: RECURSOS,
    porPerfil: POR_PERFIL,
    url: urlDe,
    estado: function () {
      return {
        modo: CFG.modo,
        recursos: RECURSOS.length,
        autenticacao: (CFG.modo === 'api' && typeof CFG.token === 'function')
          ? 'por token' : 'nenhuma',
        aviso: CFG.modo === 'estatico'
          ? 'Sítio estático. Os ficheiros de dados são públicos e descarregáveis por quem ' +
            'souber o endereço. Nenhum dado individualizado deve entrar no sistema antes ' +
            'da migração para servidor.'
          : 'Modo servidor. O controlo de acesso é do servidor, não do navegador.'
      };
    }
  };
})(window);
