#!/usr/bin/env python3
# Генерация живых нейроголосов (edge-tts, бесплатно) для текстов сцен и диалогов.
# Голоса: Otto=мужской, Грета=женский, дети=детский (женский + выше).
import asyncio, re, sys, os
from html.parser import HTMLParser
import edge_tts

ROOT = os.path.join(os.path.dirname(__file__), '..', 'site')
AUDIO = os.path.join(ROOT, 'audio')
os.makedirs(AUDIO, exist_ok=True)

VOICE = {
    'male':   dict(voice='de-DE-KillianNeural', rate='-4%',  pitch='-2Hz'),
    'female': dict(voice='de-DE-KatjaNeural',   rate='+0%',  pitch='+0Hz'),
    'child':  dict(voice='de-DE-SeraphinaMultilingualNeural', rate='+8%', pitch='+28Hz'),
    '':       dict(voice='de-DE-KatjaNeural',   rate='+0%',  pitch='+0Hz'),
}

def clean(t):
    t = re.sub(r'<[^>]+>', ' ', t)
    t = (t.replace('&nbsp;',' ').replace('&amp;','&').replace('&laquo;','«').replace('&raquo;','»'))
    return re.sub(r'\s+', ' ', t).strip()

# --- 1) тексты сцен (одним голосом) ---
SCENES = [
    ('scene-der1', 'male',   'thema-01-der.html'),
    ('scene-die1', 'female', 'thema-01-die.html'),
    ('scene-das1', 'child',  'thema-01-das.html'),
    ('scene-der2', 'male',   'thema-02-der.html'),
]
def scene_text(fn):
    html = open(os.path.join(ROOT, fn), encoding='utf-8').read()
    m = re.search(r'id="deText"[^>]*>(.*?)</p>', html, re.S)
    return clean(m.group(1)) if m else ''

# --- 2) диалоги (по репликам, голос по говорящему) ---
class Lines(HTMLParser):
    def __init__(self):
        super().__init__(); self.lines=[]; self.cur=None; self.role=None; self.skip=0; self.in_sp=False
    def handle_starttag(self, tag, attrs):
        a=dict(attrs); cls=a.get('class','')
        if tag=='p':
            self.cur=[]; self.role=''; self.has_sp=False
        if tag=='span' and 'sp' in cls.split():
            self.in_sp=True; self.has_sp=True
            self.role = 'male' if 'der' in cls.split() else 'female' if 'die' in cls.split() else 'child' if 'das' in cls.split() else ''
        if tag=='span' and 'rem' in cls.split():
            self.skip+=1
    def handle_endtag(self, tag):
        if tag=='span':
            if self.in_sp: self.in_sp=False
            elif self.skip>0: self.skip-=1
        if tag=='p' and self.cur is not None:
            txt=re.sub(r'\s+',' ',''.join(self.cur)).strip()
            if getattr(self,'has_sp',False) and txt:
                self.lines.append((self.role, txt))
            self.cur=None
    def handle_data(self, data):
        if self.cur is not None and not self.in_sp and self.skip==0:
            self.cur.append(data)

def dialog_lines(n, html):
    m = re.search(r'%d:\{[^`]*?de:`(.*?)`,\s*ru:' % n, html, re.S)
    if not m: return []
    p = Lines(); p.feed(m.group(1)); return p.lines

async def tts(text, role, out):
    cfg = VOICE.get(role, VOICE[''])
    c = edge_tts.Communicate(text, cfg['voice'], rate=cfg['rate'], pitch=cfg['pitch'])
    await c.save(out)
    print('  ✓', os.path.basename(out), '·', role, '·', text[:42])

async def main():
    # сцены
    for sid, role, fn in SCENES:
        t = scene_text(fn)
        if t: await tts(t, role, os.path.join(AUDIO, sid+'.mp3'))
        else: print('  ! нет текста в', fn)
    # диалоги
    dhtml = open(os.path.join(ROOT,'dialog.html'), encoding='utf-8').read()
    for n in (1,2,3):
        lines = dialog_lines(n, dhtml)
        print(f'диалог {n}: {len(lines)} реплик')
        for i,(role,txt) in enumerate(lines):
            await tts(txt, role, os.path.join(AUDIO, f'dlg-{n}-{i}.mp3'))

asyncio.run(main())
print('Готово.')
