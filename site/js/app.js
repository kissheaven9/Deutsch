// Озвучка через браузер (de-DE). Позже заменим на предгенерированные mp3.
function speak(text){
  try{
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'de-DE'; u.rate = 0.9;
    const v = speechSynthesis.getVoices().find(x=>x.lang && x.lang.startsWith('de'));
    if(v) u.voice = v;
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  }catch(e){ alert('Озвучка недоступна в этом браузере'); }
}
// прогреть список голосов
if('speechSynthesis' in window){ speechSynthesis.onvoiceschanged = ()=>{}; speechSynthesis.getVoices(); }

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
