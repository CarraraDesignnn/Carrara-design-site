/* Home: "What a Commission Means" v27. One clear statement of what we do, three plain benefits, and one film
   (a live design session: the wheel finish changing on a client's GT3). No text on images, nothing hidden behind hover.
   Replaces only the old first screen of #pricing; "By the Numbers" stays. */
(function(){
  var BEN=[
    ['Real-time design sessions','Paint, wheels and trim change live on your exact car, with us beside you, until it’s right.'],
    ['Expert creative direction','Over a decade with the factory programmes behind every recommendation. You see every possibility, then choose the best of them.'],
    ['Photoreal 3D visualization','Your car in studio and natural light, so every material is chosen with confidence.']
  ];
  var sec=document.getElementById('pricing');if(!sec)return;
  function hydrated(){return Object.keys(sec).some(function(k){return k.indexOf('__react')===0})}
  function whenReady(fn){var t=0;(function poll(){if(hydrated()||t>60)return setTimeout(fn,120);t++;setTimeout(poll,100)})()}
  whenReady(function(){
    if(sec.querySelector('.cm'))return;
    sec.insertAdjacentHTML('afterbegin','<div class="cm cmx"><div class="cm-scene cm-a"><div class="cmx-wrap">'+
      '<div class="cmx-text"><p class="eyebrow">Before you commission</p><h2 id="cm-title" class="h3">What a Commission Means</h2>'+
      '<p class="cmx-lead">We help collectors specify their cars with the factory. Before anything is ordered, you see your exact car in photoreal 3D, and we design it with you.</p>'+
      '<ul class="cmx-list">'+BEN.map(function(b){return '<li><h3>'+b[0]+'</h3><p>'+b[1]+'</p></li>'}).join('')+'</ul></div>'+
      '<div class="cmx-film"><video muted playsinline loop preload="none" poster="/img/commission/b-sessions-poster.jpg" data-src="/img/step-sessions.mp4" disablepictureinpicture aria-label="A live design session: the wheel finish changing on a GT3"></video></div>'+
      '</div></div></div>');
    sec.classList.add('cm-ready');sec.setAttribute('aria-labelledby','cm-title');
    var v=sec.querySelector('.cmx-film video'),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,inView=false;
    function go(on){if(on&&!reduce){if(!v.src){v.src=v.dataset.src;v.preload='auto'}var p=v.play();if(p&&p.catch)p.catch(function(){})}else v.pause()}
    if('IntersectionObserver' in window)new IntersectionObserver(function(es){es.forEach(function(e){inView=e.isIntersecting;go(inView)})},{threshold:.25}).observe(v);else go(true);
    document.addEventListener('visibilitychange',function(){go(!document.hidden&&inView)});
  });
})();
