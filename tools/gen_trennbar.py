# -*- coding: utf-8 -*-
# ГЕНЕРАТОР темы «Отделяемые глаголы» (site/thema-trennbar.html) — ИСТОЧНИК ИСТИНЫ по формам.
# Пересобирает прямо в HTML: conj (спряжение), gap (Präsens), pgap (Perfekt — авто из причастия),
# lq (вопросы аудирования) + генерирует аудио Отто (edge-tts Killian) для всех форм и предложений.
#
# ⚠️ ФОРМЫ СПРЯЖЕНИЯ НЕ ПИСАТЬ РУКАМИ — только этим движком.
#    Правила: основа на -d/-t → +e (findest/findet, bietest, arbeitet, schaltet);
#             основа на -s/-ß/-z/-x → du = основа+t (kreuzt, weist);
#             сильные (haben/nehmen/geben/sehen/fahren/waschen/schlagen/fangen/laden) — таблицей.
#    Ошибки, которые это чинит (дневник 2026-07-09): findst/findt, bereitst/bereitt, bietst/biett,
#    kreuzst, weisst, ladt, arbeitt, schaltt.
#
# Запуск: python3 tools/gen_trennbar.py     (идемпотентно; существующее аудио пропускается)
import re, os, asyncio, edge_tts

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'site'))
HTML = os.path.join(ROOT, 'thema-trennbar.html')
WORD = os.path.join(ROOT, 'audio', 'word'); os.makedirs(WORD, exist_ok=True)

PREFIXES = ['spazieren','zurück','weiter','kennen','durch','statt','fern','nach','frei',
            'aus','auf','ein','mit','vor','weg','hin','ab','an','um','zu']
STRONG = {
 'haben':['habe','hast','hat','haben','habt','haben'],
 'nehmen':['nehme','nimmst','nimmt','nehmen','nehmt','nehmen'],
 'geben':['gebe','gibst','gibt','geben','gebt','geben'],
 'sehen':['sehe','siehst','sieht','sehen','seht','sehen'],
 'fahren':['fahre','fährst','fährt','fahren','fahrt','fahren'],
 'waschen':['wasche','wäschst','wäscht','waschen','wascht','waschen'],
 'schlagen':['schlage','schlägst','schlägt','schlagen','schlagt','schlagen'],
 'fangen':['fange','fängst','fängt','fangen','fangt','fangen'],
 'laden':['lade','lädst','lädt','laden','ladet','laden'],
}
HAB=['habe','hast','hat','haben','habt','haben']; SEIN=['bin','bist','ist','sind','seid','sind']

def split_prefix(inf):
    if ' ' in inf:
        part, base = inf.split(' ',1); return base, part
    for p in PREFIXES:
        if inf.startswith(p) and len(inf)>len(p)+2: return inf[len(p):], p
    return inf, ''

def conj_base(base):
    if base in STRONG: return list(STRONG[base])
    stem=base[:-2]; last=stem[-1]
    if last in 'dt': du,er,ihr=stem+'est',stem+'et',stem+'et'
    elif last in ('s','ß','z','x'): du,er,ihr=stem+'t',stem+'t',stem+'t'
    else: du,er,ihr=stem+'st',stem+'t',stem+'t'
    return [stem+'e',du,er,base,ihr,base]

def conj_full(inf):
    """→ (6 полных форм 'steht auf', приставка, 6 форм базы без приставки)"""
    base,part=split_prefix(inf); forms=conj_base(base)
    return [f+(' '+part if part else '') for f in forms], part, forms

# ---- глаголы по частям: (инфинитив, перевод, Perfekt) ----
VERBS=[
 [('freihaben','быть выходным','hat freigehabt'),('aufstehen','вставать','ist aufgestanden'),
  ('anziehen','надевать','hat angezogen'),('anmachen','включать','hat angemacht'),
  ('abwaschen','мыть посуду','hat abgewaschen'),('nachdenken','размышлять','hat nachgedacht'),
  ('stattfinden','состояться','hat stattgefunden'),('anrufen','звонить','hat angerufen'),
  ('einladen','приглашать','hat eingeladen'),('zusagen','соглашаться','hat zugesagt'),
  ('vorschlagen','предлагать','hat vorgeschlagen')],
 [('mitnehmen','брать с собой','hat mitgenommen'),('auflegen','класть трубку','hat aufgelegt'),
  ('zurückrufen','перезванивать','hat zurückgerufen'),('mitmachen','участвовать','hat mitgemacht'),
  ('vorbereiten','готовить','hat vorbereitet'),('einkaufen','закупаться','hat eingekauft'),
  ('anbieten','предлагать','hat angeboten'),('mitbringen','приносить с собой','hat mitgebracht'),
  ('ausfüllen','заполнять','hat ausgefüllt'),('ankreuzen','отметить крестиком','hat angekreuzt'),
  ('durchstreichen','зачёркивать','hat durchgestrichen')],
 [('angeben','указывать','hat angegeben'),('hinweisen','указывать на','hat hingewiesen'),
  ('anzeigen','показывать','hat angezeigt'),('abholen','забирать','hat abgeholt'),
  ('anschauen','смотреть / разглядывать','hat angeschaut'),('abfliegen','вылетать','ist abgeflogen'),
  ('ankommen','прибывать','ist angekommen'),('einsteigen','садиться (в транспорт)','ist eingestiegen'),
  ('abfahren','отъезжать','ist abgefahren'),('durchsagen','объявлять','hat durchgesagt'),
  ('umsteigen','пересаживаться','ist umgestiegen')],
 [('weiterfahren','ехать дальше','ist weitergefahren'),('aussteigen','выходить (из транспорта)','ist ausgestiegen'),
  ('vorstellen','представлять(ся)','hat vorgestellt'),('kennenlernen','знакомиться','hat kennengelernt'),
  ('aufbauen','собирать / монтировать','hat aufgebaut'),('aufräumen','убирать','hat aufgeräumt'),
  ('ausräumen','разбирать / освобождать','hat ausgeräumt'),('abladen','выгружать','hat abgeladen'),
  ('mitarbeiten','работать вместе','hat mitgearbeitet'),('anfangen','начинать','hat angefangen'),
  ('fernsehen','смотреть телевизор','hat ferngesehen')],
 [('aussehen','выглядеть','hat ausgesehen'),('ausdrücken','выражать','hat ausgedrückt'),
  ('spazieren gehen','гулять','ist spazieren gegangen'),('weggehen','уходить','ist weggegangen'),
  ('weitergeben','передавать','hat weitergegeben'),('absagen','отменять','hat abgesagt'),
  ('umziehen','переезжать','ist umgezogen'),('zurückkommen','возвращаться','ist zurückgekommen'),
  ('zumachen','закрывать','hat zugemacht'),('ausmachen','выключать / гасить','hat ausgemacht'),
  ('ausschalten','выключать','hat ausgeschaltet'),('aufschreiben','записывать','hat aufgeschrieben')],
]

# ---- «Вставь глагол»: (начало, лицо 0..5, середина-с-подлежащим, конец, перевод) ----
# предложение = начало + ЛИЧНАЯ ФОРМА + середина + ПРИСТАВКА + конец
# ПРАВИЛО: разные лица и подлежащие из мира Отто — НЕ «Heute … Otto …» под копирку.
GAP=[
 [('Am Samstag ',3,' wir ','.','В субботу у нас выходной.'),
  ('Jeden Morgen ',0,' ich früh ','.','Каждое утро я встаю рано.'),
  ('Warum ',1,' du den Hut ','?','Почему ты надеваешь шляпу?'),
  ('Beim Frühstück ',2,' Otto den Fernseher ','.','За завтраком Отто включает телевизор.'),
  ('Nach dem Essen ',4,' ihr ','.','После еды вы моете посуду.'),
  ('Danach ',2,' Otto über das Fest ','.','Потом Отто думает о празднике.'),
  ('Am Samstag ',2,' das Gartenfest ','.','В субботу состоится праздник в саду.'),
  ('Zuerst ',0,' ich meinen Sohn ','.','Сначала я звоню сыну.'),
  ('Dann ',2,' Otto seinen Enkel ','.','Потом Отто приглашает внука.'),
  ('Der Sohn ',2,' sofort ','.','Сын сразу соглашается.'),
  ('Ich ',0,' ein Gartenfest ','.','Я предлагаю праздник в саду.')],
 [('Der Sohn ',2,' meinen Enkel ','.','Сын берёт с собой моего внука.'),
  ('Dann ',0,' ich ','.','Потом я кладу трубку.'),
  ('Bald ',2,' mein Enkel ','.','Вскоре внук перезванивает.'),
  ('Beim Fest ',1,' du ','?','Ты участвуешь в празднике?'),
  ('Wir ',3,' kleine Geschenke ','.','Мы готовим маленькие подарки.'),
  ('Am Vormittag ',0,' ich ','.','До обеда я закупаюсь.'),
  ('Der Verkäufer ',2,' mir Orangen ','.','Продавец предлагает мне апельсины.'),
  ('Ich ',0,' Orangen ','.','Я приношу апельсины.'),
  ('Zu Hause ',0,' ich ein Formular ','.','Дома я заполняю анкету.'),
  ('Du ',1,' die richtige Antwort ','.','Ты отмечаешь правильный ответ.'),
  ('Wir ',3,' die falschen Wörter ','.','Мы зачёркиваем неправильные слова.')],
 [('Ich ',0,' meine Telefonnummer ','.','Я указываю свой телефон.'),
  ('Die App ',2,' mich auf den Fehler ','.','Приложение указывает мне на ошибку.'),
  ('Das Formular ',2,' den Fehler ','.','Анкета показывает ошибку.'),
  ('Nach dem Mittagessen ',0,' ich meinen Enkel ','.','После обеда я забираю внука.'),
  ('Zuerst ',0,' ich die App ','.','Сначала я смотрю приложение.'),
  ('Sein Flugzeug ',2,' pünktlich ','.','Его самолёт вылетает вовремя.'),
  ('Am Flughafen ',2,' er pünktlich ','.','В аэропорту он прибывает вовремя.'),
  ('Wir ',3,' in die Straßenbahn ','.','Мы садимся в трамвай.'),
  ('Die Straßenbahn ',2,' langsam ','.','Трамвай медленно отъезжает.'),
  ('Unterwegs ',2,' man alles ','.','По дороге всё объявляют.'),
  ('Am Hauptbahnhof ',3,' wir in den Bus ','.','На вокзале мы пересаживаемся на автобус.')],
 [('Mit dem Bus ',3,' wir ','.','На автобусе мы едем дальше.'),
  ('Zu Hause ',3,' wir ','.','Дома мы выходим.'),
  ('Ich ',0,' meinen Enkel den Nachbarn ','.','Я представляю внука соседям.'),
  ('Er ',2,' Theo und Lina ','.','Он знакомится с Тео и Линой.'),
  ('Zusammen ',3,' wir einen Tisch ','.','Вместе мы собираем стол.'),
  ('Ihr ',4,' den Garten ','.','Вы убираете сад.'),
  ('Ich ',0,' den Schrank ','.','Я разбираю шкаф.'),
  ('Den Müll ',3,' wir am Container ','.','Мусор мы выгружаем у контейнера.'),
  ('Theo ',2,' gern ','.','Тео охотно помогает.'),
  ('Am Abend ',2,' das Fußballspiel ','.','Вечером начинается футбол.'),
  ('Wir ',3,' zusammen ','.','Мы вместе смотрим телевизор.')],
 [('Du ',1,' heute glücklich ','.','Ты сегодня выглядишь счастливым.'),
  ('Ich ',0,' meine Gefühle nicht ','.','Я не выражаю своих чувств.'),
  ('Nach dem Spiel ',5,' alle ','.','После матча все идут гулять.'),
  ('Theo und Lina ',5,' um zehn Uhr ','.','Тео и Лина уходят в десять.'),
  ('Greta ',2,' ein Stück Kuchen ','.','Грета передаёт кусочек пирога.'),
  ('Meine Termine ',0,' ich morgen ','.','Свои встречи я завтра отменяю.'),
  ('Finlay ',2,' nach Deutschland ','.','Финлей переезжает в Германию.'),
  ('Fast ',0,' ich nach Schottland ','.','Я почти возвращаюсь в Шотландию.'),
  ('Am Ende ',3,' wir die Tür ','.','В конце мы закрываем дверь.'),
  ('Wir ',3,' das Licht ','.','Мы гасим свет.'),
  ('Ich ',0,' den Computer ','.','Я выключаю компьютер.'),
  ('Am Abend ',0,' ich alles ','.','Вечером я всё записываю.')],
]

# ---- аудирование: (вопрос БЕЗ целевого глагола, [принимаемые ответы], показ) ----
LQ=[
 [("Was macht Otto früh am Morgen?",["stehtauf","aufstehen","aufgestanden"],"steht auf (aufstehen)"),
  ("Was macht Otto mit Rock und Hut?",["ziehtan","anziehen","angezogen"],"zieht an (anziehen)"),
  ("Was macht Otto beim Frühstück mit der Sendung?",["machtan","anmachen","angemacht"],"macht an (anmachen)"),
  ("Wann findet das Gartenfest statt?",["samstag","stattfinden","findetstatt"],"am Samstag (stattfinden)"),
  ("Was macht Otto mit dem Sohn?",["ruftan","anrufen","laedtein","einladen"],"ruft an / lädt ein"),
  ("Was macht Otto nach dem Essen?",["waeschtab","abwaschen","abgewaschen"],"wäscht ab (abwaschen)")],
 [("Wen nimmt der Sohn mit?",["enkel","mitnehmen","nimmtmit"],"den Enkel (mitnehmen)"),
  ("Was macht der Enkel bald?",["ruftzurueck","zurueckrufen"],"ruft zurück (zurückrufen)"),
  ("Was bereitet der Enkel vor?",["geschenke","vorbereiten","bereitetvor"],"kleine Geschenke (vorbereiten)"),
  ("Was bietet der Verkäufer an?",["bietetan","anbieten","orangen"],"bietet Orangen an (anbieten)"),
  ("Was macht Otto am Vormittag?",["kauftein","einkaufen","eingekauft"],"kauft ein (einkaufen)"),
  ("Was füllt Otto zu Hause aus?",["formular","ausfuellen","fuelltaus"],"ein Formular (ausfüllen)")],
 [("Was gibt Otto im Formular an?",["telefonnummer","angeben","gibtan"],"die Telefonnummer (angeben)"),
  ("Was fehlt im Formular?",["postleitzahl","anzeigen"],"die Postleitzahl (anzeigen)"),
  ("Was macht Otto nach dem Mittagessen?",["holtab","abholen","abgeholt"],"holt den Enkel ab (abholen)"),
  ("Wie kommt der Enkel am Flughafen an?",["puenktlich","ankommen","kommtan"],"pünktlich (ankommen)"),
  ("Was passiert mit der Straßenbahn?",["kaputt","durchsagen","sagtdurch"],"sie ist kaputt (durchsagen)"),
  ("Wohin steigen sie am Hauptbahnhof um?",["bus","umsteigen","steigenum"],"in den Bus (umsteigen)")],
 [("Wen stellt Otto den Nachbarn vor?",["enkel","vorstellen","stelltvor"],"den Enkel (vorstellen)"),
  ("Wen lernt der Enkel kennen?",["theo","lina","kennenlernen","lerntkennen"],"Theo und Lina (kennenlernen)"),
  ("Was bauen sie für das Fest auf?",["tisch","aufbauen","bauenauf"],"einen Tisch (aufbauen)"),
  ("Was räumen sie auf?",["garten","aufraeumen","raeumenauf"],"den Garten (aufräumen)"),
  ("Wer arbeitet gern mit?",["theo","mitarbeiten","arbeitetmit"],"Theo (mitarbeiten)"),
  ("Was machen sie am Abend?",["sehenfern","fernsehen","faengtan"],"sehen fern (fernsehen)")],
 [("Wie sieht Otto aus?",["aufgeregt","gluecklich","aussehen","siehtaus"],"aufgeregt (aussehen)"),
  ("Was machen alle nach dem Spiel?",["spazieren","gehenspazieren"],"gehen spazieren (spazieren gehen)"),
  ("Wann gehen Theo und Lina weg?",["zehn","weggehen","gehenweg"],"um zehn Uhr (weggehen)"),
  ("Was gibt Greta der Freundin weiter?",["kuchen","weitergeben","gibtweiter"],"ein Stück Kuchen (weitergeben)"),
  ("Wohin möchte Finlay umziehen?",["deutschland","umziehen","ziehtum"],"nach Deutschland (umziehen)"),
  ("Was macht Otto mit dem Licht am Ende?",["machtaus","ausmachen","ausgemacht"],"macht das Licht aus (ausmachen)")],
]

PROA=['ich','du','er','wir','ihr','sie']
def esc(s): return s.replace('\\','\\\\').replace("'","\\'")
def slug(s):
    s=s.lower().replace('ä','ae').replace('ö','oe').replace('ü','ue').replace('ß','ss')
    return re.sub(r'[^a-z0-9]+','-',s).strip('-')

conj_blocks, gap_blocks, lq_blocks = [], [], []
audio={}
for pi,verbs in enumerate(VERBS):
    clines=[]
    for inf,ru,pp in verbs:
        full,part,base=conj_full(inf)
        clines.append("  ['%s','%s',[%s]]"%(esc(inf),esc(ru),', '.join('"%s"'%f for f in full)))
        for i in range(6): audio[slug(PROA[i]+' '+full[i])]=PROA[i]+' '+full[i]
        audio[slug(pp)]=pp                      # причастие для памятки/списка
        audio[slug(inf)]=inf                    # инфинитив
    conj_blocks.append("conj:[\n"+",\n".join(clines)+"\n ],\n sent:")

    glines, plines=[], []
    for (inf,ru_v,pp),(g0,pidx,mid,g4,ru) in zip(verbs,GAP[pi]):
        _,part,base=conj_full(inf)
        finite=base[pidx]
        glines.append("  ['%s','%s','%s','%s','%s','%s','%s']"%(esc(g0),esc(finite),esc(mid),esc(part),esc(g4),esc(inf),esc(ru)))
        audio[slug(g0+finite+mid+part+g4)]=g0+finite+mid+part+g4
        aux=(SEIN if pp.startswith('ist') else HAB)[pidx]
        partizip=' '.join(pp.split()[1:])
        plines.append("  ['%s','%s','%s','%s','%s','%s','%s']"%(esc(g0),esc(aux),esc(mid),esc(partizip),esc(g4),esc(inf),esc(ru)))
        audio[slug(g0+aux+mid+partizip+g4)]=g0+aux+mid+partizip+g4
    gap_blocks.append("gap:[\n"+",\n".join(glines)+"\n ],\n pgap:[\n"+",\n".join(plines)+"\n ],\n lq:")

    qlines=[]
    for q,acc,disp in LQ[pi]:
        qlines.append("  ['%s',[%s],'%s']"%(esc(q),', '.join('"%s"'%a for a in acc),esc(disp)))
    lq_blocks.append("lq:[\n"+",\n".join(qlines)+"]\n}")

html=open(HTML,encoding='utf-8').read()
def rep(text,pat,blocks):
    it=iter(blocks)
    return re.sub(pat,lambda m: next(it),text,flags=re.S)
html=rep(html,r"conj:\[.*?\n \],\n sent:",conj_blocks)
html=rep(html,r"gap:\[.*?\n \],\n lq:",gap_blocks)
html=rep(html,r"lq:\[.*?\]\]\n\}",lq_blocks)
open(HTML,'w',encoding='utf-8').write(html)
print("patched: conj",len(conj_blocks),"gap+pgap",len(gap_blocks),"lq",len(lq_blocks),"| аудио-фраз",len(audio))

VOICE='de-DE-KillianNeural'   # голос Отто; НИКОГДА не браузерный speak()
async def tts(text,out):
    if os.path.exists(out): return 'skip'
    for a in range(5):
        try: await edge_tts.Communicate(text,VOICE,rate='-8%',pitch='-2Hz').save(out); return 'ok'
        except Exception: await asyncio.sleep(2*(a+1))
    return 'fail'
async def main():
    done=skip=fail=0; items=list(audio.items())
    for k,(sl,text) in enumerate(items):
        r=await tts(text,os.path.join(WORD,sl+'.mp3'))
        if r=='ok':done+=1
        elif r=='skip':skip+=1
        else:fail+=1;print('  ✗',text)
        if (k+1)%50==0: print('  ...',k+1,'/',len(items))
    print('аудио: новых',done,'было',skip,'ошибок',fail)
asyncio.run(main())
print('Готово.')
