/* r2r-v1: homepage "From Render to Reality" showcase, under Made by Hand.
   One card: the render and the delivered car side by side, rotating through three projects. */
(function(){
  var PAIRS=[
    {name:'James’ Manthey GT3 RS',href:'/work/manthey-gt3-rs/',
     a:{video:'/img/p/manthey/render.mp4',poster:'/img/p/manthey/render-poster.jpg'},
     b:{video:'/img/p/manthey/reality.mp4',poster:'/img/p/manthey/reality-poster.jpg'}},
    {name:'Sparky’s Huayra BC',href:'/work/huayra-bc/',
     a:{img:'/img/p/huayra/cmp2-render-1400.jpg'},b:{img:'/img/p/huayra/cmp2-real-1400.jpg'}},
    {name:'James’ Chromaflair GT2 RS',href:'/work/urban-bamboo-gt2-rs/',
     a:{img:'/img/p/gt2rs/cmp3-render-1400.jpg'},b:{img:'/img/p/gt2rs/cmp3-real-1400.jpg'}}
  ];
  var HOLD=7000;
  function start(){
    var after=document.getElementById('team');if(!after)return false;if(document.getElementById('r2r'))return true;
    var s=document.createElement('section');s.id='r2r';s.className='panel r2r';s.setAttribute('aria-labelledby','r2r-title');
    function side(m,label){
      return '<figure class="r2r-side"><div class="r2r-frame">'+(m.video
        ?'<video muted loop playsinline preload="none" poster="'+m.poster+'" data-src="'+m.video+'"></video>'
        :'<img src="'+m.img+'" alt="'+label+'" loading="lazy" decoding="async" draggable="false">')
        +'<span class="r2r-tag">'+label+'</span></div></figure>';
    }
    s.innerHTML='<div class="wrap r2r-in">'
      +'<header class="r2r-head"><h2 id="r2r-title" class="h3">From Render to Reality</h2>'
      +'<p class="body">Every project starts as a render. Here is what we designed, next to the car that was delivered.</p></header>'
      +'<div class="r2r-card">'
        +'<div class="r2r-stage">'+PAIRS.map(function(p,i){return '<div class="r2r-pair'+(i?'':' is-on')+'" aria-hidden="'+(i?'true':'false')+'">'+side(p.a,'Render')+side(p.b,'Reality')+'</div>'}).join('')+'</div>'
        +'<div class="r2r-foot"><a class="r2r-name work-all" href="'+PAIRS[0].href+'">'+PAIRS[0].name+'</a>'
        +'<div class="r2r-tabs" role="tablist" aria-label="Projects">'+PAIRS.map(function(p,i){return '<button type="button" role="tab" class="r2r-tab'+(i?'':' is-on')+'" aria-selected="'+(i?'false':'true')+'" aria-label="'+p.name+'"><i></i></button>'}).join('')+'</div></div>'
      +'</div></div>';
    after.insertAdjacentElement('afterend',s);

    var pairs=[].slice.call(s.querySelectorAll('.r2r-pair')),tabs=[].slice.call(s.querySelectorAll('.r2r-tab')),name=s.querySelector('.r2r-name');
    var cur=0,timer=0,visible=false,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    function vids(i){return [].slice.call(pairs[i].querySelectorAll('video'))}
    function play(i){vids(i).forEach(function(v){if(!v.getAttribute('src'))v.src=v.dataset.src;try{v.currentTime=0}catch(e){}var p=v.play();p&&p.catch&&p.catch(function(){})})}
    function stop(i){vids(i).forEach(function(v){try{v.pause()}catch(e){}})}
    function show(i){
      stop(cur);cur=(i+pairs.length)%pairs.length;
      pairs.forEach(function(p,k){p.classList.toggle('is-on',k===cur);p.setAttribute('aria-hidden',k===cur?'false':'true')});
      tabs.forEach(function(t,k){t.classList.toggle('is-on',k===cur);t.setAttribute('aria-selected',k===cur?'true':'false');var f=t.querySelector('i');f.style.animation='none';void f.offsetWidth;f.style.animation=''});
      name.textContent=PAIRS[cur].name;name.href=PAIRS[cur].href;
      if(visible)play(cur);schedule();
    }
    function schedule(){clearTimeout(timer);if(visible&&!reduce)timer=setTimeout(function(){show(cur+1)},HOLD)}
    tabs.forEach(function(t,k){t.addEventListener('click',function(){show(k)})});
    var x0=null,y0=null,stage=s.querySelector('.r2r-stage');
    stage.addEventListener('touchstart',function(e){var t=e.touches[0];x0=t.clientX;y0=t.clientY},{passive:true});
    stage.addEventListener('touchend',function(e){if(x0==null)return;var t=e.changedTouches[0],dx=t.clientX-x0,dy=t.clientY-y0;x0=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3)show(cur+(dx<0?1:-1))},{passive:true});
    if('IntersectionObserver' in window){new IntersectionObserver(function(es){var on=es[0].isIntersecting;if(on===visible)return;visible=on;s.classList.toggle('is-live',on);if(on){play(cur);schedule()}else{stop(cur);clearTimeout(timer)}},{threshold:.35}).observe(s)}
    else{visible=true;play(cur);schedule()}
    document.addEventListener('visibilitychange',function(){if(document.hidden){stop(cur);clearTimeout(timer)}else if(visible){play(cur);schedule()}});
    return true;
  }
  if(!start()){var n=0,t=setInterval(function(){if(start()||++n>60)clearInterval(t)},150)}
})();
