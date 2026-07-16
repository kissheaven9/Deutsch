# -*- coding: utf-8 -*-
import re, os, asyncio, edge_tts
ROOT='/Users/kissheaven99gmail.com/Documents/Projects/Deutsch/site'
WORD=os.path.join(ROOT,'audio','word')
h=open(os.path.join(ROOT,'thema-trennbar.html'),encoding='utf-8').read()
pps=set()
for m in re.finditer(r"verbs:\[(.*?)\n \],", h, re.S):
    for v in re.finditer(r"\['[^']+','[^']*','((?:hat|ist) [^']+)'\]", m.group(1)):
        pps.add(v.group(1))
def slug(s):
    s=s.lower().replace('ä','ae').replace('ö','oe').replace('ü','ue').replace('ß','ss')
    return re.sub(r'[^a-z0-9]+','-',s).strip('-')
print('причастий:',len(pps))
async def tts(t,out):
    if os.path.exists(out): return 'skip'
    for a in range(5):
        try: await edge_tts.Communicate(t,'de-DE-KillianNeural',rate='-8%',pitch='-2Hz').save(out); return 'ok'
        except Exception: await asyncio.sleep(2*(a+1))
    return 'fail'
async def main():
    d=s=f=0
    for t in sorted(pps):
        r=await tts(t,os.path.join(WORD,slug(t)+'.mp3'))
        if r=='ok':d+=1
        elif r=='skip':s+=1
        else:f+=1;print('✗',t)
    print('готово: новых',d,'было',s,'ошибок',f)
asyncio.run(main())
