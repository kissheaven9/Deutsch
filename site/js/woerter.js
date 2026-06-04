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
        ["Beruf","профессия"],["Job","работа (job)"],["Single","холостяк / одинокий"],["Partner","партнёр"],
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
      ["wohnen","жить (проживать)","reg",["wohne","wohnst","wohnt","wohnen","wohnt","wohnen"]],
      ["leben","жить","reg",["lebe","lebst","lebt","leben","lebt","leben"]],
      ["lernen","учить(ся)","reg",["lerne","lernst","lernt","lernen","lernt","lernen"]],
      ["machen","делать","reg",["mache","machst","macht","machen","macht","machen"]],
      ["arbeiten","работать","reg",["arbeite","arbeitest","arbeitet","arbeiten","arbeitet","arbeiten"]],
      ["studieren","учиться (в вузе)","reg",["studiere","studierst","studiert","studieren","studiert","studieren"]],
      ["sammeln","собирать / коллекционировать","reg",["sammle","sammelst","sammelt","sammeln","sammelt","sammeln"]],
      ["glauben","верить / думать","reg",["glaube","glaubst","glaubt","glauben","glaubt","glauben"]],
      ["planen","планировать","reg",["plane","planst","plant","planen","plant","planen"]],
      ["zusammenleben","жить вместе","reg",["lebe … zusammen","lebst … zusammen","lebt … zusammen","leben … zusammen","lebt … zusammen","leben … zusammen"]],
      ["sein","быть","irr",["bin","bist","ist","sind","seid","sind"]],
      ["haben","иметь","irr",["habe","hast","hat","haben","habt","haben"]],
      ["sprechen","говорить","irr",["spreche","sprichst","spricht","sprechen","sprecht","sprechen"]],
      ["heißen","зваться","irr",["heiße","heißt","heißt","heißen","heißt","heißen"]],
      ["kommen","приходить / быть родом","irr",["komme","kommst","kommt","kommen","kommt","kommen"]],
      ["gehen","идти","irr",["gehe","gehst","geht","gehen","geht","gehen"]]
    ],
    other:{
      "Прилагательные / состояния":[["alt","старый"],["verheiratet","женат / замужем"],["geschieden","разведён(а)"],["allein","один / одна"],["richtig","правильный"],["falsch","неправильный"]],
      "Фразы":[["… Jahre alt","… лет (возраст)"],["von Beruf","по профессии"],["ein bisschen","немного"],["gar nicht","совсем не"],["Wie geht’s?","Как дела?"],["Es geht","Нормально"],["Nicht so gut","Не очень"],["vielen Dank","большое спасибо"],["Guten Tag","добрый день"],["Guten Morgen","доброе утро"],["Guten Abend","добрый вечер"],["Gute Nacht","спокойной ночи"],["Auf Wiedersehen","до свидания"]],
      "Наречия / служебные":[["jetzt","сейчас"],["zusammen","вместе"],["hier","здесь"],["auch","тоже"],["aus","из"],["bei","у / при"],["als","как (в роли)"],["in","в"],["wo","где"],["woher","откуда"],["wer","кто"],["wie","как"],["welche","какой / которые"],["aber","но"],["und","и"]],
      "Да / нет / отрицание":[["ja","да"],["nein","нет"],["doch","нет, наоборот / всё же"],["kein / keine","не / никакой"],["mein","мой"],["dein","твой"]]
    },
    countries:[["Deutschland","Германия"],["die Schweiz","Швейцария"],["die Türkei","Турция"],["die USA","США"],["Eritrea","Эритрея"],["Spanien","Испания"],["Frankreich","Франция"],["Österreich","Австрия"],["Polen","Польша"]],
    langs:[["Deutsch","немецкий"],["Englisch","английский"],["Spanisch","испанский"],["Russisch","русский"],["Chinesisch","китайский"],["Polnisch","польский"],["Französisch","французский"],["Italienisch","итальянский"],["Türkisch","турецкий"]]
  }
  /* следующие темы добавляются сюда — словарь станет накопительным автоматически */
]};

/* ===================== Рендер (общий для обоих режимов) ===================== */
const Dict = (function(){
  const esc = s => String(s).replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
  const say = de => `<button class="say" title="Озвучить" onclick="event.stopPropagation();speak('${String(de).replace(/'/g,"\\'")}')">🔊</button>`;
  const tag = t => t ? ` data-theme="${t}"` : "";

  function nounEntry(art,row,tid){
    const [de,ru]=row;
    return `<div class="entry ${art}"${tag(tid)} data-de="${esc(de.toLowerCase())}" data-ru="${esc(ru.toLowerCase())}">
      <span class="art">${art}</span><span class="de">${esc(de)}</span><span class="ru">${esc(ru)}</span>${say(de)}</div>`;
  }
  function genderBlock(art,who,arr){
    if(!arr.length) return "";
    return `<div class="gwrap"><div class="gtitle"><span class="pill ${art}">${art}</span><span class="who">${who} · ${arr.length} слов</span></div>
      <div class="list">${arr.map(r=>nounEntry(art,r,r._t)).join("")}</div></div>`;
  }
  function pair(row){
    const [de,ru]=row;
    return `<div class="pair g-other"${tag(row._t)} data-de="${esc(de.toLowerCase())}" data-ru="${esc(ru.toLowerCase())}">
      <span class="de">${esc(de)}</span><span class="ru">${esc(ru)}</span>${say(de)}</div>`;
  }
  function verbEntry(v){
    const [inf,ru,type,forms]=v;
    const rows = forms.map((f,i)=>`<div class="row" onclick="speak('${(PRO[i].split('/')[0]+' '+f.replace(/ … /,' ')).replace(/'/g,"\\'")}')"><span class="pro">${PRO[i]}</span><span class="frm">${esc(f)}</span></div>`).join("");
    const badge = type==="reg"?`<span class="vbadge reg">прав.</span>`:`<span class="vbadge irr">непр.</span>`;
    return `<div class="ventry g-verb"${tag(v._t)} data-de="${esc(inf.toLowerCase())}" data-ru="${esc(ru.toLowerCase())}">
      <div class="vhead" onclick="this.parentElement.classList.toggle('open')">
        ${badge}<span class="de">${esc(inf)}</span><span class="ru">${esc(ru)}</span>${say(inf)}<span class="caret">▶</span></div>
      <div class="conj"><div class="grid">${rows}</div><div class="tip">Настоящее время. Прошедшее — в отдельном разделе глаголов. Клик по форме — озвучка.</div></div></div>`;
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

    h+=`<div class="sec">Глаголы <span class="cnt">клик — спряжение (наст. время)</span></div>`;
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
      fGender=ch.dataset.f; root.querySelectorAll('.chip[data-f]').forEach(c=>c.setAttribute('aria-pressed',c===ch?"true":"false")); apply();
    }));
    root.querySelectorAll('.chip[data-t]').forEach(ch=>ch.addEventListener('click',()=>{
      fTheme=ch.dataset.t; root.querySelectorAll('.chip[data-t]').forEach(c=>c.setAttribute('aria-pressed',c===ch?"true":"false")); apply();
    }));
    const eye=root.querySelector('.eye');
    eye.addEventListener('click',()=>{ const on=document.body.classList.toggle('hide-ru'); eye.textContent=on?"👁 Показать переводы":"🙈 Скрыть переводы"; });
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
