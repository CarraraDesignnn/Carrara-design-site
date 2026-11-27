/* r2r-v2: homepage "From Render to Reality" showcase, after What a Commission Means.
   GT3 RS: render and reality clips side by side. Huayra BC and GT2 RS: drag-to-compare sliders.
   Clear named tabs plus arrows to switch; auto-rotation stops once someone uses it. */
(function(){
  var PAIRS=[
    {tab:'GT3 RS',name:'James’ Manthey GT3 RS',href:'/work/manthey-gt3-rs/',kind:'films',
     a:{video:'/img/p/manthey/render.mp4',poster:'/img/p/manthey/render-poster.jpg'},
     b:{video:'/img/p/manthey/reality.mp4',poster:'/img/p/manthey/reality-poster.jpg'}},
    {tab:'Huayra BC',name:'Sparky’s Huayra BC',href:'/work/huayra-bc/',kind:'compare',pos:'50% 62%',
     render:'/img/p/huayra/cmp2-render-1400.jpg',real:'/img/p/huayra/cmp2-real-1400.jpg'},
    {tab:'GT2 RS',name:'James’ Chromaflair GT2 RS',href:'/work/urban-bamboo-gt2-rs/',kind:'compare',pos:'50% 50%',
     render:'/img/p/gt2rs/cmp3-render-1400.jpg',real:'/img/p/gt2rs/cmp3-real-1400.jpg'}
  ];
  var HOLD=8000;
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')}
  function film(m,label){return '<figure class="r2r-side"><div class="r2r-frame"><video muted loop playsinline preload="none" poster="'+m.poster+'" data-src="'+m.video+'"></video><span class="r2r-tag">'+label+'</span></div></figure>'}
  function compare(p){
    return '<div class="r2r-cmp" style="--p:50%">'
      +'<img class="r2r-real" src="'+p.real+'" alt="'+esc(p.name)+', delivered" loading="lazy" decoding="async" draggable="false" style="object-position:'+p.pos+'">'
      +'<img class="r2r-render" src="'+p.render+'" alt="'+esc(p.name)+', render" loading="lazy" decoding="async" draggable="false" style="object-position:'+p.pos+'">'
      +'<span class="r2r-line" aria-hidden="true"></span><span class="r2r-knob" aria-hidden="true">‹ ›</span>'
      +'<span class="r2r-tag">Render</span><span class="r2r-tag r">Reality</span>'
      +'<input type="range" min="0" max="100" value="50" step="0.1" aria-label="Drag to compare the render with the delivered car"></div>';
  }
  function start(){
    var anchor=document.getElementById('pricing')||document.getElementById('team');if(!anchor)return false;if(document.getElementById('r2r'))return true;
    var s=document.createElement('section');s.id='r2r';s.className='panel r2r';s.setAttribute('aria-labelledby','r2r-title');
    s.innerHTML='<div class="wrap r2r-in">'
      +'<header class="r2r-head"><h2 id="r2r-title" class="h3">From Render to Reality</h2>'
      +'<p class="body">Every project starts as a render. Here is what we designed, next to the car that was delivered.</p></header>'
      +'<div class="r2r-card">'
        +'<div class="r2r-stage">'+PAIRS.map(function(p,i){return '<div class="r2r-pair r2r-'+p.kind+(i?'':' is-on')+'" aria-hidden="'+(i?'true':'false')+'">'+(p.kind==='films'?film(p.a,'Render')+film(p.b,'Reality'):compare(p))+'</div>'}).join('')+'</div>'
        +'<div class="r2r-nav">'
          +'<button type="button" class="r2r-arrow prev" aria-label="Previous project">←</button>'
          +'<div class="r2r-tabs" role="tablist" aria-label="Projects">'+PAIRS.map(function(p,i){return '<button type="button" role="tab" class="r2r-tab'+(i?'':' is-on')+'" aria-selected="'+(i?'false':'true')+'">'+p.tab+'<i></i></button>'}).join('')+'</div>'
          +'<button type="button" class="r2r-arrow next" aria-label="Next project">→</button>'
        +'</div>'
        +'<a class="r2r-name work-all" href="'+PAIRS[0].href+'">'+PAIRS[0].name+'</a>'
      +'</div></div>';
    anchor.insertAdjacentElement('afterend',s);

    var pairs=[].slice.call(s.querySelectorAll('.r2r-pair')),tabs=[].slice.call(s.querySelectorAll('.r2r-tab')),name=s.querySelector('.r2r-name');
    var cur=0,timer=0,visible=false,auto=true,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    function vids(i){return [].slice.call(pairs[i].querySelectorAll('video'))}
    function play(i){vids(i).forEach(function(v){if(!v.getAttribute('src'))v.src=v.dataset.src;try{v.currentTime=0}catch(e){}var p=v.play();p&&p.catch&&p.catch(function(){})})}
    function stop(i){vids(i).forEach(function(v){try{v.pause()}catch(e){}})}
    /* sliders: drag sets the split; on arrival a short sweep hints that it can be dragged */
    pairs.forEach(function(pr){var c=pr.querySelector('.r2r-cmp');if(!c)return;var r=c.querySelector('input');
      function set(v){c.style.setProperty('--p',v+'%');r.value=v}
      r.addEventListener('input',function(){set(+r.value);userTook()});
      ['pointerdown','touchstart'].forEach(function(t){r.addEventListener(t,function(){c.classList.add('is-drag');userTook()},{passive:true})});
      ['pointerup','touchend','pointercancel'].forEach(function(t){r.addEventListener(t,function(){c.classList.remove('is-drag')},{passive:true})});
      pr._hint=function(){if(reduce){set(50);return}var t0=null,from=78,to=50;c.classList.add('is-hint');
        set(from);requestAnimationFrame(function step(ts){if(!t0)t0=ts;var k=Math.min(1,(ts-t0)/1100),e=1-Math.pow(1-k,3);set(from+(to-from)*e);if(k<1)requestAnimationFrame(step);else c.classList.remove('is-hint')})};
    });
    function show(i,byUser){
      if(byUser)userTook();
      stop(cur);cur=(i+pairs.length)%pairs.length;
      pairs.forEach(function(p,k){p.classList.toggle('is-on',k===cur);p.setAttribute('aria-hidden',k===cur?'false':'true')});
      tabs.forEach(function(t,k){t.classList.toggle('is-on',k===cur);t.setAttribute('aria-selected',k===cur?'true':'false');var f=t.querySelector('i');f.style.animation='none';void f.offsetWidth;f.style.animation=''});
      name.textContent=PAIRS[cur].name;name.href=PAIRS[cur].href;
      if(visible){play(cur);if(pairs[cur]._hint)pairs[cur]._hint()}
      schedule();
    }
    function userTook(){if(!auto)return;auto=false;s.classList.add('is-manual');clearTimeout(timer)}
    function schedule(){clearTimeout(timer);if(auto&&visible&&!reduce)timer=setTimeout(function(){show(cur+1)},HOLD)}
    tabs.forEach(function(t,k){t.addEventListener('click',function(){show(k,true)})});
    s.querySelector('.r2r-arrow.prev').addEventListener('click',function(){show(cur-1,true)});
    s.querySelector('.r2r-arrow.next').addEventListener('click',function(){show(cur+1,true)});
    /* swipe between projects on the clips only (sliders use the drag) */
    var x0=null,y0=null;
    s.querySelector('.r2r-stage').addEventListener('touchstart',function(e){if(e.target.closest('.r2r-cmp')){x0=null;return}var t=e.touches[0];x0=t.clientX;y0=t.clientY},{passive:true});
    s.querySelector('.r2r-stage').addEventListener('touchend',function(e){if(x0==null)return;var t=e.changedTouches[0],dx=t.clientX-x0,dy=t.clientY-y0;x0=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3)show(cur+(dx<0?1:-1),true)},{passive:true});
    if('IntersectionObserver' in window){new IntersectionObserver(function(es){var on=es[0].isIntersecting;if(on===visible)return;visible=on;s.classList.toggle('is-live',on);if(on){play(cur);if(pairs[cur]._hint)pairs[cur]._hint();schedule()}else{stop(cur);clearTimeout(timer)}},{threshold:.35}).observe(s)}
    else{visible=true;play(cur);schedule()}
    document.addEventListener('visibilitychange',function(){if(document.hidden){stop(cur);clearTimeout(timer)}else if(visible){play(cur);schedule()}});
    return true;
  }
  /* insert only after the app has hydrated, or the redraw would remove it */
  function hydrated(){var s=document.getElementById('pricing');return s&&Object.keys(s).some(function(k){return k.indexOf('__react')===0})}
  var n=0;(function poll(){if(hydrated()||n>80){setTimeout(function(){if(!start()){var k=0,t=setInterval(function(){if(start()||++k>40)clearInterval(t)},150)}},200);return}n++;setTimeout(poll,100)})();
})();
