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
// короткое слово — просто проговорить заново
function speak(text){
  try{ speechSynthesis.cancel(); speechSynthesis.speak(_utter(text)); }
  catch(e){ alert('Озвучка недоступна в этом браузере'); }
}
// длинный текст — кнопка играть/пауза/продолжить
// очередь предложений (длинный текст Chrome рвёт → режем; запуск СИНХРОННО, иначе Safari блокирует)
let _q=[], _qi=0, _qBtn=null, _qOn=false;
function _next(){
  const sy=window.speechSynthesis;
  if(_qi>=_q.length){ _qOn=false; if(_qBtn) _qBtn.textContent='🔊 Послушать'; return; }
  const u=_utter(_q[_qi]);
  u.onend=()=>{ _qi++; _next(); };
  u.onerror=()=>{ _qi++; _next(); };
  sy.speak(u);
}
function toggleSpeak(text, btn){
  const sy = window.speechSynthesis; if(!sy){ alert('Озвучка недоступна в этом браузере'); return; }
  if(_qOn && sy.speaking && !sy.paused){ sy.pause(); if(btn) btn.textContent='▶ Продолжить'; return; }
  if(_qOn && sy.paused){ sy.resume(); if(btn) btn.textContent='⏸ Пауза'; return; }
  try{ sy.cancel(); }catch(e){}
  _q = (text||'').replace(/\s+/g,' ').trim().match(/[^.!?]+[.!?]*/g) || [text];
  _qi=0; _qBtn=btn; _qOn=true; if(btn) btn.textContent='⏸ Пауза';
  _next(); // СИНХРОННО, внутри клика — иначе Safari/iOS не озвучит
}
// начать текст сначала
function restartSpeak(text, btn){
  const sy=window.speechSynthesis; if(!sy) return;
  const u=_utter(text); u.onend=()=>{ if(btn) btn.textContent='🔊 Послушать'; };
  sy.cancel(); sy.speak(u); if(btn) btn.textContent='⏸ Пауза';
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
