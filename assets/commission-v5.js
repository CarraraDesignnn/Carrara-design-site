/* Home: "What a Commission Means" v5 (minimal copy, cards only). Four cards, one still each; hovering (mouse) or pressing (touch) a card
   fades it to a film. Replaces only the old first screen of #pricing; the "By the Numbers" screen stays as it was. */
(function(){
  var IMG='/img/commission/';
  var STAGES=[
    {n:'01',name:'The Conversation',img:'c1-stitch',vid:'c3-film2',copy:'Where your ideas meet ours.'},
    {n:'02',name:'Creative Direction',img:'c3-ice',vid:'c3-film',copy:'Every option considered. Only the right ones chosen.'},
    {n:'03',name:'The Studio',img:'c2-huayra',vid:'c2-clay',copy:'Your car, rendered in OEM-standard 3D.'},
    {n:'04',name:'The Factory',img:'c4-manthey',vid:'c4-delivery',copy:'Every decision certain before it’s built.'}
  ];

  var sec=document.getElementById('pricing');if(!sec)return;
  function hydrated(){return Object.keys(sec).some(function(k){return k.indexOf('__react')===0})}
  function whenReady(fn){var t=0;(function poll(){if(hydrated()||t>60)return setTimeout(fn,120);t++;setTimeout(poll,100)})()}

  function build(){
    var h='<div class="cm"><div class="cm-scene cm-a"><div class="cm-head">'+
      '<p class="eyebrow">The commission</p>'+
      '<h2 id="cm-title" class="h3">What a Commission Means</h2>'+
      '<p class="cm-lead">Your car, designed together.</p>'+
      '</div><ol class="cm-rail">'+
      STAGES.map(function(s){return '<li class="cm-card"><div class="cm-media" tabindex="0" aria-label="'+s.name+'">'+
        '<img alt="" decoding="async" data-src="'+IMG+s.img+'-600.jpg" data-srcset="'+IMG+s.img+'-600.jpg 600w, '+IMG+s.img+'-1050.jpg 1050w" sizes="(max-width:700px) 74vw, 24vw">'+
        '<video muted playsinline loop preload="none" data-src="'+IMG+s.vid+'.mp4" disablepictureinpicture></video>'+
        '<span class="cm-over"><span class="cm-num">'+s.n+'</span><span class="cm-name">'+s.name+'</span></span>'+
        '<span class="cm-play" aria-hidden="true"></span>'+
        '</div><p class="cm-copy">'+s.copy+'</p></li>'}).join('')+
      '</ol></div></div>';
    sec.insertAdjacentHTML('afterbegin',h);
    sec.classList.add('cm-ready');sec.setAttribute('aria-labelledby','cm-title');
    return sec.querySelector('.cm');
  }

  whenReady(function(){
    if(sec.querySelector('.cm'))return;
    var root=build(),loaded=false;
    function loadAll(){if(loaded)return;loaded=true;
      [].forEach.call(root.querySelectorAll('img[data-src]'),function(im){im.srcset=im.dataset.srcset;im.src=im.dataset.src});}
    if('IntersectionObserver' in window)new IntersectionObserver(function(es,o){es.forEach(function(e){if(e.isIntersecting){loadAll();o.disconnect()}})},{rootMargin:'900px 0px'}).observe(sec);else loadAll();

    [].forEach.call(root.querySelectorAll('.cm-media'),function(m){
      var v=m.querySelector('video'),on=false;
      function start(){if(on)return;on=true;if(!v.src){v.src=v.dataset.src;v.preload='auto'}
        try{v.currentTime=0}catch(e){}
        var p=v.play();if(p&&p.catch)p.catch(function(){});
        var show=function(){if(on)m.classList.add('is-film')};
        if(v.readyState>=3)show();else v.addEventListener('playing',function once(){v.removeEventListener('playing',once);show()});}
      function stop(){on=false;m.classList.remove('is-film');setTimeout(function(){if(!on)v.pause()},500)}
      m.addEventListener('mouseenter',start);m.addEventListener('mouseleave',stop);
      m.addEventListener('focus',start);m.addEventListener('blur',stop);
      m.addEventListener('touchstart',start,{passive:true});
      m.addEventListener('touchend',stop);m.addEventListener('touchcancel',stop);
      m.addEventListener('contextmenu',function(e){e.preventDefault()});
      /* warm up the film once the card is on screen, so a press plays straight away */
      if('IntersectionObserver' in window)new IntersectionObserver(function(es,o){es.forEach(function(e){if(e.isIntersecting){if(!v.src){v.src=v.dataset.src;v.preload='auto'}o.disconnect()}})},{threshold:.4}).observe(m);
    });
  });
})();
