# -*- coding: utf-8 -*-
"""
AUDITORIA DE REGRESSÃO — SINAGEPE
Verifica, ecrã a ecrã, se as funcionalidades já conquistadas continuam lá.
Cada linha da tabela é uma coisa que uma vez funcionou. Se deixar de funcionar,
esta auditoria diz qual e onde.
"""
import io, os, re, json, glob

B = '/mnt/user-data/outputs'
def ler(f):
    p = os.path.join(B, f)
    return io.open(p, encoding='utf-8').read() if os.path.exists(p) else None

# ecrã -> lista de (nome da capacidade, teste)
ECRAS_COM_BARRA = ['mapa-integrado.html','armazens-nacionais.html','ponto-cego-duplo.html',
 'sandbox-rastreabilidade.html','centro-antecipacao.html','adesao-institucional.html',
 'portal-produtores.html','portal-transportadores.html','governanca-dado.html','balanco-visual.html',
 'ficha-detalhe.html']

CAP = {}
for f in ECRAS_COM_BARRA:
    CAP[f] = [
      ('guarda de sessão',      lambda s: 'assets/access-control.js' in s),
      ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
      ('barra montada',         lambda s: 'SinagepeNav.montar' in s),
      ('sem barra à mão',       lambda s: s.count('class="nav-item') <= 1),
      ('pesquisa global',       lambda s: 'assets/pesquisa-sinagepe.js' in s and 'SinagepePesquisa.iniciar' in s),
    ]
CAP['mapa-integrado.html'].append(('camada de fluxos', lambda s: 'desenharFluxos' in s and 'gflux' in s))
CAP['mapa-integrado.html'].append(('navios ilustrativos', lambda s: 'function navio(' in s and 'gnav' in s))
CAP['mapa-integrado.html'].append(('navios sem rótulo', lambda s: 'PORTOS_NAV' in s and 'Ilustração, não informação' in s))
CAP['portal-produtores.html'].append(('preços do SIMA', lambda s: 'sima-precos' in s and 'desenharSima' in s))
CAP['portal-produtores.html'].append(('cadeia produtor-retalho', lambda s: 'desenharCadeia' in s))
CAP['portal-produtores.html'].append(('fluxos por província', lambda s: 'desenharFluxosSima' in s and 'if(ST.sima) desenharFluxosSima()' in s))

CAP['dashboard-banco-central.html'] = [
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('indicadores com origem',lambda s: 'IndicadoresSinagepe.linha' in s),
  ('sem recomendação de intervenção', lambda s: 'intervencao' not in s.split('porqueNaoEReal')[0]
     and 'necessidadeDivisas' not in s),
  ('sem índice de pressão',  lambda s: 'pressaoCambialIndex' not in s),
  ('lê dados verificados',   lambda s: 'sima-precos' in s and 'cascata-precos' in s),
  ('diz que não recomenda',  lambda s: 'recomenda interven' in s),
  ('limites declarados',     lambda s: 'var LIMITES' in s),
]

CAP['portal-transportadores.html'] = [
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('indicadores com origem',lambda s: 'assets/indicadores-sinagepe.js' in s
     and 'IndicadoresSinagepe.linha' in s),
  ('cartões abrem ao clique', lambda s: 'IndicadoresSinagepe.iniciar' in s),
  ('gasóleo com fórmula',   lambda s: "id:'tr-gasoleo'" in s and 'componentes:' in s),
  ('cortes com detalhe',    lambda s: "id:'tr-cortes-prov'" in s
     and "id:'tr-sem-alternativa'" in s),
  ('avisa que ausência não é garantia', lambda s: 'n&atilde;o &eacute; garantia de via aberta' in s),
]

CAP['portal-bancos.html'] = [
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('indicadores com origem',lambda s: 'IndicadoresSinagepe.linha' in s),
  ('sem empresas nomeadas', lambda s: 'empresasCandidatas' not in s and 'scoreIA' not in s),
  ('sem carteira inventada',lambda s: 'creditoHomologado' not in s and 'inadimplencia' not in s),
  ('lê cadastros reais',    lambda s: 'armazens-nacionais' in s and 'farmacias-anarme' in s),
  ('selo de proveniência',  lambda s: 'SeloProveniencia.aplicar' in s),
  ('limites declarados',    lambda s: 'var LIMITES' in s),
]

CAP['portal-empresas.html'] = [
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('indicadores com origem',lambda s: 'IndicadoresSinagepe.linha' in s),
  ('sem recomendações de IA', lambda s: 'recomendacoes' not in s and 'confianca' not in s),
  ('sem benchmarks inventados', lambda s: 'benchmarks' not in s and 'faixaQuota' not in s),
  ('assenta em preços reais', lambda s: 'sima-precos' in s and 'retalho1462' in s),
  ('ilustrações de produto',lambda s: 'ProdutosVisual.svg' in s),
  ('limites declarados',    lambda s: 'var LIMITES' in s),
]

CAP['portal-investidores.html'] = [
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('indicadores com origem',lambda s: 'assets/indicadores-sinagepe.js' in s and 'IndicadoresSinagepe.linha' in s),
  ('sem ROI inventado',     lambda s: 'oportunidades' not in s and '% ROI' not in s),
  ('sem simulador de IA',   lambda s: 'sim-retorno' not in s and 'Simulador de Retorno (IA)' not in s),
  ('sem "seguro garantido" activo', lambda s: 'Seguro Gar' not in s.split('porqueNaoEReal')[0]),
  ('lê cadastros reais',    lambda s: 'armazens-nacionais' in s and 'cascata-precos' in s),
  ('diz que é matéria regulada', lambda s: 'mat&eacute;ria regulada' in s),
  ('diz o que não pode dar', lambda s: 'var LIMITES' in s),
]

CAP['simulador-preditivo.html'] = [
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('sem balanço inventado', lambda s: 'balancoNacional' not in s),
  ('sem projecção a 120 dias', lambda s: 'cobCen' not in s and 'stockCen' not in s),
  ('encaminha, não duplica',lambda s: 'centro-antecipacao.html' in s
     and 'simulador-importacoes.html' in s),
  ('explica a cadeia partida', lambda s: 'Porque foi retirado' in s and 'class="cadeia"' in s),
  ('diz que pode voltar',   lambda s: 'este simulador pode voltar' in s),
]

CAP['index.html'] = [
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'id="nav-mount"' in s),
  ('barra montada no fim',  lambda s: s.rfind('function montarNavegacao') > s.rfind("login-submit')")),
  ('sem barra à mão',       lambda s: s.count('class="nav-item') == 0),
  ('pesquisa global',       lambda s: 'assets/pesquisa-sinagepe.js' in s and 'SinagepePesquisa.iniciar' in s),
  ('autenticação PBKDF2',   lambda s: 'PBKDF2' in s and 'deriveBits' in s),
  ('modo demo desligado',   lambda s: 'const MODO_DEMO = false;' in s),
  ('aviso demo por código', lambda s: "av.id = 'aviso-demo'" in s and 'MODO DEMONSTRAÇÃO ACTIVO</b>' not in s.split('<script')[0]),
  ('versão sem contradição',lambda s: 'v3.4.1 — Oficial' not in s),
  ('18 parceiros',          lambda s: len(json.loads(re.search(r'const NIVEIS_ACESSO = (\[.*?\n\]);',s,re.S).group(1))) == 18),
  ('nenhum perfil com menos de 5 ecrãs', lambda s: all(len(n['paginas'])>=5 for n in json.loads(re.search(r'const NIVEIS_ACESSO = (\[.*?\n\]);',s,re.S).group(1)))),
  ('bancos com cadastro e logística', lambda s: (lambda n: 'armazens-nacionais.html' in n['paginas'] and 'rede-logistica.html' in n['paginas'])(
      [x for x in json.loads(re.search(r'const NIVEIS_ACESSO = (\[.*?\n\]);',s,re.S).group(1)) if x['chave']=='bancos'][0])),
  ('MAAP e não MASA',       lambda s: '"instituicao": "MAAP"' in s),
  ('bloqueio por tentativas',lambda s: 'sinagepe_bloqueio' in s),
  ('logout tolerante',      lambda s: "closest('#btn-logout')" in s),
  ('sem getElementById frágil', lambda s: not re.search(r"document\.getElementById\('(btn-logout|nav-[a-z-]+)'\)\.", s)),
]
CAP['lista-de-acessos.html'] = [
  ('guarda de sessão',      lambda s: 'assets/access-control.js' in s),
  ('tabela gerada do index',lambda s: "fetch('index.html'" in s),
  ('não diz 17 contas',     lambda s: '17 contas' not in s),
  ('não diz qualquer texto',lambda s: 'qualquer texto' not in s),
]
CAP['relatorio-executivo.html'] = [
  ('guarda de sessão',      lambda s: 'assets/access-control.js' in s),
  ('CSS de impressão A4',   lambda s: '@page{size:A4' in s or '@page {' in s),
  ('exportação CSV',        lambda s: 'b-csv' in s and 'text/csv' in s),
  ('exportação JSON',       lambda s: 'b-json' in s),
  ('secção do que falta',   lambda s: 'não é conhecido' in s or 'n&atilde;o &eacute; conhecido' in s),
  ('8 secções',             lambda s: s.count('class="num">') >= 8),
  ('série do SIMA',         lambda s: 'sima-precos' in s and 'Preços e mercados' in s),
  ('recomendações',         lambda s: 'Recomendações' in s and 'menor esforço e maior impacto' in s),
  ('idade dos dados',       lambda s: 'Idade dos dados' in s),
  ('pesquisa global',       lambda s: 'assets/pesquisa-sinagepe.js' in s),
]
CAP['rede-logistica.html'] = [
  ('guarda de sessão',      lambda s: 'assets/access-control.js' in s),
  ('lê cadastro nacional',  lambda s: 'armazens-nacionais.json' in s),
  ('sem estado simulado',   lambda s: "'simulado'" not in s),
  ('conta só sensores reais',lambda s: "conta('activo')+conta('simulado')" not in s),
]
CAP['simulador-preditivo.html'] = [
  ('guarda de sessão',      lambda s: 'assets/access-control.js' in s),
  # As duas guardas abaixo protegiam o motor do simulador preditivo, que
  # assentava em stock inventado e foi retirado de serviço em Agosto de 2026.
  # O ecrã passou a encaminhar; as guardas deixaram de ter objecto.
]
CAP['verificador-ecras.html'] = [
  ('guarda de sessão',      lambda s: 'assets/access-control.js' in s),
  ('testa os 81 ecrãs',     lambda s: 'NIVEIS_ACESSO' in s),
  ('detecta sem guarda',    lambda s: 'SEM access-control' in s),
]

for _f, _k in [('fontes-nacionais.html','fontes-externas.json'),
               ('fontes-internacionais.html','GTIN')]:
  CAP[_f] = [
    ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'SinagepeNav.montar' in s),
    ('pesquisa global',       lambda s: 'assets/pesquisa-sinagepe.js' in s),
    ('sem "tempo real"',      lambda s: 'tempo real' not in s),
    ('sem links mortos',      lambda s: s.count('href="#"') == 0),
    ('links externos reais',  lambda s: s.count('https://') >= 5),
  ]
CAP['fontes-nacionais.html'].append(
  ('ressalva de infracção',  lambda s: 'prova de infrac' in s))
CAP['fontes-internacionais.html'].append(
  ('nota do prefixo GS1',    lambda s: 'prefixo nacional continua por atribuir' in s))

CAP['index.html'] = [
  ('sem "Tempo Real" no hero', lambda s: 'Abastecimento em Tempo Real' not in s),
  ('sem "Garantindo"',      lambda s: 'Garantindo a estabilidade' not in s),
  ('sem disponibilidade inventada', lambda s: 'disponibilidadeNacional' not in s),
  ('sem cobertura inventada', lambda s: 'diasCoberturaMedia' not in s),
  ('sem importações inventadas', lambda s: 'importacoesTransito' not in s),
  ('sem balanço inventado', lambda s: 'balancoNacional' not in s),
  ('sem índice logístico inventado', lambda s: 'indiceLogisticoNacional' not in s),
  ('carrega dados verificados', lambda s: 'function carregarReais' in s
     and 'armazens-nacionais' in s and 'farmacias-anarme' in s),
  ('diz o que não se sabe', lambda s: 'n&atilde;o se sabe' in s or 'não se sabe' in s),
  ('indicadores levam ao detalhe', lambda s: 'monitorizacao-em-falta.html' in s
     and 'cadastro-armazens.html' in s),
]

CAP['assets/produtos-visual.js'] = [
  ('13 produtos com tom próprio', lambda s: s.count("a:'#") >= 12),
  ('saco com base larga',   lambda s: 'Contorno calculado ponto a ponto' in s),
  ('espiga com grãos em fiadas', lambda s: 'function espiga' in s and 'desloc' in s),
  ('cimento com forma própria', lambda s: 'function cimento' in s),
  ('grão derramado por forma', lambda s: "forma === 'longo'" in s and "forma === 'rim'" in s),
  ('gradiente de volume',   lambda s: 'function defs' in s and 'radialGradient' in s),
  ('fotografia tem prioridade', lambda s: 'Fotografia primeiro' in s),
]

CAP['painel-nacional.html'] = [
  ('ilustração por produto', lambda s: 'ProdutosVisual.svg' in s),
  ('estados de cadastro',   lambda s: 'function desenharEstadosCadastro' in s),
  ('lê a rede comercial',   lambda s: 'rede-comercial' in s and 'function desenharRedeComercial' in s),
  ('indicador de operadores comerciais', lambda s: "id:'pn-comercio'" in s),
  ('distingue declarado de cadastrado', lambda s: 'locais declarados pelos operadores' in s
     and 'com morada no sistema' in s),
  ('mostra divergências dos operadores', lambda s: 'divergenciasRegistadas' in s),
  ('estabelecimentos por fonte comercial', lambda s: 'estabelecimentosIdentificados' in s),
  ('declara o limite da matriz', lambda s: 'matriz de quem abastece quem' in s),
  ('não confunde com a rede nacional', lambda s:
     'n&atilde;o a rede comercial de Mo&ccedil;ambique' in s),
  ('conta separadamente',   lambda s: 'confirmada-pelo-titular' in s
     and 'Ningu&eacute;m declarou' in s),
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('indicadores com origem',lambda s: 'assets/indicadores-sinagepe.js' in s and 'IndicadoresSinagepe.linha' in s),
  ('sem disponibilidade inventada', lambda s: 'disponibilidadeNacional' not in s
     and 'diasCoberturaMedia' not in s and 'indiceLogisticoNacional' not in s),
  ('sem balanço inventado',  lambda s: 'balancoNacional' not in s),
  ('províncias clicáveis',   lambda s: 'class="prov entra" href=' in s),
  ('linhas com destino',     lambda s: 'data-ir=' in s and 'stopPropagation' in s),
  ('lê os cinco cadastros', lambda s: all(x in s for x in
     ['armazens-nacionais','farmacias-anarme','rede-viaria','ipc-ine','indicadores-provinciais-ine'])),
  ('mostra dados do INE por província', lambda s: 'esperancaVida2017' in s
     and 'migracaoLiquida2017' in s),
  ('explica a cor',          lambda s: 'lacuna de cadastro' in s),
  ('respeita reduced-motion',lambda s: 'prefers-reduced-motion' in s),
]

CAP['fontes-internacionais.html'] = [
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('indicadores com origem',lambda s: 'IndicadoresSinagepe.linha' in s),
  ('as seis perguntas',     lambda s: 'ondeSinagepeEntra' in s and 'function desenharPerguntas' in s),
  ('camadas próprias na 1.ª pergunta', lambda s: 'camadasProprias' in s),
  ('leitura própria da necessidade', lambda s: 'leituraPropriaDeNecessidade' in s
     and 'leituraPropria' in s),
  # O texto vive no ficheiro de dados; o que se verifica no ecrã é que
  # ele o lê e o desenha.
  ('tese de utilidade pública', lambda s: 'utilidadePublica' in s and 'desenharTese' in s),
  ('série com divergência', lambda s: 'divergenciaRegistada' in s and 'desenharSerie' in s),
  ('contexto SADC',         lambda s: 'contextoRegional' in s and 'desenharRegional' in s),
  ('organizações filtráveis', lambda s: 'function desenharOrgs' in s and 'ST.filtro' in s),
  ('links externos reais',  lambda s: "target=\"_blank\"" in s and 'esc(f.url)' in s),
]

CAP['balanco-visual.html'] = [
  ('cartões clicáveis',    lambda s: 'class="pd" href=' in s),
  ('não repete o mesmo valor', lambda s: 'da capacidade que o guarda' not in s),
  ('lê os preços do SIMA', lambda s: 'sima-precos' in s and 'function precoDe' in s),
  ('correspondência por lista', lambda s: 'var PRECO_DE' in s),
  ('ilustração por produto', lambda s: 'ProdutosVisual.render' in s),
]

CAP['relatorios-central.html'] = [
  ('17 relatórios',        lambda s: s.count("id:'") >= 17),
  ('relatórios que cruzam', lambda s: all(x in s for x in
     ['relFomeOferta','relDivergencias','relExposicao','relCampanha','relDuasLeituras'])),
  ('confronta as duas leituras', lambda s: 'soInternacional' in s and 'soSistema' in s),
  ('lê fontes internacionais', lambda s: 'fontes-internacionais' in s),
  ('devolve divergências',  lambda s: 'não escolhe nenhuma em sil' in s),
]

CAP['series-precos.html'] = [
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('indicadores com origem',lambda s: 'IndicadoresSinagepe.linha' in s),
  ('gráfico da série',      lambda s: 'function desenharGrafico' in s and 'traca' in s),
  ('filtro por produto',    lambda s: 'function desenharFiltros' in s),
  ('ilustrações de produto',lambda s: 'ProdutosVisual.svg' in s),
  ('avisa a idade do dado', lambda s: 'Julho de 2023' in s),
  ('explica a edição 1446', lambda s: 'repete a semana anterior' in s),
]

CAP['indicadores-painel.html'] = [
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('sem secção de retirados', lambda s: 'O que foi retirado' not in s),
  ('sem rasuras',           lambda s: 'line-through' not in s),
  ('fundamenta a utilidade',lambda s: 'Porque importa' in s and 'Que decis&atilde;o permite' in s),
  ('diz quem usa',          lambda s: 'Quem o usa' in s and 'quemUsa' in s),
  ('regras de leitura',     lambda s: 'var REGRAS' in s),
]

CAP['centro-antecipacao.html'] = [
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('indicadores com origem',lambda s: 'IndicadoresSinagepe.linha' in s),
  ('desenha os 10 riscos',  lambda s: 'function desenharRiscos' in s and 'riscosFiltrados' in s),
  ('calendário de 12 meses',lambda s: 'function desenharCalendario' in s and 'cal-m' in s),
  ('cadeia causal',         lambda s: 'Cadeia causal' in s and 'class="cadeia"' in s),
  ('mitigações com campos', lambda s: 'function mitigacao' in s and 'm.horizonte' in s),
  ('filtros por gravidade', lambda s: 'function desenharFiltros' in s),
  ('explica ausência de probabilidade', lambda s: 'percentagem de probabilidade' in s),
]

CAP['inflacao-cobertura.html'] = [
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('indicadores com origem',lambda s: 'assets/indicadores-sinagepe.js' in s and 'IndicadoresSinagepe.linha' in s),
  ('cruza IPC com SIMA',    lambda s: 'ipc-ine' in s and 'sima-precos' in s),
  ('diagrama em SVG',       lambda s: 'desenharVenn' in s and '<circle' in s),
  ('gráfico de colunas',    lambda s: 'desenharGrafico' in s and 'crescerY' in s),
  ('animação com respeito por preferências', lambda s: 'prefers-reduced-motion' in s),
  ('não critica o INE',     lambda s: 'cr&iacute;tica ao m&eacute;todo do INE' in s),
  ('declara o que não prova', lambda s: 'var LIMITES' in s),
]

CAP['actualidade-dados.html'] = [
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('indicadores com origem',lambda s: 'assets/indicadores-sinagepe.js' in s and 'IndicadoresSinagepe.linha' in s),
  ('mede em ciclos',        lambda s: 'var FONTES' in s and 'ciclo:' in s),
  ('assume o problema do SIMA', lambda s: 'Julho de 2023' in s and 'Continuam verdadeiros' in s),
  ('distingue as datas',    lambda s: 'var DATAS' in s and 'Data do facto' in s),
  ('tabela de linguagem',   lambda s: 'var LINGUAGEM' in s),
  ('recusa índice numérico',lambda s: 'Decidido n&atilde;o fazer' in s),
]

CAP['assets/indicadores-sinagepe.js'] = [
  ('motor de actualidade',  lambda s: 'function actualidade' in s and 'PERIODICIDADE' in s),
  ('selo no cartão',        lambda s: 'seloIdade' in s and 'ind-idade' in s),
  ('nota no painel',        lambda s: 'ind-actual' in s),
  ('apanha data futura',    lambda s: 'impossivel' in s and 'data futura' in s),
  ('mede em ciclos, não dias', lambda s: 'ciclos = dias / per.dias' in s),
  ('sem índice numérico',   lambda s: '/100' not in s.split('PERIODICIDADE')[1][:4000]),
]

CAP['dashboard-arc.html'] = [
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('indicadores com origem',lambda s: 'assets/indicadores-sinagepe.js' in s and 'IndicadoresSinagepe.linha' in s),
  ('sem empresas nomeadas', lambda s: 'empresasDominantes' not in s and 'Agrícola Sul' not in s),
  ('sem alerta de cartel',  lambda s: 'alertaCartel' not in s and 'a.alertaCartel' not in s),
  ('sem HHI inventado',     lambda s: 'hhiPorProduto' not in s),
  ('sem "tempo real"',      lambda s: 'Dados em tempo real' not in s),
  ('regras do portal',      lambda s: 'var REGRAS' in s and 'n&atilde;o nomeia empresas' in s),
  ('diz o que precisaria',  lambda s: 'var PRECISA' in s),
]

CAP['dashboard-igsae.html'] = [
  ('cadastro de farmácias', lambda s: 'farmacias-anarme' in s and 'desenharFarmacias' in s),
  ('declara o que não reproduz', lambda s: 'n&atilde;o s&atilde;o reproduzidas' in s),
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('indicadores com origem',lambda s: 'assets/indicadores-sinagepe.js' in s and 'IndicadoresSinagepe.linha' in s),
  ('sem operadores suspeitos', lambda s: 'operadoresSuspeitos' not in s and 'Alpha-MZ' not in s),
  ('sem fiscalizações inventadas', lambda s: 'fiscalizacoesRealizadasMes' not in s),
  ('lê o cadastro real',    lambda s: 'armazens-nacionais' in s),
  ('mostra a cadeia',       lambda s: 'etapasResponsabilidade' in s),
  ('sem "tempo real"',      lambda s: 'Dados em tempo real' not in s),
  ('diz o que teria com protocolo', lambda s: 'var PROTOCOLO' in s),
]

CAP['monitorizacao-em-falta.html'] = [
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('indicadores com origem',lambda s: 'assets/indicadores-sinagepe.js' in s and 'IndicadoresSinagepe.linha' in s),
  ('lê o cadastro real',    lambda s: 'armazens-nacionais.json' in s),
  ('ausência não é infracção', lambda s: 'n&atilde;o uma prova de infrac' in s),
  ('via por natureza jurídica', lambda s: 'var EXIGENCIA' in s and 'Contratual' in s),
  ('diz o que destrava',    lambda s: 'var DESTRAVA' in s),
]

CAP['administracao-auditoria.html'] = [
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('indicadores com origem',lambda s: 'assets/indicadores-sinagepe.js' in s and 'IndicadoresSinagepe.linha' in s),
  ('sem registo fabricado', lambda s: 'registoAuditoria' not in s and 'Muthemba' not in s),
  ('sem fontes "Conectado"',lambda s: 'fontesDados' not in s),
  ('estado real das fontes',lambda s: 'var FONTES' in s and 'ausente' in s),
  ('lê os perfis reais',    lambda s: 'NIVEIS_ACESSO' in s),
  ('secção do que falta',   lambda s: 'var FALTA' in s),
]

CAP['modulo-logistica.html'] = [
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('indicadores com origem',lambda s: 'assets/indicadores-sinagepe.js' in s and 'IndicadoresSinagepe.linha' in s),
  ('assenta em dados reais',lambda s: 'rede-viaria' in s and 'cascata-precos' in s),
  ('sem corredores inventados', lambda s: 'fluxosCorredor' not in s and 'custoLogisticoBreakdown' not in s),
  ('sem IPL sobre demonstração', lambda s: 'calcIPL' not in s),
  ('declara pressupostos',  lambda s: s.count('Valor seu') >= 3),
  ('avisa a data dos cortes', lambda s: 'antes de planear rota' in s),
]

CAP['mapa-nacional.html'] = [
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('encaminha, não duplica',lambda s: 'mapa-integrado.html' in s and 'province-grid' not in s),
  ('explica a consolidação',lambda s: 'Porque foi consolidado' in s),
  ('diz o que se perdeu',   lambda s: 'perdeu na consolida' in s),
]

CAP['relatorios.html'] = [
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('encaminha, não duplica',lambda s: 'relatorios-central.html' in s and 'exportacoesRecentes' not in s),
  ('explica a consolidação',lambda s: 'Porque foi consolidado' in s),
  ('diz o que falta',       lambda s: 'ainda n&atilde;o &eacute; poss&iacute;vel' in s),
]

CAP['inteligencia-consolidada.html'] = [
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('indicadores com origem',lambda s: 'assets/indicadores-sinagepe.js' in s and 'IndicadoresSinagepe.linha' in s),
  ('pressupostos à vista',  lambda s: 'var PRESSUPOSTOS' in s and 'desenharPressupostos' in s),
  ('sem elasticidade inventada', lambda s: 'elasticidadeProcura' not in s.split('Retirado')[0]),
  ('sem stock inventado',   lambda s: 'balancoNacional' not in s),
  ('mantém "não constitui prova"', lambda s: 'constitui prova de infrac' in s),
  ('não verificado não entra', lambda s: 'n&atilde;o entra no c&aacute;lculo' in s),
  ('secção do que não cruza', lambda s: 'var NAO_CRUZA' in s),
  ('diagnóstico por ficheiro', lambda s: 'function carregar' in s and 'devolveu HTML em vez de JSON' in s),
]

CAP['cadastro-armazens.html'] = [
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('indicadores com origem',lambda s: 'assets/indicadores-sinagepe.js' in s and 'IndicadoresSinagepe.linha' in s),
  ('lê o cadastro real',    lambda s: 'armazens-nacionais.json' in s),
  ('sem sensores falsos',   lambda s: 'condicoesConservacao' not in s and 'ocupacaoPercent' not in s),
  ('sem barra à mão',       lambda s: s.count('class="nav-item') == 0),
  ('secção do que não diz', lambda s: 'var NAO_DIZ' in s),
]

CAP['alertas.html'] = [
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('indicadores com origem',lambda s: 'assets/indicadores-sinagepe.js' in s and 'IndicadoresSinagepe.linha' in s),
  ('assenta em antecipacao',lambda s: 'antecipacao.json' in s),
  ('sem confiança em %',    lambda s: 'a.confianca' not in s and 'confidence-badge' not in s),
  ('sem acusação de especulação', lambda s: 'Retenção Especulativa' not in s),
  ('mostra evidência',      lambda s: 'r.evidencia' in s and 'r.gatilho' in s),
  ('secção do que não faz', lambda s: 'var NAO_FAZ' in s),
]

CAP['simulador-importacoes.html'] = [
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('indicadores com origem',lambda s: 'assets/indicadores-sinagepe.js' in s and 'IndicadoresSinagepe.linha' in s),
  ('assenta na cascata real',lambda s: 'cascata-precos' in s and 'sima-precos' in s),
  ('sem "Inteligência MIC"',lambda s: 'Recomendação de Inteligência MIC' not in s and 'recomendacao-ia' not in s),
  ('sem cobertura inventada',lambda s: 'balancoNacional' not in s),
  ('declara pressupostos',  lambda s: s.count('Valor seu') >= 4),
  ('secção do que não faz', lambda s: 'var NAO_FAZ' in s),
]

CAP['portal-publico.html'] = [
  ('indicadores com origem',lambda s: 'assets/indicadores-sinagepe.js' in s and 'IndicadoresSinagepe.linha' in s),
  ('usa dados reais',       lambda s: all(x in s for x in ['sima-precos','cascata-precos','armazens-nacionais','rede-viaria'])),
  ('sem "Abastecimento Garantido"', lambda s: 'Abastecimento Garantido' not in s),
  ('sem "auditados"',       lambda s: 'auditados periodicamente' not in s),
  ('explica a data dos preços', lambda s: 'a recolha continua' in s and 'publica' in s),
  ('secção do que não mostra', lambda s: 'var NAO_MOSTRA' in s),
  ('recusa previsão',       lambda s: 'recusa-se a apresentar' in s),
]

CAP['dashboard-agricultura.html'] = [
  ('campanha agrária do MAAP', lambda s: 'campanha-agraria-maap' in s and 'desenharCampanha' in s),
  ('impacto das cheias',    lambda s: 'desenharCheias' in s),
  ('declara que é previsão',lambda s: 'previs&atilde;o, n&atilde;o medi&ccedil;&atilde;o' in s),
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('indicadores com origem',lambda s: 'assets/indicadores-sinagepe.js' in s and 'IndicadoresSinagepe.linha' in s),
  ('série do SIMA',         lambda s: 'sima-precos' in s and 'desenharGrafico' in s),
  ('sem números à mão',     lambda s: 'dashboardAgricultura' not in s),
  ('explica falhas do gráfico', lambda s: 'propositadas' in s),
]

CAP['portal-comerciantes.html'] = [
  ('guarda de sessão',      lambda s: 'assets/access-control.js' in s),
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('pesquisa global',       lambda s: 'assets/pesquisa-sinagepe.js' in s),
  ('indicadores com origem',lambda s: 'assets/indicadores-sinagepe.js' in s and 'IndicadoresSinagepe.linha' in s),
  ('sem barra à mão',       lambda s: s.count('class="nav-item') == 0),
  ('sem links mortos',      lambda s: s.count('href="#"') == 0),
  ('sem "tempo real"',      lambda s: 'Dados em tempo real' not in s),
  ('usa dados reais SIMA',  lambda s: 'sima-precos' in s and 'cascata-precos' in s),
  ('declara demonstração',  lambda s: 'DEMONSTRA' in s and 'porqueNaoEReal' in s),
  ('tabela de lacunas',     lambda s: 'var LACUNAS' in s),
]

CAP['assets/indicadores-sinagepe.js'] = [
  ('três classificações',   lambda s: all(x in s for x in ['FACTO','ESTIMATIVA','DEMONSTRA'])),
  ('cartões clicáveis',     lambda s: 'data-ind' in s and 'function abrir' in s),
  ('mostra fórmula e fonte',lambda s: 'o.formula' in s and 'o.fonte' in s and 'o.dataDados' in s),
  ('demonstração explica',  lambda s: 'porqueNaoEReal' in s and 'oQueFalta' in s),
  ('faixa de aviso',        lambda s: 'faixaDemonstracao' in s),
  ('fecha com Esc',         lambda s: "e.key === 'Escape'" in s),
]


# ---------------------------------------------------------------------------
# Os nove ecrãs que não tinham verificação nenhuma. Um ecrã sem verificações
# nunca falha na auditoria, e isso não é o mesmo que estar certo.
# ---------------------------------------------------------------------------
CAP['governanca-dado.html'] = [
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('título conta as regras',lambda s: 'n-regras' in s and 'As cinco regras' not in s),
  ('lê o ficheiro de regras',lambda s: 'ST.g.regras' in s),
  ('filtra por estado',     lambda s: "r.estado===" in s),
]

CAP['armazens-nacionais.html'] = [
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('lê o cadastro',         lambda s: 'armazens-nacionais' in s),
  ('sem números à mão',     lambda s: 'ocupacaoPercent' not in s),
]

CAP['armazens-nacionais-ouro.html'] = [
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('sem link morto para PME', lambda s: 'portal-pme.html' not in s),
]

CAP['ficha-detalhe.html'] = [
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('ilustrações de produto',lambda s: 'produtos-visual.js' in s),
]

CAP['ponto-cego-duplo.html'] = [
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('lê armazenagem e GS1',  lambda s: 'armazens-nacionais' in s and 'identificacao-gs1' in s),
]

CAP['adesao-institucional.html'] = [
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('lê o dossier',          lambda s: 'adesao-institucional' in s),
]

CAP['sandbox-rastreabilidade.html'] = [
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('declara que é simulado',lambda s: 'simulad' in s.lower()),
]

CAP['diagnostico-credencial.html'] = [
  ('guarda de sessão',      lambda s: 'assets/access-control.js' in s),
]

CAP['propostas-layout.html'] = [
  ('guarda de sessão',      lambda s: 'assets/access-control.js' in s),
]

CAP['assets/cadeia-abastecimento.js'] = [
  ('cinco portos de entrada',   lambda s: 'PORTOS = [' in s and s.count("nome: '") >= 5),
  ('pressupostos declarados',   lambda s: 'TRANSPORTE = {' in s
     and 'não inclui portagens' in s.lower()),
  ('dependência de origem',     lambda s: 'function dependenciaOrigem' in s),
  ('transporte explica',        lambda s: 'function transporteExplica' in s
     and 'ligadasPorFluxo' in s),
  ('não conclui sobrepreço',    lambda s: 'não comerciam entre si' in s),
  ('declara o que não calcula', lambda s: 'NAO_CALCULA' in s
     and s.count("pedido: '") >= 4),
  ('retenção não é qualificada',lambda s: 'qualificação cabe a quem tem competência' in s),
  ('comparador de custo colocado', lambda s: 'function custoColocado' in s
     and 'inverteu' in s),
  ('conta viagens acima da capacidade', lambda s: 'Math.ceil(quantidadeKg' in s),
  ('declara que não sabe a oferta', lambda s: 'declara existências' in s and 'naoInclui' in s),
  ('índice de cobertura da fonte', lambda s: 'function transparenciaMercado' in s
     and 'ÍNDICE DE COBERTURA DA FONTE' in s),
  ('quatro estados por componente', lambda s: "ne:   { rotulo" in s
     and "hist: { rotulo" in s),
  ('zero não é ausência',   lambda s: 'não extraído desta edição deste boletim' in s),
  ('aponta a fonte do INE', lambda s: 'quadro 10.1.1' in s),
  ('quatro componentes sem ponderação', lambda s: 'Não há ponderação' in s),

  ('declara a cobertura do boletim', lambda s: 'declaradosSemPreco' in s),
]

CAP['marketplace-b2b.html'] = [
  ('motor da cadeia',       lambda s: 'cadeia-abastecimento.js' in s and 'desenharCadeia' in s),
  ('mostra o que não calcula', lambda s: 'naoCalcula' in s and 'Escond' in s),
  ('explica como ler',      lambda s: 'n&atilde;o comerciam entre si' in s
     or 'não comerciam entre si' in s),
  ('comparador no ecrã',    lambda s: 'desenharCustoColocado' in s and 'cc-filtros' in s),
  ('filtros de quantidade', lambda s: "data-cc=\"q\"" in s or "data-cc='q'" in s
     or 'data-cc="q"' in s),
  ('assinala a inversão',   lambda s: 'A ordem inverteu' in s),
  ('transparência no ecrã', lambda s: 'desenharTransparencia' in s and 'tm-tag' in s),
  ('declara que mede uma fonte', lambda s: 'mede uma fonte, n&atilde;o o pa&iacute;s' in s),
  ('dá o exemplo de 2022',  lambda s: 'Boletins do SIMA de 2022' in s),
  ('legenda dos estados',   lambda s: 'existe, de per&iacute;odo anterior' in s),
  ('guarda de sessão',      lambda s: 'assets/access-control.js' in s),
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('pesquisa global',       lambda s: 'assets/pesquisa-sinagepe.js' in s),
  ('selo de proveniência',  lambda s: 'SeloProveniencia.aplicar' in s),
  ('sem "tempo real"',      lambda s: 'Dados em tempo real' not in s),
  ('sem links mortos',      lambda s: s.count('href="#"') == 0),  # o botão de sair vive no nav-sinagepe.js, não aqui
  ('usa dados reais SIMA',  lambda s: 'sima-precos' in s and 'painelArbitragem' in s),
  ('marca a demonstração',  lambda s: 'Esta sec' in s and 'demonstra' in s),
  ('tabela do que falta',   lambda s: 'var FALTA' in s),
  ('comparador de preço',   lambda s: 'painelComparador' in s and 'cmp-preco' in s),
  ('preço não sai do ecrã', lambda s: 'sai deste ecr' in s and 'cmp-preco' not in s.split('fetch(')[-1][:400]),
  ('guarda de poucas obs.', lambda s: 'mercados.length<5' in s),
]

CAP['apresentacao.html'] = [
  ('guarda de sessão',      lambda s: 'assets/access-control.js' in s),
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('pesquisa global',       lambda s: 'assets/pesquisa-sinagepe.js' in s),
  ('5 gráficos',            lambda s: all('grafico'+str(i) in s for i in range(1,6))),
  ('nota em cada gráfico',  lambda s: all("nota'+" not in s and 'nota'+str(i) in s for i in range(1,6))),
  ('secção de fontes',      lambda s: 'function fontes' in s and 'n&ccedil;&atilde;o &agrave; data' in s),
  ('cartões ligam ao detalhe', lambda s: 'indicadores-painel.html?i=' in s),
  ('sem números à mão',     lambda s: 'ST.sima' in s and 'ST.arm' in s and 'ST.cp' in s),
]

CAP['indicadores-painel.html'] = [
  ('guarda de sessão',      lambda s: 'assets/access-control.js' in s),
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('pesquisa global',       lambda s: 'assets/pesquisa-sinagepe.js' in s),
  # O painel passou de cartões que abrem para fichas abertas, onde tudo está
  # visível de uma vez. O que se exige agora é que cada ficha leve ao ecrã
  # que detém o indicador.
  ('cada ficha leva ao ecrã', lambda s: 'ic-ir' in s and 'i.ecra' in s),
  ('mostra a fórmula',      lambda s: 'i.formula' in s and 'i.componentes' in s),
  ('declara fonte e data',  lambda s: 'i.fonte' in s and 'i.dataDados' in s),
]

CAP['relatorios-central.html'] = [
  ('guarda de sessão',      lambda s: 'assets/access-control.js' in s),
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('pesquisa global',       lambda s: 'assets/pesquisa-sinagepe.js' in s),
  ('12 relatórios',         lambda s: s.count("{id:'") >= 12),
  ('filtra por acesso',     lambda s: 'function podeVer' in s and 'sinagepe_nivel' in s),
  ('exportação só admin',   lambda s: 'function eAdministrador' in s and "!eAdministrador()" in s),
  ('CSS de impressão A4',   lambda s: '@page{size:A4' in s),
  ('data em cada relatório',lambda s: 'Dados de:' in s and 'Gerado em:' in s),
]

CAP['medicamentos-cadeia.html'] = [
  ('guarda de sessão',      lambda s: 'assets/access-control.js' in s),
  ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'nav-mount' in s),
  ('pesquisa global',       lambda s: 'assets/pesquisa-sinagepe.js' in s),
  ('proíbe dado de doente', lambda s: 'semDadosDeDoente' in s),
  ('sem números inventados',lambda s: 'medicamentos-cadeia.json' in s and 'existencia' not in s.lower().split('<script')[0]),
]

for f in ['portal-bancos.html','dashboard-banco-central.html','portal-investidores.html','portal-empresas.html']:
    CAP[f] = [
      ('guarda de sessão',      lambda s: 'assets/access-control.js' in s),
      ('selo de proveniência',  lambda s: 'selo-proveniencia.js' in s and 'SeloProveniencia.aplicar' in s),
      ('sem instituição real',  lambda s: 'Banco Comercial de Mo' not in s),
      ('barra da fonte única',  lambda s: 'assets/nav-sinagepe.js' in s and 'SinagepeNav.montar' in s),
      ('sem barra à mão',       lambda s: s.count('class="nav-item') == 0),
      ('sem links mortos',      lambda s: s.count('href="#"') == 0),
      ('pesquisa global',       lambda s: 'assets/pesquisa-sinagepe.js' in s),
    ]

# ficheiros partilhados
ASSETS = {
 'assets/nav-sinagepe.js': [
   ('lista única de ecrãs', lambda s: s.count('{ key:') >= 27),
   ('agrupamento por tema', lambda s: 'nav-grupo' in s and 'ORDEM' in s),
   ('filtra por acesso',    lambda s: 'sinagepe_nivel' in s and 'permitidas' in s),
   ('CSS próprio',          lambda s: 'nav-sinagepe-css' in s),
   ('navegação em telemóvel', lambda s: 'montarTelemovel' in s and '@media(max-width:1080px)' in s),
   ('botão de menu e véu',  lambda s: "'nav-abrir'" in s and "'nav-veu'" in s),
   ('detalhe fora do menu', lambda s: 'SO_POR_LIGACAO' in s and 'SO_POR_LIGACAO.indexOf(i.href) < 0' in s),
   # Os portais de parceiros e universidades nunca chegaram a existir como
   # ficheiro. Estavam no menu e davam 404. Foram removidos em Setembro de 2026,
   # e a verificação passa a exigir apenas os portais que existem de facto.
   ('portais por perfil',   lambda s: all(x in s for x in
      ['portal-comerciantes.html','portal-publico.html','portal-produtores.html',
       'portal-transportadores.html','portal-empresas.html'])),
   ('sem </script literal', lambda s: '</'+'script' not in s),
 ],
 'assets/pesquisa-sinagepe.js': [
   ('procura ecrãs',        lambda s: 'var ECRAS' in s),
   ('procura conceitos',    lambda s: 'var CONCEITOS' in s),
   ('procura entidades',    lambda s: 'var FICHEIROS' in s),
   ('ignora acentos',       lambda s: 'normalize' in s),
   ('filtra por acesso',    lambda s: 'podeVer' in s),
   ('atalhos de teclado',   lambda s: "key.toLowerCase() === 'k'" in s and "'Escape'" in s),
   ('sem </script literal', lambda s: '</'+'script' not in s),
 ],
 'assets/produtos-visual.js': [
   ('fotografia primeiro',  lambda s: 'img/produtos/' in s and 'onerror' in s),
   ('ilustração de recurso',lambda s: 'function saco' in s and 'linearGradient' in s),
   ('sem </script literal', lambda s: '</'+'script' not in s),
 ],
 'assets/selo-proveniencia.js': [
   ('lê o modo do ficheiro', lambda s: "meta.modo" in s or 'j.meta ? j.meta.modo' in s),
   ('desliga em modo real',  lambda s: 'function eSimulado' in s),
   ('sem </script literal',  lambda s: '</'+'script' not in s),
 ],
 'assets/sinagepe.js': [
   ('NAV_ITEMS completo',   lambda s: s.count('{ key:') >= 22),
 ],
}

# dados
DADOS = {
 'data/armazens-nacionais.json': [
   ('lacunas de integração registadas', lambda d:
      len(d['capacidadeNacionalPorConfirmar']['fontes']) >= 4),
   ('distingue capacidade de existências', lambda d:
      'quatro variáveis distintas' in d['capacidadeNacionalPorConfirmar']['distincaoObrigatoria']),
   ('regra do zero',        lambda d: 'nunca "o valor é zero"'
      in d['capacidadeNacionalPorConfirmar']['regraDoZero']),
   ('estados de cadastro por unidade', lambda d: all(a.get('estadoCadastro') for a in d['armazens'])),
   ('seis estados declarados', lambda d: len(d['meta']['estadosCadastro']['estados']) == 6),
   ('princípio da existência', lambda d: 'auto-registo' in d['meta']['estadosCadastro']['principio']),
   ('cadastro não encolhe', lambda d: len(d['armazens']) >= 30),
   ('STEMA presente',      lambda d: any(a['id']=='stema-matola' for a in d['armazens'])),
   ('todas com fonte',    lambda d: all(a.get('fonte') for a in d['armazens'])),
   ('todas sem sensor',   lambda d: all(a.get('sensor')=='sem-sensor' for a in d['armazens'])),
 ],
 'data/rede-logistica.json': [
   ('sem cadastro próprio',lambda d: not d.get('armazens')),
   ('reconciliação das 12',lambda d: len(d['reconciliacao']['entradas']) == 12),
   ('utilização não inventada',lambda d: all(c['utilizacaoPercent'] is None for c in d['corredores'])),
 ],
 'data/fontes-externas.json': [
   ('13 fontes',          lambda d: len([k for k in d if k!='meta']) >= 13),
   ('sem GTIN inventado', lambda d: not d['gs1']['identificacaoProdutos']['linhas']),
   ('bloco de auditoria', lambda d: 'auditoria2026_08_21' in d['meta']),
 ],
 'data/adesao-institucional.json': [
   ('14 entidades',        lambda d: len(d['entidades']) >= 14),
   ('SETSAN no dossier',   lambda d: any(e['sigla']=='SETSAN' for e in d['entidades'])),
   ('BAU no dossier',      lambda d: any(e['sigla']=='BAU' for e in d['entidades'])),
   ('todas com fonte',     lambda d: all(e.get('fonte') for e in d['entidades'])),
   ('ANE com serviços GIS',lambda d: any(e['sigla']=='ANE' and e.get('descobertaGIS')
      and len(e['descobertaGIS']['servicos']) >= 3 for e in d['entidades'])),
   ('ANE com licença declarada', lambda d: any(e['sigla']=='ANE'
      and 'ANE 2020' in str(e.get('descobertaGIS',{}).get('licenca','')) for e in d['entidades'])),
 ],
 'data/rede-comercial.json': [
   ('Terramar registada',   lambda d: any(o.get('id')=='terramar' for o in d['operadores'])),
   ('Recheio com rede declarada', lambda d: any(o.get('id')=='recheio'
      and o['redeDeclarada']['locais'] == 26 for o in d['operadores'])),
   ('seis operadores',      lambda d: len(d['operadores']) >= 6),
   ('divergências do VIP/SPAR', lambda d: len(d.get('divergenciasRegistadas',[])) >= 3),
   ('estabelecimentos por fonte comercial', lambda d:
      len(d.get('estabelecimentosIdentificados',[])) >= 8),
   ('fonte comercial rastreada', lambda d: len(d.get('fontesComerciais',[])) >= 1
      and all(f.get('url') and f.get('naturezaFonte') for f in d['fontesComerciais'])),
   ('decisão registada com autor', lambda d:
      d['meta']['decisaoInformacaoComercial']['decidiu'] == 'Ruben Timba'),
   ('limite da matriz declarado', lambda d: 'regra dos cinco'
      in d['meta']['decisaoInformacaoComercial']['limiteQueSeMantem']),
   ('quatro lojas com morada', lambda d: len([o for o in d['operadores']
      if o.get('id')=='terramar'][0]['lojas']) == 4),
   ('quota com reserva declarada', lambda d: 'não é neutra' in
      [o for o in d['operadores'] if o.get('id')=='terramar'][0]['quotaDeclarada']['reserva']),
   ('Terra-Mar Logística em separado', lambda d: any('Terra-Mar Log' in o.get('nome','')
      for o in d['outrosOperadores'])),
   ('unidades no mapa',     lambda d: len(d['unidades']) >= 11),
 ],
 'data/rede-viaria.json': [
   ('14 estradas nacionais', lambda d: len(d['estradas']) == 14),
   ('todas com traçado',    lambda d: all(len(e.get('pontos',[])) >= 2 for e in d['estradas'])),
   ('todas com província',  lambda d: all(e.get('provincias') for e in d['estradas'])),
   ('nota sobre o traçado', lambda d: 'notaTracado' in d['meta']),
   ('rede classificada',    lambda d: d['meta'].get('redeClassificadaKm') == 30056),
   ('divergência registada',lambda d: any(i.get('divergencia') for i in d['interrupcoes'])),
 ],
 'data/fontes-internacionais.json': [
   ('6 fontes',            lambda d: len(d['fontes']) == 6),
   ('20 organizações',     lambda d: len(d['organizacoes']) >= 20),
   ('seis perguntas',      lambda d: len(d['ondeSinagepeEntra']) == 6),
   ('1.ª pergunta com camadas próprias', lambda d:
      len(d['ondeSinagepeEntra'][0].get('camadasProprias',[])) == 4),
   ('leitura própria declara o limite', lambda d:
      'leituraPropriaDeNecessidade' in d and len(d['leituraPropriaDeNecessidade']['limite']) > 80),
   ('divergência registada', lambda d: d['divergenciaRegistada']['diferenca'] > 0
      and d['divergenciaRegistada']['porConfirmar'] is True),
   ('contexto SADC',       lambda d: d['contextoRegional']['pessoasRegiao'] > 0),
   ('tese de utilidade',   lambda d: len(d['utilidadePublica']['tese']) > 100),
   ('todas as fontes com URL', lambda d: all(f.get('url') for f in d['fontes'])),
 ],
 'data/indicadores-painel.json': [
   ('6 indicadores',       lambda d: len(d['indicadores']) == 6),
   ('todos com fundamentação', lambda d: all(i.get('porqueImporta') and i.get('queDecisaoPermite')
      and i.get('quemUsa') for i in d['indicadores'])),
   ('todos com fonte e data', lambda d: all(i.get('fonte') and i.get('dataDados') for i in d['indicadores'])),
 ],
 'data/bau-licenciamento.json': [
   ('3 regimes de licenciamento', lambda d: len(d['regimesLicenciamento']) == 3),
   ('base legal declarada',  lambda d: 'Decreto' in d['meta']['baseLegal']),
   ('o que pedir, com prioridade', lambda d: len(d['oQueSinagepePrecisa']) >= 4
      and all(x.get('prioridade') for x in d['oQueSinagepePrecisa'])),
   ('declara que não está ligado', lambda d: d['estadoIntegracao']['ligado'] is False),
 ],
 'data/campanha-agraria-maap.json': [
   ('campanha com 5 grupos', lambda d: len(d['campanha2025_26']['producaoPrevista']) == 5),
   ('declara que é previsão', lambda d: 'previsão' in d['meta']['notaImportante']
      or 'PLANIFICADA' in d['meta']['notaImportante']),
   ('cheias por província',  lambda d: len(d['cheias']['porProvincia']) >= 4),
   ('fonte com URL do MAAP', lambda d: 'agricultura.gov.mz' in d['meta']['url']),
   ('lacunas com recomendação', lambda d: len(d['lacunasQuePermanecem']) >= 4
      and all(x.get('recomendacao') for x in d['lacunasQuePermanecem'])),
 ],
 'data/indicadores-provinciais-ine.json': [
   ('11 províncias',       lambda d: len(d['provincias']) == 11),
   ('esperança de vida por sexo', lambda d: all(
      x['esperancaVida2017'].get('homens') and x['esperancaVida2017'].get('mulheres')
      for x in d['provincias'])),
   ('dependência completa',lambda d: all(x['dependencia2017'].get('total') for x in d['provincias'])),
   ('licença declarada',   lambda d: 'fins comerciais' in d['meta']['licenca']),
   ('divergência do censo registada', lambda d: len(d['divergenciaRegistada']['valores']) == 3),
   ('declara o que não inclui', lambda d: 'naoInclui' in d['meta']),
 ],
 'data/ipc-ine.json': [
   ('8 centros',            lambda d: len(d['ponderacao']) == 8),
   ('pesos somam 100',      lambda d: abs(sum(x['peso'] for x in d['ponderacao']) - 100) < 0.01),
   ('províncias fora declaradas', lambda d: len(d['provinciasForaDoIndice']) >= 3),
   ('limite importante declarado', lambda d: 'limiteImportante' in d['meta']),
   ('nota sobre confirmação', lambda d: 'confirmados na publica' in d['meta']['notaFonte']),
 ],
 'data/farmacias-anarme.json': [
   ('estados de cadastro', lambda d: 'estadosCadastro' in d
      and len(d['estadosCadastro']['estados']) >= 4),
   ('declara zero confirmadas', lambda d: any(e['estado']=='confirmada-pelo-titular'
      and e['quantas']==0 for e in d['estadosCadastro']['estados'])),
   ('cobertura nacional completa', lambda d: d['totais']['provinciasLidas'] == 11
      and d['totais']['provinciasPorLer'] == 0),
   ('mais de 1500 farmácias', lambda d: d['totais']['lidas'] >= 1500),
   ('distritos plausíveis', lambda d: 60 <= d['totais']['distritosCobertos'] <= 154),
   ('declara o que ficou sem distrito', lambda d: 'semDistritoAtribuido' in d['totais']),
   ('fonte ANARME com URL',   lambda d: 'anarme' in d['meta']['url'].lower()),
   ('extracção já não é parcial', lambda d: d['meta']['extraccaoParcial'] is False
      and len(d['provinciasPorLer']) == 0),
   ('sem observações de irregularidade', lambda d:
      'irregularidade' not in json.dumps(d, ensure_ascii=False).lower().replace(
        d['meta']['regraObservacoes'].lower(), '')),
   ('regra das observações declarada', lambda d: 'regraObservacoes' in d['meta']),
   ('por distrito e por província', lambda d: len(d['porDistrito']) >= 50
      and len(d['porProvincia']) == 11),
 ],
 'data/governanca-dado.json': [
   ('escala de evidência',  lambda d: any(r.get('escalaEvidencia') for r in d['regras'])),
   ('5 graus de evidência', lambda d: all(len(r['escalaEvidencia'])==5
      for r in d['regras'] if r.get('escalaEvidencia'))),
   ('7 regras',            lambda d: len(d['regras'])>=7),
   ('cadeia de responsabilidade', lambda d: any(r.get('etapasResponsabilidade') for r in d['regras'])),
   ('cadeia com 8 etapas', lambda d: all(len(r['etapasResponsabilidade'])==8
      for r in d['regras'] if r.get('etapasResponsabilidade'))),
   ('cada etapa nomeia quem', lambda d: all(all(e.get('quem') and e.get('estado')
      for e in r['etapasResponsabilidade']) for r in d['regras'] if r.get('etapasResponsabilidade'))),
   ('regras não diminuem', lambda d: len(d['regras']) >= 6),
   ('matriz de camadas',  lambda d: len(d['camadas']['matriz']) >= 16),
   ('classificação',      lambda d: len(d['classificacao']) >= 19),
 ],
 'data/indicadores-painel.json': [
   ('6 indicadores',       lambda d: len(d['indicadores'])==6),
   ('todos com fonte',     lambda d: all(i.get('fonte') and i.get('dataDados') for i in d['indicadores'])),
   ('todos com fórmula',   lambda d: all(i.get('formula') and i.get('componentes') for i in d['indicadores'])),
   ('4 retirados com razão',lambda d: len(d['retirados'])==4 and all(r.get('razao') for r in d['retirados'])),
 ],
 'data/medicamentos-cadeia.json': [
   ('estado por ligar',    lambda d: d['meta']['estadoDaLigacao']=='POR LIGAR'),
   ('6 estados',           lambda d: len(d['estados'])==6),
   ('nenhum indicador com dados', lambda d: all(i['estado'] in ('POR LIGAR','CALCULÁVEL') for i in d['indicadores'])),
   ('recusa previsão',     lambda d: any('Previsão de ruptura' in x['item'] for x in d['recusado'])),
 ],
 'data/sima-precos.json': [
   ('5 produtos com preço',  lambda d: len(d['retalho'])==5),
   ('série não encolhe',    lambda d: len(d['series']['edicoes'])>=8),
   ('sem preços repetidos entre produtos', lambda d: all(
      len([v for v in [x['valores'].get(str(e['edicao'])) for x in d['series']['precoMedio']] if v is not None])
      == len(set(v for v in [x['valores'].get(str(e['edicao'])) for x in d['series']['precoMedio']] if v is not None))
      for e in d['series']['edicoes'])),
   ('nota de extracção',    lambda d: 'notaExtraccao' in d['meta']),
   ('17 fluxos',             lambda d: len(d['fluxos'])==17),
   ('16 desenháveis',        lambda d: sum(1 for f in d['fluxos'] if f.get('desenhavel'))==16),
   ('declara a recência',    lambda d: 'avisoRecencia' in d['meta']),
   ('cita a fonte',          lambda d: d['meta']['url'].startswith('https://')),
 ],
 'data/sinagepe-data.json': [
   ('declara o modo',      lambda d: 'modo' in d.get('meta',{})),
   ('sem instituição real', lambda d: 'Banco Comercial de Mo' not in d['portalBancos']['banco']),
   ('decisão de nomes registada', lambda d: 'decisaoNomes' in d.get('meta',{})),
 ],
 'data/produtores-agrarios.json': [
   ('10 províncias',      lambda d: len(d['provincias']) == 10),
 ],
 'data/cascata-precos.json': [
   ('preços por região',  lambda d: len(d['regioes']) >= 7),
 ],
}

falhas = []
print('='*72)
print('AUDITORIA DE REGRESSÃO — o que já funcionou tem de continuar a funcionar')
print('='*72)

def bloco(titulo, itens, carregar, testar):
    print('\n' + titulo)
    for f, caps in itens.items():
        obj = carregar(f)
        if obj is None:
            print('  %-34s FICHEIRO EM FALTA' % f); falhas.append(f + ' — ficheiro em falta'); continue
        maus = []
        for nome, teste in caps:
            try: ok = bool(teste(obj))
            except Exception as e: ok = False
            if not ok: maus.append(nome)
        if maus:
            print('  %-34s %d/%d  PERDEU: %s' % (f, len(caps)-len(maus), len(caps), ', '.join(maus)))
            for m in maus: falhas.append(f + ' — ' + m)
        else:
            print('  %-34s %d/%d  ok' % (f, len(caps), len(caps)))

bloco('ECRÃS', CAP, ler, None)
bloco('FICHEIROS PARTILHADOS', ASSETS, ler, None)
bloco('DADOS', DADOS, lambda f: json.loads(ler(f)) if ler(f) else None, None)

print('\n' + '='*72)
if falhas:
    print('REGRESSÕES ENCONTRADAS: %d' % len(falhas))
    for f in falhas: print('  · ' + f)
else:
    print('Nenhuma regressão. Todas as funcionalidades conquistadas continuam presentes.')
print('='*72)
