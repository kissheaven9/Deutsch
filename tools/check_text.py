#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ШЛАГБАУМ ДЛЯ ТЕКСТА ГЕРОЯ — прогонять ДО выдачи любого текста.
Проверяет ДВА ядра метода (docs/17 §0):
  1) ЧИСТОТА РОДА  — в тексте героя только его род. Чужой род = ОБУЧЕНИЕ ОШИБКЕ
     (ученик привяжет слово к этому герою и выучит НЕВЕРНЫЙ род).
     Род берётся АВТОМАТИЧЕСКИ из site/js/woerter.js (словарь проекта) + EXTRA ниже.
  2) ЧИСТОТА ЛИНЗЫ — признак = ключ извлечения (вспомнил цену → Отто → der).
     Чужой тип признака загрязняет индекс. Ловит то, что проверка рода НЕ ловит:
     kosten/billig/teuer и цвета — это НЕ существительные, по роду их не поймать.
     Линза выводится из рода слова-категории: der Preis→Отто, die Farbe→Грета, das Material→Тео.

Использование:
  python3 tools/check_text.py site/thema-a2-03-die.html
  python3 tools/check_text.py site/thema-trennbar.html --hero der
  python3 tools/check_text.py site/thema-02-der.html --require "Stuhl,Tisch,Schrank"
Код возврата: 0 — чисто; 2 — ошибки (чужой род / грязная линза / нет нужных слов).
"""
import re, sys, os, argparse

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
WOERTER = os.path.join(ROOT, 'site', 'js', 'woerter.js')


def gender_from_woerter():
    """Род АВТОМАТИЧЕСКИ из словаря проекта — чтобы не вести список руками."""
    g, cur = {}, None
    if not os.path.exists(WOERTER):
        return g
    for line in open(WOERTER, encoding='utf-8'):
        if re.search(r'\bder:\[', line): cur = 'der'
        elif re.search(r'\bdie:\[', line): cur = 'die'
        elif re.search(r'\bdas:\[', line): cur = 'das'
        elif re.search(r'\b(verbs|other|andere|pluralOnly|countries|langs)\s*:', line): cur = None
        if cur:
            for w in re.findall(r'\["([^"]+)"', line):
                g.setdefault(w.strip(), cur)
    return g


# добивка: слова сцен, которых пока нет в словаре (дополнять по мере надобности)
EXTRA = {
 'Garten':'der','Gärtner':'der','Norden':'der','Süden':'der','Osten':'der','Westen':'der','Wald':'der',
 'See':'der','Fluss':'der','Berg':'der','Hügel':'der','Strand':'der','Hund':'der','Sohn':'der','Enkel':'der',
 'Morgen':'der','Tag':'der','Abend':'der','Mann':'der','Himmel':'der','Baum':'der','Kakao':'der','Park':'der',
 'Wind':'der','Ort':'der','Wohnort':'der','Traum':'der','Kunststoff':'der','Rock':'der','Hut':'der',
 'Verkäufer':'der','Container':'der','Müll':'der','Bus':'der','Hauptbahnhof':'der','Flughafen':'der',
 'Vormittag':'der','Fernseher':'der','Fischkuchen':'der','Punkt':'der','Hörer':'der','Schirm':'der',
 'Natur':'die','Landschaft':'die','Wiese':'die','Brücke':'die','Sonne':'die','Kuh':'die','Katze':'die',
 'Biene':'die','Heimat':'die','Farbe':'die','Gegend':'die','Welt':'die','Familie':'die','Mutter':'die',
 'Freundin':'die','Kamera':'die','Nachbarin':'die','Blume':'die','Pflanze':'die','Insel':'die','Luft':'die',
 'Küche':'die','Stadt':'die','Küste':'die','Straßenbahn':'die','App':'die','Postleitzahl':'die',
 'Lieblingssendung':'die','Antwort':'die','Information':'die','Tür':'die','Party':'die','Prüfung':'die',
 'Tier':'das','Pferd':'das','Schaf':'das','Feld':'das','Dorf':'das','Tal':'das','Meer':'das','Ufer':'das',
 'Kaninchen':'das','Land':'das','Kind':'das','Mädchen':'das','Haus':'das','Glück':'das','Problem':'das',
 'Wasser':'das','Gras':'das','Jahr':'das','Fest':'das','Essen':'das','Fenster':'das','Material':'das',
 'Gartenfest':'das','Flugzeug':'das','Formular':'das','Frühstück':'das','Tagebuch':'das','Licht':'das',
 'Holz':'das','Metall':'das','Glas':'das','Plastik':'das','Sonderangebot':'das','Stück':'das',
 'Geschenk':'das','Konzert':'das','Radio':'das','Fußballspiel':'das','Mittagessen':'das','Wort':'das',
}
# СТРУКТУРНЫЕ/временные — по CLAUDE.md требуется «0 чужеродных СОДЕРЖАТЕЛЬНЫХ»;
# структурные лечатся наречием (täglich/morgens/abends) → это предупреждение, не ошибка.
STRUCTURAL = {'Tag','Morgen','Abend','Nacht','Woche','Wochenende','Monat','Jahr','Zeit','Uhr',
              'Stunde','Minute','Wort','Herz','Mal','Moment'}

LEMMA = {
 'Hügeln':'Hügel','Schafen':'Schaf','Schafe':'Schaf','Pflanzen':'Pflanze','Seen':'See','Wälder':'Wald',
 'Tieren':'Tier','Tiere':'Tier','Ländern':'Land','Pferde':'Pferd','Bergen':'Berg','Wiesen':'Wiese',
 'Farben':'Farbe','Bienen':'Biene','Gärten':'Garten','Bäumen':'Baum','Landschaften':'Landschaft',
 'Kinder':'Kind','Blumen':'Blume','Inseln':'Insel','Felder':'Feld','Feldern':'Feld','Brücken':'Brücke',
 'Kühe':'Kuh','Termine':'Termin','Geschenke':'Geschenk','Orangen':'Orange','Nachbarn':'Nachbar',
 'Wörter':'Wort','Punkte':'Punkt','Gefühle':'Gefühl','Leute':'Leute','Schuhe':'Schuh','Tassen':'Tasse',
}
IGNORE = set("""Otto Greta Grete Theo Lina Bianca Anna Ben Noah Lea Mümmel Mamma Finlay Deutschland
Schottland Italien Neapel Österreich Polen Toskana Er Sie Es Aber Und Am Im In Dann Dort Hier Jeden Als So
Was Wo Warum Welches Welche Neben Zu Auf Schau Cool Ein Eine Einmal Das Die Der Den Dem Sein Seine Seinen
Ihre Ihr Manchmal Dies Diese Mit Von Bei Wie Nur Noch Wenn Denn Hause Zuhause Hallo Danke Bitte Guten Ich
Du Wir Alle Heute Morgen Nach Vor Beim Zuerst Danach Bald Fast Darum Übrigens Gute Nacht Vielen Samstag
Sonntag Montag Freitag Deutsch Perfekt Präsens Opa Mein Meine Meinen Unterwegs Zusammen Ende Gib Mach
Kannst Ruf Bring Denk Wann Wer Wen Wohin Kreuzen Streichen Füllen Geben Sehen Machen Alles Etwas Man""".split())

# --- ЛИНЗА (docs/17 §0): категорию назначает род САМОГО слова категории ---
LENS_OWNER = {'der': 'Отто · ЦЕНА (der Preis)', 'die': 'Грета · ЦВЕТ (die Farbe)', 'das': 'Тео · МАТЕРИАЛ (das Material)'}
PRICE_LEX = ['kosten','kostet','kostete','billig','billiger','günstig','günstiger','teuer','teurer','preiswert']
COLOR_LEX = ['weiß','weiss','gelb','orange','rot','grün','blau','braun','schwarz','grau','hellblau',
             'dunkelgrün','hellgrün','dunkelblau','bunt']
MATERIAL_LEX = ['aus holz','aus metall','aus glas','aus plastik','material']
OTTO_MATERIAL_OK = 'kunststoff'   # у Отто материал ОДИН и он МУЖСКОЙ — это сигнатура, не нарушение


def extract_texts(html):
    """Все форматы, в которых в проекте лежит немецкий текст сцены."""
    out = []
    for m in re.finditer(r'const TEXT_DE=`(.*?)`;', html, re.S):
        out.append(('TEXT_DE', m.group(1)))                       # сцены A2
    for m in re.finditer(r'textDE:\s*`(.*?)`,', html, re.S):
        out.append(('textDE', m.group(1)))                        # части thema-trennbar
    # Темы 1–2: текст лежит ПРЯМО В HTML (<p id="deText">…</p>) — эти страницы
    # раньше не проверялись вообще (ни новым, ни старым чекером).
    for m in re.finditer(r'id="deText"[^>]*>(.*?)</p>', html, re.S):
        out.append(('deText(html)', m.group(1)))
    if not out:
        for m in re.finditer(r'\bde:\s*`(.*?)`,', html, re.S):
            out.append(('de', m.group(1)))                        # thema-20 / диалоги
    # пустые placeholder-ы (<p id="deText"></p>, который заполняет JS) — не текст
    return [(l, t) for l, t in out if len(clean(t)) > 20]


def clean(t):
    t = re.sub(r"\$\{VB\('([^']+)','[^']*'\)\}", r'\1', t)
    t = re.sub(r"\$\{P\('([^']+)'\)\}", r'\1', t)
    t = re.sub(r"VB\('([^']+)','[^']*'\)", r'\1', t)
    t = re.sub(r"V\('([^']+)','[^']*'\)", r'\1', t)
    t = re.sub(r"V\('([^']+)'\)", r'\1', t)
    t = re.sub(r"N\('([^']+)','[^']*'\)", r'\1', t)
    t = re.sub(r"P\('([^']+)'\)", r'\1', t)
    t = re.sub(r'\$\{[^}]*\}', ' ', t)
    t = re.sub(r'<[^>]+>', ' ', t)
    t = t.replace('&nbsp;', ' ').replace('&amp;', '&')
    return re.sub(r'\s+', ' ', t).strip()


def check_one(label, text, target, gen, require):
    errors, warns = [], []
    print('\n' + '─' * 78)
    print(f'▶ {label}   (цель: {target} — {LENS_OWNER.get(target, "?")})')

    # 1. РОД
    own, foreign, structural, unknown, seen = [], [], [], [], set()
    for w in re.findall(r'\b([A-ZÄÖÜ][A-Za-zÄÖÜäöüß-]+)\b', text):
        if w in IGNORE: continue
        lemma = LEMMA.get(w, w)
        g = gen.get(lemma)
        if lemma in seen and g: continue
        seen.add(lemma)
        if g is None:
            if w not in unknown: unknown.append(w)
        elif g == target:
            own.append(lemma)
        elif lemma in STRUCTURAL:
            structural.append(f'{g} {lemma}')
        else:
            foreign.append(f'{g} {lemma}')
    print(f'  ✅ свой род ({target}): {len(set(own))} — ' + ', '.join(sorted(set(own))[:14]) + ('…' if len(set(own)) > 14 else ''))
    if foreign:
        errors.append(f'чужой род ×{len(set(foreign))}')
        print(f'  ❌ ЧУЖОЙ РОД ({len(set(foreign))}) — ОБУЧЕНИЕ ОШИБКЕ:')
        for f in sorted(set(foreign)):
            print(f'       {f}   → убрать / синоним своего рода / отдать герою того рода')
    else:
        print('  ✅ чужеродных содержательных нет')
    if structural:
        warns.append(f'структурные ×{len(set(structural))}')
        print(f'  ⚠️  чужой род, но СТРУКТУРНЫЙ ({len(set(structural))}): {", ".join(sorted(set(structural)))}')
        print('       → заменить наречием (täglich/morgens/abends/heute) или убрать')
    if unknown:
        print(f'  ❓ нет в словаре, проверить и внести ({len(unknown)}): ' + ', '.join(unknown[:18]))

    # 2. ЛИНЗА
    low = text.lower()
    price = sorted({w for w in PRICE_LEX if re.search(r'\b' + re.escape(w) + r'\b', low)})
    color = sorted({w for w in COLOR_LEX if re.search(r'\b' + re.escape(w) + r'\b', low)})
    material = sorted({m for m in MATERIAL_LEX if m in low})
    if target == 'der':
        if color:
            warns.append('цвет у Отто')
            print(f'  ⚠️  ЦВЕТ в тексте Отто — это линза Греты: {", ".join(color)} (у Отто акцент — ЦЕНА)')
        if material and OTTO_MATERIAL_OK not in low:
            warns.append('материал у Отто')
            print(f'  ⚠️  МАТЕРИАЛ в тексте Отто — линза Тео: {", ".join(material)}. У Отто материал ОДИН — der Kunststoff (муж.)')
        if price:
            print(f'  ✅ линза на месте (цена): {", ".join(price)}')
        else:
            warns.append('нет цены у Отто')
            print('  ⚠️  ЦЕНЫ нет — линза Отто не работает (нет ключа извлечения → der)')
    elif target == 'die':
        if price:
            errors.append('цена у Греты')
            print(f'  ❌ ЦЕНА в тексте Греты — ЗАПРЕЩЕНО (docs/10): {", ".join(price)} → убрать, её линза — ЦВЕТ')
        if material:
            errors.append('материал у Греты')
            print(f'  ❌ МАТЕРИАЛ в тексте Греты — линза Тео: {", ".join(material)} → убрать')
        if color:
            print(f'  ✅ линза на месте (цвет): {", ".join(color)}')
        else:
            warns.append('нет цвета у Греты')
            print('  ⚠️  ЦВЕТА нет — линза Греты не работает (нет ключа → die)')
    elif target == 'das':
        if price:
            # docs/10 запрещает цену явно только Грете; у Тео есть своё das Sonderangebot (ср. род),
            # поэтому здесь предупреждение, а не ошибка: правило строже документации не выдумываем.
            warns.append('цена у Тео')
            print(f'  ⚠️  ЦЕНА в тексте Тео — линза Отто: {", ".join(price)}. У Тео ценовое слово одно — das Sonderangebot')
        if len(color) > 2:
            warns.append('много цвета у Тео')
            print(f'  ⚠️  ЦВЕТ у Тео — только ФОНОМ, а его много: {", ".join(color)}')
        if material:
            print(f'  ✅ линза на месте (материал): {", ".join(material)}')
        else:
            warns.append('нет материала у Тео')
            print('  ⚠️  МАТЕРИАЛА нет — линза Тео не работает (нет ключа → das)')

    # 3. ОБЪЁМ
    n = len(re.findall(r'\b\w+\b', text))
    if n < 150:
        warns.append(f'объём {n}')
        print(f'  ⚠️  ОБЪЁМ {n} слов — мало (норма ≥150, на A2 больше)')
    else:
        print(f'  ✅ объём {n} слов')

    # 4. ПОКРЫТИЕ
    if require:
        missing, thin = [], []
        for w in require:
            c = len(re.findall(r'\b' + re.escape(w), text))
            if c == 0: missing.append(w)
            elif c < 2: thin.append(f'{w}({c})')
        if missing:
            errors.append(f'нет слов ×{len(missing)}')
            print(f'  ❌ НЕТ В ТЕКСТЕ ({len(missing)}): {", ".join(missing)}')
        if thin:
            warns.append('слова 1 раз')
            print(f'  ⚠️  только 1 раз (норма 2+): {", ".join(thin)}')
        if not missing and not thin:
            print(f'  ✅ покрытие {len(require)}/{len(require)}, каждое 2+ раз')
    return errors, warns


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('page')
    ap.add_argument('--hero', choices=['der', 'die', 'das'])
    ap.add_argument('--require', default='')
    a = ap.parse_args()

    target = a.hero
    if not target:
        m = re.search(r'-(der|die|das)\.html$', os.path.basename(a.page))
        if m: target = m.group(1)
    if not target:
        print('Не понял род героя. Укажи --hero der|die|das'); return 1

    gen = gender_from_woerter()
    src = len(gen)
    for k, v in EXTRA.items():
        gen.setdefault(k, v)
    html = open(a.page, encoding='utf-8').read()
    texts = extract_texts(html)
    if not texts:
        print('Текст не найден (жду TEXT_DE=`…`, textDE:`…` или de:`…`)'); return 1

    print(f'=== {a.page} ===')
    print(f'словарь родов: {src} из woerter.js + {len(gen)-src} из EXTRA = {len(gen)}')
    require = [w.strip() for w in a.require.split(',') if w.strip()]
    E, W = [], []
    for i, (label, raw) in enumerate(texts, 1):
        e, w = check_one(f'{label} #{i}', clean(raw), target, gen, require)
        E += e; W += w

    print('\n' + '═' * 78)
    if E:
        print(f'❌ НЕ ВЫДАВАТЬ. Ошибок: {len(E)} — {"; ".join(E)}')
        if W: print(f'⚠️  предупреждений {len(W)}: {"; ".join(W)}')
        return 2
    print('✅ Ошибок нет.' + (f'   ⚠️ предупреждения ({len(W)}): {"; ".join(W)}' if W else ''))
    print('   Машина НЕ проверяет «прожито или названо» — прогони тесты docs/17 §0б сам:')
    print('   вычёркивания · анонимности · «ну и что?»')
    return 0


if __name__ == '__main__':
    sys.exit(main())
