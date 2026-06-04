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
function toggleSpeak(text, btn){
  const sy = window.speechSynthesis; if(!sy){ alert('Озвучка недоступна'); return; }
  if(sy.speaking && !sy.paused){ sy.pause(); if(btn) btn.textContent='▶ Продолжить'; return; }
  if(sy.paused){ sy.resume(); if(btn) btn.textContent='⏸ Пауза'; return; }
  const u=_utter(text); u.onend=()=>{ if(btn) btn.textContent='🔊 Послушать'; };
  sy.cancel(); sy.speak(u); if(btn) btn.textContent='⏸ Пауза';
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
