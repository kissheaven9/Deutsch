#!/usr/bin/env python3
# Озвучка слов темы «Существительные-хвостики».
# Читает site/js/hvostiki.js, берёт слова из DATA.words (['der Marktplatz','...','-platz']),
# генерит audio/word/<slug(bare)>.mp3 голосом по роду (der=Killian, die=Katja, das=детский Amala).
# playWord на страницах играет bare-слово (без артикля) → слаг без артикля.
# ⛔ Только моноязычные de-DE голоса (никаких *Multilingual*).
import asyncio, re, os, sys
import edge_tts

ROOT = os.path.join(os.path.dirname(__file__), '..', 'site')
WORD = os.path.join(ROOT, 'audio', 'word')
os.makedirs(WORD, exist_ok=True)

VOICE = {
    'der': dict(voice='de-DE-KillianNeural', rate='-4%', pitch='-2Hz'),
    'die': dict(voice='de-DE-KatjaNeural',   rate='+0%', pitch='+0Hz'),
    'das': dict(voice='de-DE-AmalaNeural',   rate='+6%', pitch='+30Hz'),
}

def slug(s):
    s = s.lower().replace('ä','ae').replace('ö','oe').replace('ü','ue').replace('ß','ss')
    s = re.sub(r'[^a-z0-9]+','-', s)
    return s.strip('-')

def words():
    txt = open(os.path.join(ROOT,'js','hvostiki.js'), encoding='utf-8').read()
    # ['der Marktplatz','рыночная площадь','-platz']  → (der, Marktplatz)
    # 3-е поле ОБЯЗАТЕЛЬНО хвостик (-xxx или Ge-) — иначе цепляем примеры-фразы стишка.
    out, seen = [], set()
    for art, w, _ in re.findall(r"\['(der|die|das)\s+([^']+?)','[^']*','(-[^']*|Ge-)'\]", txt):
        key = (art, w)
        if key not in seen:
            seen.add(key); out.append((art, w))
    return out

async def tts(text, art, path):
    v = VOICE[art]
    c = edge_tts.Communicate(text, v['voice'], rate=v['rate'], pitch=v['pitch'])
    await c.save(path)

async def main():
    force = '--force' in sys.argv
    ws = words()
    print(f'слов в теме: {len(ws)}')
    made = skipped = 0
    for art, w in ws:
        path = os.path.join(WORD, slug(w)+'.mp3')
        if os.path.exists(path) and not force:
            skipped += 1; continue
        await tts(w, art, path)   # bare-слово (без артикля), голосом рода
        made += 1
        print(f'  ✓ {art} {w} → {os.path.basename(path)}')
    print(f'готово: сгенерировано {made}, пропущено (уже есть) {skipped}')

if __name__ == '__main__':
    asyncio.run(main())
