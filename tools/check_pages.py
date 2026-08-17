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

    # 4) ПЕРЕВОД РАЗЪЕХАЛСЯ С ТЕКСТОМ (дневник 16.07): немецкий переписан, русский от старой версии.
    # Ловим по числу предложений: у перевода их должно быть примерно столько же.
    de = re.findall(r'^ textDE:`(.*?)`,$', h, re.S | re.M)
    ru = re.findall(r'^ textRU:`(.*?)`,$', h, re.S | re.M)
    if de and ru:
        if len(de) != len(ru):
            err.append(f'{name} — частей с textDE {len(de)}, а с textRU {len(ru)}: перевод есть НЕ ВЕЗДЕ')
        for k, (d, r) in enumerate(zip(de, ru), 1):
            d2 = re.sub(r"\$\{VB\('([^']+)','[^']*'\)\}", r'\1', d)
            nd = len(re.findall(r'[.!?]', d2)); nr = len(re.findall(r'[.!?]', r))
            if abs(nd - nr) > 3:
                err.append(f'{name} часть {k} — предложений DE {nd} ≠ RU {nr}: '
                           f'перевод похоже от ДРУГОЙ версии текста (правь DE и RU одной правкой)')
    elif de and not ru:
        warn.append(f'{name} — есть немецкий текст, но нет textRU (кнопки перевода не будет)')

    # 5) ПРОПУСКИ ИЗ ТЕКСТА / ПОДСКАЗЫВАЮТ ДРУГ ДРУГА (дневник 16.07)
    import collections
    gaps = re.findall(r'^ gap:\[(.*?)\n \],$', h, re.S | re.M)
    de_all = ' '.join(re.sub(r"\$\{VB\('([^']+)','[^']*'\)\}", r'\1', d)
                      for d in re.findall(r'^ textDE:`(.*?)`,$', h, re.S | re.M))
    de_all = re.sub(r'\s+', ' ', de_all)
    for pi, b in enumerate(gaps, 1):
        rows = re.findall(r"\['(.*?)','(.*?)','(.*?)','(.*?)'\]", b)
        cnt = collections.Counter((bf + f + af).strip() for bf, f, af, _ in rows)
        share = sum(c for c in cnt.values() if c > 1)
        if share:
            err.append(f'{name} часть {pi} — {share} пропусков сидят в ОДНОМ предложении с другим: '
                       f'они подсказывают друг друга (у каждого пропуска — своё предложение)')
        from_text = sum(1 for s_ in cnt if s_[:40] in de_all)
        if from_text:
            err.append(f'{name} часть {pi} — {from_text} предложений взяты ИЗ ТЕКСТА части: '
                       f'проверяется память о тексте, а не знание глагола (нужны ДРУГИЕ предложения)')

    # 7) mnEar «На слух»: каждое проигрываемое предложение (sent) ДОЛЖНО иметь mp3, иначе РОБОТ (дневник 19.07)
    #    playWord(sent) ищет audio/word/<slug(sent)>.mp3; нет файла → браузерный голос = робот.
    if any(k in name for k in HERO_PAGES):
        def _slug(x):
            x = x.lower().replace('ä','ae').replace('ö','oe').replace('ü','ue').replace('ß','ss')
            return re.sub(r'[^a-z0-9]+','-', x).strip('-')
        wdir = os.path.join(ROOT, 'site', 'audio', 'word')
        played = set(re.findall(r'"sent":\s*"([^"]+)"', h))   # mnEar «На слух»
        # gap (Вставь глагол) и pgap (Вставь Perfekt): playWord собирает предложение из полей строки
        for block_re in (r'(?<!p)gap:\[(.*?)\n\s*\],', r'pgap:\[(.*?)\n\s*\]'):
            is_pgap = 'pgap' in block_re
            for bm in re.finditer(block_re, h, re.S):
                for rowm in re.finditer(r'\[([^\]]*)\]', bm.group(1)):
                    f = re.findall(r"'((?:[^'\\]|\\.)*)'", rowm.group(1))
                    f = [x.replace("\\'", "'") for x in f]
                    if len(f) >= 6:               # отделяемые: g0..g4
                        played.add((f[0]+f[1]+f[2]+f[3]+f[4]).strip())
                    elif is_pgap and len(f) >= 2: # неотделяемые pgap: 'Ich '+g0+' '+g1
                        played.add(('Ich '+f[0]+' '+f[1]).strip())
                    elif len(f) >= 3:             # неотделяемые gap: g0+g1+g2
                        played.add((f[0]+f[1]+f[2]).strip())
        # TRANSU (Переведи на немецкий): playWord озвучивает эталонный немецкий (2-е поле строки)
        tm = re.search(r'const TRANSU=(\[[\s\S]*?\]\n\];)', h)
        if tm:
            for de_ in re.findall(r'\["(?:[^"\\]|\\.)*","((?:[^"\\]|\\.)*)","', tm.group(1)):
                played.add(de_)
        played = {re.sub(r'\s+', ' ', p).strip() for p in played if p.strip()}
        miss = [p for p in played if not os.path.exists(os.path.join(wdir, _slug(p) + '.mp3'))]
        if miss:
            err.append(f'{name} — {len(miss)} проигрываемых предложений (На слух/Вставь глагол/Perfekt) БЕЗ mp3 → '
                       f'браузерный РОБОТ. Сгенерируй голосом героя (edge-tts). Пример: «{miss[0][:45]}…»')

    # 6) анти-кэш на css/js (дневник 07.06)
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
    # ГЛОБАЛЬНО: запрет мультиязычных TTS-голосов (читают нем. слова по-английски; дневник 17.08)
    for pat in (os.path.join(ROOT,'tools','*.py'), os.path.join(ROOT,'site','js','*.js')):
        for f in glob.glob(pat):
            try: txt = open(f, encoding='utf-8').read()
            except Exception: continue
            m = re.search(r'[A-Za-z]+Multilingual[A-Za-z]*Neural', txt)  # только ID голоса
            if m:
                E += 1
                print(f'  ❌ {os.path.relpath(f,ROOT)} — голос {m.group(0)} мультиязычный: '
                      f'читает нем. слова (Rad/Land/Bad…) по-английски. Только моноязычные de-DE.')

    print('\n' + '═'*70)
    if E:
        print(f'❌ НЕ ДЕПЛОИТЬ. Ошибок: {E}, предупреждений: {W}')
        return 2
    print(f'✅ Ошибок нет. Предупреждений: {W}')
    return 0

if __name__ == '__main__':
    sys.exit(main())
