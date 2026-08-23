/* Тема «Суффиксы рода»: суффикс задаёт род существительного.
   der→Otto, die→Greta, das→Teo. Данные всех троих + движок упражнений.
   Слова с непроходимыми исключениями НЕ включаются в тренажёр — исключения только в правиле (warn). */
const SF = (function(){
'use strict';
const V = {der:'male', die:'female', das:'child'};

const DATA = {
 der:{hero:'Otto', ru:'Отто', art:'der', color:'#3b5bdb', bg:'#eef2ff',
  tails:[
   ['-er','деятель / прибор','кто делает или механизм','⚠️ только про людей и приборы! У обычных предметов -er рода НЕ задаёт: das Fenster, das Messer, das Zimmer'],
   ['-ling','','','надёжно, без исключений'],
   ['-or','','',''],
   ['-ismus','','','без исключений'],
   ['-ant/-ent','','','надёжно'],
   ['-ist','','',''],
   ['-eur','франц. «-ёр»','',''],
   ['-loge','специалист','',''],
   ['корень','от глагола без суффикса','beginnen → der Beginn',''],
   ['по смыслу','дни, месяцы, сезоны, погода, стороны света, алкоголь','','⚠️ исключение: das Bier']],
  blocks:[
   {n:1,title:'Люди и приборы',suf:['-er','-ling','-or','-ismus','-ant/-ent'],
    story:{audio:'sfx-der-1',
     de:'Otto ist Fahrer und ein echter Bastler. Am Morgen klingelt der Wecker, im Betrieb warten der Computer und der Drucker; der Fernseher bleibt aus. Sein Nachbar ist Lehrer, sein Freund ist Verkäufer, ein Bekannter ist Arbeiter. Im Frühling ist Otto der Liebling vom Hof. Sein Motor läuft gut, und der Professor von nebenan repariert den Traktor. Otto liest gern über Tourismus. Ein Student und ein Praktikant besuchen ihn oft, und im Zirkus wohnt sogar ein Elefant. „Optimismus und Fleiß — das ist mein Stil!“',
     ru:'Отто — водитель и настоящий мастер на все руки. Утром звонит будильник, на работе ждут компьютер и принтер; телевизор он не включает. Сосед — учитель, друг — продавец, знакомый — рабочий. Весной Отто — общий любимец двора. Мотор его машины работает хорошо, а сосед-профессор чинит трактор. Отто любит читать про туризм. Студент и практикант часто его навещают, а в цирке живёт даже слон. «Оптимизм и старание — вот мой стиль!»',
     targets:['Fahrer','Wecker','Computer','Drucker','Fernseher','Lehrer','Verkäufer','Arbeiter','Frühling','Liebling','Motor','Professor','Traktor','Tourismus','Student','Praktikant','Elefant','Optimismus']}},
   {n:2,title:'Профессии, глаголы и смысл',suf:['-ist','-eur','-loge','корень','по смыслу'],
    story:{audio:'sfx-der-2',
     de:'Am Montag, im Mai, ist ein warmer Sommer. Otto ist ein echter Tourist. Sein Bruder ist Polizist, sein Freund ist Journalist, ein anderer ist Pianist. Ein Ingenieur kommt vorbei, am Samstag der Friseur, und ein Psychologe liebt den Tanz. Otto plant den Flug in den Süden: zuerst der Besuch, dann der Anfang vom Urlaub. Draußen ist mal der Regen, mal der Wind, mal der Schnee, und am Abend der Wein. „Vielen Dank für den Tag!“',
     ru:'В понедельник, в мае, стоит тёплое лето. Отто в душе турист. Брат — полицейский, друг — журналист, ещё один — пианист. Заходит инженер, в субботу — парикмахер, а знакомый психолог обожает танец. Отто планирует полёт на юг: сначала визит, потом начало отпуска. На улице то дождь, то ветер, то снег, а вечером — вино. «Большое спасибо за день!»',
     targets:['Montag','Mai','Sommer','Tourist','Polizist','Journalist','Pianist','Ingenieur','Friseur','Psychologe','Tanz','Flug','Besuch','Anfang','Regen','Wind','Schnee','Wein','Dank']}}],
  words:[
   ['der Lehrer','учитель','-er'],['der Fahrer','водитель','-er'],['der Verkäufer','продавец','-er'],['der Schüler','ученик','-er'],['der Arbeiter','рабочий','-er'],['der Vermieter','арендодатель','-er'],['der Empfänger','получатель','-er'],['der Absender','отправитель','-er'],['der Ausländer','иностранец','-er'],['der Sprecher','диктор','-er'],['der Computer','компьютер','-er'],['der Drucker','принтер','-er'],['der Wecker','будильник','-er'],['der Fernseher','телевизор','-er'],
   ['der Frühling','весна','-ling'],['der Lehrling','подмастерье','-ling'],['der Liebling','любимец','-ling'],['der Flüchtling','беженец','-ling'],['der Zwilling','близнец','-ling'],
   ['der Doktor','доктор','-or'],['der Motor','мотор','-or'],['der Professor','профессор','-or'],['der Traktor','трактор','-or'],['der Autor','автор','-or'],
   ['der Tourismus','туризм','-ismus'],['der Kapitalismus','капитализм','-ismus'],['der Journalismus','журналистика','-ismus'],
   ['der Student','студент','-ant/-ent'],['der Praktikant','практикант','-ant/-ent'],['der Patient','пациент','-ant/-ent'],['der Assistent','ассистент','-ant/-ent'],['der Elefant','слон','-ant/-ent'],
   ['der Tourist','турист','-ist'],['der Polizist','полицейский','-ist'],['der Journalist','журналист','-ist'],['der Optimist','оптимист','-ist'],['der Pianist','пианист','-ist'],
   ['der Ingenieur','инженер','-eur'],['der Friseur','парикмахер','-eur'],['der Masseur','массажист','-eur'],['der Regisseur','режиссёр','-eur'],
   ['der Psychologe','психолог','-loge'],['der Biologe','биолог','-loge'],['der Kardiologe','кардиолог','-loge'],
   ['der Beginn','начало','корень'],['der Besuch','визит','корень'],['der Verkauf','продажа','корень'],['der Anfang','начало','корень'],['der Flug','полёт','корень'],['der Schlaf','сон','корень'],['der Dank','благодарность','корень'],['der Tanz','танец','корень'],
   ['der Montag','понедельник','по смыслу'],['der Mai','май','по смыслу'],['der Sommer','лето','по смыслу'],['der Norden','север','по смыслу'],['der Regen','дождь','по смыслу'],['der Wind','ветер','по смыслу'],['der Schnee','снег','по смыслу'],['der Wein','вино','по смыслу']
  ]},
 die:{hero:'Greta', ru:'Грета', art:'die', color:'#c2185b', bg:'#fce7f3',
  tails:[
   ['-ung','действие / результат','','очень надёжно'],
   ['-in','женщина-деятель','die Lehrerin',''],
   ['-ion','','die Information',''],
   ['-heit','','die Freiheit',''],
   ['-keit','','die Möglichkeit',''],
   ['-schaft','','die Freundschaft',''],
   ['-ei','','die Bäckerei',''],
   ['-ik','','die Musik',''],
   ['-tät','','die Universität',''],
   ['-ur','','die Natur',''],
   ['-anz/-enz','','die Distanz',''],
   ['-age','франц.','die Garage',''],
   ['-ie','','die Familie',''],
   ['-e','','die Blume','⚠️ не 100%: der Name, das Auge'],
   ['-t','от глагола','die Fahrt (fahren)','']],
  blocks:[
   {n:1,title:'Действия и люди',suf:['-ung','-in','-ion','-heit','-keit'],
    story:{audio:'sfx-die-1',
     de:'Greta liest die Zeitung in ihrer Wohnung. Eine Freundin ruft an — sie ist Lehrerin; ihre Tochter ist Studentin, die Nachbarin ist Ärztin. Heute gibt es eine besondere Situation: Eine Journalistin kommt zu Greta und braucht Informationen. Greta sagt die Wahrheit und teilt ihre Meinung: Gesundheit beginnt mit guter Küche. Es gibt eine kleine Schwierigkeit — die Rechnung für die Zutaten. Aber Greta sieht eine Möglichkeit. Pünktlichkeit und tägliche Übung helfen ihr. „Kochen, was man liebt — das ist Freiheit!“',
     ru:'Грета читает газету в своей квартире. Звонит подруга — она учительница; её дочь — студентка, соседка — врач. Сегодня особая ситуация: в гости к Грете придёт журналистка, ей нужна информация. Грета говорит правду и делится мнением: здоровье начинается с хорошей кухни. Есть маленькая трудность — счёт за продукты. Но Грета видит возможность. Пунктуальность и ежедневная тренировка ей помогают. «Готовить то, что любишь, — это свобода!»',
     targets:['Zeitung','Wohnung','Freundin','Lehrerin','Studentin','Nachbarin','Ärztin','Situation','Journalistin','Informationen','Wahrheit','Meinung','Gesundheit','Schwierigkeit','Rechnung','Möglichkeit','Pünktlichkeit','Übung','Freiheit']}},
   {n:2,title:'Места и науки',suf:['-schaft','-ei','-ik','-tät','-ur'],
    story:{audio:'sfx-die-2',
     de:'Am meisten schätzt Greta die Freundschaft. Ihre Mannschaft spielt samstags — das gehört zur Gesellschaft der kleinen Stadt. Am Morgen geht sie in die Bäckerei und in die Metzgerei, daneben ist die Bücherei. Sie liebt Musik, ein bisschen Politik und Technik in der Küche; Mathematik braucht sie für die Rechnung. In der Nähe ist die Universität: dort zählen Qualität und Aktivität. Manchmal braucht die Kaffeemaschine eine Reparatur. Aber die Natur, die Kultur und die warme Temperatur machen alles schöner.',
     ru:'Больше всего Грета ценит дружбу. Её команда играет по субботам — это часть общества маленького города. Утром она заходит в пекарню и мясную лавку, рядом — библиотека. Она любит музыку, немного политику и технику на кухне; математика нужна для счёта. Рядом университет: там ценят качество и активность. Иногда кофемашине нужен ремонт. Но природа, культура и тёплая температура делают всё красивее.',
     targets:['Freundschaft','Mannschaft','Gesellschaft','Bäckerei','Metzgerei','Bücherei','Musik','Politik','Technik','Mathematik','Universität','Qualität','Aktivität','Reparatur','Natur','Kultur','Temperatur']}},
   {n:3,title:'Заимствования и -e/-t',suf:['-anz/-enz','-age','-ie','-e','-t'],
    story:{audio:'sfx-die-3',
     de:'Die Familie ist für Greta das Wichtigste. Bis zur Arbeit ist es eine kurze Distanz; die Garage in der unteren Etage ist gleich um die Ecke. Ihre Energie ist wie eine Melodie. In der Küche stehen eine Blume und eine Lampe, die Katze schläft auf der Tasche. Greta spricht zwei Sprachen. Nach der langen Fahrt und der Arbeit tut eine Massage gut. Sie hat eine klare Absicht: bis zur Ankunft der Familie ist alles fertig. „Toleranz und gute Laune — das ist meine Sicht auf den Tag!“',
     ru:'Семья для Греты — самое важное. До работы небольшая дистанция; гараж на нижнем этаже совсем рядом. Её энергия — как мелодия. На кухне стоят цветок и лампа, кошка спит на сумке. Грета говорит на двух языках. После долгой поездки и работы приятен массаж. У неё ясное намерение: к приезду семьи всё готово. «Терпимость и хорошее настроение — вот мой взгляд на день!»',
     targets:['Familie','Distanz','Garage','Etage','Energie','Melodie','Blume','Lampe','Katze','Tasche','Sprachen','Fahrt','Massage','Absicht','Ankunft','Toleranz','Sicht']}}],
  words:[
   ['die Zeitung','газета','-ung'],['die Wohnung','квартира','-ung'],['die Übung','упражнение','-ung'],['die Meinung','мнение','-ung'],['die Rechnung','счёт','-ung'],
   ['die Lehrerin','учительница','-in'],['die Studentin','студентка','-in'],['die Ärztin','врач (ж)','-in'],['die Freundin','подруга','-in'],['die Verkäuferin','продавщица','-in'],
   ['die Information','информация','-ion'],['die Situation','ситуация','-ion'],['die Lektion','урок','-ion'],['die Region','регион','-ion'],['die Station','станция','-ion'],
   ['die Freiheit','свобода','-heit'],['die Gesundheit','здоровье','-heit'],['die Krankheit','болезнь','-heit'],['die Wahrheit','правда','-heit'],['die Kindheit','детство','-heit'],
   ['die Möglichkeit','возможность','-keit'],['die Schwierigkeit','трудность','-keit'],['die Geschwindigkeit','скорость','-keit'],['die Pünktlichkeit','пунктуальность','-keit'],
   ['die Freundschaft','дружба','-schaft'],['die Mannschaft','команда','-schaft'],['die Wirtschaft','экономика','-schaft'],['die Gesellschaft','общество','-schaft'],['die Wissenschaft','наука','-schaft'],
   ['die Bäckerei','пекарня','-ei'],['die Metzgerei','мясная лавка','-ei'],['die Polizei','полиция','-ei'],['die Bücherei','библиотека','-ei'],
   ['die Musik','музыка','-ik'],['die Politik','политика','-ik'],['die Technik','техника','-ik'],['die Mathematik','математика','-ik'],['die Fabrik','фабрика','-ik'],
   ['die Universität','университет','-tät'],['die Qualität','качество','-tät'],['die Aktivität','активность','-tät'],['die Realität','реальность','-tät'],
   ['die Kultur','культура','-ur'],['die Natur','природа','-ur'],['die Temperatur','температура','-ur'],['die Reparatur','ремонт','-ur'],
   ['die Distanz','дистанция','-anz/-enz'],['die Toleranz','толерантность','-anz/-enz'],['die Konferenz','конференция','-anz/-enz'],['die Existenz','существование','-anz/-enz'],
   ['die Garage','гараж','-age'],['die Massage','массаж','-age'],['die Etage','этаж','-age'],['die Reportage','репортаж','-age'],
   ['die Familie','семья','-ie'],['die Energie','энергия','-ie'],['die Biologie','биология','-ie'],['die Industrie','промышленность','-ie'],['die Melodie','мелодия','-ie'],
   ['die Blume','цветок','-e'],['die Lampe','лампа','-e'],['die Katze','кошка','-e'],['die Tasche','сумка','-e'],['die Sprache','язык','-e'],
   ['die Fahrt','поездка','-t'],['die Arbeit','работа','-t'],['die Ankunft','прибытие','-t'],['die Sicht','вид','-t'],['die Absicht','намерение','-t']
  ]},
 das:{hero:'Teo', ru:'Тео', art:'das', color:'#0e9488', bg:'#ccfbf1',
  tails:[
   ['-chen','уменьшительное','das Mädchen','без исключений; род исходного слова стирается (die Frau → das Frauchen)'],
   ['-lein','уменьшительное (книжн.)','das Büchlein',''],
   ['-um','','das Datum',''],
   ['-ment','','das Dokument',''],
   ['-tum','','das Eigentum','⚠️ исключения: der Reichtum, der Irrtum'],
   ['-nis','','das Ergebnis','⚠️ ненадёжный! бывает die: die Erlaubnis, die Kenntnis, die Finsternis'],
   ['Ge-','приставка','das Geschenk','⚠️ исключения: die Geschichte, der Geschmack, der Gedanke, der Geburtstag'],
   ['глагол','инфинитив как сущ.','das Essen','работает с любым глаголом — всегда das'],
   ['по смыслу','языки, цвета, металлы, буквы/ноты','das Deutsch, das Gold','']],
  blocks:[
   {n:1,title:'Малыши и латынь',suf:['-chen','-lein','-um','-ment'],
    story:{audio:'sfx-das-1',
     de:'Teo ist ein Kind. Am Morgen gibt ihm das Mädchen von nebenan ein Brötchen. Zu Hause stehen ein Tischlein und ein Büchlein. Heute ist ein wichtiges Datum: alle gehen ins Museum im Zentrum. Teo nimmt ein Dokument (wie ein Ticket) und ein kleines Instrument mit. Im Museum sind das Praktikum und das Studium wie ein Spiel. Das Publikum klatscht. Am Abend isst Teo ein Hähnchen: „Das ist besser als jedes Medikament!“',
     ru:'Тео — ребёнок. Утром соседская девочка даёт ему булочку. Дома стоят столик и книжечка. Сегодня важная дата: все идут в музей в центре. Тео берёт документ (как билет) и маленький инструмент. В музее практика и учёба — как игра. Публика хлопает. Вечером Тео ест курочку: «Это лучше любого лекарства!»',
     targets:['Mädchen','Brötchen','Tischlein','Büchlein','Datum','Museum','Zentrum','Dokument','Instrument','Praktikum','Studium','Publikum','Hähnchen','Medikament']}},
   {n:2,title:'Ge-, глаголы и смысл',suf:['-tum','-nis','Ge-','глагол','по смыслу'],
    story:{audio:'sfx-das-2',
     de:'Teos Tag ist voller Erlebnisse. Am Morgen gibt es ein Geschenk und ein Getränk, dazu gibt es Gemüse. Teo liebt das Schwimmen, das Lernen und das Einkaufen mit Lina. Im Geschäft nehmen sie leichtes Gepäck. Das Ergebnis ist gut, und das Zeugnis ist gut. Teo lernt Deutsch und Russisch, mag Blau und Grün und das Gold. Weit weg sieht man das Gebirge. „Das Leben und das Essen — das ist wichtig!“ Und ein Gespräch mit Lina ist das schönste Ende vom Tag.',
     ru:'День Тео полон впечатлений. Утром есть подарок и напиток, ещё овощи. Тео любит плавание, учёбу и покупки с Линой. В магазине они берут лёгкий багаж. Результат хороший, и аттестат хороший. Тео учит немецкий и русский, любит синий и зелёный и золото. Вдали видны горы. «Жизнь и еда — вот что важно!» А разговор с Линой — лучшее завершение дня.',
     targets:['Erlebnisse','Geschenk','Getränk','Gemüse','Schwimmen','Lernen','Einkaufen','Geschäft','Gepäck','Ergebnis','Zeugnis','Deutsch','Russisch','Blau','Grün','Gold','Gebirge','Leben','Essen','Gespräch']}}],
  words:[
   ['das Mädchen','девочка','-chen'],['das Brötchen','булочка','-chen'],['das Hähnchen','курочка','-chen'],['das Häuschen','домик','-chen'],['das Kätzchen','котёнок','-chen'],
   ['das Fräulein','барышня','-lein'],['das Büchlein','книжечка','-lein'],['das Tischlein','столик','-lein'],
   ['das Datum','дата','-um'],['das Praktikum','практика','-um'],['das Studium','учёба','-um'],['das Museum','музей','-um'],['das Zentrum','центр','-um'],['das Publikum','публика','-um'],['das Visum','виза','-um'],
   ['das Dokument','документ','-ment'],['das Medikament','лекарство','-ment'],['das Instrument','инструмент','-ment'],['das Argument','аргумент','-ment'],['das Parlament','парламент','-ment'],
   ['das Eigentum','собственность','-tum'],['das Wachstum','рост','-tum'],['das Christentum','христианство','-tum'],
   ['das Ergebnis','результат','-nis'],['das Zeugnis','аттестат','-nis'],['das Erlebnis','впечатление','-nis'],['das Verhältnis','отношение','-nis'],
   ['das Geschenk','подарок','Ge-'],['das Gespräch','разговор','Ge-'],['das Getränk','напиток','Ge-'],['das Gemüse','овощи','Ge-'],['das Gepäck','багаж','Ge-'],['das Geschäft','магазин','Ge-'],['das Geld','деньги','Ge-'],['das Gebäude','здание','Ge-'],['das Gewicht','вес','Ge-'],['das Gebirge','горы','Ge-'],
   ['das Essen','еда','глагол'],['das Leben','жизнь','глагол'],['das Lernen','учёба','глагол'],['das Rauchen','курение','глагол'],['das Schwimmen','плавание','глагол'],['das Wiedersehen','встреча','глагол'],['das Einkaufen','покупки','глагол'],
   ['das Deutsch','немецкий язык','по смыслу'],['das Russisch','русский язык','по смыслу'],['das Blau','синий цвет','по смыслу'],['das Grün','зелёный цвет','по смыслу'],['das Gold','золото','по смыслу'],['das Silber','серебро','по смыслу'],['das Eisen','железо','по смыслу']
  ]}
};

function slug(s){return String(s).toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function bare(de){return de.replace(/^(der|die|das)\s+/,'');}
function esc(s){return s.replace(/'/g,"\\'");}
function chunk(a,n){const r=[];for(let k=0;k<a.length;k+=n)r.push(a.slice(k,k+n));return r;}
function praise(ok,total){const p=total?ok/total:0;if(p===1)return '🎉 Отлично! Всё верно!';if(p>=.8)return '👍 Очень хорошо!';if(p>=.5)return 'Неплохо — ещё разок!';return 'Потренируйся ещё 💪';}
function say(w,g){return `<button class="say" style="border:none;background:#0000000d;border-radius:8px;padding:3px 7px;cursor:pointer" onclick="playWord('${esc(w)}','${V[g]}')">🔊</button>`;}
function poolOf(g,suf){const d=DATA[g];return suf?d.words.filter(w=>suf.indexOf(w[2])>=0):d.words;}

/* ---------- правило: суффиксы → род (с исключениями) ---------- */
function renderRule(g,elId,suf){const d=DATA[g];const items=d.tails.filter(t=>!suf||suf.indexOf(t[0])>=0);
 // компактные чипы в ряд (перенос сам собой: 3+2 / все 5)
 let chips='<div style="display:flex;flex-wrap:wrap;gap:8px;margin:2px 0">';
 items.forEach(t=>{const warn=t[3]&&/⚠️/.test(t[3]);
   chips+=`<span style="display:inline-flex;align-items:center;gap:6px;background:${d.bg};border:1px solid ${d.color}55;border-radius:11px;padding:6px 12px;font-weight:800;color:${d.color}">${t[0]}${t[1]?`<span style="color:#6b7280;font-weight:500;font-size:13px">${t[1]}</span>`:''}${warn?' <span title="есть исключения">⚠️</span>':''}</span>`;});
 chips+='</div>';
 const ws=items.filter(t=>t[3]&&/⚠️/.test(t[3]));
 let warns='';
 if(ws.length){warns='<div style="display:flex;flex-direction:column;gap:5px;margin-top:8px">'
   +ws.map(t=>`<div style="font-size:13px;color:#92400e;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:5px 10px"><b>${t[0]}</b> — ${t[3].replace('⚠️','').trim()}</div>`).join('')+'</div>';}
 document.getElementById(elId).innerHTML=chips+warns;}

/* ---------- список слов по суффиксам ---------- */
function renderWords(g,elId,suf){const d=DATA[g];let html='';
 d.tails.filter(t=>!suf||suf.indexOf(t[0])>=0).forEach(t=>{const ws=d.words.filter(w=>w[2]===t[0]);if(!ws.length)return;
   html+=`<div style="margin:14px 0 4px;font-weight:800;color:${d.color}">${t[0]}${t[1]?' <span style="color:#6b7280;font-weight:500;font-size:14px">— '+t[1]+'</span>':''}</div>`;
   html+='<div style="display:flex;flex-direction:column;gap:5px">'+ws.map(w=>
     `<div style="display:grid;grid-template-columns:auto 1fr 1fr;gap:10px;align-items:center;background:#fff;border:1px solid var(--line);border-radius:10px;padding:7px 11px">`
     +`<button class="say" style="border:none;background:${d.bg};border-radius:9px;padding:5px 9px;cursor:pointer" onclick="playWord('${esc(bare(w[0]))}','${V[g]}')">🔊</button>`
     +`<b>${w[0]}</b><span style="color:#4b5563">${w[1]}</span></div>`).join('')+'</div>';});
 document.getElementById(elId).innerHTML=html;}

/* ---------- итог сессии ---------- */
function sessResults(el,g,ok,mist,total,gi,ng,runGroup){
 let html=`<div class="hvq">Итог${ng>1?` — часть ${gi+1} из ${ng}`:''}</div>`
  +`<div style="text-align:center;font-size:24px;margin:6px 0"><b style="color:${ok===total?'#16a34a':'#6d28d9'}">Правильно ${ok} из ${total}</b></div>`
  +`<div style="text-align:center;margin-bottom:6px;color:#6b7280">${praise(ok,total)}</div>`;
 if(mist.length){html+=`<div style="margin:12px 0 6px;font-weight:700;color:#dc2626">Работа над ошибками (${mist.length}):</div><div style="display:flex;flex-direction:column;gap:6px">`;
   mist.forEach(m=>{html+=`<div style="background:#fdecec;border:1px solid #f3c0c0;border-radius:10px;padding:8px 11px;font-size:15px"><b style="color:${DATA[m[3]].color}">${m[0]}</b> <span style="color:#4b5563">— ${m[1]}</span> ${say(bare(m[0]),m[3])}</div>`;});
   html+='</div>';}
 else html+='<div style="text-align:center;color:#16a34a;margin:8px 0">Без ошибок! 🎉</div>';
 html+='<div class="hvopts" style="margin-top:16px"><button class="btn" id="qAgain">🔁 Повторить</button>';
 if(gi+1<ng)html+=`<button class="btn" id="qNext" style="background:${DATA[g].color};color:#fff">Дальше →</button>`;
 html+='<button class="btn" id="qRestart">↩︎ Сначала</button></div>';
 el.innerHTML=html;
 el.querySelector('#qAgain').onclick=()=>runGroup(gi);
 const nx=el.querySelector('#qNext');if(nx)nx.onclick=()=>runGroup(gi+1);
 el.querySelector('#qRestart').onclick=()=>runGroup(0);
}

/* ---------- Соотнеси: слово ↔ перевод ---------- */
function initMatch(g,box,suf){const d=DATA[g];const el=document.getElementById(box);const words=poolOf(g,suf);
 function round(){const L=shuffle(words).slice(0,6).map((w,i)=>({de:w[0],ru:w[1],k:i}));const R=shuffle(L.slice());let sel=null,left=L.length,err=0;
  el.innerHTML='<div class="hvcnt">Соотнеси слово и перевод</div><div class="mgrid"><div id="mL"></div><div id="mR"></div></div><div style="text-align:center;margin-top:10px"><button class="btn sm" id="mNew">🔀 Другие слова</button></div>';
  el.querySelector('#mL').innerHTML=L.map(x=>`<div class="mit" data-k="${x.k}" data-s="L">${x.de}</div>`).join('');
  el.querySelector('#mR').innerHTML=R.map(x=>`<div class="mit" data-k="${x.k}" data-s="R">${x.ru}</div>`).join('');
  el.querySelectorAll('.mit').forEach(m=>m.onclick=()=>{if(m.classList.contains('ok'))return;
    if(!sel){sel=m;m.classList.add('sel');return;}
    if(sel===m){m.classList.remove('sel');sel=null;return;}
    if(sel.dataset.s===m.dataset.s){sel.classList.remove('sel');sel=m;m.classList.add('sel');return;}
    if(sel.dataset.k===m.dataset.k){sel.classList.add('ok');m.classList.add('ok');sel.classList.remove('sel');playWord(bare(L.find(x=>x.k==m.dataset.k).de),V[g]);sel=null;if(--left===0)setTimeout(()=>done(err),700);}
    else{err++;const a=sel;m.classList.add('bad');a.classList.add('bad');sel=null;setTimeout(()=>{m.classList.remove('bad');a.classList.remove('bad','sel');},600);}});
  el.querySelector('#mNew').onclick=round;}
 function done(err){el.innerHTML=`<div class="hvq">Готово!</div><div style="text-align:center;font-size:22px;margin:6px 0"><b style="color:#16a34a">Все пары собраны 🎉</b></div>`
   +`<div style="text-align:center;color:#6b7280;margin-bottom:6px">${err?('Ошибочных нажатий: '+err):'Без ошибок! 👍'}</div>`
   +`<div class="hvopts"><button class="btn" id="mAgain" style="background:${DATA[g].color};color:#fff">Ещё раз →</button></div>`;
   el.querySelector('#mAgain').onclick=round;}
 round();}

/* ---------- Выбери перевод (RU → DE), группами ---------- */
function initChoice(g,box,suf,size){size=size||10;const d=DATA[g];const el=document.getElementById(box);const words=poolOf(g,suf);
 const groups=chunk(shuffle(words),size);
 function runGroup(gi){if(gi>=groups.length)gi=0;const grp=groups[gi];let i=0,ok=0,mist=[];
   function show(){const w=grp[i];
     const opts=shuffle([w[0],...shuffle(words.filter(x=>x[0]!==w[0])).slice(0,2).map(x=>x[0])]);
     el.innerHTML=`<div class="hvcnt">Часть ${gi+1} из ${groups.length} · ${i+1} / ${grp.length} · верно ${ok}</div>`
      +`<div class="qru">Выбери перевод:</div><div class="hvq">${w[1]}</div><div class="cots" id="cots"></div><div class="hvfb" id="cfb"></div>`;
     el.querySelector('#cots').innerHTML=opts.map(o=>`<button class="btn">${o}</button>`).join('');
     el.querySelectorAll('#cots .btn').forEach(b=>b.onclick=()=>pick(b.textContent,b));}
   function pick(ans,btn){const w=grp[i];const good=ans===w[0];
     el.querySelectorAll('#cots .btn').forEach(b=>{b.disabled=true;if(b.textContent===w[0])b.style.background='#e8f6ee';});
     if(!good)btn.style.background='#fdecec';
     if(good)ok++;else mist.push([w[0],w[1],w[2],g]);
     el.querySelector('#cfb').innerHTML=(good?'<span style="color:#16a34a">✓ Верно! </span>':'<span style="color:#dc2626">✗ '+w[0]+' </span>')+say(bare(w[0]),g);
     playWord(bare(w[0]),V[g]);i++;
     setTimeout(()=>{i<grp.length?show():sessResults(el,g,ok,mist,grp.length,gi,groups.length,runGroup);},1100);}
   show();}
 runGroup(0);}

/* ---------- Переведи (RU→DE, самопроверка), группами ---------- */
function initTrans(g,box,suf,size){size=size||10;const d=DATA[g];const el=document.getElementById(box);const words=poolOf(g,suf);
 const groups=chunk(shuffle(words),size);
 function runGroup(gi){if(gi>=groups.length)gi=0;const grp=groups[gi];let i=0,ok=0,mist=[];
   function show(){const w=grp[i];
     el.innerHTML=`<div class="hvcnt">Часть ${gi+1} из ${groups.length} · ${i+1} / ${grp.length} · верно ${ok}</div>`
      +`<div class="qru">Скажи по-немецки (с артиклем):</div><div class="hvq">${w[1]}</div>`
      +`<div style="text-align:center"><button class="btn sm" id="trev">Показать ответ 🔊</button></div>`
      +`<div class="hvrev" id="trv" hidden></div>`
      +`<div class="hvopts" id="tmark" hidden><button class="btn" id="tok" style="color:#16a34a">✓ Знал(а)</button><button class="btn" id="tno" style="color:#dc2626">✗ Не знал(а)</button></div>`;
     el.querySelector('#trev').onclick=()=>{const r=el.querySelector('#trv');r.hidden=false;
       r.innerHTML=`<b>${w[0]}</b> ${say(bare(w[0]),g)}<div style="color:#6b7280;font-size:13px;margin-top:4px">суффикс ${w[2]} → ${d.art}</div>`;
       playWord(bare(w[0]),V[g]);el.querySelector('#tmark').hidden=false;el.querySelector('#trev').style.display='none';};
     el.querySelector('#tok').onclick=()=>mark(true);
     el.querySelector('#tno').onclick=()=>mark(false);}
   function mark(good){const w=grp[i];if(good)ok++;else mist.push([w[0],w[1],w[2],g]);i++;
     i<grp.length?show():sessResults(el,g,ok,mist,grp.length,gi,groups.length,runGroup);}
   show();}
 runGroup(0);}

/* ---------- ФЛАГМАН: определи род по суффиксу (детерминир. группы, выбор группы) ---------- */
function initMix(box,size){
 size=size||30;
 const all=[];['der','die','das'].forEach(g=>DATA[g].words.forEach(w=>all.push([bare(w[0]),g,w[2]])));
 function seededShuffle(a,seed){a=a.slice();let s=seed>>>0;const rnd=()=>{s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
 const pool=seededShuffle(all,20250817);let groups=chunk(pool,size);
 if(groups.length>1&&groups[groups.length-1].length<size*0.4){const last=groups.pop();groups[groups.length-1]=groups[groups.length-1].concat(last);}
 const el=document.getElementById(box);
 function saveG(gi){try{localStorage.setItem('sf_mix_g',gi);}catch(e){}}
 function pickerHTML(cur){let h='<div class="hvopts gpickbar" style="gap:6px;margin:0 0 12px;flex-wrap:wrap">';for(let k=0;k<groups.length;k++)h+=`<button class="btn sm gpick" data-g="${k}" style="${k===cur?'background:#6d28d9;color:#fff':''}">Группа ${k+1}</button>`;return h+'</div>';}
 function bindPicker(){el.querySelectorAll('.gpick').forEach(b=>b.onclick=()=>runGroup(+b.dataset.g));}
 function runGroup(gi){gi=((gi%groups.length)+groups.length)%groups.length;saveG(gi);const grp=groups[gi];const ans=new Array(grp.length).fill(null);let i=0;
   function fb(w,chosen){if(!chosen)return '<span style="color:#9ca3af">Выбери артикль…</span>';const good=chosen===w[1];
     return (good?'<span style="color:#16a34a">✓ Верно! </span>':'<span style="color:#dc2626">✗ '+chosen+' — неверно. </span>')
      +`<b style="color:${DATA[w[1]].color}">${w[1]} ${w[0]}</b> — суффикс <b>${w[2]}</b> ${say(w[0],w[1])}`;}
   function show(){const w=grp[i];const chosen=ans[i];const answered=ans.filter(Boolean).length;
     const opts=['der','die','das'].map(a=>{let st='color:'+DATA[a].color;
       if(chosen){if(a===w[1])st+=';background:#e8f6ee;border:2px solid #16a34a';else if(a===chosen)st+=';background:#fdecec;border:2px solid #dc2626';}
       return `<button class="btn" data-a="${a}" style="${st}">${a}</button>`;}).join('');
     el.innerHTML=pickerHTML(gi)
      +`<div class="hvcnt">Группа ${gi+1} из ${groups.length} · слово ${i+1} из ${grp.length} · отвечено ${answered} из ${grp.length}</div>`
      +`<div class="hvq">${w[0]}</div><div class="hvopts">${opts}</div><div class="hvfb" id="mfb">${fb(w,chosen)}</div>`
      +`<div class="hvopts" style="margin-top:14px"><button class="btn sm" id="mPrev"${i===0?' disabled':''}>← Назад</button>`
      +`<button class="btn sm" id="mNext"${i===grp.length-1?' disabled':''}>Вперёд →</button>`
      +`<button class="btn" id="mCheck" style="background:#6d28d9;color:#fff">Проверить группу ✓</button></div>`
      +`<div class="hvcnt" style="margin-top:6px">Выбери артикль, листай ← →. Ответ можно менять. В конце — «Проверить».</div>`;
     el.querySelectorAll('.hvopts .btn[data-a]').forEach(b=>b.onclick=()=>pick(b.dataset.a));
     el.querySelector('#mPrev').onclick=()=>{if(i>0){i--;show();}};
     el.querySelector('#mNext').onclick=()=>{if(i<grp.length-1){i++;show();}};
     el.querySelector('#mCheck').onclick=results;bindPicker();}
   function pick(a){ans[i]=a;const w=grp[i];if(typeof playWord==='function')playWord(w[0],V[w[1]]);show();}
   function results(){let ok=0,mist=[],good=[];grp.forEach((w,k)=>{if(ans[k]===w[1]){ok++;good.push(w);}else mist.push([w[0],w[1],ans[k]||'—',w[2]]);});
     let html=pickerHTML(gi)+`<div class="hvq">Итог — группа ${gi+1} из ${groups.length}</div>`
      +`<div style="text-align:center;font-size:24px;margin:6px 0"><b style="color:${ok===grp.length?'#16a34a':'#6d28d9'}">Правильно ${ok} из ${grp.length}</b></div>`
      +`<div style="text-align:center;margin-bottom:6px;color:#6b7280">${praise(ok,grp.length)}</div>`;
     if(mist.length){html+=`<div style="margin:12px 0 6px;font-weight:700;color:#dc2626">Ошибки (${mist.length}) — запомни род:</div><div style="display:flex;flex-direction:column;gap:6px">`;
       mist.forEach(m=>{html+=`<div style="background:#fdecec;border:1px solid #f3c0c0;border-radius:10px;padding:8px 11px;font-size:15px"><b style="color:${DATA[m[1]].color}">${m[1]} ${m[0]}</b> <span style="color:#6b7280">(суффикс ${m[3]})</span> — ты выбрал(а) <b>${m[2]}</b> ${say(m[0],m[1])}</div>`;});
       html+='</div>';}
     if(good.length){html+=`<div style="margin:14px 0 6px;font-weight:700;color:#16a34a">Верно (${good.length}):</div><div style="display:flex;flex-wrap:wrap;gap:6px">`;
       good.forEach(w=>{html+=`<span style="background:#e8f6ee;border:1px solid #bbf7d0;border-radius:10px;padding:5px 10px;font-size:14px"><b style="color:${DATA[w[1]].color}">${w[1]} ${w[0]}</b> ${say(w[0],w[1])}</span>`;});
       html+='</div>';}
     html+='<div class="hvopts" style="margin-top:16px"><button class="btn" id="mAgain">🔁 Повторить группу</button>';
     if(groups.length>1)html+='<button class="btn" id="mNextG" style="background:#6d28d9;color:#fff">Следующая группа →</button>';
     html+='<button class="btn" id="mRestart">↩︎ Сначала</button></div>';
     el.innerHTML=html;
     el.querySelector('#mAgain').onclick=()=>runGroup(gi);
     const nx=el.querySelector('#mNextG');if(nx)nx.onclick=()=>runGroup(gi+1);
     el.querySelector('#mRestart').onclick=()=>runGroup(0);bindPicker();}
   show();}
 let startGi=0;try{const s=parseInt(localStorage.getItem('sf_mix_g'),10);if(!isNaN(s)&&s>=0&&s<groups.length)startGi=s;}catch(e){}
 runGroup(startGi);}

/* ---------- Текст блока: послушай, прочитай, найди слова суффикса ---------- */
function initStory(g,box,n){const el=document.getElementById(box);if(!el)return;const d=DATA[g];
 const blk=(d.blocks||[]).find(b=>b.n===n);if(!blk||!blk.story){el.innerHTML='';return;}const p=blk.story;
 let picked={},checked=false;
 function paint(w){el.querySelectorAll('.pw').forEach(x=>{if(x.dataset.w===w)x.classList.toggle('on',!!picked[w]);});}
 function render(){
   const body=p.de.split(/(\s+)/).map(tok=>{const clean=tok.replace(/[^A-Za-zÄÖÜäöüß]/g,'');
     if(clean&&p.targets.indexOf(clean)>=0){const on=picked[clean]?' on':'';return tok.replace(clean,`<button class="pw${on}" data-w="${clean}">${clean}</button>`);}
     return tok;}).join('');
   el.innerHTML=`<div style="text-align:center;margin-bottom:8px"><button class="btn sm" id="pstory" style="background:${d.color};color:#fff">🔊 Слушать</button></div>`
     +`<div class="storytext">${body}</div>`
     +`<div style="text-align:center;margin-top:10px"><button class="btn sm" id="pchk" style="background:${d.color};color:#fff">Проверить</button> <button class="btn sm" id="pru">Перевод</button> <button class="btn sm" id="prst">↺ Ещё раз</button></div>`
     +`<div id="sru" class="storyru" hidden></div><div id="srev"></div>`;
   el.querySelector('#pstory').onclick=function(){playSeq(['audio/'+p.audio+'.mp3?v=1'],this);};
   el.querySelectorAll('.pw').forEach(b=>b.onclick=()=>{if(checked)return;const w=b.dataset.w;if(picked[w])delete picked[w];else picked[w]=1;paint(w);});
   el.querySelector('#pchk').onclick=check;
   el.querySelector('#pru').onclick=()=>{const r=el.querySelector('#sru');r.hidden=!r.hidden;r.textContent=p.ru;};
   el.querySelector('#prst').onclick=()=>{picked={};checked=false;render();};}
 function check(){checked=true;el.querySelectorAll('.pw').forEach(b=>b.classList.add(picked[b.dataset.w]?'good':'miss'));
   el.querySelector('#srev').innerHTML=`<div class="preveal" style="margin-top:10px;font-weight:700;color:${d.color}">Все выделенные слова — <span style="text-transform:uppercase">${d.art}</span>! Их род виден по суффиксу блока.</div>`;}
 render();}

return {DATA, renderRule, renderWords, initMatch, initChoice, initTrans, initMix, initStory};
})();
