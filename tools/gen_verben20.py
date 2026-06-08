# -*- coding: utf-8 -*-
# Тренажёр по 22 глаголам Lektion 20: примеры (Präsens+Futur, все местоимения),
# вставка формы, аудирование→перевод. Генерирует аудио (v20/) и данные (js/verben20-data.js).
import asyncio, os, re, json, edge_tts

ROOT=os.path.join(os.path.dirname(__file__),'..','site')
AUD=os.path.join(ROOT,'audio','v20'); os.makedirs(AUD,exist_ok=True)
VOICE=dict(voice='de-DE-KillianNeural', rate='-2%', pitch='-2Hz')  # один спокойный мужской голос

PRON=['Ich','Du','Er','Wir','Ihr','Sie']
RU_PRON=['Я','Ты','Он','Мы','Вы','Они']
WERD=['werde','wirst','wird','werden','werdet','werden']

# inf, ru, prefix(отделяемая или None), present-stem forms[6] (без приставки), контекст, [hear: (de_extra, ru)]
V=[
 ('aufstehen','вставать','auf',['stehe','stehst','steht','stehen','steht','stehen'],'früh',
   [('Wir stehen am Montag früh auf.','Мы встаём рано в понедельник.'),('Er steht heute spät auf.','Он сегодня встаёт поздно.')]),
 ('einkaufen','закупаться','ein',['kaufe','kaufst','kauft','kaufen','kauft','kaufen'],'im Supermarkt',
   [('Ich kaufe heute im Supermarkt ein.','Я сегодня закупаюсь в супермаркете.'),('Wir kaufen am Samstag ein.','Мы закупаемся в субботу.')]),
 ('abholen','забирать','ab',['hole','holst','holt','holen','holt','holen'],'das Paket',
   [('Sie holt das Paket ab.','Она забирает посылку.'),('Wir holen dich ab.','Мы тебя заберём.')]),
 ('anrufen','звонить','an',['rufe','rufst','ruft','rufen','ruft','rufen'],'den Kunden',
   [('Ich rufe den Kunden an.','Я звоню клиенту.'),('Er ruft heute an.','Он сегодня звонит.')]),
 ('zurückrufen','перезванивать','zurück',['rufe','rufst','ruft','rufen','ruft','rufen'],'schnell',
   [('Otto ruft schnell zurück.','Отто быстро перезванивает.'),('Ich rufe später zurück.','Я перезвоню позже.')]),
 ('aussehen','выглядеть','aus',['sehe','siehst','sieht','sehen','seht','sehen'],'müde',
   [('Das Team sieht sympathisch aus.','Команда выглядит симпатично.'),('Du siehst heute gut aus.','Ты сегодня хорошо выглядишь.')]),
 ('einladen','приглашать','ein',['lade','lädst','lädt','laden','ladet','laden'],'die Freunde',
   [('Greta lädt die Freunde ein.','Грета приглашает друзей.'),('Wir laden dich ein.','Мы тебя приглашаем.')]),
 ('mitarbeiten','работать (в команде)','mit',['arbeite','arbeitest','arbeitet','arbeiten','arbeitet','arbeiten'],'im Projekt',
   [('Greta arbeitet im Projekt mit.','Грета работает в проекте.'),('Ich arbeite gern mit.','Я охотно участвую.')]),
 ('kennenlernen','знакомиться','kennen',['lerne','lernst','lernt','lernen','lernt','lernen'],'neue Leute',
   [('Er lernt neue Leute kennen.','Он знакомится с новыми людьми.'),('Wir lernen die Kollegen kennen.','Мы знакомимся с коллегами.')]),
 ('verlieren','терять',None,['verliere','verlierst','verliert','verlieren','verliert','verlieren'],'das Handy',
   [('Er verliert oft sein Handy.','Он часто теряет телефон.'),('Wir verlieren keine Zeit.','Мы не теряем времени.')]),
 ('bekommen','получать',None,['bekomme','bekommst','bekommt','bekommen','bekommt','bekommen'],'eine Stelle',
   [('Stefan bekommt eine Stelle.','Штефан получает должность.'),('Wir bekommen ein Paket.','Мы получаем посылку.')]),
 ('erzählen','рассказывать',None,['erzähle','erzählst','erzählt','erzählen','erzählt','erzählen'],'eine Geschichte',
   [('Greta erzählt allen von der App.','Грета всем рассказывает о приложении.'),('Ich erzähle dir alles.','Я тебе всё расскажу.')]),
 ('vergessen','забывать',None,['vergesse','vergisst','vergisst','vergessen','vergesst','vergessen'],'die Blumen',
   [('Er vergisst die Blumen.','Он забывает цветы.'),('Ich vergesse den Termin nicht.','Я не забываю про встречу.')]),
 ('gefallen','нравиться',None,['gefalle','gefällst','gefällt','gefallen','gefallt','gefallen'],'die App',
   [('Die App gefällt mir.','Приложение мне нравится.'),('Das Büro gefällt uns.','Офис нам нравится.')]),
 ('verpassen','пропускать',None,['verpasse','verpasst','verpasst','verpassen','verpasst','verpassen'],'den Bus',
   [('Er verpasst den Bus.','Он пропускает автобус.'),('Wir verpassen die U-Bahn.','Мы пропускаем метро.')]),
 ('erfinden','изобретать',None,['erfinde','erfindest','erfindet','erfinden','erfindet','erfinden'],'eine App',
   [('Otto erfindet eine App.','Отто изобретает приложение.'),('Sie erfinden etwas Neues.','Они изобретают что-то новое.')]),
 ('besuchen','навещать, посещать',None,['besuche','besuchst','besucht','besuchen','besucht','besuchen'],'einen Freund',
   [('Sie besucht Otto.','Она навещает Отто.'),('Wir besuchen die Firma.','Мы посещаем фирму.')]),
 ('verbessern','улучшать',None,['verbessere','verbesserst','verbessert','verbessern','verbessert','verbessern'],'die App',
   [('Otto verbessert die App.','Отто улучшает приложение.'),('Wir verbessern den Service.','Мы улучшаем сервис.')]),
 ('beraten','консультировать',None,['berate','berätst','berät','beraten','beratet','beraten'],'die Kunden',
   [('Otto berät die Kunden.','Отто консультирует клиентов.'),('Sie berät das Team.','Она консультирует команду.')]),
 ('transportieren','транспортировать',None,['transportiere','transportierst','transportiert','transportieren','transportiert','transportieren'],'die Pflanzen',
   [('Er transportiert die Pflanzen.','Он перевозит растения.'),('Wir transportieren das Paket.','Мы перевозим посылку.')]),
 ('organisieren','организовывать',None,['organisiere','organisierst','organisiert','organisieren','organisiert','organisieren'],'die Arbeit',
   [('Greta organisiert die Arbeit.','Грета организует работу.'),('Wir organisieren ein Fest.','Мы организуем праздник.')]),
 ('ausprobieren','пробовать','aus',['probiere','probierst','probiert','probieren','probiert','probieren'],'die App',
   [('Greta probiert die App aus.','Грета пробует приложение.'),('Wir probieren es aus.','Мы это пробуем.')]),
]

HABEN=['habe','hast','hat','haben','habt','haben']
SEIN=['bin','bist','ist','sind','seid','sind']
# inf -> (вспом 'hat'/'ist', причастие Partizip II)
PERF={
 'aufstehen':('ist','aufgestanden'),'einkaufen':('hat','eingekauft'),'abholen':('hat','abgeholt'),
 'anrufen':('hat','angerufen'),'zurückrufen':('hat','zurückgerufen'),'aussehen':('hat','ausgesehen'),
 'einladen':('hat','eingeladen'),'mitarbeiten':('hat','mitgearbeitet'),'kennenlernen':('hat','kennengelernt'),
 'verlieren':('hat','verloren'),'bekommen':('hat','bekommen'),'erzählen':('hat','erzählt'),
 'vergessen':('hat','vergessen'),'gefallen':('hat','gefallen'),'verpassen':('hat','verpasst'),
 'erfinden':('hat','erfunden'),'besuchen':('hat','besucht'),'verbessern':('hat','verbessert'),
 'beraten':('hat','beraten'),'transportieren':('hat','transportiert'),'organisieren':('hat','organisiert'),
 'ausprobieren':('hat','ausprobiert'),
}
def aux6(a): return SEIN if a=='ist' else HABEN
def sent_perf(i,inf,ctx):
    a,part=PERF[inf]; return f"{PRON[i]} {aux6(a)[i]} {ctx} {part}."

def sent_pres(i,f,pref,ctx):
    if pref: return f"{PRON[i]} {f[i]} {ctx} {pref}."
    return f"{PRON[i]} {f[i]} {ctx}."
def sent_fut(i,inf,ctx):
    return f"{PRON[i]} {WERD[i]} {ctx} {inf}."

async def tts(text,out):
    if os.path.exists(out): return
    for a in range(5):
        try:
            await edge_tts.Communicate(text,VOICE['voice'],rate=VOICE['rate'],pitch=VOICE['pitch']).save(out); return
        except Exception: await asyncio.sleep(2*(a+1))
    print("  ✗",os.path.basename(out))

async def main():
    DATA=[]; jobs=[]
    for inf,ru,pref,f,ctx,hears in V:
        slug=inf; demo=[]
        for i in range(6):
            sp=sent_pres(i,f,pref,ctx); fn=f"{slug}-p{i}"; jobs.append((sp,fn)); demo.append({'pron':RU_PRON[i],'t':sp,'tense':'Präsens','f':fn})
        for i in range(6):
            sf=sent_fut(i,inf,ctx); fn=f"{slug}-f{i}"; jobs.append((sf,fn)); demo.append({'pron':RU_PRON[i],'t':sf,'tense':'Futur','f':fn})
        demoPP=[]
        for i in range(6):
            spp=sent_perf(i,inf,ctx); fn=f"{slug}-pp{i}"; jobs.append((spp,fn)); demoPP.append({'pron':RU_PRON[i],'t':spp,'tense':'Perfekt','f':fn})
        a,part=PERF[inf]
        pp=[]
        for i in (0,2,3):  # ich, er, wir
            pres=(PRON[i]+' '+f[i]+' '+ctx+(' '+pref if pref else '')).strip()
            perf=(PRON[i]+' '+aux6(a)[i]+' '+ctx+' '+part).strip()
            pp.append({'pres':pres,'a':perf})
        gap=[]
        du=sent_pres(1,f,pref,ctx)
        if pref: gp=du.replace(f[1],'___',1).replace(' '+pref+'.',' ___.'); ans=f"{f[1]} {pref}"
        else: gp=du.replace(f[1],'___',1); ans=f[1]
        gap.append({'q':gp,'a':ans,'hint':'Du · Präsens'})
        wf=sent_fut(3,inf,ctx); gp2=wf.replace(WERD[3],'___',1).replace(inf,'___',1)
        gap.append({'q':gp2,'a':f"{WERD[3]} {inf}",'hint':'Wir · Futur'})
        hear=[]
        for k,(de,rru) in enumerate(hears):
            fn=f"{slug}-h{k}"; jobs.append((de,fn)); hear.append({'t':de,'ru':rru,'f':fn})
        DATA.append({'inf':inf,'ru':ru,'sep':pref or '','perf':PERF[inf][0]+' '+PERF[inf][1],'demoPP':demoPP,'pp':pp,'demo':demo,'gap':gap,'hear':hear})
    js="const VB20="+json.dumps(DATA,ensure_ascii=False)+";"
    open(os.path.join(ROOT,'js','verben20-data.js'),'w',encoding='utf-8').write(js)
    print("данные записаны, глаголов:",len(DATA),"; аудио-задач:",len(jobs))
    for text,fn in jobs:
        await tts(text, os.path.join(AUD,fn+'.mp3'))
    print("аудио готово")

asyncio.run(main())
