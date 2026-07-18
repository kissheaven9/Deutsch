// Общий модуль ИИ для страниц-тренажёров: ключ (localStorage), запрос, правила метода,
// журнал ошибок и персональная мнемоника. Один файл — чтобы промпт не разъезжался по страницам.
const AI_KEY='deutsch_ai_key', ERR_KEY='deutsch_errors';
function aiGetKey(){return localStorage.getItem(AI_KEY)||'';}
function aiSaveKey(v){if(v)localStorage.setItem(AI_KEY,v.trim());}
function aiClearKey(){localStorage.removeItem(AI_KEY);}

// ПРАВИЛА МЕТОДА — единый системный промпт (род через персонажа, не грамматикой)
const METHOD_SYS=`Ты — Грета: тёплая шумная итальянка из Неаполя, повар, соседка молчуна Отто, говоришь «Mamma mia!».
Ученик учит немецкий A1–A2 по методу, где РОД привязан к персонажу:
der→ОТТО (жадный садовник; кошелёк der Geldbeutel; линза — ЦЕНА), die→ГРЕТА (ты: кухня, цвета, солнце Неаполя; линза — ЦВЕТ), das→ТЕО (ребёнок; из чего сделано; линза — МАТЕРИАЛ).
ГЛАГОЛЫ: отделяемые→Отто (steht … auf, aufgestanden); неотделяемые be-/er-/ver-/ge-→ты (bekommen → hat bekommen, БЕЗ ge-); -ieren→Тео.
ГЛАВНОЕ ПРАВИЛО ИСПРАВЛЕНИЙ: род поправляй ЧЕРЕЗ ПЕРСОНАЖА, не грамматикой. Не «это мужской род», а «der Geldbeutel — это же Отто, он вечно его достаёт, помнишь? значит der».
Уровень строго A1–A2, только простое. Коротко (2–4 строки), тепло, эмоционально.`;

async function aiAsk(messages,{max=400,temp=0.7}={}){
  const k=aiGetKey(); if(!k) return '⚠️ Введи ключ ИИ.';
  try{
    const r=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+k},
      body:JSON.stringify({model:'gpt-4o-mini',messages,temperature:temp,max_tokens:max})});
    if(!r.ok) return '⚠️ Ошибка ИИ '+r.status+': '+(await r.text()).slice(0,150);
    return (await r.json()).choices[0].message.content;
  }catch(e){return '⚠️ Сеть: '+e.message;}
}

// ЖУРНАЛ ОШИБОК (питает SRS и мнемонику)
function errBump(inf){const e=JSON.parse(localStorage.getItem(ERR_KEY)||'{}');e[inf]=(e[inf]||0)+1;localStorage.setItem(ERR_KEY,JSON.stringify(e));}
function errOk(inf){const e=JSON.parse(localStorage.getItem(ERR_KEY)||'{}');if(e[inf])e[inf]=Math.max(0,e[inf]-1);localStorage.setItem(ERR_KEY,JSON.stringify(e));}
function errTop(n=5){const e=JSON.parse(localStorage.getItem(ERR_KEY)||'{}');return Object.entries(e).filter(([,c])=>c>0).sort((a,b)=>b[1]-a[1]).slice(0,n);}

// персональная мнемоника для «застрявшего» глагола
async function aiMnemonic(inf,ru,pp){
  return aiAsk([{role:'system',content:METHOD_SYS},
   {role:'user',content:`Ученик НИКАК не может запомнить глагол «${inf}» (${ru}, Perfekt: ${pp}). Придумай ОДНУ яркую персональную мнемонику/ассоциацию, чтобы запомнить и значение, и что это МОЙ глагол (неотделяемый, Perfekt без ge-). Опирайся на звучание слова ИЛИ на мой мир (кухня, Неаполь, цвета, солнце). Коротко, тепло, по-русски, с примером-предложением A1.`}],{max:300});
}
