#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SINAGEPE — subir a luminosidade (opção C)
=========================================
Substitui a paleta em TODOS os ficheiros de uma vez: os 45 ecrãs que
declaram cores próprias no cabeçalho, os ficheiros de CSS e os scripts
que pintam o mapa e os cartões.

POR DEFEITO NÃO ALTERA NADA — mostra o que mudaria. Para aplicar mesmo,
acrescente --aplicar.

    python assets\\subir-luz.py              (simulação, escreve nada)
    python assets\\subir-luz.py --aplicar    (altera os ficheiros)

O script encontra o repositório esteja ele na raiz ou dentro de assets.

Antes de aplicar, garanta que não tem alterações por comitar: assim, se
o resultado não agradar, basta "Discard changes" no GitHub Desktop e
está tudo como antes.

O que muda, e porquê. As legendas e as notas de origem estavam a 3,1 de
contraste sobre o cartão, quando a norma pede 4,5. Eram justamente as
linhas que dizem de onde vem cada número — o que o sistema tem de mais
importante era o que menos se lia. Sobem para 7,0. Os fundos sobem um
degrau para os cartões se separarem do fundo, e o bronze passa a ver-se
nas molduras em vez de se adivinhar.

O que NÃO é tocado, e porquê:
  - assets/chart.umd.min.js — biblioteca de terceiros, não é nosso
  - assets/app-consumidor.css e os ecrãs app-consumidor-* — a app do
    consumidor tem identidade própria (turquesa e dourado); tratá-la
    com a mesma paleta descaracterizava-a
  - armazens-nacionais-ouro.html, propostas-layout.html e
    relatorio-executivo.html — são de fundo claro; clarear o texto
    tornaria-os ilegíveis
"""
import glob, os, re, sys

def raiz_do_repositorio():
    """O script pode viver na raiz ou em assets/. Numa pasta de ferramentas
    (assets), os ecras estao um nivel acima — procurar ali daria zero
    ficheiros e a impressao falsa de que nao havia nada a mudar."""
    aqui = os.path.dirname(os.path.abspath(__file__))
    if os.path.basename(aqui).lower() in ('assets', 'scripts', 'ferramentas'):
        acima = os.path.dirname(aqui)
        if os.path.exists(os.path.join(acima, 'index.html')):
            return acima
    return aqui


RAIZ = raiz_do_repositorio()
APLICAR = '--aplicar' in sys.argv

EXCLUIR = {
    'assets/chart.umd.min.js',
    'assets/app-consumidor.css',
    'armazens-nacionais-ouro.html',
    'propostas-layout.html',
    'relatorio-executivo.html',
}
EXCLUIR_PREFIXO = ('app-consumidor',)

# ---- fundos: sobem um degrau, mantendo o azul profundo ----
FUNDOS = {
    '#080F1C': '#0B1524',   # fundo geral (43 ficheiros)
    '#040712': '#0B1524',   # fundo do index e do CSS comum
    '#060B16': '#0B1524',
    '#0B1421': '#0E1A2B',   # barra lateral (42 ficheiros)
    '#0A1421': '#0E1A2B',
    '#0A1220': '#0E1A2B',
    '#141F2B': '#17243A',   # cartões (43 ficheiros)
    '#0C1626': '#17243A',
    '#0F1A30': '#17243A',
    '#1B2836': '#203148',   # cartão sobre o rato (42 ficheiros)
    '#101B2E': '#18263C',
    '#101E33': '#1A2940',
    '#0A1128': '#101B34',
    '#111E35': '#1B2A44',
    '#152740': '#1E3350',
    '#02121C': '#0A1F2C',
    '#22354F': '#2B4165',
}

# ---- texto: o que estava a desaparecer no fundo ----
TEXTO = {
    '#F3F7FC': '#FAFCFF',   # principal
    '#C3D0E0': '#D6E1EE',   # secundário
    '#8FA1B8': '#C2D1E4',   # --t3 / --ink-dim   5,9 -> 10,0
    '#5E7189': '#9DB0C8',   # --t4 / legendas    3,1 ->  7,0
    '#64748B': '#9DB0C8',
    '#94A3B8': '#C2D1E4',
    '#CBD5E1': '#D6E1EE',
    '#5F6D90': '#9DB0C8',
    '#8C94A1': '#B4C2D6',
}

# ---- bronze: nos três usos ----
BRONZE = {
    '#C98A3C': '#EDB86E',   # bronze base      5,3 -> 8,7
    '#E8BE7A': '#F5DDB8',   # bronze claro     8,9 -> 11,8
    '#8A5C25': '#A8743A',   # bronze escuro
}

# ---- sinais: mantêm o significado, cansam menos a vista ----
SINAIS = {
    '#EF4444': '#FF7A7A',   # crítico
    '#12B981': '#3FD9A8',   # bom
    '#F0A926': '#FFC352',   # atenção
    '#22B8F0': '#5CCBF7',   # informação
    '#2DD4BF': '#5FE3D2',   # turquesa
    '#A78BFA': '#BFA9FF',   # violeta
}

MAPA = {}
MAPA.update(FUNDOS); MAPA.update(TEXTO); MAPA.update(BRONZE); MAPA.update(SINAIS)

# ---- molduras e linhas: o problema era a transparência, não a cor ----
RGBA = [
    (r'rgba\(201,\s*138,\s*60,\s*\.28\)', 'rgba(237,184,110,.52)'),
    (r'rgba\(201,\s*138,\s*60,\s*\.30\)', 'rgba(237,184,110,.52)'),
    (r'rgba\(201,\s*138,\s*60,\s*\.45\)', 'rgba(237,184,110,.62)'),
    (r'rgba\(201,\s*138,\s*60,\s*\.55\)', 'rgba(237,184,110,.70)'),
    (r'rgba\(201,\s*138,\s*60,\s*\.0?7\)', 'rgba(237,184,110,.12)'),
    (r'rgba\(201,\s*138,\s*60,\s*\.0?8\)', 'rgba(237,184,110,.13)'),
    (r'rgba\(201,\s*138,\s*60,\s*\.0?9\)', 'rgba(237,184,110,.14)'),
    (r'rgba\(38,\s*56,\s*86,\s*\.(\d+)\)',  r'rgba(72,100,144,.\1)'),
    (r'rgba\(64,\s*86,\s*108,\s*\.55\)',    'rgba(100,128,164,.62)'),
    (r'rgba\(239,\s*68,\s*68,',             'rgba(255,122,122,'),
    (r'rgba\(18,\s*185,\s*129,',            'rgba(63,217,168,'),
    (r'rgba\(240,\s*169,\s*38,',            'rgba(255,195,82,'),
    (r'rgba\(34,\s*184,\s*240,',            'rgba(92,203,247,'),
]


def alvo(caminho):
    rel = os.path.relpath(caminho, RAIZ).replace('\\', '/')
    if rel in EXCLUIR:
        return False, rel
    if os.path.basename(rel).startswith(EXCLUIR_PREFIXO):
        return False, rel
    return True, rel


def ficheiros():
    return (sorted(glob.glob(os.path.join(RAIZ, '*.html')))
            + sorted(glob.glob(os.path.join(RAIZ, 'assets', '*.css')))
            + sorted(glob.glob(os.path.join(RAIZ, 'assets', '*.js'))))


def main():
    print('SINAGEPE — SUBIR A LUZ (opcao C)')
    print('=' * 68)
    print('MODO: ' + ('APLICAR — os ficheiros vao ser alterados'
                      if APLICAR else 'SIMULACAO — nada e escrito'))
    print()
    tocados = saltados = trocas = 0

    for cam in ficheiros():
        ok, rel = alvo(cam)
        if not ok:
            saltados += 1
            continue
        t = original = open(cam, encoding='utf-8', errors='replace').read()

        n = 0
        for velho, novo in MAPA.items():
            padrao = re.compile(re.escape(velho), re.IGNORECASE)
            t, k = padrao.subn(novo, t)
            n += k
        for padrao, novo in RGBA:
            t, k = re.subn(padrao, novo, t, flags=re.IGNORECASE)
            n += k

        if t == original:
            continue
        tocados += 1
        trocas += n
        print(f'  {rel:42s} {n:4d} cores')
        if APLICAR:
            open(cam, 'w', encoding='utf-8', newline='').write(t)

    print()
    print(f'repositorio: {RAIZ}')
    print(f'ficheiros alterados: {tocados}   |   substituicoes: {trocas}   |   ignorados: {saltados}')
    if not APLICAR:
        print('\nNada foi escrito. Para aplicar mesmo, acrescente --aplicar ao mesmo comando.')
    else:
        print('\nFeito. Abra o localhost e confira antes de comitar.')
        print('Se nao gostar: GitHub Desktop, botao direito, Discard changes.')


if __name__ == '__main__':
    main()
