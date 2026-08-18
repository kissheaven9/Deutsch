#!/usr/bin/env python3
# Озвучка слов темы «Суффиксы рода». Читает site/js/suffixe.js DATA.words.
# audio/word/<slug(bare)>.mp3 голосом по роду. ⛔ только моноязычные de-DE.
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
    return re.sub(r'[^a-z0-9]+','-', s).strip('-')
def words():
    txt = open(os.path.join(ROOT,'js','suffixe.js'), encoding='utf-8').read()
    out, seen = [], set()
    for art, w in re.findall(r"\['(der|die|das)\s+([^']+?)','[^']*','[^']*'\]", txt):
        if (art,w) not in seen:
            seen.add((art,w)); out.append((art,w))
    return out
async def tts(text, art, path):
    v = VOICE[art]
    await edge_tts.Communicate(text, v['voice'], rate=v['rate'], pitch=v['pitch']).save(path)
async def main():
    force = '--force' in sys.argv
    ws = words(); print(f'слов в теме: {len(ws)}')
    made = skip = 0
    for art, w in ws:
        p = os.path.join(WORD, slug(w)+'.mp3')
        if os.path.exists(p) and not force: skip += 1; continue
        await tts(w, art, p); made += 1; print(f'  ✓ {art} {w}')
    print(f'готово: сгенерировано {made}, пропущено {skip}')
if __name__ == '__main__':
    asyncio.run(main())
