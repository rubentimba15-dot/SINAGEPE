#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SINAGEPE — inventário de cores
==============================
Lê todos os .html e .css do repositório e lista as cores que lá estão,
por frequência. NÃO ALTERA NADA. Serve para saber o que existe antes
de mexer na luminosidade.

Porque é preciso: a cor não vem de um ficheiro só. 45 ecrãs declaram o
seu próprio bloco :root no cabeçalho, além dos ficheiros de CSS. Mudar
só o sinagepe.css deixaria o sistema com duas luminosidades.

Como correr, na pasta do repositório:
    python inventario-cores.py > cores.txt

Depois envie o cores.txt.
"""
import collections, glob, os, re, sys

def raiz_do_repositorio():
    aqui = os.path.dirname(os.path.abspath(__file__))
    if os.path.basename(aqui).lower() in ('assets', 'scripts', 'ferramentas'):
        acima = os.path.dirname(aqui)
        if os.path.exists(os.path.join(acima, 'index.html')):
            return acima
    return aqui


RAIZ = raiz_do_repositorio()

HEX = re.compile(r'#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})\b')
RGBA = re.compile(r'rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+\s*)?\)')
VAR = re.compile(r'(--[a-z0-9-]+)\s*:\s*([^;}\n]+)')


def ficheiros():
    for p in sorted(glob.glob(os.path.join(RAIZ, '*.html'))):
        yield p
    for p in sorted(glob.glob(os.path.join(RAIZ, 'assets', '*.css'))):
        yield p
    for p in sorted(glob.glob(os.path.join(RAIZ, 'assets', '*.js'))):
        yield p


def main():
    hexes = collections.Counter()
    rgbas = collections.Counter()
    variaveis = collections.defaultdict(collections.Counter)
    onde = collections.defaultdict(set)
    total = 0

    for cam in ficheiros():
        nome = os.path.relpath(cam, RAIZ)
        try:
            t = open(cam, encoding='utf-8', errors='replace').read()
        except Exception as e:
            print(f'!! nao consegui ler {nome}: {e}')
            continue
        total += 1
        for m in HEX.finditer(t):
            c = '#' + m.group(1).upper()
            if len(c) == 4:  # #abc -> #aabbcc
                c = '#' + ''.join(ch * 2 for ch in c[1:])
            hexes[c] += 1
            onde[c].add(nome)
        for m in RGBA.finditer(t):
            c = re.sub(r'\s+', '', m.group(0)).lower()
            rgbas[c] += 1
            onde[c].add(nome)
        for m in VAR.finditer(t):
            variaveis[m.group(1)][m.group(2).strip()] += 1

    print('SINAGEPE — INVENTARIO DE CORES')
    print('=' * 70)
    print(f'ficheiros lidos: {total}')
    print(f'cores hexadecimais distintas: {len(hexes)}')
    print(f'cores rgba distintas: {len(rgbas)}')
    print()

    print('--- HEX, por frequencia (as 60 mais usadas) ---')
    print(f'{"cor":10s} {"vezes":>6s}  {"ficheiros":>9s}  exemplos')
    for c, n in hexes.most_common(60):
        ex = ', '.join(sorted(onde[c])[:3])
        print(f'{c:10s} {n:6d}  {len(onde[c]):9d}  {ex}')
    print()

    print('--- RGBA, por frequencia (as 30 mais usadas) ---')
    for c, n in rgbas.most_common(30):
        print(f'{n:6d}  {len(onde[c]):3d} ficheiros  {c}')
    print()

    print('--- VARIAVEIS CSS e os valores que lhes sao dados ---')
    print('(mais do que um valor para a mesma variavel = incoerencia entre ecras)')
    for v in sorted(variaveis):
        vals = variaveis[v]
        marca = '  <-- VALORES DIFERENTES' if len(vals) > 1 else ''
        print(f'{v}{marca}')
        for val, n in vals.most_common():
            print(f'      {n:4d}x  {val}')


if __name__ == '__main__':
    main()
