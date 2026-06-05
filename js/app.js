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
// очередь предложений (длинный текст Chrome рвёт → режем; запуск СИНХРОННО, иначе Safari блокирует)
// _gen — «поколение»: при любой новой озвучке растёт, старые onend становятся неактуальны
// и НЕ продолжают прежний текст (баг: озвучка слова продолжала текст).
let _q=[], _qi=0, _qBtn=null, _gen=0;
function _stopAll(){ _gen++; _q=[]; _qi=0; if(_qBtn){ _qBtn.textContent='🔊 Послушать'; _qBtn=null; } try{ window.speechSynthesis.cancel(); }catch(e){} }
function _seq(){
  if(_qi>=_q.length){ if(_qBtn){ _qBtn.textContent='🔊 Послушать'; _qBtn=null; } return; }
  const my=_gen, u=_utter(_q[_qi]);
  u.onend=()=>{ if(my!==_gen) return; _qi++; _seq(); };
  u.onerror=()=>{ if(my!==_gen) return; _qi++; _seq(); };
  window.speechSynthesis.speak(u);
}
// короткое слово — останавливает любой текст и говорит только слово
function speak(text){
  try{ _stopAll(); window.speechSynthesis.speak(_utter(text)); }
  catch(e){ alert('Озвучка недоступна в этом браузере'); }
}
// длинный текст — кнопка играть/пауза/продолжить
function toggleSpeak(text, btn){
  const sy = window.speechSynthesis; if(!sy){ alert('Озвучка недоступна в этом браузере'); return; }
  const running = _q.length>0 && _qi<_q.length;            // идёт ли наш текст
  if(running && sy.speaking && !sy.paused){ sy.pause(); if(btn) btn.textContent='▶ Продолжить'; return; }
  if(running && sy.paused){ sy.resume(); if(btn) btn.textContent='⏸ Пауза'; return; }
  _stopAll();
  _q = (text||'').replace(/\s+/g,' ').trim().match(/[^.!?]+[.!?]*/g) || [text];
  _qi=0; _qBtn=btn; if(btn) btn.textContent='⏸ Пауза';
  _seq(); // СИНХРОННО, внутри клика — иначе Safari/iOS не озвучит
}
function restartSpeak(text, btn){ _stopAll(); toggleSpeak(text, btn); }

// похвала за правильный ответ
const PRAISE=['Молодец! 👏','Отлично! 🌟','Супер! ✅','Верно! 🎯','Класс! 💪','Здорово! 🎉','Так держать! 🙌'];
function praise(){ return PRAISE[Math.floor(Math.random()*PRAISE.length)]; }

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
