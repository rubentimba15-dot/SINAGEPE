/* ============================================================================
   INDEPENDÊNCIA DAS FONTES
   ----------------------------------------------------------------------------
   Duas publicações que reproduzem a mesma fonte primária não são duas
   confirmações. São uma voz repetida.

   Este motor existe por causa de um erro concreto. O sistema registou uma
   divergência entre o PICA de 2013 e o quadro do INE de 2022 sobre a
   capacidade nacional de armazenagem. As duas publicações citam o ICM como
   fonte original. Não eram duas fontes a discordar: era a mesma origem a
   dizer coisas diferentes em anos diferentes.

   A correcção mudou a conclusão, e mudou-a para pior: a capacidade de
   armazenagem de Moçambique tem UMA fonte. Se o ICM estiver errado,
   ninguém o corrige.

   O QUE ESTE MOTOR FAZ
   --------------------
   Recebe um conjunto de referências e devolve quantas ORIGENS PRIMÁRIAS
   distintas existem — não quantas publicações. É a contagem que interessa.

   O QUE NÃO FAZ
   -------------
   Não adivinha a origem. Cada fonte tem de declarar a sua, no campo
   origemPrimaria ou fonteOriginalDeclarada. Uma fonte que não declara
   origem é tratada como origem própria, e isso fica assinalado — porque
   pode estar a esconder uma cadeia.
   ========================================================================= */
(function (global) {
  'use strict';

  /* Instituições que produzem dados primários em Moçambique, com o que medem.
     Serve para reconhecer a origem quando ela é citada em texto livre. */
  var PRODUTORES = [
    { sigla: 'ICM',       nome: 'Instituto de Cereais de Moçambique',
      mede: 'armazenagem, silos, comercialização agrícola' },
    { sigla: 'INE',       nome: 'Instituto Nacional de Estatística',
      mede: 'censos, inquéritos, preços, comércio externo' },
    { sigla: 'ANE',       nome: 'Administração Nacional de Estradas',
      mede: 'rede viária, interrupções' },
    { sigla: 'ANARME',    nome: 'Autoridade Nacional Reguladora de Medicamentos',
      mede: 'licenciamento de farmácias' },
    { sigla: 'ARENE',     nome: 'Autoridade Reguladora de Energia',
      mede: 'preços regulados de combustível' },
    { sigla: 'SIMA',      nome: 'Sistema de Informação de Mercados Agrários',
      mede: 'preços por praça e fluxos' },
    { sigla: 'MAAP',      nome: 'Ministério da Agricultura, Ambiente e Pescas',
      mede: 'campanha agrária, produção' },
    { sigla: 'BAU',       nome: 'Balcão de Atendimento Único',
      mede: 'licenciamento comercial e industrial' },
    { sigla: 'IPC',       nome: 'Integrated Food Security Phase Classification',
      mede: 'fases de insegurança alimentar' },
    { sigla: 'FAO',       nome: 'Organização das Nações Unidas para a Alimentação',
      mede: 'insegurança alimentar, deslocação' },
    { sigla: 'WFP',       nome: 'Programa Mundial Alimentar',
      mede: 'assistência alimentar' },
    { sigla: 'SETSAN',    nome: 'Secretariado Técnico de Segurança Alimentar e Nutricional',
      mede: 'coordenação da avaliação de vulnerabilidade' },
    { sigla: 'BM',        nome: 'Banco de Moçambique',
      mede: 'câmbio, reservas, balança de pagamentos' },
    { sigla: 'ALFÂNDEGAS', nome: 'Autoridade Tributária — Alfândegas',
      mede: 'importações e exportações' }
  ];

  function normalizar(s) {
    return String(s || '')
      .normalize ? String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()
                 : String(s || '').toUpperCase();
  }

  /* Procura uma sigla de produtor no texto da fonte. */
  function origemDe(fonte) {
    if (!fonte) return null;
    if (fonte.origemPrimaria) return fonte.origemPrimaria;
    var texto = normalizar(
      (fonte.fonteOriginalDeclarada || '') + ' ' + (fonte.fonte || fonte.publicacao || fonte));
    for (var i = 0; i < PRODUTORES.length; i++) {
      var s = normalizar(PRODUTORES[i].sigla);
      if (texto.indexOf(s) >= 0) return PRODUTORES[i].sigla;
    }
    return null;
  }

  /* Conta origens primárias distintas, não publicações. */
  function confirmacoesIndependentes(fontes) {
    var origens = {}, semOrigem = 0, cadeias = [];
    (fontes || []).forEach(function (f) {
      var o = origemDe(f);
      if (o) {
        if (!origens[o]) origens[o] = [];
        origens[o].push(f.publicacao || f.fonte || String(f));
      } else {
        semOrigem++;
      }
    });
    Object.keys(origens).forEach(function (o) {
      if (origens[o].length > 1) {
        cadeias.push({
          origem: o,
          publicacoes: origens[o],
          nota: origens[o].length + ' publicações reproduzem ' + o +
                '. Contam como uma confirmação, não ' + origens[o].length + '.'
        });
      }
    });
    var n = Object.keys(origens).length + semOrigem;
    return {
      publicacoes: (fontes || []).length,
      origensDistintas: Object.keys(origens).length,
      semOrigemDeclarada: semOrigem,
      confirmacoes: n,
      cadeias: cadeias,
      independente: Object.keys(origens).length > 1,
      leitura: cadeias.length
        ? (function () {
            var n = Object.keys(origens).length;
            return 'Há ' + (fontes || []).length + ' publicações mas só ' + n +
              (n > 1 ? ' origens primárias' : ' origem primária') + '. ' +
              'Publicações que citam a mesma origem não se confirmam entre si.';
          })()
        : 'Cada publicação tem origem própria.',
      aviso: semOrigem
        ? semOrigem + ' fonte' + (semOrigem > 1 ? 's' : '') + ' sem origem declarada. ' +
          'Tratada como origem própria, o que pode estar a esconder uma cadeia.'
        : null
    };
  }

  /* Avalia uma divergência: se as fontes que discordam têm a mesma origem,
     a discordância é de outra natureza — e a conclusão muda. */
  function avaliarDivergencia(div) {
    var r = confirmacoesIndependentes(div.valores || []);
    return {
      assunto: div.assunto,
      publicacoes: r.publicacoes,
      origensDistintas: r.origensDistintas,
      mesmaOrigem: r.origensDistintas === 1,
      origem: r.origensDistintas === 1 && Object.keys(r.cadeias).length
        ? r.cadeias[0].origem : null,
      leitura: r.origensDistintas === 1
        ? 'As publicações que divergem têm a mesma origem primária. ' +
          'Não são duas fontes a discordar: é a mesma origem a dizer coisas diferentes. ' +
          'Só ela pode esclarecer, porque é a única que mede.'
        : 'As publicações têm origens distintas. A divergência é entre medições independentes.',
      confirmacoesIndependentes: r.origensDistintas === 1 ? 0 : r.origensDistintas
    };
  }

  global.IndependenciaFontes = {
    produtores: PRODUTORES,
    origemDe: origemDe,
    confirmacoesIndependentes: confirmacoesIndependentes,
    avaliarDivergencia: avaliarDivergencia,
    regra: 'Duas publicações que reproduzem a mesma fonte primária não contam como ' +
           'duas confirmações. Contam como uma voz repetida.'
  };
})(window);
