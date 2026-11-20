/* Commission page: a short run of full-screen panels that snap one swipe at a time.
   Content comes from window.PROJECT; the list of all commissions from window.WORK. */
(function(){
  var P=window.PROJECT,root=document.getElementById('art');if(!P||!root)return;
  document.documentElement.classList.add('ap-snap');
  var ALL=window.WORK||[];
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  var idx=-1;ALL.forEach(function(w,i){if(w.slug===P.slug)idx=i});
  var next=ALL.length>1?ALL[(idx+1)%ALL.length]:null,title=P.title,lbList=[],num=0;
  function n(){num++;return (num<10?'0':'')+num}
  function head(t,hint){return '<header class="ap-h"><p class="art-ch-n">'+n()+'</p><h2 class="art-ch-t">'+esc(t)+'</h2>'+(hint?'<p class="ap-hint">'+esc(hint)+'</p>':'')+'</header>'}
  function paras(a){return (a||[]).map(function(t){return '<p>'+esc(t)+'</p>'}).join('')}
  function fig(ph,cls){if(!ph||!ph.src)return '';lbList.push(ph);return '<figure class="ap-f '+(cls||'')+'" data-lb="'+(lbList.length-1)+'"><img src="'+esc(ph.src)+'" alt="'+esc(ph.alt||title)+'" loading="lazy" decoding="async"'+(ph.pos?' style="object-position:'+esc(ph.pos)+'"':'')+'>'+(ph.caption?'<figcaption>'+esc(ph.caption)+'</figcaption>':'')+'</figure>'}
  var meta=(P.meta||[]).map(function(m){return '<div><dt>'+esc(m[0])+'</dt><dd>'+(m[2]?'<a href="'+esc(m[2])+'" target="_blank" rel="noopener">'+esc(m[1])+'</a>':esc(m[1]))+'</dd></div>'}).join('');
  var h='';
  h+='<section class="ap art-hero'+(P.heroCopy==='top'?' copy-top':'')+'">'+(P.heroMobile?'<picture><source media="(max-width:700px)" srcset="'+esc(P.heroMobile)+'">':'')+'<img src="'+esc(P.hero)+'" alt="'+esc(title)+' by Carrara Design" fetchpriority="high"'+(P.heroPos?' style="object-position:'+esc(P.heroPos)+'"':'')+'>'+(P.heroMobile?'</picture>':'')
    +'<div class="art-hero-copy"><p class="art-kicker">'+esc(P.kicker||'')+(P.year?' · '+esc(P.year):'')+'</p><h1 class="art-title">'+esc(title)+'</h1>'+(P.tagline?'<p class="art-tag">'+esc(P.tagline)+'</p>':'')+'</div></section>';
  h+='<section class="ap ap-brief"><div class="ap-in ap-2"><div class="ap-copy">'+head('The Brief')+'<div class="art-ch-b">'+paras(P.brief)+'</div></div><dl class="ap-meta">'+meta+'</dl></div></section>';
  if(P.compare)h+='<section class="ap ap-cmp"><div class="ap-in">'+head('Render to Reality','Drag to compare')+'<div class="art-cmp" style="--x:50%"><img src="'+esc(P.compare.render)+'" alt="Render" loading="lazy" decoding="async"'+(P.compare.pos?' style="object-position:'+esc(P.compare.pos)+'"':'')+'><div class="art-cmp-top"><img src="'+esc(P.compare.reality)+'" alt="Reality" loading="lazy" decoding="async"'+(P.compare.pos2?' style="object-position:'+esc(P.compare.pos2)+'"':'')+'></div><span class="art-cmp-l">Render</span><span class="art-cmp-r">Reality</span><span class="art-cmp-h" aria-hidden="true"></span><input type="range" min="0" max="100" value="50" aria-label="Drag to compare render and reality"></div></div></section>';
  if(P.decision)h+='<section class="ap ap-dec"><div class="ap-in"><div class="ap-2"><div>'+head(P.decision.title||'The Turning Point')+'</div><div class="art-ch-b">'+paras(P.decision.body)+'</div></div>'+((P.decision.photos||[]).length?'<div class="ap-row n'+P.decision.photos.length+'">'+P.decision.photos.map(function(p){return fig(p)}).join('')+'</div>':'')+'</div></section>';
  if(P.sheet){var g=P.sheet;h+='<section class="ap ap-sheet art-sheet"><div class="ap-in">'+head('The Specification')+'<div class="art-sheet-g">'+Object.keys(g).map(function(k){var rows=g[k];return '<div class="art-sheet-col"><p class="art-sheet-k">'+esc(k)+'</p>'+(typeof rows[0]==='string'?'<ol class="art-wishes">'+rows.map(function(r,i){return '<li><span>'+(i<9?'0':'')+(i+1)+'</span>'+esc(r)+'</li>'}).join('')+'</ol>':'<dl>'+rows.map(function(r){return '<div><dt>'+esc(r[0])+'</dt><dd>'+esc(r[1])+'</dd></div>'}).join('')+'</dl>')+'</div>'}).join('')+'</div></div></section>'}
  if((P.delivered||[]).length)h+='<section class="ap ap-del"><div class="ap-in">'+head(P.deliveredTitle||'Delivered',P.deliveredNote||'')+'<div class="ap-row n'+P.delivered.length+'">'+P.delivered.map(function(p){return fig(p)}).join('')+'</div></div></section>';
  h+='<section class="ap ap-end">'+(next?'<a class="art-next" href="/work/'+esc(next.slug)+'/"><img src="'+esc(next.img)+'" alt="" loading="lazy" decoding="async"><div class="art-next-copy"><p>Next commission</p><strong>'+esc(next.title)+'</strong></div></a>':'')
    +'<div class="ap-end-row"><a class="ap-all" href="/work/">More commissions →</a><div class="art-cta"><h2 class="h3">Have a Car in Mind? Let’s Specify It Together.</h2><a class="btn btn-light" href="/#inquire">Start a commission</a></div></div></section>';
  root.innerHTML=h;
  document.title=title+' — Carrara Design';
  [].forEach.call(root.querySelectorAll('.art-cmp'),function(c){var r=c.querySelector('input');function u(){c.style.setProperty('--x',r.value+'%')}r.addEventListener('input',u);u()});
  /* lightbox */
  if(!lbList.length)return;
  var lb=document.createElement('div');lb.className='art-lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Photo viewer');
  lb.innerHTML='<img alt=""><button class="art-lb-x" aria-label="Close">&times;</button><button class="art-lb-p" aria-label="Previous">&larr;</button><button class="art-lb-n" aria-label="Next">&rarr;</button><p class="art-lb-c"></p>';
  document.body.appendChild(lb);var im=lb.querySelector('img'),cap=lb.querySelector('.art-lb-c'),cur=0,x0=null;
  function show(i){cur=(i+lbList.length)%lbList.length;var p=lbList[cur];im.src=p.src;im.alt=p.alt||title;cap.textContent=(cur+1)+' / '+lbList.length}
  function openLb(i){show(i);lb.classList.add('is-open');document.body.classList.add('lb-open')}
  function close(){lb.classList.remove('is-open');document.body.classList.remove('lb-open')}
  root.addEventListener('click',function(e){var f=e.target.closest('[data-lb]');if(f)openLb(+f.dataset.lb)});
  lb.addEventListener('click',function(e){if(e.target===lb||e.target.closest('.art-lb-x'))close();else if(e.target.closest('.art-lb-p'))show(cur-1);else if(e.target.closest('.art-lb-n'))show(cur+1)});
  document.addEventListener('keydown',function(e){if(!lb.classList.contains('is-open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1)});
  lb.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
  lb.addEventListener('touchend',function(e){if(x0==null)return;var dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>50)show(cur+(dx<0?1:-1))},{passive:true});
})();
/* header: transparent over the hero, solid once you scroll past it */
(function(){var h=document.querySelector('.page-header');if(!h||!document.getElementById('art'))return;function u(){h.classList.toggle('is-solid',scrollY>innerHeight*.75)}u();addEventListener('scroll',u,{passive:true})})();

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
  var P=window.PROJECT||{};
  var seen={},srcs=[];
  function add(s){if(!s)return;var k=s.split('?')[0];if(seen[k])return;seen[k]=1;srcs.push(s)}
  seen[(first.getAttribute('src')||'').split('?')[0]]=1;if(P.heroMobile)seen[P.heroMobile]=1;
  (P.heroSlides||[]).forEach(add);
  if(!P.heroSlides){[].forEach.call(document.querySelectorAll('#art .ap-f img, #art figure img'),function(im){if(im.closest('.ap-cmp'))return;add(im.getAttribute('src'))})}
  srcs=srcs.slice(0,4);if(!srcs.length)return;
  var layer=document.createElement('div');layer.className='hero-ss';layer.setAttribute('aria-hidden','true');
  var slides=srcs.map(function(s,i){var im=document.createElement('img');im.alt='';im.decoding='async';im.dataset.src=s;im.className='ss'+(i%2?' ss-alt':'');layer.appendChild(im);return im});
  (hero.querySelector('picture')||first).insertAdjacentElement('afterend',layer);
  var all=[null].concat(slides),cur=0,timer=0,HOLD=5200;
  function prep(i){var im=all[i];if(im&&!im.src)im.src=im.dataset.src}
  function next(){
    var n=(cur+1)%all.length,im=all[n];prep(n);prep((n+1)%all.length);
    var go=function(){
      slides.forEach(function(s){if(s!==im)s.classList.remove('on')});
      if(im){im.classList.remove('kb');void im.offsetWidth;im.classList.add('on','kb')}
      else{first.classList.remove('kb');void first.offsetWidth;first.classList.add('kb');
        setTimeout(function(){slides.forEach(function(s){s.classList.remove('on')})},0)}
      cur=n;timer=setTimeout(next,HOLD)};
    if(im&&!(im.complete&&im.naturalWidth)){im.onload=go;im.onerror=function(){timer=setTimeout(next,HOLD)}}else go();
  }
  var running=false;
  function start(){if(running)return;running=true;prep(1);timer=setTimeout(next,HOLD)}
  function stop(){running=false;clearTimeout(timer)}
  if('IntersectionObserver' in window)new IntersectionObserver(function(es){es[0].isIntersecting&&!document.hidden?start():stop()},{threshold:.3}).observe(hero);else start();
  document.addEventListener('visibilitychange',function(){document.hidden?stop():start()});
})();
