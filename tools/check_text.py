#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ПРОВЕРКА РОДА В ТЕКСТЕ ГЕРОЯ (главное правило метода).
Прогонять ДО выдачи любого текста героя:  python3 tools/check_text.py site/thema-a2-03-die.html
Печатает ВСЕ существительные текста и помечает ЧУЖОЙ род.
Цель: 0 чужеродных СОДЕРЖАТЕЛЬНЫХ существительных (природа/животные/предметы/категория).
Чужое — убрать или отдать герою того рода (die→Грета, der→Otto, das→Тео).
"""
import re, sys, os

# --- известный род (лемма -> der/die/das). Дополнять по мере новых слов. ---
GENDER = {
 # --- der ---
 'Garten':'der','Gärtner':'der','Norden':'der','Süden':'der','Osten':'der','Westen':'der',
 'Wald':'der','See':'der','Fluss':'der','Berg':'der','Hügel':'der','Strand':'der','Hund':'der',
 'Kaffee':'der','Sohn':'der','Enkel':'der','Morgen':'der','Tag':'der','Abend':'der','Mann':'der',
 'Himmel':'der','Baum':'der','Kakao':'der','Lieblingsplatz':'der','Park':'der','Wind':'der',
 'Ort':'der','Wohnort':'der','Espresso':'der','Traum':'der',
 # --- die ---
 'Natur':'die','Landschaft':'die','Wiese':'die','Brücke':'die','Sonne':'die','Kuh':'die',
 'Katze':'die','Biene':'die','Heimat':'die','Farbe':'die','Gegend':'die','Welt':'die',
 'Familie':'die','Mutter':'die','Freundin':'die','Kindheit':'die','Kamera':'die','Ordnung':'die',
 'Nachbarin':'die','Blume':'die','Pflanze':'die','Stelle':'die','Insel':'die','Luft':'die',
 'Landschaftsarchitektin':'die','Wärme':'die','Küche':'die','Stadt':'die',
 'Küste':'die','Aussicht':'die','Liebe':'die','Milch':'die','Ecke':'die','Kindern':'die',
 # --- das ---
 'Tier':'das','Pferd':'das','Schaf':'das','Feld':'das','Dorf':'das','Tal':'das','Meer':'das',
 'Ufer':'das','Kaninchen':'das','Land':'das','Kind':'das','Mädchen':'das','Haus':'das',
 'Glück':'das','Problem':'das','Rätsel':'das','Spiel':'das','Foto':'das','Herz':'das',
 'Wasser':'das','Gras':'das','Zuhause':'das','Jahr':'das','Fest':'das','Essen':'das','Dorf ':'das',
 'Frage-Kind':'das','Lieblingsfenster':'das','Fenster':'das',
}
# формы мн.ч./склонения -> лемма
LEMMA = {
 'Hügeln':'Hügel','Schafen':'Schaf','Schafe':'Schaf','Pflanzen':'Pflanze','Seen':'See','Wälder':'Wald',
 'Tieren':'Tier','Tiere':'Tier','Ländern':'Land','Pferde':'Pferd','Spiele':'Spiel','Bergen':'Berg',
 'Fotos':'Foto','Wiesen':'Wiese','Farben':'Farbe','Bienen':'Biene','Gärten':'Garten','Bäumen':'Baum',
 'Landschaften':'Landschaft','Kinder':'Kind','Blumen':'Blume','Inseln':'Insel',
 'Felder':'Feld','Feldern':'Feld','Brücken':'Brücke','Kühe':'Kuh',
}
# имена собственные и НЕ-существительные с заглавной (служебные, начало предложения) — игнор
IGNORE = set("""Otto Greta Theo Lina Bianca Anna Ben Noah Lea Mümmel Mamma Deutschland Schottland
Italien Neapel Österreich Polen Toskana Welt? Er Sie Es Aber Und Am Im In Dann Dort Hier Jeden Als So
Was Wo Warum Welches Welche Neben Zu Auf Schau Cool Ein Eine Einmal Das Die Der Den Dem Sein Seine Seinen
Ihre Ihr Manchmal Gelb Rot Grün Blau Dies Diese Mit Von Bei Wie Nur Noch Wenn Denn Hause Zuhause""".split())

def main():
    if len(sys.argv)<2:
        print("usage: check_text.py <page.html>"); return 1
    path=sys.argv[1]
    target=None
    m=re.search(r'-(der|die|das)\.html$',os.path.basename(path))
    if m: target=m.group(1)
    h=open(path,encoding='utf-8').read()
    tm=re.search(r'const TEXT_DE=`(.*?)`;',h,re.S)
    if not tm: print("TEXT_DE не найден"); return 1
    t=tm.group(1)
    t=re.sub(r"VB\('([^']+)','[^']*'\)",r'\1',t)
    t=re.sub(r"N\('([^']+)','[^']*'\)",r'\1',t)
    t=t.replace('<br>',' ')
    caps=re.findall(r'\b([A-ZÄÖÜ][A-Za-zÄÖÜäöüß-]+)\b',t)
    target_ok=[]; foreign=[]; unknown=[]; ignored=set()
    seen=set()
    for w in caps:
        if w in IGNORE: ignored.add(w); continue
        lemma=LEMMA.get(w,w)
        g=GENDER.get(lemma)
        key=lemma
        if key in seen and g is not None: continue
        seen.add(key)
        if g is None:
            if w not in unknown: unknown.append(w)
        elif g==target:
            target_ok.append(f"{g} {lemma}")
        else:
            foreign.append(f"{g} {lemma}  ← в тексте «{w}»")
    print(f"\n=== {path}  (цель: {target}) ===")
    print(f"\n✅ Свой род ({target}), {len(target_ok)}: "+', '.join(sorted(set(target_ok))))
    print(f"\n❌ ЧУЖОЙ РОД ({len(foreign)}):")
    for f in sorted(set(foreign)): print("   "+f)
    if not foreign: print("   — нет, чисто.")
    print(f"\n❓ Не в словаре родов — проверить вручную ({len(unknown)}): "+', '.join(unknown))
    print(f"\n(игнор — имена/служебные: {', '.join(sorted(ignored))})")
    return 0 if not foreign else 2

if __name__=='__main__':
    sys.exit(main())
