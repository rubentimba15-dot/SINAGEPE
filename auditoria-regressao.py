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
  ('guarda da série IPC',   lambda s: 'Array.isArray(FX.ine.ipc.serie)' in s),
  ('guarda da reserva',     lambda s: 'meta.actualToneladas!=null' in s),
]
CAP['verificador-ecras.html'] = [
  ('guarda de sessão',      lambda s: 'assets/access-control.js' in s),
  ('testa os 81 ecrãs',     lambda s: 'NIVEIS_ACESSO' in s),
  ('detecta sem guarda',    lambda s: 'SEM access-control' in s),
]

for f in ['portal-bancos.html','dashboard-banco-central.html','portal-investidores.html','portal-empresas.html']:
    CAP[f] = [
      ('guarda de sessão',      lambda s: 'assets/access-control.js' in s),
      ('selo de proveniência',  lambda s: 'selo-proveniencia.js' in s and 'SeloProveniencia.aplicar' in s),
      ('sem instituição real',  lambda s: 'Banco Comercial de Mo' not in s),
    ]

# ficheiros partilhados
ASSETS = {
 'assets/nav-sinagepe.js': [
   ('lista única de ecrãs', lambda s: s.count('{ key:') >= 27),
   ('agrupamento por tema', lambda s: 'nav-grupo' in s and 'ORDEM' in s),
   ('filtra por acesso',    lambda s: 'sinagepe_nivel' in s and 'permitidas' in s),
   ('CSS próprio',          lambda s: 'nav-sinagepe-css' in s),
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
   ('29 unidades',        lambda d: len(d['armazens']) == 29),
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
 'data/governanca-dado.json': [
   ('6 regras',           lambda d: len(d['regras']) == 6),
   ('matriz de camadas',  lambda d: len(d['camadas']['matriz']) >= 16),
   ('classificação',      lambda d: len(d['classificacao']) >= 19),
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
