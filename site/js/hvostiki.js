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
  tails:[['-haus','das Haus','дом (здание)'],['-zimmer','das Zimmer','комната'],['-buch','das Buch','книга'],['-rad','das Rad','колесо / велосипед'],['-amt','das Amt','ведомство'],['-geld','das Geld','деньги'],['-land','das Land','страна'],['-bad','das Bad','ванна / купание'],['-zeug','das Zeug','принадлежности'],['Ge-','das Ge-','приставка Ge- → часто das']],
  words:[
   ['das Wohnhaus','жилой дом','-haus'],['das Rathaus','ратуша','-haus'],['das Krankenhaus','больница','-haus'],['das Kaufhaus','универмаг','-haus'],
   ['das Schlafzimmer','спальня','-zimmer'],['das Kinderzimmer','детская','-zimmer'],['das Badezimmer','ванная','-zimmer'],['das Wohnzimmer','гостиная','-zimmer'],['das Wartezimmer','приёмная','-zimmer'],
   ['das Wörterbuch','словарь','-buch'],['das Notizbuch','блокнот','-buch'],['das Kochbuch','книга рецептов','-buch'],['das Lehrbuch','учебник','-buch'],
   ['das Fahrrad','велосипед','-rad'],['das Rad','колесо / велик','-rad'],
   ['das Finanzamt','налоговая','-amt'],['das Arbeitsamt','биржа труда','-amt'],['das Amt','ведомство','-amt'],
   ['das Taschengeld','карманные деньги','-geld'],['das Kleingeld','мелочь','-geld'],['das Bargeld','наличные','-geld'],
   ['das Heimatland','родина','-land'],['das Nachbarland','соседняя страна','-land'],['das Ausland','заграница','-land'],
   ['das Schwimmbad','бассейн','-bad'],['das Sonnenbad','солнечная ванна','-bad'],
   ['das Spielzeug','игрушка','-zeug'],['das Werkzeug','инструмент','-zeug'],['das Flugzeug','самолёт','-zeug'],
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

/* ---------- упражнение: перевод RU→DE ---------- */
function initTrans(g,box){const d=DATA[g];let list=shuffle(d.words),i=0;
 const el=document.getElementById(box);
 el.innerHTML=`<div class="hvq" id="tq"></div><div style="text-align:center"><button class="btn sm" id="trev">Показать 🔊</button></div><div class="hvrev" id="trv" hidden></div><div style="text-align:center;margin-top:8px"><button class="btn sm" id="tnx">Дальше →</button></div><div class="hvcnt" id="tc"></div>`;
 function show(){document.getElementById('tq').textContent=list[i][1];document.getElementById('trv').hidden=true;document.getElementById('tc').textContent=`${i+1} / ${list.length}`;}
 document.getElementById('trev').onclick=()=>{const w=list[i];const r=document.getElementById('trv');r.hidden=false;r.innerHTML=`<b>${w[0]}</b> <button class="say" onclick="playWord('${esc(bare(w[0]))}','${V[g]}')">🔊</button> <span style="color:#6b7280;font-size:13px">${w[2]} → ${d.art}</span>`;playWord(bare(w[0]),V[g]);};
 document.getElementById('tnx').onclick=()=>{i=(i+1)%list.length;if(i===0)list=shuffle(d.words);show();};
 show();}

/* ---------- ФЛАГМАН: определи род по хвостику (группами, с итогом) ---------- */
function initMix(box,size){
 size=size||30;
 const all=[]; ['der','die','das'].forEach(g=>DATA[g].words.forEach(w=>all.push([bare(w[0]),g,w[2]])));
 const pool=shuffle(all);const groups=[];for(let k=0;k<pool.length;k+=size)groups.push(pool.slice(k,k+size));
 const el=document.getElementById(box);let gi=0;
 function runGroup(){let i=0,ok=0,mist=[];const grp=groups[gi];
   function show(){const w=grp[i];
     el.innerHTML=`<div class="hvcnt">Группа ${gi+1} из ${groups.length} · слово ${i+1} из ${grp.length} · верно ${ok}</div>`
      +`<div class="hvq">${w[0]}</div>`
      +`<div class="hvopts"><button class="btn" data-a="der" style="color:#3b5bdb">der</button>`
      +`<button class="btn" data-a="die" style="color:#c2185b">die</button>`
      +`<button class="btn" data-a="das" style="color:#0e9488">das</button></div><div class="hvfb" id="mfb"></div>`;
     el.querySelectorAll('.hvopts .btn').forEach(b=>b.onclick=()=>pick(b.dataset.a));}
   function pick(ans){const w=grp[i];const art=w[1];const good=ans===art;
     el.querySelectorAll('.hvopts .btn').forEach(b=>b.disabled=true);
     if(good)ok++;else mist.push([w[0],art,ans,w[2]]);
     document.getElementById('mfb').innerHTML=(good?'<span style="color:#16a34a">✓ Верно! </span>':'<span style="color:#dc2626">✗ </span>')
      +`<b style="color:${DATA[art].color}">${art} ${w[0]}</b> — хвостик <b>${w[2]}</b> <button class="say" onclick="playWord('${esc(w[0])}','${V[art]}')">🔊</button>`;
     playWord(w[0],V[art]);i++;
     setTimeout(()=>{i<grp.length?show():results(ok,mist,grp.length);},1200);}
   show();}
 function results(ok,mist,total){
   let html=`<div class="hvq">Итог группы ${gi+1}</div>`
    +`<div style="text-align:center;font-size:22px;margin:8px 0"><b style="color:${ok===total?'#16a34a':'#6d28d9'}">Правильно ${ok} из ${total}</b></div>`;
   if(mist.length){html+=`<div style="margin:12px 0 6px;font-weight:700;color:#dc2626">Ошибки (${mist.length}) — запомни род:</div><div style="display:flex;flex-direction:column;gap:6px">`;
     mist.forEach(m=>{html+=`<div style="background:#fdecec;border:1px solid #f3c0c0;border-radius:10px;padding:8px 11px;font-size:15px"><b style="color:${DATA[m[1]].color}">${m[1]} ${m[0]}</b> <span style="color:#6b7280">(хвостик ${m[3]})</span> — ты выбрал(а) <b>${m[2]}</b> <button class="say" onclick="playWord('${esc(m[0])}','${V[m[1]]}')">🔊</button></div>`;});
     html+='</div>';}
   else html+='<div style="text-align:center;color:#16a34a;margin:8px 0;font-size:17px">Без ошибок! 🎉</div>';
   html+='<div class="hvopts" style="margin-top:16px"><button class="btn" id="mAgain">🔁 Повторить группу</button>';
   if(gi+1<groups.length)html+='<button class="btn" id="mNext" style="background:#6d28d9;color:#fff">Следующая группа →</button>';
   html+='<button class="btn" id="mRestart">↩︎ Сначала</button></div>';
   el.innerHTML=html;
   document.getElementById('mAgain').onclick=runGroup;
   const nx=document.getElementById('mNext');if(nx)nx.onclick=()=>{gi++;runGroup();};
   document.getElementById('mRestart').onclick=()=>{gi=0;runGroup();};}
 runGroup();}

/* ---------- Соотнеси: слово ↔ перевод ---------- */
function initMatch(g,box){const d=DATA[g];const el=document.getElementById(box);
 function round(){const L=shuffle(d.words).slice(0,6).map((w,i)=>({de:w[0],ru:w[1],k:i}));const R=shuffle(L.slice());let sel=null,left=6;
  el.innerHTML='<div class="mgrid"><div id="mL"></div><div id="mR"></div></div><div style="text-align:center;margin-top:10px"><button class="btn sm" id="mNew">🔀 Ещё раз</button></div>';
  document.getElementById('mL').innerHTML=L.map(x=>`<div class="mit" data-k="${x.k}" data-s="L">${x.de}</div>`).join('');
  document.getElementById('mR').innerHTML=R.map(x=>`<div class="mit" data-k="${x.k}" data-s="R">${x.ru}</div>`).join('');
  el.querySelectorAll('.mit').forEach(m=>m.onclick=()=>{if(m.classList.contains('ok'))return;
    if(!sel){sel=m;m.classList.add('sel');return;}
    if(sel===m){m.classList.remove('sel');sel=null;return;}
    if(sel.dataset.s===m.dataset.s){sel.classList.remove('sel');sel=m;m.classList.add('sel');return;}
    if(sel.dataset.k===m.dataset.k){sel.classList.add('ok');m.classList.add('ok');sel.classList.remove('sel');playWord(bare(L.find(x=>x.k==m.dataset.k).de),V[g]);sel=null;if(--left===0)setTimeout(round,900);}
    else{const a=sel;m.classList.add('bad');a.classList.add('bad');sel=null;setTimeout(()=>{m.classList.remove('bad');a.classList.remove('bad','sel');},600);}});
  document.getElementById('mNew').onclick=round;}
 round();}

/* ---------- Выбери перевод (RU → DE) ---------- */
let HV_c=null;
function initChoice(g,box){const d=DATA[g];let list=shuffle(d.words),i=0,ok=0,done=0;const el=document.getElementById(box);
 el.innerHTML='<div class="hvq" id="cq"></div><div class="cots" id="cots"></div><div class="hvfb" id="cfb"></div><div class="hvcnt" id="cc"></div>';
 function show(){const w=list[i];document.getElementById('cq').textContent=w[1];document.getElementById('cfb').innerHTML='';
   const opts=shuffle([w[0],...shuffle(d.words.filter(x=>x[0]!==w[0])).slice(0,2).map(x=>x[0])]);
   document.getElementById('cots').innerHTML=opts.map(o=>`<button class="btn" onclick="HV._c('${esc(o)}')">${o}</button>`).join('');}
 HV_c=function(ans){const w=list[i];const good=ans===w[0];done++;if(good)ok++;
   document.getElementById('cfb').innerHTML=(good?'<span style="color:#16a34a">✓ Верно! </span>':'<span style="color:#dc2626">✗ '+w[0]+' </span>')+`<button class="say" onclick="playWord('${esc(bare(w[0]))}','${V[g]}')">🔊</button>`;
   playWord(bare(w[0]),V[g]);document.getElementById('cc').textContent=`верно ${ok} из ${done}`;
   i=(i+1)%list.length;if(i===0)list=shuffle(d.words);setTimeout(show,1200);};
 show();}

/* ---------- Собери слово (компонент + хвостик) ---------- */
let HV_s=null;
function stem(w){return bare(w[0]).replace(new RegExp(w[2].replace(/[-]/g,'')+'$','i'),'');}
function initSammel(g,box){const d=DATA[g];const pool=d.words.filter(w=>w[2]!=='Ge-'&&stem(w));let list=shuffle(pool),i=0;const el=document.getElementById(box);
 el.innerHTML='<div class="qru" id="sq"></div><div class="hvq" id="sbase"></div><div class="cots" id="sopts"></div><div class="hvfb" id="sfb"></div><div style="text-align:center;margin-top:6px"><button class="btn sm" id="snx">Дальше →</button></div><div class="hvcnt" id="sc"></div>';
 function show(){const w=list[i];const base=w[2].replace(/[-]/g,'');
   document.getElementById('sq').textContent=w[1];
   document.getElementById('sbase').innerHTML=`___ + <b>-${base}</b> = ?`;
   const opts=shuffle([stem(w),...shuffle(pool.filter(x=>x[2]===w[2]&&x[0]!==w[0])).slice(0,2).map(stem)]);
   document.getElementById('sopts').innerHTML=opts.map(o=>`<button class="btn" onclick="HV._s('${esc(o)}')">${o}</button>`).join('');
   document.getElementById('sfb').innerHTML='';document.getElementById('sc').textContent=`${i+1} / ${list.length}`;}
 HV_s=function(ans){const w=list[i];const good=ans.toLowerCase()===stem(w).toLowerCase();
   document.getElementById('sfb').innerHTML=(good?'<span style="color:#16a34a">✓ </span>':'<span style="color:#dc2626">✗ </span>')+`<b>${w[0]}</b> <button class="say" onclick="playWord('${esc(bare(w[0]))}','${V[g]}')">🔊</button> <span style="color:#6b7280;font-size:13px">${w[2]} → ${d.art}</span>`;
   playWord(bare(w[0]),V[g]);};
 document.getElementById('snx').onclick=()=>{i=(i+1)%list.length;if(i===0)list=shuffle(pool);show();};
 show();}

return {DATA, renderSong, renderWords, initTrans, initMix, initMatch, initChoice, initSammel,
  _c:(a)=>HV_c&&HV_c(a), _s:(a)=>HV_s&&HV_s(a)};
})();
