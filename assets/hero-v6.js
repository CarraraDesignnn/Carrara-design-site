/* Home cover slideshow: render → reality pairs and reels, with a headline per slide. */
(function(){
  var SLIDES=[
    {type:'reel',src:'/img/reel-serafino.mp4',hd:'/img/reel-serafino-hd.mp4',poster:'/img/reel-serafino.jpg',blur:'/img/reel-serafino-blur.jpg',ratio:'9/16',title:'From Render to Reality',label:'The GT3 RS',href:'/work/manthey-gt3-rs/'},
    {type:'reel',src:'/img/reel-studio.mp4',poster:'/img/reel-studio.jpg',blur:'/img/reel-studio-blur.jpg',ratio:'2/3',title:'Inside the Studio',label:'The Studio'}
  ];

  var IMG_MS=5000,REEL_MAX=7000,FALLBACK_MS=7000;
  var hero=document.querySelector('.hero-v3');if(!hero)return;
  var media=hero.querySelector('.hero-media'),shade=hero.querySelector('.hero-shade'),content=hero.querySelector('.hero-content'),title=hero.querySelector('.hero-title');
  if(!media||!content||!title)return;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,mobile=matchMedia('(max-width: 700px)');

  function hydrated(){return Object.keys(hero).some(function(k){return k.indexOf('__reactFiber')===0||k.indexOf('__reactProps')===0})}
  function whenReady(fn){var t=0;(function poll(){if(hydrated()||t>60)return setTimeout(fn,150);t++;setTimeout(poll,100)})()}

  whenReady(function(){
    var layer=document.createElement('div');layer.className='hs';layer.setAttribute('aria-hidden','true');
    media.insertBefore(layer,shade||null);
    var els=SLIDES.map(function(s,i){
      var el=document.createElement('div');el.className='hs-slide hs-'+s.type;
      if(s.type==='reel'){
        el.innerHTML='<div class="hs-bg" style="background-image:url('+s.blur+')"></div><div class="hs-frame" style="aspect-ratio:'+s.ratio+'"><video muted playsinline preload="none" poster="'+s.poster+'"></video></div>';
      }else if(s.type==='photo'||s.type==='studio'){
        el.innerHTML='<img alt="" decoding="async"'+(s.pos?' style="object-position:'+s.pos+'"':'')+'>';
      }
      layer.appendChild(el);return el;
    });
    var scrim=document.createElement('div');scrim.className='hs-scrim';layer.appendChild(scrim);

    var ui=document.createElement('div');ui.className='hs-ui';
    ui.innerHTML='<div class="hs-tabs" role="tablist" aria-label="Cover">'+SLIDES.map(function(x){return '<button type="button" class="hs-seg" role="tab">'+x.label+'<i></i></button>'}).join('')+'</div><a class="hs-cap" href="#"></a>';
    content.appendChild(ui);
    var cap=ui.querySelector('.hs-cap'),segs=[].slice.call(ui.querySelectorAll('.hs-seg'));

    var cur=0,timer=null,visible=true,started=Date.now(),remaining=0,dur=IMG_MS;

    function load(i){
      var s=SLIDES[i],el=els[i];if(!s||el._loaded)return;el._loaded=true;
      if(s.type==='reel'){var v=el.querySelector('video');v.src=(!mobile.matches&&s.hd)?s.hd:s.src;v.preload='auto';v.addEventListener('ended',function(){if(cur===i)next()})}
      else if(s.type!=='base'){el.querySelector('img').src=(mobile.matches&&s.mobile)?s.mobile:s.src}
    }
    function setTitle(t){
      if(title.textContent===t)return;
      title.classList.add('hs-out');
      setTimeout(function(){title.textContent=t;title.classList.remove('hs-out')},180);
    }
    function schedule(ms){clearTimeout(timer);dur=ms;started=Date.now();remaining=ms;if(!reduce&&visible)timer=setTimeout(next,ms);
      var seg=segs[cur].querySelector('i');seg.style.animation='none';void seg.offsetWidth;seg.style.animation='hsfill '+ms+'ms linear forwards';seg.style.animationPlayState=(visible&&!reduce)?'running':'paused'}
    function show(i){
      var prev=cur;cur=(i+SLIDES.length)%SLIDES.length;var s=SLIDES[cur];
      load(cur);var nx=(cur+1)%SLIDES.length;setTimeout(function(){load(nx)},2500);
      var target=cur,shown=false;
      function reveal(){if(shown||cur!==target)return;shown=true;els.forEach(function(el,k){el.classList.toggle('is-on',k===target)})}
      var nv=s.type==='reel'&&els[cur].querySelector('video');
      /* keep what's on screen (the still poster on first load) until the video has a real frame: no black flash */
      if(nv&&nv.readyState<3){var ok=function(){nv.removeEventListener('playing',ok);if(nv.requestVideoFrameCallback)nv.requestVideoFrameCallback(function(){reveal()});else setTimeout(reveal,80)};nv.addEventListener('playing',ok);setTimeout(reveal,3000)}
      else reveal();
      if(prev!==cur){var pv=els[prev].querySelector('video');if(pv){pv.pause()}}
      hero.setAttribute('data-tone',s.tone||'dark');hero.setAttribute('data-slide',s.type);
      segs.forEach(function(b,k){b.classList.toggle('is-done',k<cur);b.classList.toggle('is-on',k===cur);b.setAttribute('aria-selected',k===cur);if(k!==cur){var f=b.querySelector('i');f.style.animation='none'}});
      setTitle(s.title);
      if(s.cap){cap.textContent=s.cap;cap.classList.add('is-on');if(s.href){cap.setAttribute('href',s.href);cap.classList.add('is-link');cap.removeAttribute('tabindex')}else{cap.removeAttribute('href');cap.classList.remove('is-link')}}else{cap.classList.remove('is-on')}
      if(s.type==='reel'){
        var v=els[cur].querySelector('video');try{v.currentTime=0}catch(e){}
        var ms=Math.min(REEL_MAX,((v.duration&&isFinite(v.duration))?v.duration*1000:FALLBACK_MS));
        if(visible&&!reduce){var p=v.play();if(p&&p.catch)p.catch(function(){})}
        schedule(ms);
        if(!(v.duration>0))v.addEventListener('loadedmetadata',function once(){v.removeEventListener('loadedmetadata',once);if(cur===SLIDES.indexOf(s))schedule(Math.min(REEL_MAX,v.duration*1000))});
      }else schedule(IMG_MS);
    }
    function next(){show(cur+1)}
    function prev(){show(cur-1)}
    function pause(){if(!visible)return;visible=false;clearTimeout(timer);remaining=Math.max(500,dur-(Date.now()-started));var v=els[cur].querySelector('video');if(v)v.pause();var f=segs[cur].querySelector('i');f.style.animationPlayState='paused'}
    function resume(){if(visible)return;visible=true;if(reduce)return;started=Date.now()-(dur-remaining);timer=setTimeout(next,remaining);var v=els[cur].querySelector('video');if(v){var p=v.play();if(p&&p.catch)p.catch(function(){})}var f=segs[cur].querySelector('i');f.style.animationPlayState='running'}

    segs.forEach(function(b,k){b.addEventListener('click',function(e){e.preventDefault();show(k)})});
    var x0=null,y0=null;
    hero.addEventListener('touchstart',function(e){var t=e.touches[0];x0=t.clientX;y0=t.clientY},{passive:true});
    hero.addEventListener('touchend',function(e){if(x0==null)return;var t=e.changedTouches[0],dx=t.clientX-x0,dy=t.clientY-y0;x0=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.4){dx<0?next():prev()}},{passive:true});
    if('IntersectionObserver' in window)new IntersectionObserver(function(es){es.forEach(function(en){en.isIntersecting&&en.intersectionRatio>.35?resume():pause()})},{threshold:[0,.35,.6]}).observe(hero);
    document.addEventListener('visibilitychange',function(){document.hidden?pause():resume()});
    hero.classList.add('hs-ready');
    show(0);
  });
})();
