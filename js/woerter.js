/* ==========================================================================
   woerter.js — ЕДИНЫЙ источник слов + рендер словаря (DRY).
   Один словарь, два режима:
     • общий  (Dict.init({mount}))            — все темы вместе (накопительно)
     • по теме (Dict.init({mount, thema:"01"})) — только эта тема
   Род — сверен по Lernwortschatz (Momente A1, Arbeitsbuch). Pl. не выдумываем.
   Озвучка — speak() из app.js. Порядок форм глагола: ich·du·er/sie/es·wir·ihr·sie/Sie
   ========================================================================== */
const PRO = ["ich","du","er/sie/es","wir","ihr","sie/Sie"];

const WOERTER = { themes: [
  {
    id:"01", title:"Знакомство и семья", lessons:"L1–L3",
    nouns:{
      der:[
        ["Name","имя"],["Vorname","имя (личное)"],["Familienname","фамилия"],["Herr","господин"],
        ["Beruf","профессия"],["Job","работа (job)"],["Gärtner","садовник"],["Single","холостяк / одинокий"],["Partner","партнёр"],
        ["Wohnort","место жительства"],["Familienstand","семейное положение"],["Moment","момент"],
        ["Satz","предложение"],["Punkt","точка / пункт"],
        ["Ingenieur","инженер"],["Kfz-Mechatroniker","автомеханик"],["Student","студент"],["Journalist","журналист"],
        ["Friseur","парикмахер"],["Architekt","архитектор"],["Arzt","врач"],["Tierarzt","ветеринар"],
        ["Lehrer","учитель"],["Verkäufer","продавец"],["Kellner","официант"],["Paketzusteller","курьер"],
        ["Schüler","школьник"],["Rentner","пенсионер"],["Schauspieler","актёр"],["Sänger","певец"],
        ["Vater","отец"],["Papa","папа"],["Bruder","брат"],["Sohn","сын"],["Onkel","дядя"],
        ["Großvater","дедушка"],["Enkel","внук"],["Ehemann","муж"],["Verwandte","родственник"],["Mann","мужчина / муж"],
        ["Master","магистр","Fokus Beruf"],["IT-Trainer","IT-тренер","Fokus Beruf"]
      ],
      die:[
        ["Frau","женщина / госпожа"],["Musik","музыка"],["Information","информация"],
        ["Partnerin","партнёрша"],["Zahl","число"],["Firma","фирма"],["Stelle","место / должность"],
        ["Ausbildung","профобучение"],["Herkunft","происхождение"],
        ["Krankenschwester","медсестра"],["Ingenieurin","инженер (ж)"],["Studentin","студентка"],
        ["Journalistin","журналистка"],["Friseurin","парикмахер (ж)"],["Architektin","архитектор (ж)"],
        ["Ärztin","врач (ж)"],["Tierärztin","ветеринар (ж)"],["Lehrerin","учительница"],
        ["Verkäuferin","продавщица"],["Kellnerin","официантка"],["Paketzustellerin","курьер (ж)"],
        ["Schülerin","школьница"],["Rentnerin","пенсионерка"],["Schauspielerin","актриса"],["Sängerin","певица"],
        ["Familie","семья"],["Mutter","мать"],["Mama","мама"],["Schwester","сестра"],["Tochter","дочь"],
        ["Oma","бабушка"],["Großmutter","бабушка"],["Enkelin","внучка"],["Ehefrau","жена"],
        ["Verwandte","родственница"],["Tante","тётя"],["Liste","список"],["Sprache","язык"],
        ["Visitenkarte","визитка","Fokus Beruf"]
      ],
      das:[
        ["Alphabet","алфавит"],["Land","страна"],["Gespräch","разговор"],
        ["Jahr","год"],["Kind","ребёнок"],["Interview","интервью"],["Rätsel","загадка"],
        ["Praktikum","практика"],["Alter","возраст"],["Studium","учёба (в вузе)"],["Tier","животное"],
        ["Enkelkind","внук / внучка"],["Fest","праздник"],["Mitglied","член (участник)"]
      ]
    },
    pluralOnly:[["die Eltern","родители"],["die Geschwister","братья и сёстры"],["die Großeltern","бабушка и дедушка"]],
    verbs:[
      ["wohnen","жить (проживать)","reg",["wohne","wohnst","wohnt","wohnen","wohnt","wohnen"],"hat gewohnt"],
      ["leben","жить","reg",["lebe","lebst","lebt","leben","lebt","leben"],"hat gelebt"],
      ["lernen","учить(ся)","reg",["lerne","lernst","lernt","lernen","lernt","lernen"],"hat gelernt"],
      ["machen","делать","reg",["mache","machst","macht","machen","macht","machen"],"hat gemacht"],
      ["arbeiten","работать","reg",["arbeite","arbeitest","arbeitet","arbeiten","arbeitet","arbeiten"],"hat gearbeitet"],
      ["studieren","учиться (в вузе)","reg",["studiere","studierst","studiert","studieren","studiert","studieren"],"hat studiert"],
      ["sammeln","собирать / коллекционировать","reg",["sammle","sammelst","sammelt","sammeln","sammelt","sammeln"],"hat gesammelt"],
      ["glauben","верить / думать","reg",["glaube","glaubst","glaubt","glauben","glaubt","glauben"],"hat geglaubt"],
      ["planen","планировать","reg",["plane","planst","plant","planen","plant","planen"],"hat geplant"],
      ["zusammenleben","жить вместе","reg",["lebe … zusammen","lebst … zusammen","lebt … zusammen","leben … zusammen","lebt … zusammen","leben … zusammen"],"hat zusammengelebt"],
      ["sein","быть","irr",["bin","bist","ist","sind","seid","sind"],"ist gewesen (war)"],
      ["haben","иметь","irr",["habe","hast","hat","haben","habt","haben"],"hat gehabt (hatte)"],
      ["sprechen","говорить","irr",["spreche","sprichst","spricht","sprechen","sprecht","sprechen"],"hat gesprochen"],
      ["heißen","зваться","irr",["heiße","heißt","heißt","heißen","heißt","heißen"],"hat geheißen"],
      ["kommen","приходить / быть родом","irr",["komme","kommst","kommt","kommen","kommt","kommen"],"ist gekommen"],
      ["gehen","идти","irr",["gehe","gehst","geht","gehen","geht","gehen"],"ist gegangen"]
    ],
    other:{
      "Прилагательные / состояния":[["alt","старый"],["verheiratet","женат / замужем"],["geschieden","разведён(а)"],["allein","один / одна"],["richtig","правильный"],["falsch","неправильный"]],
      "Фразы":[["… Jahre alt","… лет (возраст)"],["von Beruf","по профессии"],["ein bisschen","немного"],["gar nicht","совсем не"],["Wie geht’s?","Как дела?"],["Es geht","Нормально"],["Nicht so gut","Не очень"],["vielen Dank","большое спасибо"],["Guten Tag","добрый день"],["Guten Morgen","доброе утро"],["Guten Abend","добрый вечер"],["Gute Nacht","спокойной ночи"],["Auf Wiedersehen","до свидания"]],
      "Наречия / служебные":[["jetzt","сейчас"],["zusammen","вместе"],["hier","здесь"],["auch","тоже"],["aus","из"],["bei","у / при"],["als","как (в роли)"],["in","в"],["wo","где"],["woher","откуда"],["wer","кто"],["wie","как"],["welche","какой / которые"],["aber","но"],["und","и"]],
      "Да / нет / отрицание":[["ja","да"],["nein","нет"],["doch","нет, наоборот / всё же"],["kein / keine","не / никакой"],["mein","мой"],["dein","твой"]]
    },
    countries:[["Deutschland","Германия"],["die Schweiz","Швейцария"],["die Türkei","Турция"],["die USA","США"],["Eritrea","Эритрея"],["Spanien","Испания"],["Frankreich","Франция"],["Österreich","Австрия"],["Polen","Польша"]],
    langs:[["Deutsch","немецкий"],["Englisch","английский"],["Spanisch","испанский"],["Russisch","русский"],["Chinesisch","китайский"],["Polnisch","польский"],["Französisch","французский"],["Italienisch","итальянский"],["Türkisch","турецкий"]]
  },
  {
    id:"02", title:"Быт (дом и вещи)", lessons:"L4–L5",
    nouns:{
      der:[
        ["Stuhl","стул"],["Sessel","кресло"],["Tisch","стол"],["Schrank","шкаф"],["Teppich","ковёр"],
        ["Spiegel","зеркало"],["Schlüssel","ключ(и)"],["Geldbeutel","кошелёк"],["Regenschirm","зонт"],
        ["Kugelschreiber","шариковая ручка"],["Bleistift","карандаш"],["Kunststoff","пластик (материал)"],
        ["Preis","цена"],["Euro","евро"],["Cent","цент"]
      ],
      die:[
        ["Tasche","сумка"],["Brille","очки"],["Sonnenbrille","солнечные очки"],["Uhr","часы"],["Lampe","лампа"],
        ["Möbel","мебель"],["Kette","бусы / цепочка"],["Flasche","бутылка"],["Kamera","камера"],
        ["Bürste","щётка"],["Seife","мыло"],["Sonne","солнце"],["Farbe","цвет"]
      ],
      das:[
        ["Zimmer","комната"],["Bett","кровать"],["Sofa","диван"],["Regal","полка"],["Auto","машинка"],
        ["Buch","книга"],["Bild","рисунок / картинка"],["Haus","дом"],["Handy","мобильник"],["Telefon","телефон"],
        ["Material","материал"],["Geschäft","магазин"],["Sonderangebot","акция / скидка"],["Glück","счастье / удача"],
        ["Problem","проблема"],["Ding","вещь"],["Wort","слово"],["Feuerzeug","зажигалка"],["Taschentuch","платочек"],
        ["Holz","дерево"],["Metall","металл"],["Plastik","пластик"],["Glas","стекло"],["Papier","бумага"]
      ]
    },
    pluralOnly:[],
    verbs:[
      ["kosten","стоить","reg",["koste","kostest","kostet","kosten","kostet","kosten"],"hat gekostet"],
      ["kaufen","покупать","reg",["kaufe","kaufst","kauft","kaufen","kauft","kaufen"],"hat gekauft"],
      ["bestellen","заказывать","reg",["bestelle","bestellst","bestellt","bestellen","bestellt","bestellen"],"hat bestellt"],
      ["finden","находить / считать","irr",["finde","findest","findet","finden","findet","finden"],"hat gefunden"],
      ["sehen","видеть","irr",["sehe","siehst","sieht","sehen","seht","sehen"],"hat gesehen"],
      ["haben","иметь","irr",["habe","hast","hat","haben","habt","haben"],"hat gehabt (hatte)"],
      ["sein","быть","irr",["bin","bist","ist","sind","seid","sind"],"ist gewesen (war)"]
    ],
    other:{
      "Цвета":[["weiß","белый"],["gelb","жёлтый"],["orange","оранжевый"],["rot","красный"],["grün","зелёный"],["blau","синий"],["braun","коричневый"],["schwarz","чёрный"],["grau","серый"],["hell-","светло-"],["dunkel-","тёмно-"]],
      "Оценка / свойства":[["schön","красивый"],["hässlich","некрасивый"],["teuer","дорогой"],["günstig","выгодный"],["billig","дешёвый"],["praktisch","практичный"],["modern","современный"],["groß","большой"],["klein","маленький"],["alt","старый"],["neu","новый"],["zu teuer","слишком дорого"]],
      "Материал / фразы":[["aus Holz","из дерева"],["aus Plastik","из пластика"],["aus Metall","из металла"],["aus Glas","из стекла"],["aus Papier","из бумаги"],["Wie viel kostet …?","сколько стоит …?"],["ein Sonderangebot","по скидке / акция"]],
      "Слова-помощники":[["ein / eine","один / одна (неопр. артикль)"],["kein / keine","не / никакой"],["mein","мой"],["dein","твой"],["sehr","очень"],["nur","только"],["hier","здесь"],["und","и"],["aber","но"],["oder","или"]]
    }
  }
,{
    id:"03", title:"Свободное время", lessons:"L6–L7",
    nouns:{
      der:[
        ["Sport","спорт"],["Fußball","футбол"],["Film","фильм"],["Computer","компьютер"],["Park","парк"],
        ["Spaziergang","прогулка"],["Verein","клуб / секция"],["Tanz","танец"],["Ausflug","вылазка / экскурсия"],["Tag","день"]
      ],
      die:[
        ["Musik","музыка"],["Freizeit","свободное время"],["Party","вечеринка"],["Reise","поездка"],["Gitarre","гитара"],
        ["Karte","билет / карта"],["Pause","перерыв"],["Woche","неделя"],["Zeit","время"],["Bibliothek","библиотека"]
      ],
      das:[
        ["Hobby","хобби"],["Kino","кино"],["Konzert","концерт"],["Spiel","игра"],["Fahrrad","велосипед"],
        ["Schwimmbad","бассейн"],["Café","кафе"],["Instrument","инструмент"],["Wochenende","выходные"],["Theater","театр"]
      ]
    },
    pluralOnly:[],
    verbs:[
      ["spielen","играть","reg",["spiele","spielst","spielt","spielen","spielt","spielen"],"hat gespielt"],
      ["hören","слушать","reg",["höre","hörst","hört","hören","hört","hören"],"hat gehört"],
      ["tanzen","танцевать","reg",["tanze","tanzt","tanzt","tanzen","tanzt","tanzen"],"hat getanzt"],
      ["kochen","готовить","reg",["koche","kochst","kocht","kochen","kocht","kochen"],"hat gekocht"],
      ["malen","рисовать","reg",["male","malst","malt","malen","malt","malen"],"hat gemalt"],
      ["fotografieren","фотографировать","reg",["fotografiere","fotografierst","fotografiert","fotografieren","fotografiert","fotografieren"],"hat fotografiert"],
      ["lesen","читать","irr",["lese","liest","liest","lesen","lest","lesen"],"hat gelesen"],
      ["schwimmen","плавать","irr",["schwimme","schwimmst","schwimmt","schwimmen","schwimmt","schwimmen"],"ist geschwommen"],
      ["fahren","ехать / кататься","irr",["fahre","fährst","fährt","fahren","fahrt","fahren"],"ist gefahren"],
      ["singen","петь","irr",["singe","singst","singt","singen","singt","singen"],"hat gesungen"],
      ["treffen","встречать","irr",["treffe","triffst","trifft","treffen","trefft","treffen"],"hat getroffen"],
      ["können","мочь / уметь","irr",["kann","kannst","kann","können","könnt","können"],"hat gekonnt"]
    ],
    other:{
      "Как часто / как":[["gern","охотно (нравится)"],["nicht gern","не нравится"],["oft","часто"],["manchmal","иногда"],["immer","всегда"],["nie","никогда"],["jeden Tag","каждый день"],["zusammen","вместе"],["mit","с (кем-то)"]],
      "Дни недели":[["Montag","понедельник"],["Dienstag","вторник"],["Mittwoch","среда"],["Donnerstag","четверг"],["Freitag","пятница"],["Samstag","суббота"],["Sonntag","воскресенье"],["am Wochenende","на выходных"]],
      "Слова-помощники":[["am","в (день)"],["dann","потом"],["auch","тоже"],["heute","сегодня"],["und","и"],["aber","но"],["oder","или"],["sehr","очень"]]
    }
  }
    /* следующие темы добавляются сюда — словарь станет накопительным автоматически */
]};

/* ===================== Рендер (общий для обоих режимов) ===================== */
const Dict = (function(){
  const esc = s => String(s).replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
  const say = (text, role) => `<button class="say" title="Озвучить" onclick="event.stopPropagation();playWord('${String(text).replace(/'/g,"\\'")}','${role||''}')">🔊</button>`;
  const ROLE = {der:'male', die:'female', das:'child'};
  const tag = t => t ? ` data-theme="${t}"` : "";

  function nounEntry(art,row,tid){
    const [de,ru]=row;
    return `<div class="entry ${art}"${tag(tid)} data-de="${esc(de.toLowerCase())}" data-ru="${esc(ru.toLowerCase())}">
      <span class="art">${art}</span><span class="de">${esc(de)}</span><span class="ru">${esc(ru)}</span>${say(art+' '+de, ROLE[art])}</div>`;
  }
  function genderBlock(art,who,arr){
    if(!arr.length) return "";
    return `<div class="gwrap"><div class="gtitle"><span class="pill ${art}">${art}</span><span class="who">${who} · ${arr.length} слов</span></div>
      <div class="list">${arr.map(r=>nounEntry(art,r,r._t)).join("")}</div></div>`;
  }
  function pair(row){
    const [de,ru]=row;
    return `<div class="pair g-other"${tag(row._t)} data-de="${esc(de.toLowerCase())}" data-ru="${esc(ru.toLowerCase())}">
      <span class="de">${esc(de)}</span><span class="ru">${esc(ru)}</span>${say(de,'')}</div>`;
  }
  function verbEntry(v){
    const [inf,ru,type,forms,pp]=v;
    const rows = forms.map((f,i)=>`<div class="row" onclick="speak('${(PRO[i].split('/')[0]+' '+f.replace(/ … /,' ')).replace(/'/g,"\\'")}')"><span class="pro">${PRO[i]}</span><span class="frm">${esc(f)}</span></div>`).join("");
    const badge = type==="reg"?`<span class="em" title="правильный">✅</span>`:`<span class="em" title="неправильный">⚠️</span>`;
    const past = pp?`<div class="pastline"><span class="past" title="Прошедшее (Perfekt)" onclick="event.stopPropagation();speak('${('er '+pp.replace(/\\s*\\(.*\\)/,'')).replace(/'/g,"\\'")}')">⏪ Прошедшее (Perfekt): ${esc(pp)}</span></div>`:"";
    return `<div class="ventry g-verb"${tag(v._t)} data-de="${esc(inf.toLowerCase())}" data-ru="${esc(ru.toLowerCase())}">
      <div class="vhead" onclick="this.parentElement.classList.toggle('open')">
        ${badge}<span class="de">${esc(inf)}</span><span class="ru">${esc(ru)}</span>${say(inf,'male')}<span class="caret">▶</span></div>
      <div class="conj"><div class="grid">${rows}</div>${past}<div class="tip">Настоящее время · клик по форме — озвучка.</div></div></div>`;
  }

  // склеить одну категорию по всем темам, пометив каждую запись её темой (._t)
  function mergeNouns(themes,g){ return themes.flatMap(t=>t.nouns[g].map(r=>{const c=r.slice();c._t=t.id;return c;})); }
  function mergeList(themes,key){ return themes.flatMap(t=>(t[key]||[]).map(r=>{const c=r.slice();c._t=t.id;return c;})); }
  function mergeVerbs(themes){ return themes.flatMap(t=>t.verbs.map(r=>{const c=r.slice();c._t=t.id;return c;})); }
  function mergeOther(themes){
    const out={};
    themes.forEach(t=>{ for(const [k,arr] of Object.entries(t.other)){ (out[k]=out[k]||[]).push(...arr.map(r=>{const c=r.slice();c._t=t.id;return c;})); } });
    return out;
  }

  function build(themes){
    const der=mergeNouns(themes,"der"), die=mergeNouns(themes,"die"), das=mergeNouns(themes,"das");
    const plural=mergeList(themes,"pluralOnly"), verbs=mergeVerbs(themes), other=mergeOther(themes);
    const countries=mergeList(themes,"countries"), langs=mergeList(themes,"langs");

    let h="";
    h+=`<div class="sec">Существительные <span class="cnt">по роду — 3 персонажа</span></div>`;
    h+=genderBlock("der","👨 Otto",der);
    h+=genderBlock("die","👩 Грета",die);
    h+=genderBlock("das","🧒 Тео",das);
    if(plural.length) h+=`<div class="gwrap"><div class="gtitle"><span class="who">Только множественное число</span></div><div class="pairs">${plural.map(pair).join("")}</div></div>`;

    h+=`<div class="sec">Глаголы <span class="cnt">оранжевым — прошедшее (Perfekt) · клик — спряжение</span></div>`;
    h+=`<div class="list" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr))">${verbs.map(verbEntry).join("")}</div>`;

    h+=`<div class="sec">Другое <span class="cnt">фразы, прилагательные, наречия</span></div>`;
    for(const [title,arr] of Object.entries(other)) h+=`<div class="gwrap"><div class="gtitle"><span class="who">${esc(title)}</span></div><div class="pairs">${arr.map(pair).join("")}</div></div>`;
    if(countries.length) h+=`<div class="gwrap"><div class="gtitle"><span class="who">Страны</span></div><div class="pairs">${countries.map(pair).join("")}</div></div>`;
    if(langs.length) h+=`<div class="gwrap"><div class="gtitle"><span class="who">Языки</span></div><div class="pairs">${langs.map(pair).join("")}</div></div>`;
    return h;
  }

  function wire(root,themes){
    const q=root.querySelector('.search'), empty=root.querySelector('.d-empty'), dict=root.querySelector('.d-list');
    let fGender="all", fTheme="all";

    function apply(){
      const term=q.value.trim().toLowerCase();
      const cards=dict.querySelectorAll('.entry,.ventry,.pair');
      let vis=0;
      cards.forEach(c=>{
        const inG = fGender==="all"
          || (fGender==="der"&&c.classList.contains('der'))
          || (fGender==="die"&&c.classList.contains('die'))
          || (fGender==="das"&&c.classList.contains('das'))
          || (fGender==="verb"&&c.classList.contains('g-verb'))
          || (fGender==="other"&&c.classList.contains('g-other'));
        const inT = fTheme==="all" || c.dataset.theme===fTheme;
        const inTerm = !term || c.dataset.de.includes(term) || c.dataset.ru.includes(term);
        const show = inG && inT && inTerm;
        c.style.display = show?"":"none"; if(show) vis++;
      });
      dict.querySelectorAll('.gwrap').forEach(g=>{ g.style.display=[...g.querySelectorAll('.entry,.ventry,.pair')].some(c=>c.style.display!=="none")?"":"none"; });
      dict.querySelectorAll('.sec').forEach(s=>{
        let n=s.nextElementSibling, any=false;
        while(n && !n.classList.contains('sec')){ if(n.querySelectorAll){ any=[...n.querySelectorAll('.entry,.ventry,.pair')].some(c=>c.style.display!=="none")||any; } n=n.nextElementSibling; }
        s.style.display=any?"":"none";
      });
      empty.style.display=vis?"none":"block";
    }
    q.addEventListener('input',apply);
    root.querySelectorAll('.chip[data-f]').forEach(ch=>ch.addEventListener('click',()=>{
      fGender=ch.dataset.f; root.querySelectorAll('.chip[data-f]').forEach(c=>c.setAttribute('aria-pressed',c===ch?"true":"false")); apply(); paintPdf();
    }));
    root.querySelectorAll('.chip[data-t]').forEach(ch=>ch.addEventListener('click',()=>{
      fTheme=ch.dataset.t; root.querySelectorAll('.chip[data-t]').forEach(c=>c.setAttribute('aria-pressed',c===ch?"true":"false")); apply();
    }));
    const eye=root.querySelector('.eye');
    eye.addEventListener('click',()=>{ const on=document.body.classList.toggle('hide-ru'); eye.textContent=on?"👁 Показать переводы":"🙈 Скрыть переводы"; });

    // ----- Скачать PDF (печать выбранного набора) -----
    const pdfBtn=root.querySelector('.btn-pdf');
    if(pdfBtn) pdfBtn.addEventListener('click',exportPDF);
    function paintPdf(){ const b=root.querySelector('.btn-pdf'); if(!b) return;
      const map={all:["#374151","#fff"],der:["#2563EB","#fff"],die:["#DC2626","#fff"],das:["#16A34A","#fff"],verb:["#eab308","#1f2937"],other:["#6D28D9","#fff"]};
      const c=map[fGender]||map.all; b.style.background=c[0]; b.style.color=c[1]; }
    paintPdf();
    function grab(sel,isVerb){
      const out=[];
      root.querySelectorAll(sel).forEach(c=>{ if(c.style.display==="none") return;
        if(isVerb){ out.push({art:"",de:c.querySelector('.vhead .de').textContent,ru:c.querySelector('.vhead .ru').textContent,pp:(c.querySelector('.past')?.textContent||"").replace(/.*:\s*/,"")}); }
        else { out.push({art:(c.querySelector('.art')?.textContent||"").trim(),de:c.querySelector('.de').textContent,ru:c.querySelector('.ru').textContent,pp:""}); }
      });
      return out;
    }
    function exportPDF(){
      if(!window.html2pdf){ alert("PDF-модуль не загрузился (нужен интернет при первом разе). Обнови страницу и попробуй ещё раз."); return; }
      const der=grab('.entry.der'),die=grab('.entry.die'),das=grab('.entry.das'),verbs=grab('.ventry',true),other=grab('.pair');
      const themeTitle = themes.length===1 ? themes[0].title : "все темы";
      const activeG=root.querySelector('.chip[data-f][aria-pressed="true"]');
      const gLabel=activeG?activeG.textContent.trim():"Все";
      const total=der.length+die.length+das.length+verbs.length+other.length;
      const col=(t,c,rows)=> rows.length? `<div class="col"><div class="ch" style="color:${c};border-color:${c}55">${t} · ${rows.length}</div>${rows.map(r=>`<div class="r"><b style="color:${c}">${esc(r.art)}</b><span>${esc(r.de)}</span><i>${esc(r.ru)}</i></div>`).join("")}</div>`:"";
      const nouns=[col("der","#2563EB",der),col("die","#DC2626",die),col("das","#16A34A",das)].filter(Boolean).join("");
      const list2=(t,c,rows,withPp)=> rows.length? `<div class="ch" style="color:${c};border-color:${c}55">${t} · ${rows.length}</div><div class="g2">${rows.map(r=>`<div class="r"><span>${esc(r.de)}</span><i>${esc(r.ru)}${withPp&&r.pp?' · '+esc(r.pp):''}</i></div>`).join("")}</div>`:"";
      const el=document.createElement('div');
      el.innerHTML=`<style>
        .pdfdoc{font-family:"Inter",Arial,sans-serif;color:#1f2937;width:760px;padding:4px 6px;box-sizing:border-box}
        .pdfdoc h1{font-size:17px;margin:0} .pdfdoc .sub{color:#6b7280;font-size:11px;margin:1px 0 8px}
        .pdfdoc .cols{display:flex;gap:14px;align-items:flex-start} .pdfdoc .col{flex:1;min-width:0}
        .pdfdoc .ch{font-weight:800;font-size:12px;margin:9px 0 3px;border-bottom:1.5px solid #e5e7eb;padding-bottom:2px}
        .pdfdoc .r{font-size:11px;padding:1px 0;display:flex;gap:4px;align-items:baseline;break-inside:avoid}
        .pdfdoc .r b{min-width:22px;font-weight:700} .pdfdoc .r span{font-weight:600} .pdfdoc .r i{color:#6b7280;font-style:normal;margin-left:auto;text-align:right;padding-left:6px}
        .pdfdoc .g2{display:grid;grid-template-columns:1fr 1fr;gap:0 18px}
      </style><div class="pdfdoc">
        <h1>Словарь A1 — ${esc(themeTitle)}</h1>
        <div class="sub">Раздел: ${esc(gLabel)} · ${total} слов · для самостоятельной учёбы</div>
        ${nouns?`<div class="cols">${nouns}</div>`:""}
        ${list2("Глаголы","#a16207",verbs,true)}
        ${list2("Другое","#6D28D9",other,false)}
      </div>`;
      el.style.cssText="position:fixed;left:-10000px;top:0";
      document.body.appendChild(el);
      const opt={margin:[8,8,10,8],filename:`slovar-${themeTitle}-${gLabel}.pdf`,image:{type:'jpeg',quality:0.97},
        html2canvas:{scale:2,useCORS:true},jsPDF:{unit:'mm',format:'a4',orientation:'portrait'},pagebreak:{mode:['css','legacy']}};
      html2pdf().set(opt).from(el.firstElementChild.nextElementSibling||el).save().then(()=>el.remove()).catch(()=>el.remove());
    }
  }

  // opts: { mount, thema? }  — без thema = общий (все темы)
  function init(opts){
    const mount=opts.mount;
    const themes = opts.thema ? WOERTER.themes.filter(t=>t.id===opts.thema) : WOERTER.themes;
    if(!themes.length){ mount.innerHTML="<p class='lead'>Тема не найдена.</p>"; return; }
    const multi = !opts.thema && WOERTER.themes.length>1;
    const themeChips = multi
      ? `<button class="chip f-all" data-t="all" aria-pressed="true">Все темы</button>`
        + WOERTER.themes.map(t=>`<button class="chip f-theme" data-t="${t.id}" aria-pressed="false">${esc(t.title)}</button>`).join("")
      : "";
    mount.innerHTML = `
      <div class="tools">
        <input class="search" type="search" placeholder="Поиск по немецкому или переводу…" autocomplete="off">
        <div class="filters">
          <button class="chip f-all" data-f="all" aria-pressed="true">Все</button>
          <button class="chip f-der" data-f="der" aria-pressed="false">der</button>
          <button class="chip f-die" data-f="die" aria-pressed="false">die</button>
          <button class="chip f-das" data-f="das" aria-pressed="false">das</button>
          <button class="chip f-verb" data-f="verb" aria-pressed="false">глаголы</button>
          <button class="chip f-other" data-f="other" aria-pressed="false">другое</button>
          <span class="spacer"></span>
          <button class="btn-pdf">📄 Скачать PDF</button>
          <button class="eye">🙈 Скрыть переводы</button>
        </div>
        ${ multi ? `<div class="filters tfilters">${themeChips}</div>` : "" }
      </div>
      <div class="d-list">${build(themes)}</div>
      <div class="d-empty" style="display:none">Ничего не найдено.</div>`;
    wire(mount,themes);
  }

  return { init, data:WOERTER };
})();
