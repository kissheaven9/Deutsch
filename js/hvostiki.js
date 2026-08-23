/* Тема «Существительные-хвостики»: хвостик (последнее слово в составном) задаёт род.
   Данные всех трёх героев + движок упражнений. Используют hub/hero/mix-страницы. */
const HV = (function(){
'use strict';
const V = {der:'male', die:'female', das:'child'};

const DATA = {
 der:{hero:'Otto', ru:'Отто', art:'der', color:'#3b5bdb', bg:'#eef2ff', song:'hvostiki-otto',
  lyrics:`[Припев]\nDer, der, der — das ist Otto!\nDer, der, der — Otto sagt!\n\n[Куплет — PLATZ]\nHier ist der Marktplatz,\ndort ist der Spielplatz,\nda ist der Parkplatz,\nund das ist mein Sitzplatz.\nDer Platz, der Platz — immer der!\n\n[Куплет — PLAN]\nIch habe den Fahrplan,\nich habe den Stadtplan,\nich habe den Zeitplan,\nOtto hat den Plan!\nDer Plan, der Plan — immer der!\n\n[Куплет — SCHEIN]\nWo ist der Führerschein?\nWo ist der Geldschein?\nDa kommt der Sonnenschein!\nOtto lacht: der Schein!\nDer Schein — immer der!\n\n[Куплет — WEG]\nDas ist der Fußweg,\ndas ist der Heimweg,\ndas ist der Radweg,\nOtto geht den Weg.\nDer Weg — immer der!\n\n[Куплет — HOF und RAUM]\nDa steht der Bahnhof,\nda steht der Bauernhof,\nhier ist der Klassenraum,\nhier ist der Wohnraum.\nDer Hof, der Raum — immer der!\n\n[Куплет — LAUF und KAUF]\nOtto schreibt den Lebenslauf,\nOtto macht den Einkauf,\nOtto steht und gibt nicht auf!\nDer Lauf, der Kauf — immer der!\n\n[Финал]\nPlatz, Plan, Schein, Weg,\nHof, Raum, Lauf, Kauf —\nalles der! Alles der!`,
  tails:[['-platz','der Platz','площадь / место'],['-plan','der Plan','план'],['-schein','der Schein','свет / документ'],['-weg','der Weg','путь / дорога'],['-hof','der Hof','двор'],['-raum','der Raum','помещение'],['-lauf','der Lauf','ход / бег'],['-kauf','der Kauf','покупка'],['-tag','der Tag','день'],['-monat','der Monat','месяц'],['-abend','der Abend','вечер'],['-preis','der Preis','цена'],['-ort','der Ort','место / город'],['-zug','der Zug','поезд'],['-brief','der Brief','письмо'],['-kurs','der Kurs','курс'],['-stock','der Stock','этаж']],
  song2:{title:'Alles Der', audio:'hvostiki-alles-der',
   lines:['[Intro]','Der, der, der — das ist Otto!','',
     '[Куплет 1]','Der Wochentag, der Feiertag,','der Geburtstag, jeder Tag —','alles der!','',
     '[Куплет 2]','Der Feierabend, spät und still,','der Sonntagabend, wie man will —','alles der!','',
     '[Куплет 3]','Der Fahrpreis und der Kaufpreis,','der Eintrittspreis ist heiß —','alles der!','',
     '[Куплет 4]','Der Wohnort und der Geburtsort,','der Urlaubsort — komm fort! —','alles der!','',
     '[Припев]','Der, der, der — das ist Otto!','Der, der, der — Otto sagt!','',
     '[Куплет 5]','Der Schnellzug und der Nachtzug,','der Regionalzug — genug! —','alles der!','',
     '[Куплет 6]','Der Liebesbrief, der Kurzbrief,','der Elternbrief liegt schief —','alles der!','',
     '[Куплет 7]','Der Deutschkurs und der Sprachkurs,','der Abendkurs — das ist Kurs —','alles der!','',
     '[Куплет 8]','Der erste Stock, der zweite Stock,','der dritte Stock — im Rock! —','alles der!','',
     '[Финал]','Tag, Abend, Preis und Ort,','Zug, Brief, Kurs und Stock —','alles der! Alles der!'],
   targets:['Wochentag','Feiertag','Geburtstag','Tag','Feierabend','Sonntagabend','Fahrpreis','Kaufpreis','Eintrittspreis','Wohnort','Geburtsort','Urlaubsort','Schnellzug','Nachtzug','Regionalzug','Liebesbrief','Kurzbrief','Elternbrief','Deutschkurs','Sprachkurs','Abendkurs','Stock','Abend','Preis','Ort','Zug','Brief','Kurs'],
   find:['-tag','-abend','-preis','-ort','-zug','-brief','-kurs','-stock'],
   img:'hvostiki-alles-der',
   coords:[[1,1.5,13,4],[17.5,1.5,11.5,4],[30.5,1.5,13,4],[45.5,2,15,8],[64,1.5,14,4],[82,2,16.5,11],[1,23,14,4.5],[17.5,23,12,4.5],[31,22,13,10],[63,20,13,4],[77.5,20,12,4],[89,20,10.5,11],[1,42,15,4],[17.5,41,11,4],[31,41,13,11],[64,42,13,4],[79,41,11,4],[89,41,10.5,11],[0.5,64,16,4],[17.5,64,12,4],[31,64,14,11],[55,64,14,4],[70,64,13,4],[84,64,15,11]]},
  words:[
   ['der Marktplatz','рыночная площадь','-platz'],['der Spielplatz','детская площадка','-platz'],['der Parkplatz','парковка','-platz'],['der Arbeitsplatz','рабочее место','-platz'],['der Sitzplatz','сидячее место','-platz'],
   ['der Fahrplan','расписание','-plan'],['der Stadtplan','карта города','-plan'],['der Zeitplan','график','-plan'],['der Terminplan','план встреч','-plan'],
   ['der Führerschein','водительские права','-schein'],['der Geldschein','купюра','-schein'],['der Sonnenschein','солнечный свет','-schein'],
   ['der Fußweg','тропинка','-weg'],['der Heimweg','путь домой','-weg'],['der Radweg','велодорожка','-weg'],['der Schulweg','дорога в школу','-weg'],
   ['der Bahnhof','вокзал','-hof'],['der Bauernhof','ферма','-hof'],['der Hinterhof','задний двор','-hof'],
   ['der Klassenraum','класс','-raum'],['der Wohnraum','жилое помещение','-raum'],['der Warteraum','зал ожидания','-raum'],
   ['der Lebenslauf','резюме','-lauf'],['der Einkauf','покупка','-kauf'],['der Verkauf','продажа','-kauf'],
   ['der Tag','день','-tag'],['der Montag','понедельник','-tag'],['der Dienstag','вторник','-tag'],['der Donnerstag','четверг','-tag'],['der Freitag','пятница','-tag'],['der Samstag','суббота','-tag'],['der Sonntag','воскресенье','-tag'],['der Geburtstag','день рождения','-tag'],['der Feiertag','праздник','-tag'],['der Wochentag','будний день','-tag'],
   ['der Monat','месяц','-monat'],['der Sommermonat','летний месяц','-monat'],['der Wintermonat','зимний месяц','-monat'],['der Urlaubsmonat','месяц отпуска','-monat'],
   ['der Abend','вечер','-abend'],['der Sonntagabend','воскресный вечер','-abend'],['der Freitagabend','вечер пятницы','-abend'],['der Feierabend','конец рабочего дня','-abend'],['der Heiligabend','Сочельник','-abend'],
   ['der Preis','цена','-preis'],['der Fahrpreis','стоимость проезда','-preis'],['der Kaufpreis','цена покупки','-preis'],['der Eintrittspreis','цена билета','-preis'],
   ['der Ort','место','-ort'],['der Wohnort','место жительства','-ort'],['der Geburtsort','место рождения','-ort'],['der Urlaubsort','место отдыха','-ort'],
   ['der Zug','поезд','-zug'],['der Schnellzug','скорый поезд','-zug'],['der Nachtzug','ночной поезд','-zug'],['der Regionalzug','региональный поезд','-zug'],
   ['der Brief','письмо','-brief'],['der Liebesbrief','любовное письмо','-brief'],['der Kurzbrief','записка','-brief'],['der Elternbrief','письмо родителям','-brief'],
   ['der Kurs','курс','-kurs'],['der Deutschkurs','курс немецкого','-kurs'],['der Sprachkurs','языковой курс','-kurs'],['der Abendkurs','вечерний курс','-kurs'],
   ['der Stock','этаж','-stock']
  ]},
 die:{hero:'Greta', ru:'Грета', art:'die', color:'#c2185b', bg:'#fce7f3', song:'hvostiki-greta',
  lyrics:`[Припев]\nDie, die, die — das ist Greta!\nDie, die, die — Greta singt!\n\n[Куплет — BAHN]\nDa kommt die Straßenbahn,\nda kommt die U-Bahn,\nda kommt die Eisenbahn,\nGreta fährt mit der Bahn.\nDie Bahn, die Bahn — immer die!\n\n[Куплет — KARTE]\nHier ist die Fahrkarte,\nhier ist die Speisekarte,\nhier ist die Postkarte,\nGreta liest die Karte.\nDie Karte — immer die!\n\n[Куплет — ZEIT]\nAm Morgen die Arbeitszeit,\nam Mittag die Pausenzeit,\nam Abend die Freizeit —\nGreta hat viel Zeit!\nDie Zeit — immer die!\n\n[Куплет — STRASSE und TÜR]\nHier ist die Hauptstraße,\ndort ist die Bahnhofstraße,\nhier ist die Haustür,\ndort ist die Autotür.\nDie Straße, die Tür — immer die!\n\n[Куплет — SCHRIFT und KASSE]\nDas ist die Unterschrift,\ndas ist die Handschrift,\nda steht die Kaffeekasse,\nda steht die Supermarktkasse.\nDie Schrift, die Kasse — immer die!\n\n[Куплет — STELLE]\nGreta sucht die Arbeitsstelle,\nGreta findet die Haltestelle,\nGreta kommt — und kommt sehr schnelle!\nDie Stelle — immer die!\n\n[Финал]\nBahn, Karte, Zeit und Stelle,\nSchrift, Kasse, Straße, Tür —\nalles die! Alles die!`,
  tails:[['-bahn','die Bahn','дорога / путь (рельсы)'],['-karte','die Karte','карта / карточка'],['-zeit','die Zeit','время'],['-straße','die Straße','улица'],['-tür','die Tür','дверь'],['-schrift','die Schrift','письмо / шрифт'],['-kasse','die Kasse','касса'],['-stelle','die Stelle','место / точка'],['-stunde','die Stunde','час / урок'],['-woche','die Woche','неделя'],['-nummer','die Nummer','номер']],
  song2:{title:'Alles Die', audio:'hvostiki-alles-die',
   lines:['[Intro]','Die, die, die — das ist Greta!','',
     '[Куплет 1 — STUNDE]','Die Deutschstunde, die Schulstunde,','die Sportstunde, jede Stunde —','alles die!','',
     '[Куплет 2 — STUNDE]','Die Mittagsstunde, warm und satt,','die Abendstunde in der Stadt —','alles die!','',
     '[Припев]','Die, die, die — das ist Greta!','Die, die, die — Greta singt!','',
     '[Куплет 3 — WOCHE]','Die Arbeitswoche, lang und schwer,','die Ferienwoche — bitte mehr! —','alles die!','',
     '[Куплет 4 — WOCHE]','Die erste Woche, die zweite Woche,','die ganze Woche — Greta kocht sie —','alles die!','',
     '[Припев]','Die, die, die — das ist Greta!','Die, die, die — Greta singt!','',
     '[Куплет 5 — NUMMER]','Die Hausnummer, die Handynummer,','die Zimmernummer — welche Nummer? —','alles die!','',
     '[Куплет 6 — NUMMER]','Die Telefonnummer, schreib sie auf!','Die Kontonummer — pass gut auf! —','alles die!','',
     '[Финал]','Stunde, Woche, Nummer —','alles die! Alles die!'],
   targets:['Deutschstunde','Schulstunde','Sportstunde','Stunde','Mittagsstunde','Abendstunde','Arbeitswoche','Ferienwoche','Woche','Hausnummer','Handynummer','Zimmernummer','Nummer','Telefonnummer','Kontonummer'],
   find:['-stunde','-woche','-nummer'],
   img:'hvostiki-alles-die',
   coords:[[6,3,13,4.5],[27,3,13,4.5],[79,3,15,9],[1,27,16,4.5],[20,27,13,4.5],[62,27,15,4.5],[80,27,15,4.5],[3,52,15,4.5],[17,52,16,4.5],[37,58,14,8],[64,71,14,4.5],[78,71,15,4.5],[88,71,12,4.5],[16,83,19,8.5],[29,84,18,11]]},
  words:[
   ['die Straßenbahn','трамвай','-bahn'],['die U-Bahn','метро','-bahn'],['die Eisenbahn','железная дорога','-bahn'],['die Autobahn','автобан','-bahn'],
   ['die Fahrkarte','билет','-karte'],['die Speisekarte','меню','-karte'],['die Postkarte','открытка','-karte'],['die Eintrittskarte','входной билет','-karte'],['die Landkarte','карта (местности)','-karte'],
   ['die Freizeit','свободное время','-zeit'],['die Arbeitszeit','рабочее время','-zeit'],['die Mittagszeit','полдень','-zeit'],['die Jahreszeit','время года','-zeit'],['die Uhrzeit','время (по часам)','-zeit'],
   ['die Hauptstraße','главная улица','-straße'],['die Bahnhofstraße','вокзальная улица','-straße'],['die Einbahnstraße','улица с односторонним движением','-straße'],
   ['die Haustür','входная дверь','-tür'],['die Autotür','дверь машины','-tür'],['die Kühlschranktür','дверь холодильника','-tür'],
   ['die Unterschrift','подпись','-schrift'],['die Handschrift','почерк','-schrift'],['die Überschrift','заголовок','-schrift'],
   ['die Supermarktkasse','касса супермаркета','-kasse'],['die Krankenkasse','больничная касса','-kasse'],['die Kaffeekasse','касса на кофе','-kasse'],
   ['die Haltestelle','остановка','-stelle'],['die Arbeitsstelle','место работы','-stelle'],['die Tankstelle','заправка','-stelle'],
   ['die Stunde','час / урок','-stunde'],['die Deutschstunde','урок немецкого','-stunde'],['die Schulstunde','школьный урок','-stunde'],['die Arbeitsstunde','рабочий час','-stunde'],['die Sportstunde','урок физкультуры','-stunde'],['die Mittagsstunde','полуденный час','-stunde'],['die Abendstunde','вечерний час','-stunde'],
   ['die Woche','неделя','-woche'],['die Arbeitswoche','рабочая неделя','-woche'],['die Schulwoche','учебная неделя','-woche'],['die Urlaubswoche','неделя отпуска','-woche'],['die Ferienwoche','неделя каникул','-woche'],
   ['die Nummer','номер','-nummer'],['die Hausnummer','номер дома','-nummer'],['die Telefonnummer','номер телефона','-nummer'],['die Handynummer','номер мобильного','-nummer'],['die Zimmernummer','номер комнаты','-nummer'],['die Kontonummer','номер счёта','-nummer']
  ]},
 das:{hero:'Teo', ru:'Тео', art:'das', color:'#0e9488', bg:'#ccfbf1', song:'hvostiki-teo',
  lyrics:`[Припев]
Das, das, das — das ist Teo!
Das, das, das — Teo lacht!

[Куплет — HAUS]
Hier steht das Wohnhaus,
dort steht das Rathaus,
da steht das Krankenhaus,
Teo kommt nach Hause.
Das Haus, das Haus — immer das!

[Куплет — ZIMMER]
Hier ist das Schlafzimmer,
hier ist das Kinderzimmer,
hier ist das Badezimmer,
Teo putzt das Zimmer.
Das Zimmer, das Zimmer — immer das!

[Припев]
Das, das, das — das ist Teo!
Das, das, das — Teo lacht!

[Куплет — BUCH und RAD]
Teo liest das Wörterbuch,
Teo schreibt das Notizbuch,
Teo fährt das Fahrrad,
Teo liebt das Rad.
Das Buch, das Rad — immer das!

[Куплет — AMT und GELD]
Am Montag das Rathausamt,
am Dienstag das Finanzamt,
im Sommer das Taschengeld,
im Winter das Kleingeld.
Das Amt, das Geld — immer das!

[Припев]
Das, das, das — das ist Teo!
Das, das, das — Teo lacht!

[Куплет — LAND und BAD]
Das ist das Heimatland,
das ist das Nachbarland,
hier ist das Schwimmbad,
dort ist das Sonnenbad.
Das Land, das Bad — immer das!

[Куплет — GE-]
Teo hört das Gespräch,
Teo baut das Gebäude,
Teo bringt das Geschenk —
Teo hat die Freude!
Ge-, Ge-, Ge- — immer das!

[Финал]
Haus, Zimmer, Buch und Rad,
Amt, Geld, Land und Bad —
alles das! Alles das!`,
  tails:[['-haus','das Haus','дом (здание)'],['-zimmer','das Zimmer','комната'],['-buch','das Buch','книга'],['-rad','das Rad','колесо / велосипед'],['-amt','das Amt','ведомство'],['-geld','das Geld','деньги'],['-land','das Land','страна'],['-bad','das Bad','ванна / купание'],['-zeug','das Zeug','принадлежности'],['-jahr','das Jahr','год'],['-essen','das Essen','еда / приём пищи'],['Ge-','das Ge-','приставка Ge- → часто das']],
  words:[
   ['das Wohnhaus','жилой дом','-haus'],['das Rathaus','ратуша','-haus'],['das Krankenhaus','больница','-haus'],['das Kaufhaus','универмаг','-haus'],
   ['das Schlafzimmer','спальня','-zimmer'],['das Kinderzimmer','детская','-zimmer'],['das Badezimmer','ванная','-zimmer'],['das Wohnzimmer','гостиная','-zimmer'],['das Wartezimmer','приёмная','-zimmer'],
   ['das Wörterbuch','словарь','-buch'],['das Notizbuch','блокнот','-buch'],['das Kochbuch','книга рецептов','-buch'],['das Lehrbuch','учебник','-buch'],
   ['das Fahrrad','велосипед','-rad'],['das Rad','колесо / велик','-rad'],
   ['das Finanzamt','налоговая','-amt'],['das Arbeitsamt','биржа труда','-amt'],['das Amt','ведомство','-amt'],
   ['das Taschengeld','карманные деньги','-geld'],['das Kleingeld','мелочь','-geld'],['das Bargeld','наличные','-geld'],
   ['das Heimatland','родина','-land'],['das Nachbarland','соседняя страна','-land'],['das Ausland','заграница','-land'],
   ['das Schwimmbad','бассейн','-bad'],['das Sonnenbad','солнечная ванна','-bad'],
   ['das Spielzeug','игрушка','-zeug'],['das Werkzeug','инструмент','-zeug'],['das Flugzeug','самолёт','-zeug'],['das Feuerzeug','зажигалка','-zeug'],
   ['das Jahr','год','-jahr'],['das Schuljahr','учебный год','-jahr'],['das Halbjahr','полугодие','-jahr'],['das Neujahr','Новый год','-jahr'],
   ['das Essen','еда','-essen'],['das Mittagessen','обед','-essen'],['das Abendessen','ужин','-essen'],
   ['das Gespräch','разговор','Ge-'],['das Gebäude','здание','Ge-'],['das Geschenk','подарок','Ge-']
  ]}
};

function slug(s){return String(s).toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function bare(de){return de.replace(/^(der|die|das)\s+/,'');}   // без артикля
function esc(s){return s.replace(/'/g,"\\'");}

/* ---------- рендер песни ---------- */
function renderSong(g,elId){const d=DATA[g];const html=d.lyrics.split('\n').map(l=>{
  if(/^\[.*\]$/.test(l))return `<div style="font-weight:800;color:${d.color};margin:10px 0 2px">${l}</div>`;
  if(!l.trim())return '<div style="height:6px"></div>';
  return `<div>${l}</div>`;}).join('');
 document.getElementById(elId).innerHTML=html;}

/* ---------- список слов по хвостикам ---------- */
function renderWords(g,elId){const d=DATA[g];let html='';
 d.tails.forEach(t=>{const ws=d.words.filter(w=>w[2]===t[0]);if(!ws.length)return;
   html+=`<div style="margin:14px 0 4px;font-weight:800;color:${d.color}">${t[0]} → <span style="color:#111">${t[1]}</span> <span style="color:#6b7280;font-weight:500;font-size:14px">(${t[2]})</span></div>`;
   html+='<div style="display:flex;flex-direction:column;gap:5px">'+ws.map(w=>
     `<div style="display:grid;grid-template-columns:auto 1fr 1fr;gap:10px;align-items:center;background:#fff;border:1px solid var(--line);border-radius:10px;padding:7px 11px">`
     +`<button class="say" style="border:none;background:${d.bg};border-radius:9px;padding:5px 9px;cursor:pointer" onclick="playWord('${esc(bare(w[0]))}','${V[g]}')">🔊</button>`
     +`<b>${w[0]}</b><span style="color:#4b5563">${w[1]}</span></div>`).join('')+'</div>';});
 document.getElementById(elId).innerHTML=html;}

/* ---------- helpers: сессии группами с итогом и работой над ошибками ---------- */
function chunk(a,n){const r=[];for(let k=0;k<a.length;k+=n)r.push(a.slice(k,k+n));return r;}
function praise(ok,total){const p=total?ok/total:0;if(p===1)return '🎉 Отлично! Всё верно!';if(p>=.8)return '👍 Очень хорошо!';if(p>=.5)return 'Неплохо — ещё разок!';return 'Потренируйся ещё 💪';}
/* mist: [de(с артиклем), ru, tail, g] */
function sessResults(el,g,ok,mist,total,gi,ng,runGroup){
 let html=`<div class="hvq">Итог${ng>1?` — группа ${gi+1} из ${ng}`:''}</div>`
  +`<div style="text-align:center;font-size:24px;margin:6px 0"><b style="color:${ok===total?'#16a34a':'#6d28d9'}">Правильно ${ok} из ${total}</b></div>`
  +`<div style="text-align:center;margin-bottom:6px;color:#6b7280">${praise(ok,total)}</div>`;
 if(mist.length){html+=`<div style="margin:12px 0 6px;font-weight:700;color:#dc2626">Работа над ошибками (${mist.length}):</div><div style="display:flex;flex-direction:column;gap:6px">`;
   mist.forEach(m=>{html+=`<div style="background:#fdecec;border:1px solid #f3c0c0;border-radius:10px;padding:8px 11px;font-size:15px"><b style="color:${DATA[m[3]].color}">${m[0]}</b> <span style="color:#4b5563">— ${m[1]}</span> <span style="color:#6b7280;font-size:13px">(${m[2]})</span> <button class="say" onclick="playWord('${esc(bare(m[0]))}','${V[m[3]]}')">🔊</button></div>`;});
   html+='</div>';}
 else html+='<div style="text-align:center;color:#16a34a;margin:8px 0">Без ошибок! 🎉</div>';
 html+='<div class="hvopts" style="margin-top:16px"><button class="btn" id="qAgain">🔁 Повторить</button>';
 if(gi+1<ng)html+=`<button class="btn" id="qNext" style="background:${DATA[g].color};color:#fff">Дальше →</button>`;
 html+='<button class="btn" id="qRestart">↩︎ Сначала</button></div>';
 el.innerHTML=html;
 document.getElementById('qAgain').onclick=()=>runGroup(gi);
 const nx=document.getElementById('qNext');if(nx)nx.onclick=()=>runGroup(gi+1);
 document.getElementById('qRestart').onclick=()=>runGroup(0);
}

/* ---------- Переведи (RU→DE, самопроверка) ---------- */
function initTrans(g,box,size){size=size||10;const d=DATA[g];const el=document.getElementById(box);
 const groups=chunk(shuffle(d.words),size);
 function runGroup(gi){if(gi>=groups.length)gi=0;const grp=groups[gi];let i=0,ok=0,mist=[];
   function show(){const w=grp[i];
     el.innerHTML=`<div class="hvcnt">Группа ${gi+1} из ${groups.length} · ${i+1} / ${grp.length} · верно ${ok}</div>`
      +`<div class="qru">Скажи по-немецки:</div><div class="hvq">${w[1]}</div>`
      +`<div style="text-align:center"><button class="btn sm" id="trev">Показать ответ 🔊</button></div>`
      +`<div class="hvrev" id="trv" hidden></div>`
      +`<div class="hvopts" id="tmark" hidden><button class="btn" id="tok" style="color:#16a34a">✓ Знал(а)</button><button class="btn" id="tno" style="color:#dc2626">✗ Не знал(а)</button></div>`;
     document.getElementById('trev').onclick=()=>{const r=document.getElementById('trv');r.hidden=false;
       r.innerHTML=`<b>${w[0]}</b> <button class="say" onclick="playWord('${esc(bare(w[0]))}','${V[g]}')">🔊</button><div style="color:#6b7280;font-size:13px;margin-top:4px">${w[2]} → ${d.art}</div>`;
       playWord(bare(w[0]),V[g]);document.getElementById('tmark').hidden=false;document.getElementById('trev').style.display='none';};
     document.getElementById('tok').onclick=()=>mark(true);
     document.getElementById('tno').onclick=()=>mark(false);}
   function mark(good){const w=grp[i];if(good)ok++;else mist.push([w[0],w[1],w[2],g]);i++;
     i<grp.length?show():sessResults(el,g,ok,mist,grp.length,gi,groups.length,runGroup);}
   show();}
 runGroup(0);}

/* ---------- ФЛАГМАН: определи род по хвостику (листаешь ← →, в конце «Проверить») ---------- */
function say(w,g){return `<button class="say" style="border:none;background:#0000000d;border-radius:8px;padding:3px 7px;cursor:pointer" onclick="playWord('${esc(w)}','${V[g]}')">🔊</button>`;}
function initMix(box,size){
 size=size||30;
 const all=[]; ['der','die','das'].forEach(g=>DATA[g].words.forEach(w=>all.push([bare(w[0]),g,w[2]])));
 // детерминированный порядок: «Группа N» ВСЕГДА одни и те же слова (роды вперемешку) — можно вернуться к любой
 function seededShuffle(a,seed){a=a.slice();let s=seed>>>0;const rnd=()=>{s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
 const pool=seededShuffle(all,20250817);let groups=chunk(pool,size);
 if(groups.length>1&&groups[groups.length-1].length<size*0.4){const last=groups.pop();groups[groups.length-1]=groups[groups.length-1].concat(last);}
 const el=document.getElementById(box);
 function saveG(gi){try{localStorage.setItem('hv_mix_g',gi);}catch(e){}}
 function pickerHTML(cur){let h='<div class="hvopts gpickbar" style="gap:6px;margin:0 0 12px;flex-wrap:wrap">';for(let k=0;k<groups.length;k++)h+=`<button class="btn sm gpick" data-g="${k}" style="${k===cur?'background:#6d28d9;color:#fff':''}">Группа ${k+1}</button>`;return h+'</div>';}
 function bindPicker(){el.querySelectorAll('.gpick').forEach(b=>b.onclick=()=>runGroup(+b.dataset.g));}
 function runGroup(gi){gi=((gi%groups.length)+groups.length)%groups.length;saveG(gi);const grp=groups[gi];const ans=new Array(grp.length).fill(null);let i=0;
   function fb(w,chosen){if(!chosen)return '<span style="color:#9ca3af">Выбери артикль…</span>';const good=chosen===w[1];
     return (good?'<span style="color:#16a34a">✓ Верно! </span>':'<span style="color:#dc2626">✗ '+chosen+' — неверно. </span>')
      +`<b style="color:${DATA[w[1]].color}">${w[1]} ${w[0]}</b> — хвостик <b>${w[2]}</b> ${say(w[0],w[1])}`;}
   function show(){const w=grp[i];const chosen=ans[i];const answered=ans.filter(Boolean).length;
     const opts=['der','die','das'].map(a=>{let st='color:'+DATA[a].color;
       if(chosen){if(a===w[1])st+=';background:#e8f6ee;border:2px solid #16a34a';else if(a===chosen)st+=';background:#fdecec;border:2px solid #dc2626';}
       return `<button class="btn" data-a="${a}" style="${st}">${a}</button>`;}).join('');
     el.innerHTML=pickerHTML(gi)
      +`<div class="hvcnt">Группа ${gi+1} из ${groups.length} · слово ${i+1} из ${grp.length} · отвечено ${answered} из ${grp.length}</div>`
      +`<div class="hvq">${w[0]}</div>`
      +`<div class="hvopts">${opts}</div>`
      +`<div class="hvfb" id="mfb">${fb(w,chosen)}</div>`
      +`<div class="hvopts" style="margin-top:14px">`
        +`<button class="btn sm" id="mPrev"${i===0?' disabled':''}>← Назад</button>`
        +`<button class="btn sm" id="mNext"${i===grp.length-1?' disabled':''}>Вперёд →</button>`
        +`<button class="btn" id="mCheck" style="background:#6d28d9;color:#fff">Проверить группу ✓</button>`
      +`</div>`
      +`<div class="hvcnt" style="margin-top:6px">Выбери артикль, листай ← →. Ответ можно менять. В конце — «Проверить».</div>`;
     el.querySelectorAll('.hvopts .btn[data-a]').forEach(b=>b.onclick=()=>pick(b.dataset.a));
     document.getElementById('mPrev').onclick=()=>{if(i>0){i--;show();}};
     document.getElementById('mNext').onclick=()=>{if(i<grp.length-1){i++;show();}};
     document.getElementById('mCheck').onclick=results;bindPicker();}
   function pick(a){ans[i]=a;const w=grp[i];if(typeof playWord==='function')playWord(w[0],V[w[1]]);show();}
   function results(){let ok=0,mist=[],good=[];grp.forEach((w,k)=>{if(ans[k]===w[1]){ok++;good.push(w);}else mist.push([w[0],w[1],ans[k]||'—',w[2]]);});
     let html=pickerHTML(gi)+`<div class="hvq">Итог — группа ${gi+1} из ${groups.length}</div>`
      +`<div style="text-align:center;font-size:24px;margin:6px 0"><b style="color:${ok===grp.length?'#16a34a':'#6d28d9'}">Правильно ${ok} из ${grp.length}</b></div>`
      +`<div style="text-align:center;margin-bottom:6px;color:#6b7280">${praise(ok,grp.length)}</div>`;
     if(mist.length){html+=`<div style="margin:12px 0 6px;font-weight:700;color:#dc2626">Ошибки (${mist.length}) — запомни род:</div><div style="display:flex;flex-direction:column;gap:6px">`;
       mist.forEach(m=>{html+=`<div style="background:#fdecec;border:1px solid #f3c0c0;border-radius:10px;padding:8px 11px;font-size:15px"><b style="color:${DATA[m[1]].color}">${m[1]} ${m[0]}</b> <span style="color:#6b7280">(хвостик ${m[3]})</span> — ты выбрал(а) <b>${m[2]}</b> ${say(m[0],m[1])}</div>`;});
       html+='</div>';}
     if(good.length){html+=`<div style="margin:14px 0 6px;font-weight:700;color:#16a34a">Верно (${good.length}):</div><div style="display:flex;flex-wrap:wrap;gap:6px">`;
       good.forEach(w=>{html+=`<span style="background:#e8f6ee;border:1px solid #bbf7d0;border-radius:10px;padding:5px 10px;font-size:14px"><b style="color:${DATA[w[1]].color}">${w[1]} ${w[0]}</b> ${say(w[0],w[1])}</span>`;});
       html+='</div>';}
     html+='<div class="hvopts" style="margin-top:16px"><button class="btn" id="mAgain">🔁 Повторить группу</button>';
     if(groups.length>1)html+='<button class="btn" id="mNextG" style="background:#6d28d9;color:#fff">Следующая группа →</button>';
     html+='<button class="btn" id="mRestart">↩︎ Сначала</button></div>';
     el.innerHTML=html;
     document.getElementById('mAgain').onclick=()=>runGroup(gi);
     const nx=document.getElementById('mNextG');if(nx)nx.onclick=()=>runGroup(gi+1);
     document.getElementById('mRestart').onclick=()=>runGroup(0);bindPicker();}
   show();}
 let startGi=0;try{const s=parseInt(localStorage.getItem('hv_mix_g'),10);if(!isNaN(s)&&s>=0&&s<groups.length)startGi=s;}catch(e){}
 runGroup(startGi);}

/* ---------- Соотнеси: слово ↔ перевод ---------- */
function initMatch(g,box){const d=DATA[g];const el=document.getElementById(box);
 function round(){const L=shuffle(d.words).slice(0,6).map((w,i)=>({de:w[0],ru:w[1],k:i}));const R=shuffle(L.slice());let sel=null,left=6,err=0;
  el.innerHTML='<div class="hvcnt">Соотнеси 6 пар · слово ↔ перевод</div><div class="mgrid"><div id="mL"></div><div id="mR"></div></div><div style="text-align:center;margin-top:10px"><button class="btn sm" id="mNew">🔀 Другие 6 слов</button></div>';
  document.getElementById('mL').innerHTML=L.map(x=>`<div class="mit" data-k="${x.k}" data-s="L">${x.de}</div>`).join('');
  document.getElementById('mR').innerHTML=R.map(x=>`<div class="mit" data-k="${x.k}" data-s="R">${x.ru}</div>`).join('');
  el.querySelectorAll('.mit').forEach(m=>m.onclick=()=>{if(m.classList.contains('ok'))return;
    if(!sel){sel=m;m.classList.add('sel');return;}
    if(sel===m){m.classList.remove('sel');sel=null;return;}
    if(sel.dataset.s===m.dataset.s){sel.classList.remove('sel');sel=m;m.classList.add('sel');return;}
    if(sel.dataset.k===m.dataset.k){sel.classList.add('ok');m.classList.add('ok');sel.classList.remove('sel');playWord(bare(L.find(x=>x.k==m.dataset.k).de),V[g]);sel=null;if(--left===0)setTimeout(()=>done(err),700);}
    else{err++;const a=sel;m.classList.add('bad');a.classList.add('bad');sel=null;setTimeout(()=>{m.classList.remove('bad');a.classList.remove('bad','sel');},600);}});
  document.getElementById('mNew').onclick=round;}
 function done(err){el.innerHTML=`<div class="hvq">Готово!</div>`
   +`<div style="text-align:center;font-size:22px;margin:6px 0"><b style="color:#16a34a">Все 6 пар собраны 🎉</b></div>`
   +`<div style="text-align:center;color:#6b7280;margin-bottom:6px">${err?('Ошибочных нажатий: '+err+' — в следующий раз аккуратнее 💪'):'Без единой ошибки! 👍'}</div>`
   +`<div class="hvopts" style="margin-top:12px"><button class="btn" id="mAgain" style="background:${DATA[g].color};color:#fff">Ещё 6 слов →</button></div>`;
   document.getElementById('mAgain').onclick=round;}
 round();}

/* ---------- Выбери перевод (RU → DE) ---------- */
function initChoice(g,box,size){size=size||10;const d=DATA[g];const el=document.getElementById(box);
 const groups=chunk(shuffle(d.words),size);
 function runGroup(gi){if(gi>=groups.length)gi=0;const grp=groups[gi];let i=0,ok=0,mist=[];
   function show(){const w=grp[i];
     const opts=shuffle([w[0],...shuffle(d.words.filter(x=>x[0]!==w[0])).slice(0,2).map(x=>x[0])]);
     el.innerHTML=`<div class="hvcnt">Группа ${gi+1} из ${groups.length} · ${i+1} / ${grp.length} · верно ${ok}</div>`
      +`<div class="qru">Выбери перевод:</div><div class="hvq">${w[1]}</div>`
      +`<div class="cots" id="cots"></div><div class="hvfb" id="cfb"></div>`;
     document.getElementById('cots').innerHTML=opts.map(o=>`<button class="btn">${o}</button>`).join('');
     el.querySelectorAll('#cots .btn').forEach(b=>b.onclick=()=>pick(b.textContent,b));}
   function pick(ans,btn){const w=grp[i];const good=ans===w[0];
     el.querySelectorAll('#cots .btn').forEach(b=>{b.disabled=true;if(b.textContent===w[0])b.style.background='#e8f6ee';});
     if(!good)btn.style.background='#fdecec';
     if(good)ok++;else mist.push([w[0],w[1],w[2],g]);
     document.getElementById('cfb').innerHTML=(good?'<span style="color:#16a34a">✓ Верно! </span>':'<span style="color:#dc2626">✗ '+w[0]+' </span>')+`<button class="say" onclick="playWord('${esc(bare(w[0]))}','${V[g]}')">🔊</button>`;
     playWord(bare(w[0]),V[g]);i++;
     setTimeout(()=>{i<grp.length?show():sessResults(el,g,ok,mist,grp.length,gi,groups.length,runGroup);},1100);}
   show();}
 runGroup(0);}

/* ---------- Собери слово (компонент + хвостик) ---------- */
function stem(w){return bare(w[0]).replace(new RegExp(w[2].replace(/[-]/g,'')+'$','i'),'');}
function initSammel(g,box,size){size=size||10;const d=DATA[g];const pool=d.words.filter(w=>w[2]!=='Ge-'&&stem(w));const el=document.getElementById(box);
 const groups=chunk(shuffle(pool),size);
 function runGroup(gi){if(gi>=groups.length)gi=0;const grp=groups[gi];let i=0,ok=0,mist=[];
   function show(){const w=grp[i];const base=w[2].replace(/[-]/g,'');
     el.innerHTML=`<div class="hvcnt">Группа ${gi+1} из ${groups.length} · ${i+1} / ${grp.length} · верно ${ok}</div>`
      +`<div class="qru">${w[1]}</div><div class="hvq">___ + <b>-${base}</b> = ?</div>`
      +`<div class="cots" id="sopts"></div><div class="hvfb" id="sfb"></div>`;
     const opts=shuffle([stem(w),...shuffle(pool.filter(x=>x[2]===w[2]&&x[0]!==w[0])).slice(0,2).map(stem)]);
     document.getElementById('sopts').innerHTML=opts.map(o=>`<button class="btn">${o}</button>`).join('');
     el.querySelectorAll('#sopts .btn').forEach(b=>b.onclick=()=>pick(b.textContent,b));}
   function pick(ans,btn){const w=grp[i];const good=ans.toLowerCase()===stem(w).toLowerCase();
     el.querySelectorAll('#sopts .btn').forEach(b=>{b.disabled=true;if(b.textContent.toLowerCase()===stem(w).toLowerCase())b.style.background='#e8f6ee';});
     if(!good)btn.style.background='#fdecec';
     if(good)ok++;else mist.push([w[0],w[1],w[2],g]);
     document.getElementById('sfb').innerHTML=(good?'<span style="color:#16a34a">✓ </span>':'<span style="color:#dc2626">✗ </span>')+`<b>${w[0]}</b> <button class="say" onclick="playWord('${esc(bare(w[0]))}','${V[g]}')">🔊</button> <span style="color:#6b7280;font-size:13px">${w[2]} → ${d.art}</span>`;
     playWord(bare(w[0]),V[g]);i++;
     setTimeout(()=>{i<grp.length?show():sessResults(el,g,ok,mist,grp.length,gi,groups.length,runGroup);},1100);}
   show();}
 runGroup(0);}

/* ---------- Песня «Alles ...»: послушай, прочитай, найди хвостики ---------- */
function initSongFind(g,box){const el=document.getElementById(box);if(!el)return;const d=DATA[g];const p=d.song2;
 if(!p){el.innerHTML='';return;}
 let picked={},checked=false;
 function paint(w){el.querySelectorAll('.pw').forEach(x=>{if(x.dataset.w===w)x.classList.toggle('on',!!picked[w]);});}
 function render(){
   const body=p.lines.map(line=>{
     if(/^\[.*\]$/.test(line))return `<div class="hd" style="color:${d.color}">${line}</div>`;
     if(!line.trim())return '<div style="height:6px"></div>';
     return '<div>'+line.split(/(\s+)/).map(tok=>{
       const clean=tok.replace(/[^A-Za-zÄÖÜäöüß]/g,'');
       if(clean&&p.targets.indexOf(clean)>=0){const on=picked[clean]?' on':'';return tok.replace(clean,`<button class="pw${on}" data-w="${clean}">${clean}</button>`);}
       return tok;}).join('')+'</div>';}).join('');
   el.innerHTML=`<div style="text-align:center;margin-bottom:10px"><button class="btn" id="psong" style="background:${d.color};color:#fff">🔊 Слушать песню</button></div>`
     +(p.img?`<div class="maskbar" style="justify-content:center;margin:0 0 6px"><button class="btn sm" id="s2open">👁 Открыть все</button><button class="btn sm" id="s2close">🙈 Закрыть все</button></div>`
       +`<p class="sub" style="color:#6b7280;text-align:center;margin:0 0 8px">Слова на картинке закрыты — нажми на плашку, чтобы открыть и проверить себя.</p>`
       +`<div class="imgmask" id="s2mask"><img src="img/${p.img}.png?v=1" alt=""></div>`:'')
     +`<div class="song2">${body}</div>`
     +`<div style="text-align:center;margin-top:12px"><button class="btn" id="pchk" style="background:${d.color};color:#fff">Проверить</button> <button class="btn sm" id="prst">↺ Ещё раз</button></div>`
     +`<div id="prev"></div>`;
   document.getElementById('psong').onclick=function(){playSeq(['audio/'+p.audio+'.mp3?v=1'],this);};
   if(p.img){const wrap=document.getElementById('s2mask');(p.coords||[]).forEach(c=>{const b=document.createElement('div');b.className='mbox';b.style.left=c[0]+'%';b.style.top=c[1]+'%';b.style.width=c[2]+'%';b.style.height=c[3]+'%';b.textContent='?';b.onclick=()=>b.classList.toggle('open');wrap.appendChild(b);});
     document.getElementById('s2open').onclick=()=>wrap.querySelectorAll('.mbox').forEach(b=>b.classList.add('open'));
     document.getElementById('s2close').onclick=()=>wrap.querySelectorAll('.mbox').forEach(b=>b.classList.remove('open'));}
   el.querySelectorAll('.pw').forEach(b=>b.onclick=()=>{if(checked)return;const w=b.dataset.w;if(picked[w])delete picked[w];else picked[w]=1;paint(w);});
   document.getElementById('pchk').onclick=check;
   document.getElementById('prst').onclick=()=>{picked={};checked=false;render();};}
 function check(){checked=true;
   el.querySelectorAll('.pw').forEach(b=>b.classList.add(picked[b.dataset.w]?'good':'miss'));
   let html=`<div class="preveal"><div style="font-weight:800;margin:12px 0 8px;color:${d.color}">Хвостики этой песни — и все они <span style="text-transform:uppercase">${d.art}</span>:</div>`;
   p.find.forEach(t=>{const tl=d.tails.find(x=>x[0]===t);if(!tl)return;const ws=d.words.filter(w=>w[2]===t);
     html+=`<div class="tailbox" style="border-left:4px solid ${d.color}">`
      +`<div style="margin-bottom:6px"><b style="color:${d.color}">${t} → ${tl[1]}</b> <span style="color:#6b7280">(${tl[2]})</span></div>`
      +`<div class="tw">${ws.map(w=>`<span class="chip2"><b>${w[0]}</b> <button class="say" onclick="playWord('${esc(bare(w[0]))}','${V[g]}')">🔊</button> <i style="color:#6b7280">${w[1]}</i></span>`).join('')}</div></div>`;});
   html+='</div>';
   document.getElementById('prev').innerHTML=html;}
 render();}

/* ---------- Карточки: учить слова (DE+артикль → RU), с озвучкой ---------- */
function initCards(g,box,size){size=size||10;const d=DATA[g];const el=document.getElementById(box);
 const groups=chunk(shuffle(d.words),size);
 function runGroup(gi){if(gi>=groups.length)gi=0;const grp=groups[gi];let i=0,ok=0,mist=[];
   function show(){const w=grp[i];
     el.innerHTML=`<div class="hvcnt">Часть ${gi+1} из ${groups.length} · ${i+1} / ${grp.length} · знаю ${ok}</div>`
      +`<div class="hvq" style="color:${d.color}">${w[0]} ${say(bare(w[0]),g)}</div>`
      +`<div id="cback" hidden><div style="text-align:center;font-size:19px;color:#374151">${w[1]}</div><div style="text-align:center;color:#9ca3af;font-size:13px;margin-top:2px">хвостик ${w[2]}</div></div>`
      +`<div style="text-align:center;margin-top:10px"><button class="btn sm" id="cflip" style="background:${d.color};color:#fff">Перевод ↓</button></div>`
      +`<div class="hvopts" id="cmark" hidden><button class="btn" id="cok" style="color:#16a34a">✓ Знаю</button><button class="btn" id="cno" style="color:#dc2626">✗ Учить ещё</button></div>`;
     if(typeof playWord==='function')playWord(bare(w[0]),V[g]);
     el.querySelector('#cflip').onclick=()=>{el.querySelector('#cback').hidden=false;el.querySelector('#cmark').hidden=false;el.querySelector('#cflip').style.display='none';};
     el.querySelector('#cok').onclick=()=>mark(true);
     el.querySelector('#cno').onclick=()=>mark(false);}
   function mark(good){const w=grp[i];if(good)ok++;else mist.push([w[0],w[1],w[2],g]);i++;
     i<grp.length?show():sessResults(el,g,ok,mist,grp.length,gi,groups.length,runGroup);}
   show();}
 runGroup(0);}

return {DATA, renderSong, renderWords, initTrans, initMix, initMatch, initChoice, initSammel, initSongFind, initCards};
})();
