/* Commission + archive pages: open on the hero photo, and run the hero as a slow-zoom crossfading slideshow. */
/* Open on the hero photo every time (iPhone Safari could land on the brief), unless the URL has a #section
   or the visitor came back with the Back button. */
(function(){
  if(location.hash)return;
  var nav=(performance.getEntriesByType&&performance.getEntriesByType('navigation')[0])||{};
  if(nav.type==='back_forward')return;
  var touched=false;['touchstart','wheel','keydown','mousedown'].forEach(function(t){addEventListener(t,function(){touched=true},{once:true,passive:true})});
  function top(){if(!touched&&scrollY>0){var r=document.documentElement;r.classList.add('js-gliding');scrollTo(0,0);setTimeout(function(){r.classList.remove('js-gliding')},60)}}
  top();setTimeout(top,120);setTimeout(top,450);addEventListener('load',function(){top();setTimeout(top,250)});
})();

/* Hero slideshow: slow zoom on each photo, crossfading to the next photos from the page's gallery. */
(function(){
  var hero=document.querySelector('.art-hero');if(!hero)return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var first=hero.querySelector('img');if(!first)return;
  var P=window.PROJECT||{};if(!window.PROJECT&&window.ARCHIVE){var sl=(document.getElementById('arc')||{}).getAttribute&&document.getElementById('arc').getAttribute('data-slug');P=window.ARCHIVE.filter(function(x){return x.slug===sl})[0]||{}}
  var seen={},srcs=[];
  function add(s){if(!s)return;var k=s.split('?')[0];if(seen[k])return;seen[k]=1;srcs.push(s)}
  seen[(first.getAttribute('src')||'').split('?')[0]]=1;if(P.heroMobile)seen[P.heroMobile]=1;
  (P.heroSlides||[]).forEach(add);
  if(!P.heroSlides){[].forEach.call(document.querySelectorAll('#art .ap-f img, #art figure img, #arc .arc-cmp-f img, #arc .arc-f img'),function(im){if(im.closest('.ap-cmp'))return;add(im.getAttribute('src'))})}
  function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
  srcs=shuffle(srcs).slice(0,6);if(!srcs.length)return;
  var layer=document.createElement('div');layer.className='hero-ss';layer.setAttribute('aria-hidden','true');
  var slides=srcs.map(function(s,i){var im=document.createElement('img');im.alt='';im.decoding='async';im.dataset.src=s;im.className='ss'+(i%2?' ss-alt':'');layer.appendChild(im);return im});
  (hero.querySelector('picture')||first).insertAdjacentElement('afterend',layer);
  var all=[null].concat(slides),cur=0,timer=0,HOLD=2600,queue=[];
  /* cover first, then the rest in random order; reshuffle each round, never the same photo twice in a row */
  function pick(){if(!queue.length){queue=shuffle(all.map(function(_,i){return i}));if(queue[0]===cur)queue.push(queue.shift())}return queue.shift()}
  function prep(i){var im=all[i];if(im&&!im.src)im.src=im.dataset.src}
  function next(){
    var n=pick(),im=all[n];prep(n);if(queue.length)prep(queue[0]);
    var go=function(){
      slides.forEach(function(s){if(s!==im)s.classList.remove('on')});
      if(im){im.classList.remove('kb');void im.offsetWidth;im.classList.add('on','kb')}
      else{first.classList.remove('kb');void first.offsetWidth;first.classList.add('kb');
        setTimeout(function(){slides.forEach(function(s){s.classList.remove('on')})},0)}
      cur=n;timer=setTimeout(next,HOLD)};
    if(im&&!(im.complete&&im.naturalWidth)){im.onload=go;im.onerror=function(){timer=setTimeout(next,HOLD)}}else go();
  }
  var running=false;
  queue=shuffle(slides.map(function(_,i){return i+1}));
  function start(){if(running)return;running=true;prep(queue[0]);timer=setTimeout(next,HOLD)}
  function stop(){running=false;clearTimeout(timer)}
  if('IntersectionObserver' in window)new IntersectionObserver(function(es){es[0].isIntersecting&&!document.hidden?start():stop()},{threshold:.3}).observe(hero);else start();
  document.addEventListener('visibilitychange',function(){document.hidden?stop():start()});
})();

/* archive pages: header transparent over the hero photo, solid once you scroll past it */
(function(){var h=document.querySelector('.page-header');if(!h||!document.querySelector('#arc .art-hero'))return;function u(){h.classList.toggle('is-solid',scrollY>innerHeight*.75)}u();addEventListener('scroll',u,{passive:true})})();
