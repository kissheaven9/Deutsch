#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ЛИНТЕР СТРАНИЦ — механическая проверка правил, которые я нарушаю ПОВТОРНО.
Причина повторов: правило в дневнике исполняется, только если я о нём ВСПОМНЮ в момент кода.
Не вспоминаю. Поэтому правило = ПРОВЕРКА, а не текст (дневник 16.07).

  python3 tools/check_pages.py            # все страницы
  python3 tools/check_pages.py site/x.html
Код 2 = не деплоить.
"""
import re, sys, os, glob

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

# страницы-тренажёры героев: тут озвучка ТОЛЬКО записанным голосом
HERO_PAGES = ('thema-trennbar', 'thema-untrennbar', 'verben-otto', 'thema-20')

def check(path):
    err, warn = [], []
    h = open(path, encoding='utf-8').read()
    name = os.path.basename(path)
    body = re.sub(r'//[^\n]*', '', h)          # без комментариев

    # 1) РОБОТ вместо голоса героя (дневник 09.07 — и повтор 16.07 на странице Греты)
    if any(k in name for k in HERO_PAGES):
        for m in re.finditer(r'\b(toggleSpeak|speak)\s*\(', body):
            line = body[:m.start()].count('\n') + 1
            err.append(f'{name}:{line} — {m.group(1)}() = БРАУЗЕРНЫЙ РОБОТ. '
                       f'На страницах героев только записанный mp3: playWord/playSeq')

    # 2) строки/кавычки в onclick рвут атрибут → кнопка мертва (дневник 01.07)
    for m in re.finditer(r'onclick="[^"]*\\?&quot;[^"]*"', body):
        line = body[:m.start()].count('\n') + 1
        warn.append(f'{name}:{line} — кавычки внутри onclick: атрибут может порваться')

    # 3) ссылка на переменную-const в onclick → тишина (дневник 16.07, памятка Греты)
    for m in re.finditer(r'onclick="[^"]*\(\s*[^\'"\d)][A-Za-z_]*\s*\)"', body):
        frag = m.group(0)
        if not re.search(r'\((this|event|i|\d)', frag):
            line = body[:m.start()].count('\n') + 1
            warn.append(f'{name}:{line} — переменная в onclick: {frag[:60]}… '
                        f'(глобальные const НЕ на window → обработчик падает молча)')

    # 4) анти-кэш на css/js (дневник 07.06)
    for m in re.finditer(r'(href|src)="(css|js)/[^"?]+\.(css|js)"', body):
        line = body[:m.start()].count('\n') + 1
        warn.append(f'{name}:{line} — нет ?v=N: {m.group(0)} (пользователь увидит кэш)')
    return err, warn

def main():
    files = sys.argv[1:] or sorted(glob.glob(os.path.join(ROOT, 'site', '*.html')))
    E = W = 0
    for f in files:
        e, w = check(f)
        for x in e: print('  ❌', x)
        for x in w: print('  ⚠️ ', x)
        E += len(e); W += len(w)
    print('\n' + '═'*70)
    if E:
        print(f'❌ НЕ ДЕПЛОИТЬ. Ошибок: {E}, предупреждений: {W}')
        return 2
    print(f'✅ Ошибок нет. Предупреждений: {W}')
    return 0

if __name__ == '__main__':
    sys.exit(main())
