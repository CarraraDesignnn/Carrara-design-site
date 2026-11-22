/* Home: "What a Commission Means", rebuilt as four stage cards (each a small slideshow of renders and films)
   and a "why it matters" screen. Replaces the old steps content inside #pricing once the page has hydrated. */
(function(){
  var IMG='/img/commission/';
  function im(n){return {type:'img',src:IMG+n+'-600.jpg',hd:IMG+n+'-1050.jpg'}}
  function vd(n){return {type:'video',src:IMG+n+'.mp4',poster:IMG+n+'.jpg'}}
  var STAGES=[
    {n:'01',name:'The Consultation',
     copy:'We start with your vision: the themes, the references, how you’ll use the car. We go through the materials actually available on your model, and the common mistakes and factory limits to plan around.',
     slides:[im('c1-stitch'),im('c1-seat'),im('c1-tartan')]},
    {n:'02',name:'Your Car in 3D',
     copy:'We build your car in precise detail in 3D CGI, whether it’s a new spec or a recommission. Every panel, stitch and finish, rendered to the standard OEM design teams keep for themselves.',
     slides:[vd('c2-clay'),im('c2-studio'),vd('c2-screen'),im('c2-gt3')]},
    {n:'03',name:'Live Design Sessions',
     copy:'Explore your car with us in real time. Try paint, leather splits, stitching and creative directions, then see each one in studio light or out in the world, until every detail is right.',
     slides:[vd('c3-film'),im('c3-jesko'),im('c3-ice'),im('c3-forest'),im('c3-london')]},
    {n:'04',name:'Factory to Delivery',
     copy:'You walk into your dealer or factory meeting with a finished, beautifully presented spec. We work alongside you around every meeting through to delivery, so the car is built to your vision with no mistakes.',
     slides:[im('c4-manthey'),vd('c4-delivery'),im('c4-sill')]}
  ];
  var WHY=[
    ['Investment protection','Costly spec mistakes are caught on screen, not on the car. A considered spec is the kind that sets trends and holds its value.'],
    ['Faster turnaround','Decisions are made together in live sessions, not over weeks of emails and back-and-forth with the dealer.'],
    ['OEM-level renders','Studio and real-world renders at the level manufacturers reserve for their own design teams.'],
    ['Private, not a sales rep','You work directly with Anthony and Tanner, start to finish, in strict confidence.']
  ];
  var STATS=[['600+','Happy customers'],['10+','Years of experience'],['1,500+','Specifications crafted'],['75+','Models specified']];
  var IMG_MS=3200,VID_MAX=9000;

  var sec=document.getElementById('pricing');if(!sec)return;
  function hydrated(){var r=document.getElementById('root');return !r||Object.keys(sec).some(function(k){return k.indexOf('__react')===0})}
  function whenReady(fn){var t=0;(function poll(){if(hydrated()||t>60)return setTimeout(fn,120);t++;setTimeout(poll,100)})()}

  function slideHTML(s){
    if(s.type==='video')return '<div class="cm-slide is-video"><video muted playsinline preload="none" poster="'+s.poster+'" data-src="'+s.src+'" disablepictureinpicture></video></div>';
    return '<div class="cm-slide"><img alt="" decoding="async" data-src="'+s.src+'" data-srcset="'+s.src+' 600w, '+s.hd+' 1050w" sizes="(max-width:700px) 74vw, 24vw"></div>';
  }
  function build(){
    var h='<div class="cm">'+
      '<div class="cm-scene cm-a"><div class="cm-head">'+
        '<div><p class="eyebrow">The commission</p>'+
        '<h2 id="cm-title" class="h3">What a Commission Means</h2></div>'+
        '<p class="cm-lead">Private hire of OEM-level design. Instead of choosing options with a sales rep, you work directly with designers who build your car in 3D and get every detail right before it goes to the factory.</p>'+
      '</div><ol class="cm-rail">'+
      STAGES.map(function(s,i){return '<li class="cm-card" data-i="'+i+'"><button type="button" class="cm-media" aria-label="'+s.name+': next image">'+
        s.slides.map(slideHTML).join('')+
        '<span class="cm-over"><span class="cm-num">'+s.n+'</span><span class="cm-name">'+s.name+'</span></span>'+
        '<span class="cm-bars">'+s.slides.map(function(){return '<i><b></b></i>'}).join('')+'</span>'+
        '</button><p class="cm-copy">'+s.copy+'</p></li>'}).join('')+
      '</ol></div>'+
      '<div class="cm-scene cm-b"><div class="cm-bg" aria-hidden="true"><picture><source media="(max-width:700px)" data-srcset="'+IMG+'why-900.jpg"><img alt="" decoding="async" data-src="'+IMG+'why-2400.jpg"></picture></div>'+
        '<div class="cm-b-in"><p class="eyebrow">Why it matters</p><h2 class="h3">Your Investment, Protected</h2>'+
        '<ul class="cm-why">'+WHY.map(function(w){return '<li><h3>'+w[0]+'</h3><p>'+w[1]+'</p></li>'}).join('')+'</ul>'+
        '<ul class="cm-stats">'+STATS.map(function(s){return '<li><strong>'+s[0]+'</strong><span>'+s[1]+'</span></li>'}).join('')+'</ul>'+
        '<div class="cm-cta"><a href="#inquire" class="cm-btn">Send us your spec</a><p>Consultations from 500 USD</p></div>'+
      '</div></div>'+
    '</div>';
    sec.insertAdjacentHTML('beforeend',h);
    sec.classList.add('cm-ready');sec.setAttribute('aria-labelledby','cm-title');
    return sec.querySelector('.cm');
  }

  whenReady(function(){
    if(sec.querySelector('.cm'))return;
    var root=build();
    var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    var loaded=false;
    function loadAll(){
      if(loaded)return;loaded=true;
      [].forEach.call(root.querySelectorAll('img[data-src]'),function(im){if(im.dataset.srcset){im.srcset=im.dataset.srcset}im.src=im.dataset.src});
      [].forEach.call(root.querySelectorAll('source[data-srcset]'),function(s){s.srcset=s.dataset.srcset});
    }
    if('IntersectionObserver' in window)new IntersectionObserver(function(es,o){es.forEach(function(e){if(e.isIntersecting){loadAll();o.disconnect()}})},{rootMargin:'900px 0px'}).observe(sec);
    else loadAll();

    [].forEach.call(root.querySelectorAll('.cm-card'),function(card,ci){
      var slides=[].slice.call(card.querySelectorAll('.cm-slide')),bars=[].slice.call(card.querySelectorAll('.cm-bars i')),cur=-1,timer=null,inView=false,started=false;
      function fill(k,ms){bars.forEach(function(b,j){var f=b.firstChild;f.style.transition='none';f.style.transform='scaleX('+(j<k?1:0)+')'});
        var f=bars[k].firstChild;void f.offsetWidth;f.style.transition='transform '+ms+'ms linear';f.style.transform='scaleX(1)'}
      function go(k){
        clearTimeout(timer);
        var prev=slides[cur];if(prev){var pv=prev.querySelector('video');if(pv)pv.pause()}
        cur=(k+slides.length)%slides.length;
        var el=slides[cur];slides.forEach(function(s,j){s.classList.toggle('is-on',j===cur)});
        var v=el.querySelector('video');
        if(v){
          if(!v.src)v.src=v.dataset.src;
          try{v.currentTime=0}catch(e){}
          var p=v.play();if(p&&p.catch)p.catch(function(){});
          var ms=(v.duration&&isFinite(v.duration))?Math.min(VID_MAX,v.duration*1000):6000;
          fill(cur,ms);if(!reduce)timer=setTimeout(function(){go(cur+1)},ms);
          if(!(v.duration>0))v.addEventListener('loadedmetadata',function once(){v.removeEventListener('loadedmetadata',once);if(slides[cur]===el){clearTimeout(timer);var m=Math.min(VID_MAX,v.duration*1000);fill(cur,m);if(!reduce)timer=setTimeout(function(){go(cur+1)},m)}});
        }else{fill(cur,IMG_MS);if(!reduce)timer=setTimeout(function(){go(cur+1)},IMG_MS)}
        var nx=slides[(cur+1)%slides.length].querySelector('video');if(nx&&!nx.src&&inView){nx.src=nx.dataset.src;nx.preload='auto'}
      }
      function stop(){clearTimeout(timer);var v=slides[cur]&&slides[cur].querySelector('video');if(v)v.pause();bars.forEach(function(b){b.firstChild.style.transition='none'})}
      card.querySelector('.cm-media').addEventListener('click',function(){go(cur+1)});
      slides[0].classList.add('is-on');cur=0;
      if('IntersectionObserver' in window)new IntersectionObserver(function(es){es.forEach(function(e){
        inView=e.isIntersecting&&e.intersectionRatio>.45;
        if(inView){if(!started){started=true;setTimeout(function(){if(inView)go(0)},ci*700)}else go(cur)}else if(started)stop();
      })},{threshold:[0,.45,.7]}).observe(card);
    });
    document.addEventListener('visibilitychange',function(){if(document.hidden)[].forEach.call(root.querySelectorAll('video'),function(v){v.pause()})});
  });
})();
