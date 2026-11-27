/* Home: "What a Commission Means" v25 — card grid (bento), back to the earlier layout with the new content.
   Five stages: Consultation (wide), Configuration, Review, Render to Reality, Legacy.
   Each card shows its label; hovering (mouse) or resting a thumb on it reveals the line and the second photo or film.
   Review's film is its normal face. Replaces only the old first screen of #pricing; "By the Numbers" stays. */
(function(){
  var IMG='/img/commission/';
  /* base / alt: {img:'name', w:[widths]} or {vid:'name', poster:'name'}; pos = object-position */
  var STAGES=[
    {n:'01',name:'Consultation',cls:'is-wide',copy:'We start with your goals, then set the creative direction together.',
      base:{img:'b1-swatch',w:[900,1600],pos:'62% 50%'},alt:{img:'b1-tartan',w:[900,1600]}},
    {n:'02',name:'Configuration',copy:'Your exact car, built in CGI to OEM standard.',
      base:{img:'b2-blender',w:[600,1050],pos:'50% 45%'},alt:{vid:'c2-clay'}},
    {n:'03',name:'Review',copy:'Designed with you in real time, through dealer meetings to factory submission.',
      base:{vid:'c3-film',poster:'c3-filmposter',loop:true},alt:{img:'c3-seat',w:[600,1050],pos:'50% 40%'}},
    {n:'04',name:'Render to Reality',copy:'The car you designed becomes the car you drive.',
      base:{img:'c4-manthey',w:[600,1050]},alt:{vid:'c4-delivery'}},
    {n:'05',name:'Legacy',copy:'Poster cars, auction records, icons of their chassis.',
      base:{img:'c5-cgt-top',w:[600,1050],pos:'50% 62%'},alt:{img:'c5-cgt-poster',w:[600,1050],pos:'50% 70%'}}
  ];

  var sec=document.getElementById('pricing');if(!sec)return;
  function hydrated(){return Object.keys(sec).some(function(k){return k.indexOf('__react')===0})}
  function whenReady(fn){var t=0;(function poll(){if(hydrated()||t>60)return setTimeout(fn,120);t++;setTimeout(poll,100)})()}

  function layer(m,cls){
    if(!m)return '';
    var st=m.pos?' style="object-position:'+m.pos+'"':'';
    if(m.vid){
      var p=m.poster?' poster="'+IMG+m.poster+'-1050.jpg"':'';
      return '<video class="'+cls+(m.loop?' cmb-loop':'')+'" muted playsinline loop preload="none"'+p+' data-src="'+IMG+m.vid+'.mp4" disablepictureinpicture'+st+'></video>';
    }
    var ss=m.w.map(function(w){return IMG+m.img+'-'+w+'.jpg '+w+'w'}).join(', ');
    return '<img class="'+cls+'" alt="" decoding="async" data-src="'+IMG+m.img+'-'+m.w[0]+'.jpg" data-srcset="'+ss+'" sizes="(max-width:700px) 100vw, 66vw"'+st+'>';
  }

  function build(){
    var h='<div class="cm cmb"><div class="cm-scene cm-a"><div class="cm-head">'+
      '<p class="eyebrow">Before you commission</p>'+
      '<h2 id="cm-title" class="h3">What a Commission Means</h2>'+
      '</div><ol class="cmb-grid">'+
      STAGES.map(function(s){return '<li class="cmb-card '+(s.cls||'')+'" tabindex="0" aria-label="'+s.name+'. '+s.copy+'">'+
        layer(s.base,'cmb-base')+layer(s.alt,'cmb-alt')+
        '<div class="cmb-info"><p class="cmb-label"><span class="cmb-n">'+s.n+'</span>'+s.name+'</p>'+
        '<div class="cmb-more"><p class="cmb-copy">'+s.copy+'</p></div></div></li>'}).join('')+
      '</ol></div></div>';
    sec.insertAdjacentHTML('afterbegin',h);
    sec.classList.add('cm-ready');sec.setAttribute('aria-labelledby','cm-title');
    return sec.querySelector('.cm');
  }

  whenReady(function(){
    if(sec.querySelector('.cm'))return;
    var root=build(),loaded=false;
    var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    function loadAll(){if(loaded)return;loaded=true;
      [].forEach.call(root.querySelectorAll('img[data-src]'),function(im){im.srcset=im.dataset.srcset;im.src=im.dataset.src});}
    function src(v){if(!v.src){v.src=v.dataset.src;v.preload='auto'}}
    function play(v){if(reduce)return;src(v);var p=v.play();if(p&&p.catch)p.catch(function(){})}

    var cards=[].slice.call(root.querySelectorAll('.cmb-card'));
    var loops=[].slice.call(root.querySelectorAll('video.cmb-loop'));
    function on(c){if(c.classList.contains('is-on'))return;c.classList.add('is-on');var v=c.querySelector('video.cmb-alt');if(v)play(v)}
    function off(c){c.classList.remove('is-on');var v=c.querySelector('video.cmb-alt');if(v)setTimeout(function(){if(!c.classList.contains('is-on'))v.pause()},600)}

    var hoverable=matchMedia('(hover:hover)');
    cards.forEach(function(c){
      c.addEventListener('mouseenter',function(){if(hoverable.matches)on(c)});
      c.addEventListener('mouseleave',function(){if(hoverable.matches)off(c)});
      c.addEventListener('focus',function(){on(c)});
      c.addEventListener('blur',function(){off(c)});
      /* phones: reveal while the thumb rests on the card */
      c.addEventListener('touchstart',function(){cards.forEach(function(o){if(o!==c)off(o)});on(c)},{passive:true});
      c.addEventListener('touchend',function(){setTimeout(function(){off(c)},250)},{passive:true});
      c.addEventListener('touchcancel',function(){off(c)},{passive:true});
      c.addEventListener('contextmenu',function(e){if(e.pointerType!=='mouse')e.preventDefault()});
    });

    var inView=false;
    function loopsOn(x){loops.forEach(function(v){if(x)play(v);else v.pause()})}
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(es,o){es.forEach(function(e){if(e.isIntersecting){loadAll();o.disconnect()}})},{rootMargin:'900px 0px'}).observe(sec);
      new IntersectionObserver(function(es){es.forEach(function(e){var was=inView;inView=e.isIntersecting;if(inView!==was)loopsOn(inView);if(!inView)cards.forEach(off)})},{threshold:.2}).observe(root.querySelector('.cmb-grid'));
    }else{loadAll();loopsOn(true)}
    document.addEventListener('visibilitychange',function(){loopsOn(!document.hidden&&inView)});
  });
})();
