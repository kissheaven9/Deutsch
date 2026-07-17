# -*- coding: utf-8 -*-
# ГЕНЕРАТОР блока «Неотделяемые глаголы» (семья ГРЕТЫ) → site/thema-untrennbar.html
# Отличие от Отто: приставка НЕ отделяется (überprüfe, а не «prüfe über»), Perfekt БЕЗ -ge-.
# Предложения для упражнений БЕРУТСЯ ИЗ ИСТОРИИ (глагол уже в живой ситуации, разные лица),
# а не штампуются шаблоном — docs/17 §0б.
# Запуск: python3 tools/gen_untrennbar.py        (идемпотентно)
import re, os, sys, asyncio, edge_tts
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from verben_engine import conj_full, perfekt_forms, PRO_AUDIO
from verbs_greta import VERBS

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'site'))
WORD = os.path.join(ROOT, 'audio', 'word'); os.makedirs(WORD, exist_ok=True)
DATA = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data'))
VOICE = 'de-DE-KatjaNeural'   # ГОЛОС ГРЕТЫ (die). НИКОГДА не браузерный speak().

def slug(s):
    s = s.lower().replace('ä','ae').replace('ö','oe').replace('ü','ue').replace('ß','ss')
    return re.sub(r'[^a-z0-9]+','-',s).strip('-')

def load_texts():
    raw = open(os.path.join(DATA,'greta-untrennbar-text-de.md'), encoding='utf-8').read()
    return re.findall(r'textDE:`(.*?)`,', raw, re.S)

def sentences(t):
    t = re.sub(r'\s+',' ', t).strip()
    return [s.strip() for s in re.split(r'(?<=[.!?])\s+', t) if s.strip()]

def find_sentence(sents, forms):
    """предложение из истории, где глагол реально живёт (самая длинная форма — точнее)"""
    for f in sorted(forms, key=len, reverse=True):
        for s in sents:
            # регистр: в начале предложения форма с большой буквы («Bestehe ich das?»)
            m = re.search(r'\b'+re.escape(f)+r'\b', s, re.I)
            if m:
                return s, m.group(0)
    return None, None

audio = {}
text_audio = {}     # ТЕКСТЫ частей — тоже mp3 Гретой! speak() (робот) запрещён (дневник 09.07 и 16.07)
parts = []
texts = load_texts()
assert len(texts) == len(VERBS), (len(texts), len(VERBS))

for pi, verbs in enumerate(VERBS):
    sents = sentences(texts[pi])
    conj, gap, pgap, miss = [], [], [], []
    for inf, ru, pp in verbs:
        full, part, base = conj_full(inf, pp)     # part=='' у неотделяемых — не разделяется
        conj.append((inf, ru, full))
        for i in range(6):
            ph = PRO_AUDIO[i] + ' ' + full[i]
            audio[slug(ph)] = ph
        audio[slug(inf)] = inf
        audio[slug(pp)] = pp
        partizip = pp.split()[-1]
        s, f = find_sentence(sents, set(full) | {partizip, inf})
        if not s:
            miss.append(inf); continue
        # ПРЯСЕНС-пропуск: одно поле (приставка не отлетает!)
        before, after = s.split(f, 1)
        gap.append((before, f, after, inf))
        audio[slug(s)] = s
    plain = re.sub(r'\s+', ' ', texts[pi]).strip()
    text_audio['greta-part-%d' % (pi+1)] = plain
    parts.append(dict(conj=conj, gap=gap))
    if miss: print('  ⚠️ часть %d: не нашла в тексте: %s' % (pi+1, ', '.join(miss)))

print('частей:', len(parts), '| глаголов:', sum(len(p['conj']) for p in parts),
      '| пропусков из истории:', sum(len(p['gap']) for p in parts))
print('аудио-фраз:', len(audio))

async def tts(t, out):
    if os.path.exists(out): return 'skip'
    for a in range(5):
        try:
            await edge_tts.Communicate(t, VOICE, rate='-4%', pitch='+0Hz').save(out); return 'ok'
        except Exception: await asyncio.sleep(2*(a+1))
    return 'fail'

async def main():
    # 1) тексты частей — отдельными файлами audio/greta-part-N.mp3
    AUD = os.path.join(ROOT, 'audio')
    for name, t in text_audio.items():
        r = await tts(t, os.path.join(AUD, name + '.mp3'))
        print('  текст %s: %s' % (name, r))
    # 2) слова/формы/предложения
    d=s=f=0; items=list(audio.items())
    for k,(sl,t) in enumerate(items):
        r = await tts(t, os.path.join(WORD, sl+'.mp3'))
        if r=='ok': d+=1
        elif r=='skip': s+=1
        else: f+=1; print('  ✗', t[:40])
        if (k+1)%60==0: print('  ...', k+1, '/', len(items))
    print('аудио Греты: новых', d, 'было', s, 'ошибок', f)

if __name__ == '__main__':
    if '--audio' in sys.argv:
        asyncio.run(main())
    else:
        print('(данные посчитаны; для озвучки: --audio)')
