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
    'seller': dict(voice='de-DE-AmalaNeural', rate='+0%', pitch='+0Hz'),
    'childgirl': dict(voice='de-DE-AmalaNeural', rate='+5%', pitch='+45Hz'),
    'carla':  dict(voice='de-DE-AmalaNeural', rate='+0%', pitch='+6Hz'),  # Carla — другой женский голос (не как Грета=Katja)
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
    ('scene-verben','male',  'verben-thema-01.html'),
    ('scene-das2',  'child', 'thema-02-das.html'),
    ('scene-die2',  'female','thema-02-die.html'),
    ('scene-verben2','female', 'verben-thema-02.html'),
    ('scene-der3', 'male',   'thema-03-der.html'),
    ('scene-die3', 'female', 'thema-03-die.html'),
    ('scene-das3', 'child',  'thema-03-das.html'),
    ('scene-verben3','female','verben-thema-03.html'),
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
            cl=cls.split()
            self.role = 'carla' if 'carla' in cl else 'childgirl' if 'lina' in cl else 'male' if 'der' in cl else 'female' if 'die' in cl else 'child' if 'das' in cl else ''
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
    # .*? (DOTALL) — чтобы перешагнуть поле prompt:`...` с бэктиками (есть в dialog2.html)
    m = re.search(r'%d:\{.*?\bde:`(.*?)`,\s*ru:' % n, html, re.S)
    if not m: return []
    p = Lines(); p.feed(m.group(1)); return p.lines

async def tts(text, role, out):
    if os.path.exists(out): return
    cfg = VOICE.get(role, VOICE[''])
    for attempt in range(6):
        try:
            c = edge_tts.Communicate(text, cfg['voice'], rate=cfg['rate'], pitch=cfg['pitch'])
            await c.save(out)
            print('  ✓', os.path.basename(out), '·', role, '·', text[:38]); return
        except Exception as e:
            await asyncio.sleep(2*(attempt+1))
    print('  ✗ не удалось:', os.path.basename(out))

def slug(s):
    s = s.lower().replace('ä','ae').replace('ö','oe').replace('ü','ue').replace('ß','ss')
    s = re.sub(r'[^a-z0-9]+','-', s)
    return s.strip('-')

# собрать существительные по роду из woerter.js (по строкам, с учётом текущего рода)
def dict_words():
    txt = open(os.path.join(ROOT,'js','woerter.js'), encoding='utf-8').read()
    g=None; out=[]; seen=set()
    for line in txt.splitlines():
        if re.search(r'\bder:\[', line): g='der'
        elif re.search(r'\bdie:\[', line): g='die'
        elif re.search(r'\bdas:\[', line): g='das'
        elif re.search(r'\b(verbs|other|andere):', line): g=None
        if g:
            for w in re.findall(r'\["([^"]+)"', line):
                key=(g,w)
                if key not in seen:
                    seen.add(key); out.append((g,w))
    return out

WORD_ROLE={'der':'male','die':'female','das':'child'}

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
    # диалоги Темы 2 (dialog2.html) → dlg2-N-i (Carla — отдельный голос)
    d2html = open(os.path.join(ROOT,'dialog2.html'), encoding='utf-8').read()
    for n in (1,2,3):
        lines = dialog_lines(n, d2html)
        print(f'диалог2 {n}: {len(lines)} реплик')
        for i,(role,txt) in enumerate(lines):
            await tts(txt, role, os.path.join(AUDIO, f'dlg2-{n}-{i}.mp3'))
    d3html = open(os.path.join(ROOT,'dialog3.html'), encoding='utf-8').read()
    for n in (1,2,3):
        lines = dialog_lines(n, d3html)
        print(f'диалог3 {n}: {len(lines)} реплик')
        for i,(role,txt) in enumerate(lines):
            await tts(txt, role, os.path.join(AUDIO, f'dlg3-{n}-{i}.mp3'))
    # слова по роду (der→Otto, die→Грета, das→Тео)
    os.makedirs(os.path.join(AUDIO,'word'), exist_ok=True)
    words = dict_words()
    print(f'слов: {len(words)}')
    for g,w in words:
        text = f'{g} {w}'
        await tts(text, WORD_ROLE[g], os.path.join(AUDIO,'word', slug(text)+'.mp3'))
    # глаголы (мужской голос)
    VERBS=['wohnen','leben','lernen','machen','arbeiten','studieren','planen','glauben',
           'sein','haben','sprechen','heißen','kommen','gehen',
           'kaufen','kosten','bestellen','sehen','finden',
           'spielen','hören','tanzen','kochen','malen','fotografieren','lesen','schwimmen','fahren','singen','treffen','können',
           'aufmachen','vorbereiten','einstellen','schneiden','anfangen','zusammenarbeiten','leiten','helfen','einladen','gefallen','verkaufen','erzählen','bekommen','bezahlen','verdienen','planen','suchen','aufräumen','zählen','aufstehen','verpassen','vergessen','anschauen','verlieren','verbessern','verwalten','beraten','transportieren','organisieren','gründen','erfinden','ausprobieren','funktionieren','anrufen','kennen','aussehen','helfen','denken','mitarbeiten','einkaufen','abholen','besuchen','kennenlernen','zurückrufen','stehen','rufen','holen','laden','passen']
    for inf in VERBS:
        await tts(inf, 'male', os.path.join(AUDIO,'word', slug(inf)+'.mp3'))
    # слова сцен, которых нет в словаре (иначе fallback на робота)
    EXTRA=[('der','Gärtner'),('das','Datum'),('das','Geburtsdatum'),('das','Mädchen'),
           ('die','Adresse'),('die','E-Mail'),('die','Hausnummer'),('die','Köchin'),
           ('die','Nationalität'),('die','Nummer'),('die','Postleitzahl'),('die','Stadt'),
           ('die','Straße'),('die','Telefonnummer')]
    for g,w in EXTRA:
        await tts(f'{g} {w}', WORD_ROLE[g], os.path.join(AUDIO,'word', slug(f'{g} {w}')+'.mp3'))
    # «Другое» Темы 2 — цвета (жен.) и оценка/свойства (муж.)
    COLORS=['weiß','gelb','orange','rot','grün','blau','braun','schwarz','grau','hellblau','dunkelgrün']
    for w in COLORS:
        await tts(w, 'female', os.path.join(AUDIO,'word', slug(w)+'.mp3'))
    PROPS=['schön','hässlich','teuer','günstig','billig','praktisch','modern','groß','klein','alt','neu']
    for w in PROPS:
        await tts(w, 'male', os.path.join(AUDIO,'word', slug(w)+'.mp3'))
    HAEUFIG=['gern','nicht gern','oft','manchmal','immer','nie','jeden Tag','zusammen','mit']
    for w in HAEUFIG:
        await tts(w, 'female', os.path.join(AUDIO,'word', slug(w)+'.mp3'))
    TAGE=['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag','am Wochenende']
    for w in TAGE:
        await tts(w, 'male', os.path.join(AUDIO,'word', slug(w)+'.mp3'))
    print('слова готовы')
    # тексты раздела «Другое»
    ANDERE=[
        ('andere-farben','female','Mamma mia, ich liebe Farben! Meine Tasche ist rot, meine Lampe ist gelb, meine Flasche ist grün. Der Himmel ist blau, die Wolke ist weiß. Meine Brille ist schwarz, meine Bürste ist orange. Nur grau mag ich nicht — grau ist langweilig! Hellblau und dunkelgrün sind auch schön. Mamma mia, das Leben ist bunt!'),
        ('andere-haeufig','female','Was machen wir in der Freizeit? Ich höre oft Musik und spiele gern Gitarre. Manchmal tanze ich. Otto spielt immer Fußball — jeden Tag! Theo liest gern, aber er kocht nicht gern. Wir machen viel zusammen, mit Freunden. Langweilig? Nie!'),
        ('andere-tage','male','Meine Woche: Am Montag spiele ich Fußball. Am Dienstag und Mittwoch arbeite ich im Garten. Am Donnerstag lese ich, am Freitag treffe ich Freunde. Am Samstag und Sonntag ist Wochenende — am Wochenende fahre ich Fahrrad. Schön!'),
        ('andere-eigenschaften','male','Was kaufe ich? Das Sofa ist schön und modern, aber teuer — zweihundert Euro! Der Stuhl ist klein und praktisch, nur günstig. Die alte Lampe ist nicht neu, aber billig. Das große Regal ist hässlich — nein, danke! Ich finde: praktisch und günstig ist gut, zu teuer ist schlecht.'),
    ]
    for sid,role,text in ANDERE:
        await tts(text, role, os.path.join(AUDIO, sid+'.mp3'))
    # Тема 20 — слова и тексты «Своё дело»
    T20W=['Start-up','Service','Fehler','Website','Projekt','Technik','Idee','Werbung','Kommunikation','Medien','Spezialist','Berater','Experte','Psychologin','U-Bahn','Päckchen','Garten','Nutzer','Blume','Pflanze','Szene','Bart','Locke','Kollege','Vorstellungsgespräch','Stelle','Pause','Team','Kunde','erfolgreich','zufrieden','sparsam','geizig','sympathisch','nett','freundlich','kreativ','fröhlich','ruhig','schlank','kräftig','langweilig','unfreundlich']
    for w in T20W:
        await tts(w, 'female', os.path.join(AUDIO,'word', slug(w)+'.mp3'))
    T20=[
      ('thema20-1','male','Otto hat eine tolle Idee: Er erfindet eine Garten-App! Viele Menschen vergessen, ihre Blumen zu gießen. Die App hilft ihnen jeden Tag. So vergisst niemand mehr seine Pflanzen! Otto steht jeden Morgen früh auf und arbeitet. Am Anfang hat die App nicht gut funktioniert, aber Otto hat sie immer wieder verbessert und ausprobiert. Er organisiert alles selbst. Otto berät auch andere Start-ups: Ich helfe euch gern! So hat Otto die ersten zehn Kunden bekommen! Manchmal ist Otto zu spät aufgestanden und hat etwas vergessen — aber die App organisiert seinen Tag. Otto verbessert die App jeden Tag und probiert neue Ideen aus. Mein Start-up funktioniert, sagt Otto glücklich.'),
      ('thema20-2','female','Greta hilft ihrer Freundin Carla mit der App. Greta macht die Werbung! Sie erzählt allen von der App — ihren Freunden und Nachbarn. Die App gefällt vielen Menschen sehr! Greta ruft neue Kunden an. Wenn ein Kunde eine Frage hat, ruft Greta schnell zurück. Guter Service ist wichtig, sagt sie. Am Wochenende lädt Greta Leute zu einem Fest ein. Dort zeigt sie die App. Carla arbeitet auch mit und hilft Greta. Greta besucht oft Otto im Büro. Sie erzählt ihm, was den Kunden gefällt und was nicht. So wird die App immer besser. Zusammen arbeiten wir super mit, lacht Greta.'),
      ('thema20-3','male','Stefan hatte heute ein Vorstellungsgespräch bei SUPS. Was für ein Tag! Am Morgen ist Stefan zu spät aufgestanden. Er ist zur U-Bahn gelaufen, aber er hat sie verpasst! Im Bus hat er sein Handy verloren. Puh, hat er gedacht. Bei SUPS hat Stefan zuerst die Website angeschaut. Otto hat ihn freundlich beraten und ihm alles über die Firma erzählt. Das Team und das Büro haben ihm sehr gefallen. Nach einer kurzen Pause hat Stefan eine gute Nachricht bekommen: Er hat die Stelle! Otto hat ihn später angerufen: Willkommen im Team! Am Abend hat Stefan noch ein Päckchen zum Kunden transportiert. Dann hat er seiner Freundin alles erzählt: Ich habe die U-Bahn verpasst und mein Handy verloren — aber ich habe die Stelle bekommen! Stefan war müde, aber zufrieden.'),
    ]
    T20.append(('thema20-reviews','female','Anna: Ich habe die App ausprobiert. Früher habe ich oft vergessen, meine Blumen zu gießen. Jetzt nicht mehr! Ben: Otto hat die App selbst erfunden und immer wieder verbessert. Super! Lina: Otto hat alles gut organisiert. Ich habe schnell Hilfe bekommen. Max: Otto hat mich gut beraten. Heute bin ich früh aufgestanden — die App hilft mir!'))
    for sid,role,text in T20:
        await tts(text, role, os.path.join(AUDIO, sid+'.mp3'))
    # мини-аудирования по героям/сценам/текстам
    HOER=[
        ('der1-beruf','male','Ich bin Gärtner von Beruf.'),
        ('der1-alter','male','Ich bin fünfzig Jahre alt.'),
        ('das1-alter','child','Ich bin sieben Jahre alt.'),
        ('das1-kinder','child','Wir sind sechs Kinder.'),
        ('der2-stuehle','male','In meinem Zimmer habe ich vier Stühle.'),
        ('der2-material','male','Mein Schrank ist aus Holz.'),
        ('d1-name','male','Mein Familienname ist MacLeod.'),
        ('d1-stadt','female','Ich komme aus Neapel, aus Italien.'),
        ('d2-theo','child','Ich bin sieben Jahre alt.'),
        ('d2-greta','female','Ich bin achtundvierzig Jahre alt.'),
        ('d3-noah','child','Mein Freund Noah kommt aus Polen.'),
        ('d3-lea','child','Lea ist zehn Jahre alt.'),
        ('d2a-preise-spiegel','child','Der Tisch kostet dreißig Euro, die Lampe neun Euro und der Spiegel neunundneunzig Euro.'),
        ('d2a-preise-bett','female','Der Schrank kostet hundertfünfzig Euro, das Bett achtzig Euro und das Regal fünfundzwanzig Euro.'),
        ('d2b-sofa','female','Das Sofa ist grün und groß.'),
        ('d2b-spiegel','female','Der Spiegel kostet neunundneunzig Euro.'),
        ('d2c-sofa','male','Das Sofa kostet jetzt nur fünfzig Euro.'),
        ('d2c-tisch','male','Der Tisch ist aus Holz.'),
    ]
    for hid, role, text in HOER:
        await tts(text, role, os.path.join(AUDIO, f'hoer-{hid}.mp3'))
    print('аудирования готовы')
    # диалог-магазин Otto + продавец (мужской + другой женский)
    SHOP_DER=[
        ('male','Guten Tag! Wie viel kostet der Tisch?'),
        ('seller','Der Tisch kostet achtzig Euro. Er ist aus Holz.'),
        ('male','Aus Holz? Nein, danke! Ich kaufe nur Kunststoff.'),
        ('seller','Der Schrank kostet hundert Euro. Er ist aus Kunststoff.'),
        ('male','Aus Kunststoff? Sehr gut! Der Preis ist okay.'),
        ('seller','Der Stuhl kostet fünfundzwanzig Euro, auch aus Kunststoff.'),
        ('male','Gut! Und der Regenschirm?'),
        ('seller','Der Regenschirm kostet zwölf Euro.'),
        ('male','Danke! Der Preis ist immer gut!'),
    ]
    for i,(role,text) in enumerate(SHOP_DER):
        await tts(text, role, os.path.join(AUDIO, f'hoer-shop-{i+1}.mp3'))
    # игра в магазин Тео + Lina (детский + другой женский), фокус — материал
    SHOP_DAS=[
        ('child','Lina, wie viel kostet das Auto?'),
        ('childgirl','Das Auto kostet drei Euro. Es ist aus Plastik.'),
        ('child','Aus Plastik? Super! Ich kaufe es!'),
        ('child','Und das Regal? Aus was ist es?'),
        ('childgirl','Das Regal ist aus Holz.'),
        ('child','Aus Holz, hmm. Und das Buch?'),
        ('childgirl','Das Buch ist aus Papier — ein Sonderangebot, nur zwei Euro!'),
        ('child','Ein Sonderangebot! Toll! Und das Handy?'),
        ('childgirl','Das Handy ist aus Glas und Metall.'),
        ('child','Aus Glas! Schön!'),
    ]
    for i,(role,text) in enumerate(SHOP_DAS):
        await tts(text, role, os.path.join(AUDIO, f'hoer-shopd-{i+1}.mp3'))
    # слова сцены Тео-комната (детский голос)
    DAS2=['Zimmer','Bett','Sofa','Regal','Auto','Buch','Bild','Haus','Handy','Telefon','Material','Geschäft',
          'Sonderangebot','Glück','Problem','Ding','Wort','Feuerzeug','Taschentuch','Holz','Metall','Plastik','Glas','Papier']
    for w in DAS2:
        await tts('das '+w, 'child', os.path.join(AUDIO,'word', slug('das '+w)+'.mp3'))
    # слова комнаты Otto (мужской голос)
    DER2=['Stuhl','Sessel','Tisch','Schrank','Teppich','Spiegel','Schlüssel','Geldbeutel','Regenschirm',
          'Kugelschreiber','Bleistift','Kaffee','Euro','Preis','Cent','Kunststoff']
    for w in DER2:
        await tts('der '+w, 'male', os.path.join(AUDIO,'word', slug('der '+w)+'.mp3'))
    # слова комнаты Греты (женский голос) — на будущее
    DIE2=['Tasche','Brille','Sonnenbrille','Uhr','Lampe','Möbel','Kette','Flasche','Kamera','Bürste','Seife','Sonne','Farbe','Schwester']
    for w in DIE2:
        await tts('die '+w, 'female', os.path.join(AUDIO,'word', slug('die '+w)+'.mp3'))
    # диалог Греты в магазине — фокус ЦВЕТА (женский + продавец)
    SHOP_DIE=[
        ('female','Guten Tag! Ich kaufe online. Welche Farbe hat die Lampe?'),
        ('seller','Die Lampe ist gelb.'),
        ('female','Und die Tasche? Welche Farbe hat sie?'),
        ('seller','Die Tasche ist rot.'),
        ('female','Und die Brille?'),
        ('seller','Die Brille ist schwarz.'),
        ('female','Und die Flasche?'),
        ('seller','Die Flasche ist grün.'),
        ('female','Mamma mia, so viele Farben! Danke!'),
    ]
    for i,(role,text) in enumerate(SHOP_DIE):
        await tts(text, role, os.path.join(AUDIO, f'hoer-shopg-{i+1}.mp3'))
    # аудирования сцен Темы 3
    SPORT3=[('male','Hallo! Am Montag spiele ich Fußball im Park.'),('male','Am Mittwoch gehe ich in den Verein und treffe Freunde.'),('male','Am Samstag mache ich einen langen Spaziergang.'),('male','Am Sonntag sehe ich einen Film am Computer. Sport ist mein Hobby!')]
    for i,(role,text) in enumerate(SPORT3):
        await tts(text, role, os.path.join(AUDIO, f'hoer-sport3-{i+1}.mp3'))
    MUSIK3=[('female','Mamma mia! Am Freitag spiele ich Gitarre.'),('female','Am Samstag habe ich eine Party — Musik und Freunde!'),('female','Manchmal mache ich eine Reise. Ich kaufe eine Karte.'),('female','In der Pause lese ich in der Bibliothek. Musik ist mein Leben!')]
    for i,(role,text) in enumerate(MUSIK3):
        await tts(text, role, os.path.join(AUDIO, f'hoer-musik3-{i+1}.mp3'))
    HOBBY3=[('child','Lina, am Wochenende gehen wir ins Kino!'),('childgirl','Ja! Und ich spiele ein Instrument im Konzert.'),('child','Ich fahre Fahrrad und schwimme im Schwimmbad.'),('childgirl','Super! Spielen ist unser Hobby!')]
    for i,(role,text) in enumerate(HOBBY3):
        await tts(text, role, os.path.join(AUDIO, f'hoer-hobby3-{i+1}.mp3'))
    print('слова Otto/Греты-комната готовы')

asyncio.run(main())
print('Готово.')
