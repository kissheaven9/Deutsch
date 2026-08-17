/* Тема «Существительные-хвостики»: хвостик (последнее слово в составном) задаёт род.
   Данные всех трёх героев + движок упражнений. Используют hub/hero/mix-страницы. */
const HV = (function(){
'use strict';
const V = {der:'male', die:'female', das:'child'};

const DATA = {
 der:{hero:'Otto', ru:'Отто', art:'der', color:'#3b5bdb', bg:'#eef2ff', song:'hvostiki-otto',
  lyrics:`[Припев]\nDer, der, der — das ist Otto!\nDer, der, der — Otto sagt!\n\n[Куплет — PLATZ]\nHier ist der Marktplatz,\ndort ist der Spielplatz,\nda ist der Parkplatz,\nund das ist mein Sitzplatz.\nDer Platz, der Platz — immer der!\n\n[Куплет — PLAN]\nIch habe den Fahrplan,\nich habe den Stadtplan,\nich habe den Zeitplan,\nOtto hat den Plan!\nDer Plan, der Plan — immer der!\n\n[Куплет — SCHEIN]\nWo ist der Führerschein?\nWo ist der Geldschein?\nDa kommt der Sonnenschein!\nOtto lacht: der Schein!\nDer Schein — immer der!\n\n[Куплет — WEG]\nDas ist der Fußweg,\ndas ist der Heimweg,\ndas ist der Radweg,\nOtto geht den Weg.\nDer Weg — immer der!\n\n[Куплет — HOF und RAUM]\nDa steht der Bahnhof,\nda steht der Bauernhof,\nhier ist der Klassenraum,\nhier ist der Wohnraum.\nDer Hof, der Raum — immer der!\n\n[Куплет — LAUF und KAUF]\nOtto schreibt den Lebenslauf,\nOtto macht den Einkauf,\nOtto steht und gibt nicht auf!\nDer Lauf, der Kauf — immer der!\n\n[Финал]\nPlatz, Plan, Schein, Weg,\nHof, Raum, Lauf, Kauf —\nalles der! Alles der!`,
  tails:[['-platz','der Platz','площадь / место'],['-plan','der Plan','план'],['-schein','der Schein','свет / документ'],['-weg','der Weg','путь / дорога'],['-hof','der Hof','двор'],['-raum','der Raum','помещение'],['-lauf','der Lauf','ход / бег'],['-kauf','der Kauf','покупка']],
  words:[
   ['der Marktplatz','рыночная площадь','-platz'],['der Spielplatz','детская площадка','-platz'],['der Parkplatz','парковка','-platz'],['der Arbeitsplatz','рабочее место','-platz'],['der Sitzplatz','сидячее место','-platz'],
   ['der Fahrplan','расписание','-plan'],['der Stadtplan','карта города','-plan'],['der Zeitplan','график','-plan'],['der Terminplan','план встреч','-plan'],
   ['der Führerschein','водительские права','-schein'],['der Geldschein','купюра','-schein'],['der Sonnenschein','солнечный свет','-schein'],
   ['der Fußweg','тропинка','-weg'],['der Heimweg','путь домой','-weg'],['der Radweg','велодорожка','-weg'],['der Schulweg','дорога в школу','-weg'],
   ['der Bahnhof','вокзал','-hof'],['der Bauernhof','ферма','-hof'],['der Hinterhof','задний двор','-hof'],
   ['der Klassenraum','класс','-raum'],['der Wohnraum','жилое помещение','-raum'],['der Warteraum','зал ожидания','-raum'],
   ['der Lebenslauf','резюме','-lauf'],['der Einkauf','покупка','-kauf'],['der Verkauf','продажа','-kauf']
  ]},
 die:{hero:'Greta', ru:'Грета', art:'die', color:'#c2185b', bg:'#fce7f3', song:'hvostiki-greta',
  lyrics:`[Припев]\nDie, die, die — das ist Greta!\nDie, die, die — Greta singt!\n\n[Куплет — BAHN]\nDa kommt die Straßenbahn,\nda kommt die U-Bahn,\nda kommt die Eisenbahn,\nGreta fährt mit der Bahn.\nDie Bahn, die Bahn — immer die!\n\n[Куплет — KARTE]\nHier ist die Fahrkarte,\nhier ist die Speisekarte,\nhier ist die Postkarte,\nGreta liest die Karte.\nDie Karte — immer die!\n\n[Куплет — ZEIT]\nAm Morgen die Arbeitszeit,\nam Mittag die Pausenzeit,\nam Abend die Freizeit —\nGreta hat viel Zeit!\nDie Zeit — immer die!\n\n[Куплет — STRASSE und TÜR]\nHier ist die Hauptstraße,\ndort ist die Bahnhofstraße,\nhier ist die Haustür,\ndort ist die Autotür.\nDie Straße, die Tür — immer die!\n\n[Куплет — SCHRIFT und KASSE]\nDas ist die Unterschrift,\ndas ist die Handschrift,\nda steht die Kaffeekasse,\nda steht die Supermarktkasse.\nDie Schrift, die Kasse — immer die!\n\n[Куплет — STELLE]\nGreta sucht die Arbeitsstelle,\nGreta findet die Haltestelle,\nGreta kommt — und kommt sehr schnelle!\nDie Stelle — immer die!\n\n[Финал]\nBahn, Karte, Zeit und Stelle,\nSchrift, Kasse, Straße, Tür —\nalles die! Alles die!`,
  tails:[['-bahn','die Bahn','дорога / путь (рельсы)'],['-karte','die Karte','карта / карточка'],['-zeit','die Zeit','время'],['-straße','die Straße','улица'],['-tür','die Tür','дверь'],['-schrift','die Schrift','письмо / шрифт'],['-kasse','die Kasse','касса'],['-stelle','die Stelle','место / точка']],
  words:[
   ['die Straßenbahn','трамвай','-bahn'],['die U-Bahn','метро','-bahn'],['die Eisenbahn','железная дорога','-bahn'],['die Autobahn','автобан','-bahn'],
   ['die Fahrkarte','билет','-karte'],['die Speisekarte','меню','-karte'],['die Postkarte','открытка','-karte'],['die Eintrittskarte','входной билет','-karte'],['die Landkarte','карта (местности)','-karte'],
   ['die Freizeit','свободное время','-zeit'],['die Arbeitszeit','рабочее время','-zeit'],['die Mittagszeit','полдень','-zeit'],['die Jahreszeit','время года','-zeit'],['die Uhrzeit','время (по часам)','-zeit'],
   ['die Hauptstraße','главная улица','-straße'],['die Bahnhofstraße','вокзальная улица','-straße'],['die Einbahnstraße','улица с односторонним движением','-straße'],
   ['die Haustür','входная дверь','-tür'],['die Autotür','дверь машины','-tür'],['die Kühlschranktür','дверь холодильника','-tür'],
   ['die Unterschrift','подпись','-schrift'],['die Handschrift','почерк','-schrift'],['die Überschrift','заголовок','-schrift'],
   ['die Supermarktkasse','касса супермаркета','-kasse'],['die Krankenkasse','больничная касса','-kasse'],['die Kaffeekasse','касса на кофе','-kasse'],
   ['die Haltestelle','остановка','-stelle'],['die Arbeitsstelle','место работы','-stelle'],['die Tankstelle','заправка','-stelle']
  ]},
 das:{hero:'Teo', ru:'Тео', art:'das', color:'#0e9488', bg:'#ccfbf1', song:'hvostiki-teo',
  lyrics:`[Припев]\nDas, das, das — das ist Teo!\nDas, das, das — Teo lacht!\n\n[Куплет — HAUS]\nHier ist das Rathaus,\ndort ist das Kaufhaus,\nda ist das Krankenhaus,\nTeo wohnt im Wohnhaus.\nDas Haus, das Haus — immer das!\n\n[Куплет — ZIMMER]\nHier ist das Wohnzimmer,\ndort ist das Schlafzimmer,\nda ist das Badezimmer,\nTeo spielt im Kinderzimmer.\nDas Zimmer — immer das!\n\n[Куплет — ZEUG]\nDas ist das Spielzeug,\ndas ist das Werkzeug,\ndas ist das Flugzeug,\nTeo nimmt das Zeug.\nDas Zeug — immer das!\n\n[Куплет — BUCH]\nHier ist das Wörterbuch,\ndort ist das Kochbuch,\nda ist das Lehrbuch,\nTeo liest das Buch.\nDas Buch — immer das!\n\n[Финал]\nHaus, Zimmer, Zeug und Buch —\nalles das! Alles das!`,
  lyricsDraft:true,
  tails:[['-haus','das Haus','дом (здание)'],['-zimmer','das Zimmer','комната'],['-zeug','das Zeug','штука / принадлежности'],['-buch','das Buch','книга'],['-mittel','das Mittel','средство']],
  words:[
   ['das Rathaus','ратуша','-haus'],['das Kaufhaus','универмаг','-haus'],['das Krankenhaus','больница','-haus'],['das Wohnhaus','жилой дом','-haus'],
   ['das Wohnzimmer','гостиная','-zimmer'],['das Schlafzimmer','спальня','-zimmer'],['das Badezimmer','ванная','-zimmer'],['das Kinderzimmer','детская','-zimmer'],['das Wartezimmer','приёмная','-zimmer'],
   ['das Spielzeug','игрушка','-zeug'],['das Werkzeug','инструмент','-zeug'],['das Flugzeug','самолёт','-zeug'],['das Feuerzeug','зажигалка','-zeug'],
   ['das Wörterbuch','словарь','-buch'],['das Kochbuch','книга рецептов','-buch'],['das Lehrbuch','учебник','-buch'],['das Tagebuch','дневник','-buch'],
   ['das Lebensmittel','продукт питания','-mittel'],['das Verkehrsmittel','транспортное средство','-mittel']
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

/* ---------- упражнение: перевод RU→DE ---------- */
function initTrans(g,box){const d=DATA[g];let list=shuffle(d.words),i=0;
 const el=document.getElementById(box);
 el.innerHTML=`<div class="hvq" id="tq"></div><div style="text-align:center"><button class="btn sm" id="trev">Показать 🔊</button></div><div class="hvrev" id="trv" hidden></div><div style="text-align:center;margin-top:8px"><button class="btn sm" id="tnx">Дальше →</button></div><div class="hvcnt" id="tc"></div>`;
 function show(){document.getElementById('tq').textContent=list[i][1];document.getElementById('trv').hidden=true;document.getElementById('tc').textContent=`${i+1} / ${list.length}`;}
 document.getElementById('trev').onclick=()=>{const w=list[i];const r=document.getElementById('trv');r.hidden=false;r.innerHTML=`<b>${w[0]}</b> <button class="say" onclick="playWord('${esc(bare(w[0]))}','${V[g]}')">🔊</button> <span style="color:#6b7280;font-size:13px">${w[2]} → ${d.art}</span>`;playWord(bare(w[0]),V[g]);};
 document.getElementById('tnx').onclick=()=>{i=(i+1)%list.length;if(i===0)list=shuffle(d.words);show();};
 show();}

/* ---------- ФЛАГМАН: определи род по хвостику (все три) ---------- */
function initMix(box){
 const all=[]; ['der','die','das'].forEach(g=>DATA[g].words.forEach(w=>all.push([bare(w[0]),g,w[2]])));
 let list=shuffle(all),i=0,ok=0,done=0;
 const el=document.getElementById(box);
 el.innerHTML=`<div class="hvq" id="mq"></div><div class="hvopts">
   <button class="btn" onclick="HV._m('der')" style="color:#3b5bdb">der</button>
   <button class="btn" onclick="HV._m('die')" style="color:#c2185b">die</button>
   <button class="btn" onclick="HV._m('das')" style="color:#0e9488">das</button></div>
   <div class="hvfb" id="mfb"></div><div class="hvcnt" id="mc"></div>`;
 function show(){document.getElementById('mq').textContent=list[i][0];document.getElementById('mfb').innerHTML='';}
 HV_pick=function(ans){const w=list[i];const good=ans===w[1];done++;if(good)ok++;
   const art={der:'der',die:'die',das:'das'}[w[1]];
   document.getElementById('mfb').innerHTML=(good?'<span style="color:#16a34a">✓ Верно! </span>':'<span style="color:#dc2626">✗ </span>')
    +`<b>${art} ${w[0]}</b> <button class="say" onclick="playWord('${esc(w[0])}','${V[w[1]]}')">🔊</button> — хвостик <b>${w[2]}</b> → всегда <b style="color:${DATA[w[1]].color}">${art}</b>`;
   document.getElementById('mc').textContent=`верно ${ok} из ${done}`;
   i=(i+1)%list.length;if(i===0)list=shuffle(all);setTimeout(show,1500);};
 show();}
let HV_pick=null;

return {DATA, renderSong, renderWords, initTrans, initMix, _m:(a)=>HV_pick&&HV_pick(a)};
})();
