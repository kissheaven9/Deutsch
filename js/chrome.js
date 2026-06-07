/* Единая шапка и подвал на всех страницах. Меняем здесь — меняется везде. */
(function(){
  const THEMES=[
    {n:'1. Знакомство и семья', href:'thema-01.html',     on:true},
    {n:'2. Быт (дом)',          href:'thema-02.html', on:true},
    {n:'3. Свободное время',    on:false},
    {n:'4. Еда',                on:false},
    {n:'5. Дорога',             on:false},
    {n:'6. Год и сад',          on:false},
    {n:'7. Город',              on:false},
    {n:'8. Дом и кухня',        on:false},
    {n:'9. Тело и здоровье',    on:false},
    {n:'10. Образ и одежда',    on:false},
    {n:'11. Погода и праздник', on:false},
  ];

  // ----- ШАПКА -----
  const head=document.querySelector('header.top .wrap');
  if(head){
    const drop=THEMES.map(t=> t.on ? `<a href="${t.href}">${t.n}</a>` : `<span class="off">${t.n} · скоро</span>`).join('');
    head.innerHTML=
      `<a class="home" href="index.html">🇩🇪 Deutsch A1</a>`+
      `<span class="navspring"></span>`+
      `<div class="nav-th"><button class="navbtn" id="thBtn" aria-expanded="false">📚 Темы ▾</button>`+
      `<div class="navdrop" id="thDrop">${drop}</div></div>`+
      `<a class="navbtn pur" href="dictionary.html">📖 Словарь</a>`;
    const btn=head.querySelector('#thBtn'), dd=head.querySelector('#thDrop');
    btn.addEventListener('click',e=>{e.stopPropagation();const o=dd.classList.toggle('open');btn.setAttribute('aria-expanded',o);});
    document.addEventListener('click',()=>dd.classList.remove('open'));
  }

  // ----- ПОДВАЛ -----
  const foot=document.querySelector('footer');
  if(foot){
    const items=THEMES.map(t=> t.on ? `<a href="${t.href}">${t.n}</a>` : `<span class="off">${t.n}</span>`).join('');
    foot.innerHTML=
      `<div class="flogo">🇩🇪 Deutsch A1</div>`+
      `<div class="fthemes">${items}<a class="fdict" href="dictionary.html">📖 Словарь · все слова</a></div>`+
      `<div class="ftag">учим немецкую лексику вместе с Отто, Гретой и детьми</div>`;
  }
})();
