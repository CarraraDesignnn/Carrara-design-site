/* Scroll-scrubbed frame sequences: <section class="scrub" data-src="/anim/x/" data-frames="105" data-ext="webp"> */
(function(){
  var cache={},secs=[].slice.call(document.querySelectorAll('.scrub'));if(!secs.length)return;
  var root=document.documentElement,ticking=false,FRAME=1000/24,lastDraw=0,pending=false,dpr=Math.min(window.devicePixelRatio||1,2);
  function pad(n){return ('000'+n).slice(-3)}
  function seq(s){
    var key=s.dataset.src;if(cache[key])return cache[key];
    var n=+s.dataset.frames,imgs=new Array(n),c={imgs:imgs,n:n,started:false};
    c.start=function(){if(c.started)return;c.started=true;
      var order=[],step=8;for(var k=step;k>=1;k=Math.floor(k/2)){for(var i=0;i<n;i+=k)if(order.indexOf(i)<0)order.push(i);if(k===1)break}
      order.forEach(function(i){var im=new Image();im.decoding='async';im.onload=function(){im._ok=true;req()};im.src=key+pad(i+1)+'.'+(s.dataset.ext||'webp');imgs[i]=im})};
    return cache[key]=c}
  secs.forEach(function(s){s._seq=seq(s);s._cv=s.querySelector('canvas');s._ctx=s._cv.getContext('2d')});
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){e.isIntersecting&&e.target._seq.start()})},{rootMargin:'150% 0px'});secs.forEach(function(s){io.observe(s)})}else secs.forEach(function(s){s._seq.start()});
  function nearest(c,i){for(var d=0;d<c.n;d++){var a=c.imgs[i-d],b=c.imgs[i+d];if(a&&a._ok)return a;if(b&&b._ok)return b}return null}
  function size(s){var cv=s._cv,w=Math.round(cv.clientWidth*dpr),h=Math.round(cv.clientHeight*dpr);if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h;s._last=null}}
  function draw(s,p){
    var c=s._seq,i=Math.round(p*(c.n-1)),im=nearest(c,i);if(!im||s._last===im)return;s._last=im;
    var cv=s._cv,ctx=s._ctx,W=cv.width,H=cv.height,r=im.naturalWidth/im.naturalHeight,wide=W/H>1,sc=wide?Math.min(W/im.naturalWidth,H/im.naturalHeight):Math.max(W/im.naturalWidth,H/im.naturalHeight);
    var w=im.naturalWidth*sc,h=im.naturalHeight*sc;ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);ctx.drawImage(im,(W-w)/2,(H-h)/2,w,h)}
  function update(){ticking=false;var vh=window.innerHeight;
    secs.forEach(function(s){var r=s.getBoundingClientRect();if(r.bottom<-vh||r.top>2*vh)return;size(s);
      var total=s.offsetHeight-vh,p=Math.min(1,Math.max(0,-r.top/total));
      var o=Math.max(0,Math.min(1,(p-.08)/.14,(.92-p)/.14));s.style.setProperty('--p',p.toFixed(4));s.style.setProperty('--o',o.toFixed(3));s._p=p});
    /* draw at most 24 times a second; fast scrolls jump straight to the current frame instead of stepping through every one */
    var now=performance.now();if(now-lastDraw>=FRAME){lastDraw=now;secs.forEach(function(s){s._p!=null&&draw(s,s._p)})}else if(!pending){pending=true;setTimeout(function(){pending=false;req()},FRAME-(now-lastDraw)+1)}
    var top=secs[0].getBoundingClientRect().top;root.classList.toggle('in-scrub',top<=2)}
  function req(){if(!ticking){ticking=true;requestAnimationFrame(update)}}
  window.addEventListener('scroll',req,{passive:true});window.addEventListener('resize',function(){secs.forEach(function(s){s._last=null});req()});req();
})();
/* Pinned "three things" section: items fade in one after another as you scroll */
(function(){
  var sec=document.getElementById('pricing');if(!sec)return;
  var root=document.documentElement,items=[].slice.call(sec.querySelectorAll('.step')),price=sec.querySelector('.steps-price'),head=[].slice.call(sec.querySelectorAll('.eyebrow,.steps-head')),tick=false;
  var all=items.concat([price]);
  function upd(){tick=false;var vh=window.innerHeight,r=sec.getBoundingClientRect(),total=sec.offsetHeight-vh,p=Math.min(1,Math.max(0,-r.top/total)),s=p*all.length*1.08;
    root.classList.toggle('in-steps',r.top<=2&&r.bottom>=vh-2);
    var hp=Math.min(1,Math.max(0,(vh-r.top)/(vh*.6)));head.forEach(function(h){h.style.opacity=hp;h.style.transform='translateY('+((1-hp)*18)+'px)'});
    all.forEach(function(el,k){var rise=Math.min(1,Math.max(0,(s-k-.15)/.45)),o=rise;
      if(k<items.length&&s<items.length+.2){var after=s-k-1.15;if(after>0)o=Math.max(.38,1-after*1.6)*rise}
      el.style.opacity=o.toFixed(3);el.style.transform='translateY('+((1-rise)*26).toFixed(1)+'px)'})}
  function req(){if(!tick){tick=true;requestAnimationFrame(upd)}}
  window.addEventListener('scroll',req,{passive:true});window.addEventListener('resize',req);req();
})();
