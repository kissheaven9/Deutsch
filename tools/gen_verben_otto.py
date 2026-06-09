# -*- coding: utf-8 -*-
# Тренажёр прошедшей формы для 8 глаголов Отто (Lektion 20).
# Блоки: A präsens↔perfekt, B präs→perf, C 8 предложений (разные лица/время/приставка), D вставка, E диктовка.
import asyncio, os, json, edge_tts
ROOT=os.path.join(os.path.dirname(__file__),'..','site')
AUD=os.path.join(ROOT,'audio','votto'); os.makedirs(AUD,exist_ok=True)
VOICE='de-DE-KillianNeural'
PRON=['Ich','Du','Er','Wir','Ihr','Sie']
RU=['я','ты','он','мы','вы','они']
HAB=['habe','hast','hat','haben','habt','haben']; SEIN=['bin','bist','ist','sind','seid','sind']

# inf, ru, prefix(или None), präsens stems[6], контекст, aux('hat'/'ist'), Partizip, [диктовка: 3 простых предложения]
V=[
 ('erfinden','изобретать',None,['erfinde','erfindest','erfindet','erfinden','erfindet','erfinden'],'eine App','hat','erfunden',
   ['Otto erfindet eine App.','Wir erfinden ein Spiel.','Er hat etwas Neues erfunden.']),
 ('vergessen','забывать',None,['vergesse','vergisst','vergisst','vergessen','vergesst','vergessen'],'die Blumen','hat','vergessen',
   ['Ich vergesse die Blumen.','Du vergisst den Termin.','Er hat das Handy vergessen.']),
 ('aufstehen','вставать','auf',['stehe','stehst','steht','stehen','steht','stehen'],'früh','ist','aufgestanden',
   ['Ich stehe früh auf.','Wir stehen spät auf.','Er ist heute früh aufgestanden.']),
 ('verbessern','улучшать',None,['verbessere','verbesserst','verbessert','verbessern','verbessert','verbessern'],'die App','hat','verbessert',
   ['Otto verbessert die App.','Wir verbessern den Service.','Er hat das Spiel verbessert.']),
 ('ausprobieren','пробовать','aus',['probiere','probierst','probiert','probieren','probiert','probieren'],'die App','hat','ausprobiert',
   ['Ich probiere die App aus.','Wir probieren das Spiel aus.','Greta hat die App ausprobiert.']),
 ('organisieren','организовывать',None,['organisiere','organisierst','organisiert','organisieren','organisiert','organisieren'],'die Arbeit','hat','organisiert',
   ['Otto organisiert die Arbeit.','Wir organisieren ein Fest.','Sie hat alles organisiert.']),
 ('beraten','консультировать',None,['berate','berätst','berät','beraten','beratet','beraten'],'die Kunden','hat','beraten',
   ['Otto berät die Kunden.','Wir beraten das Team.','Er hat mich gut beraten.']),
 ('bekommen','получать',None,['bekomme','bekommst','bekommt','bekommen','bekommt','bekommen'],'ein Paket','hat','bekommen',
   ['Ich bekomme ein Paket.','Wir bekommen Hilfe.','Otto hat zehn Kunden bekommen.']),
]

def pres(i,f,pref,ctx):
    return f"{PRON[i]} {f[i]} {ctx} {pref}." if pref else f"{PRON[i]} {f[i]} {ctx}."
def perf(i,aux,part,ctx):
    a=SEIN if aux=='ist' else HAB
    return f"{PRON[i]} {a[i]} {ctx} {part}."

async def tts(text,out):
    if os.path.exists(out): return
    for a in range(5):
        try: await edge_tts.Communicate(text,VOICE,rate='-2%',pitch='-2Hz').save(out); return
        except Exception: await asyncio.sleep(2*(a+1))
    print("  ✗",out)

async def main():
    DATA=[]; jobs=[]
    for inf,ru,pref,f,ctx,aux,part,dikt in V:
        sl=inf
        # A: настоящее — ВСЕ 6 форм (своё аудио p0..p5) + прошедшее (Perfekt)
        aform=[]
        for i in range(6):
            fn=f"{sl}-p{i}"; jobs.append((pres(i,f,pref,ctx),fn)); aform.append({'p':RU[i],'t':pres(i,f,pref,ctx),'f':fn})
        pform=[]
        for i in range(6):
            fn=f"{sl}-pf{i}"; jobs.append((perf(i,aux,part,ctx),fn)); pform.append({'p':RU[i],'t':perf(i,aux,part,ctx),'f':fn})
        pp_form=f"{(SEIN if aux=='ist' else HAB)[2]} {part}"  # er-форма Perfekt
        # B: präs->perf пары (ich, er, wir)
        bpairs=[]
        for i in (0,2,3):
            a=(SEIN if aux=='ist' else HAB)
            bpairs.append({'pres':pres(i,f,pref,ctx)[:-1],'a':f"{PRON[i]} {a[i]} {ctx} {part}"})
        # C: 8 предложений (4 präs разные лица + 4 perf разные лица), с аудио
        demo=[]
        order=[(0,'präs'),(1,'präs'),(2,'präs'),(3,'präs'),(0,'perf'),(2,'perf'),(3,'perf'),(5,'perf')]
        for k,(i,tn) in enumerate(order):
            t=pres(i,f,pref,ctx) if tn=='präs' else perf(i,aux,part,ctx)
            fn=f"{sl}-c{k}"; jobs.append((t,fn))
            lab=('Präsens' if tn=='präs' else 'Perfekt')+(' · приставка в конце' if (pref and tn=='präs') else (' · причастие' if tn=='perf' else ''))
            demo.append({'t':t,'lab':lab,'f':fn})
        # D: вставка формы (3): präs du, perf ich, präs wir
        gap=[]
        du=pres(1,f,pref,ctx); a=(SEIN if aux=='ist' else HAB)
        if pref: gap.append({'q':du.replace(f[1],'___',1).replace(' '+pref+'.',' ___.'),'a':f"{f[1]} {pref}",'h':'du · Präsens'})
        else: gap.append({'q':du.replace(f[1],'___',1),'a':f[1],'h':'du · Präsens'})
        pi=perf(0,aux,part,ctx); gap.append({'q':pi.replace(a[0],'___',1).replace(part,'___',1),'a':f"{a[0]} {part}",'h':'ich · Perfekt'})
        wi=pres(3,f,pref,ctx)
        if pref: gap.append({'q':wi.replace(f[3],'___',1).replace(' '+pref+'.',' ___.'),'a':f"{f[3]} {pref}",'h':'wir · Präsens'})
        else: gap.append({'q':wi.replace(f[3],'___',1),'a':f[3],'h':'wir · Präsens'})
        # E: диктовка (3 простых предложения, аудио, ответ = всё предложение)
        hear=[]
        for k,sent in enumerate(dikt):
            fn=f"{sl}-d{k}"; jobs.append((sent,fn)); hear.append({'t':sent,'f':fn})
        DATA.append({'inf':inf,'ru':ru,'sep':pref or '','perf':f"{aux} {part}",'aform':aform,'pform':pform,'ppform':pp_form,'b':bpairs,'demo':demo,'gap':gap,'hear':hear})
    open(os.path.join(ROOT,'js','verben-otto-data.js'),'w',encoding='utf-8').write("const VOTTO="+json.dumps(DATA,ensure_ascii=False)+";")
    print("данные записаны, глаголов:",len(DATA),"; аудио-задач:",len(jobs))
    for t,fn in jobs: await tts(t, os.path.join(AUD,fn+'.mp3'))
    print("аудио готово")

asyncio.run(main())
