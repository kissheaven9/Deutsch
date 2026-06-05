// Озвучка через браузер (de-DE). Позже заменим на предгенерированные нейро-TTS (живой голос).
let _voices = [];
function _loadVoices(){ try{ _voices = speechSynthesis.getVoices()||[]; }catch(e){} }
if('speechSynthesis' in window){ _loadVoices(); speechSynthesis.onvoiceschanged = _loadVoices; }
// выбрать самый «живой» немецкий голос из доступных в системе
function bestDeVoice(){
  const de = _voices.filter(v=>v.lang && v.lang.toLowerCase().startsWith('de'));
  const pref = ['siri','neural','enhanced','premium','google','petra','yannick','markus','anna','helena'];
  for(const p of pref){ const m = de.find(v=>v.name.toLowerCase().includes(p)); if(m) return m; }
  return de[0] || null;
}
function _utter(text){ const u=new SpeechSynthesisUtterance(text); u.lang='de-DE'; u.rate=0.92; const v=bestDeVoice(); if(v)u.voice=v; return u; }
// --- голоса по роли героя (бесплатно: системные голоса + тембр/скорость) ---
function _deVoices(){ return (_voices||[]).filter(v=>v.lang && v.lang.toLowerCase().startsWith('de')); }
function _voiceByNames(names){ const de=_deVoices(); for(const n of names){ const m=de.find(v=>v.name.toLowerCase().includes(n)); if(m) return m; } return null; }
const _FEM=['anna','petra','helena','katja','marlene','vicki','female','frau','greta','klara'];
const _MAS=['markus','yannick','conrad','stefan','viktor','reed','male','mann'];
function roleVoice(role){
  if(role==='male'||role==='der')   return { voice:_voiceByNames(_MAS)||bestDeVoice(), pitch:0.8,  rate:0.92 }; // Otto — ниже, спокойнее
  if(role==='female'||role==='die') return { voice:_voiceByNames(_FEM)||bestDeVoice(), pitch:1.12, rate:1.0  }; // Грета
  if(role==='child'||role==='das')  return { voice:_voiceByNames(_FEM)||bestDeVoice(), pitch:1.55, rate:1.07 }; // дети — выше, живее
  return { voice:bestDeVoice(), pitch:1.0, rate:0.94 };
}
function _utterRole(text, role){ const u=new SpeechSynthesisUtterance(text); u.lang='de-DE'; const r=roleVoice(role); if(r.voice)u.voice=r.voice; u.pitch=r.pitch; u.rate=r.rate; return u; }
// очередь предложений (длинный текст Chrome рвёт → режем; запуск СИНХРОННО, иначе Safari блокирует)
// _gen — «поколение»: при любой новой озвучке растёт, старые onend становятся неактуальны
// и НЕ продолжают прежний текст (баг: озвучка слова продолжала текст).
let _q=[], _qi=0, _qBtn=null, _gen=0, _qRole='';
let _sq=[], _sqi=0, _sqBtn=null;
let _au=null, _auList=[], _aui=0, _auBtn=null, _auGen=0, _auFb=null;
function _stopAll(){ _gen++; _q=[]; _qi=0; _sq=[]; _sqi=0;
  _auGen++; try{ if(_au){ _au.pause(); _au.src=''; } }catch(e){} _au=null; _auList=[]; _aui=0;
  if(_qBtn){ _qBtn.textContent='🔊 Послушать'; _qBtn=null; }
  if(_sqBtn){ _sqBtn.textContent='🔊 Послушать'; _sqBtn=null; }
  if(_auBtn){ _auBtn.textContent='🔊 Послушать'; _auBtn=null; }
  try{ window.speechSynthesis.cancel(); }catch(e){} }
function _seq(){
  if(_qi>=_q.length){ if(_qBtn){ _qBtn.textContent='🔊 Послушать'; _qBtn=null; } return; }
  const my=_gen, u=_utterRole(_q[_qi], _qRole);
  u.onend=()=>{ if(my!==_gen) return; _qi++; _seq(); };
  u.onerror=()=>{ if(my!==_gen) return; _qi++; _seq(); };
  window.speechSynthesis.speak(u);
}
// очередь реплик с РАЗНЫМИ голосами: items=[{t,role}] (для диалогов)
function speakSequence(items, btn){
  const sy=window.speechSynthesis; if(!sy){ alert('Озвучка недоступна в этом браузере'); return; }
  if(_sq.length && _sqi<_sq.length){
    if(sy.speaking && !sy.paused){ sy.pause(); if(btn) btn.textContent='▶ Продолжить'; return; }
    if(sy.paused){ sy.resume(); if(btn) btn.textContent='⏸ Пауза'; return; }
  }
  _stopAll(); _sq=(items||[]).filter(x=>x.t && x.t.trim()); _sqi=0; _sqBtn=btn; if(btn) btn.textContent='⏸ Пауза';
  _seqRole();
}
function _seqRole(){
  if(_sqi>=_sq.length){ if(_sqBtn){ _sqBtn.textContent='🔊 Послушать'; _sqBtn=null; } return; }
  const my=_gen, it=_sq[_sqi], u=_utterRole(it.t, it.role);
  u.onend=()=>{ if(my!==_gen) return; _sqi++; _seqRole(); };
  u.onerror=()=>{ if(my!==_gen) return; _sqi++; _seqRole(); };
  window.speechSynthesis.speak(u);
}
// проигрывание готовых аудиофайлов (живые нейроголоса); fallback=[{t,role}] на случай отсутствия файла
function playSeq(urls, btn, fallback){
  if(_au && _aui<_auList.length){
    if(!_au.paused){ _au.pause(); if(btn) btn.textContent='▶ Продолжить'; return; }
    _au.play(); if(btn) btn.textContent='⏸ Пауза'; return;
  }
  _stopAll();
  if(!urls || !urls.length){ if(fallback) speakSequence(fallback, btn); return; }
  _auGen++; _auList=urls; _aui=0; _auBtn=btn; _auFb=fallback||null; if(btn) btn.textContent='⏸ Пауза';
  _auPlay();
}
function _auPlay(){
  if(_aui>=_auList.length){ if(_auBtn){ _auBtn.textContent='🔊 Послушать'; _auBtn=null; } _au=null; return; }
  const my=_auGen; _au=new Audio(_auList[_aui]);
  _au.onended=()=>{ if(my!==_auGen) return; _aui++; _auPlay(); };
  _au.onerror=()=>{ if(my!==_auGen) return;
    const it=_auFb && _auFb[_aui];
    if(it && it.t){ const u=_utterRole(it.t, it.role); u.onend=()=>{ if(my!==_auGen) return; _aui++; _auPlay(); }; u.onerror=u.onend; try{ window.speechSynthesis.speak(u); }catch(e){ _aui++; _auPlay(); } }
    else { _aui++; _auPlay(); }
  };
  _au.play().catch(()=>{ if(_au && _au.onerror) _au.onerror(); });
}
// слаг для имени аудиофайла слова (совпадает с генератором tools/gen_audio.py)
function _slug(s){ return String(s).toLowerCase()
  .replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss')
  .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,''); }
// слово голосом героя: живой файл если есть, иначе браузерный голос с тембром роли
function playWord(text, role){
  _stopAll();
  const my=++_auGen, a=new Audio('audio/word/'+_slug(text)+'.mp3'); _au=a;
  a.onerror=()=>{ if(my!==_auGen) return; _au=null; speak(text, role); };
  a.play().catch(()=>{ if(my!==_auGen) return; _au=null; speak(text, role); });
}
// короткое слово — останавливает любой текст и говорит только слово
function speak(text, role){
  try{ _stopAll(); window.speechSynthesis.speak(_utterRole(text, role||'')); }
  catch(e){ alert('Озвучка недоступна в этом браузере'); }
}
// длинный текст — кнопка играть/пауза/продолжить
function toggleSpeak(text, btn, role){
  const sy = window.speechSynthesis; if(!sy){ alert('Озвучка недоступна в этом браузере'); return; }
  const running = _q.length>0 && _qi<_q.length;            // идёт ли наш текст
  if(running && sy.speaking && !sy.paused){ sy.pause(); if(btn) btn.textContent='▶ Продолжить'; return; }
  if(running && sy.paused){ sy.resume(); if(btn) btn.textContent='⏸ Пауза'; return; }
  _stopAll();
  _q = (text||'').replace(/\s+/g,' ').trim().match(/[^.!?]+[.!?]*/g) || [text];
  _qi=0; _qBtn=btn; _qRole=role||''; if(btn) btn.textContent='⏸ Пауза';
  _seq(); // СИНХРОННО, внутри клика — иначе Safari/iOS не озвучит
}
function restartSpeak(text, btn){ _stopAll(); toggleSpeak(text, btn); }

// похвала за правильный ответ
const PRAISE=['Молодец! 👏','Отлично! 🌟','Супер! ✅','Верно! 🎯','Класс! 💪','Здорово! 🎉','Так держать! 🙌'];
function praise(){ return PRAISE[Math.floor(Math.random()*PRAISE.length)]; }

// показать/скрыть русский перевод текста (блок .ru-block сразу после .bh с кнопкой)
function toggleRuBlock(btn){
  const blk = btn.closest('.bh') && btn.closest('.bh').nextElementSibling;
  if(!blk) return;
  const hidden = blk.hasAttribute('hidden');
  if(hidden) blk.removeAttribute('hidden'); else blk.setAttribute('hidden','');
  btn.textContent = hidden ? 'Скрыть перевод' : 'Показать перевод';
}

// Глазик: скрыть/показать конкретный объект
function toggleObj(btn){
  const obj = btn.closest('.obj');
  obj.classList.toggle('hidden');
}
// Тап по скрытой подписи — открыть (самопроверка)
document.addEventListener('click', e=>{
  const lab = e.target.closest('.obj.hidden .label');
  if(lab){ lab.closest('.obj').classList.remove('hidden'); }
});
// Массово
function hideAll(){ document.querySelectorAll('.obj').forEach(o=>o.classList.add('hidden')); }
function showAll(){ document.querySelectorAll('.obj').forEach(o=>o.classList.remove('hidden')); }
function toggleAll(btn){
  const anyVisible = [...document.querySelectorAll('.obj')].some(o=>!o.classList.contains('hidden'));
  if(anyVisible){ hideAll(); btn.textContent='👁 Показать все слова'; }
  else { showAll(); btn.textContent='🙈 Скрыть все слова'; }
}
