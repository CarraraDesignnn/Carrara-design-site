/* Project pages, v1. Renders window.PJ into #pj. */
(function(){
  var P=window.PJ,root=document.getElementById('pj');if(!P||!root)return;document.body.classList.add('has-pj');
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function img(src,alt,cls,lazy){var w=src.replace(/-(\d+)\.jpg$/,'');var big=src;return '<img'+(cls?' class="'+cls+'"':'')+' src="'+esc(big)+'" alt="'+esc(alt||P.title)+'" decoding="async"'+(lazy===false?'':' loading="lazy"')+' draggable="false">'}
  var h='';
  /* hero */
  h+='<section class="pj-hero"><picture>'+(P.hero.mob?'<source media="(max-width:700px)" srcset="'+esc(P.hero.mob)+'">':'')+'<img src="'+esc(P.hero.desk)+'" alt="'+esc(P.title)+' by Carrara Design" fetchpriority="high" draggable="false"'+(P.hero.pos?' style="object-position:'+esc(P.hero.pos)+'"':'')+'></picture>'
    +'<div class="pj-hero-copy"><p class="pj-eyebrow">'+esc(P.kicker)+'</p><h1>'+esc(P.title)+'</h1>'+(P.tagline?'<p class="pj-hero-tag">'+esc(P.tagline)+'</p>':'')+'</div></section>';
  /* intro + facts */
  if(P.lead)h+='<section class="pj-intro"><p class="pj-lead">'+esc(P.lead)+'</p></section>';
  if(P.facts)h+='<section class="pj-facts"><dl>'+P.facts.map(function(f){return '<div><dt>'+esc(f[0])+'</dt><dd>'+(f[2]?'<a href="'+esc(f[2])+'" target="_blank" rel="noopener">'+esc(f[1])+'</a>':esc(f[1]))+'</dd></div>'}).join('')+'</dl></section>';
  /* blocks */
  (P.blocks||[]).forEach(function(b){
    if(b.type==='text')h+='<section class="pj-text">'+(b.eyebrow?'<p class="pj-eyebrow">'+esc(b.eyebrow)+'</p>':'')+(b.title?'<h2 class="pj-h2">'+esc(b.title)+'</h2>':'')+b.body.map(function(p){return '<p>'+esc(p)+'</p>'}).join('')+'</section>';
    else if(b.type==='full')h+='<figure class="pj-media pj-full">'+img(b.src,b.alt)+'</figure>';
    else if(b.type==='wide')h+='<figure class="pj-media">'+img(b.src,b.alt)+(b.caption?'<figcaption class="pj-cap">'+esc(b.caption)+'</figcaption>':'')+'</figure>';
    else if(b.type==='pair')h+='<div class="pj-media pj-pair">'+img(b.a,b.altA)+img(b.b,b.altB)+'</div>';
    else if(b.type==='compare')h+='<figure class="pj-media pj-cmp-wrap'+(b.wide?' is-wide':'')+'"><div class="pj-cmp">'+img(b.real,P.title+', delivered')+img(b.render,P.title+', render','pj-cmp-top')
      +'<span class="pj-cmp-line"></span><span class="pj-cmp-knob" aria-hidden="true">‹ ›</span><span class="pj-cmp-tag l">Render</span><span class="pj-cmp-tag r">Reality</span>'
      +'<input type="range" min="0" max="100" value="50" aria-label="Drag to compare the render with the delivered car"></div>'+(b.caption?'<figcaption class="pj-cap">'+esc(b.caption)+'</figcaption>':'')+'</figure>';
    else if(b.type==='films')h+='<div class="pj-media pj-films">'+b.items.map(function(f){if(f.link)return '<figure><a class="pj-film-link" href="'+esc(f.link)+'" target="_blank" rel="noopener" aria-label="'+esc(f.label)+' — watch the video"><img src="'+esc(f.poster)+'" alt="" loading="lazy" draggable="false"><span class="pj-play" aria-hidden="true"></span>'+(f.cta?'<span class="pj-film-cta">'+esc(f.cta)+'</span>':'')+'</a><figcaption>'+esc(f.label)+'</figcaption></figure>';return '<figure><video src="'+esc(f.src)+'" poster="'+esc(f.poster)+'" muted loop playsinline preload="metadata" disablepictureinpicture controlslist="nodownload noplaybackrate"></video><figcaption>'+esc(f.label)+'</figcaption></figure>'}).join('')+'</div>';
    else if(b.type==='spec')h+='<section class="pj-spec">'+(b.title?'<h2 class="pj-h2">'+esc(b.title)+'</h2>':'')+'<dl>'+b.rows.map(function(r){return '<div><dt>'+esc(r[0])+'</dt><dd>'+esc(r[1])+'</dd></div>'}).join('')+'</dl></section>';
    else if(b.type==='strip')h+='<section class="pj-strip'+(b.cards?' pj-cards':'')+'"><div class="pj-strip-head"><div>'+(b.eyebrow?'<p class="pj-eyebrow">'+esc(b.eyebrow)+'</p>':'')+'<h2 class="pj-h2">'+esc(b.title)+'</h2></div><div class="pj-strip-nav"><button type="button" class="pv" aria-label="Previous photo">←</button><button type="button" class="nx" aria-label="Next photo">→</button></div></div>'
      +'<div class="pj-track">'+b.photos.map(function(s){return typeof s==='string'?'<figure>'+img(s)+'</figure>':'<figure>'+img(s.src)+'<figcaption><strong>'+esc(s.label)+'</strong>'+(s.note?'<span>'+esc(s.note)+'</span>':'')+'</figcaption></figure>'}).join('')+'</div></section>';
    else if(b.type==='close')h+='<section class="pj-close"><p>'+esc(b.text)+'</p>'+(b.credits?'<p class="pj-credits">'+esc(b.credits)+'</p>':'')+'</section>';
  });
  /* next project + CTA */
  var W=(window.WORK||[]).filter(function(w){return w.slug}),i=W.map(function(w){return w.slug}).indexOf(P.slug),next=W.length?W[(i+1)%W.length]:null;
  if(next&&next.slug!==P.slug)h+='<a class="pj-next" href="/work/'+esc(next.slug)+'/"><span class="pj-next-in">'+(next.img?'<img src="'+esc(next.img.replace(/-800\.jpg$/,'-1400.jpg'))+'" alt="" loading="lazy" draggable="false">':'')+'<span class="pj-next-copy"><span>Next project</span><strong>'+esc(next.title)+'</strong></span></span></a>';
  h+='<section class="pj-cta"><h2 class="h3">Have a car in mind? Let’s specify it together.</h2><a class="btn btn-light" href="/#inquire">Start a commission</a></section>';
  root.innerHTML=h;
  document.title=P.title+' — Carrara Design';

  /* no save menus on photos (a deterrent, not a lock) */
  root.addEventListener('contextmenu',function(e){if(e.target.closest('img,video'))e.preventDefault()});
  root.addEventListener('dragstart',function(e){if(e.target.closest('img'))e.preventDefault()});

  /* render/reality slider */
  [].forEach.call(root.querySelectorAll('.pj-cmp'),function(c){
    var inp=c.querySelector('input');function set(v){c.style.setProperty('--p',v+'%')}
    inp.addEventListener('input',function(){set(inp.value)});
    var drag=false;
    function at(e){var r=c.getBoundingClientRect();var v=Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100));inp.value=v;set(v)}
    c.addEventListener('pointerdown',function(e){drag=true;at(e)});
    addEventListener('pointermove',function(e){if(drag)at(e)});
    addEventListener('pointerup',function(){drag=false});
    /* a small hint the first time it scrolls into view */
    if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
      var done=false;new IntersectionObserver(function(es){if(done||!es[0].isIntersecting)return;done=true;var t0=null;
        (function step(ts){if(t0==null)t0=ts;var k=Math.min(1,(ts-t0)/1400),v=50+Math.sin(k*Math.PI*2)*14;set(v);inp.value=v;if(k<1)requestAnimationFrame(step);else set(50)})(performance.now())},{threshold:.6}).observe(c)}
  });

  /* films play only while on screen */
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;if(e.isIntersecting){if(v.preload==='none')v.preload='auto';var p=v.play();p&&p.catch&&p.catch(function(){})}else v.pause()})},{threshold:.35});
    [].forEach.call(root.querySelectorAll('.pj-films video'),function(v){io.observe(v)})}

  /* strip arrows (desktop) */
  [].forEach.call(root.querySelectorAll('.pj-strip'),function(s){
    var t=s.querySelector('.pj-track'),pv=s.querySelector('.pv'),nx=s.querySelector('.nx');
    function step(){var f=t.querySelector('figure');return f?f.getBoundingClientRect().width+14:300}
    function upd(){pv.disabled=t.scrollLeft<4;nx.disabled=t.scrollLeft+t.clientWidth>=t.scrollWidth-4}
    pv.addEventListener('click',function(){t.scrollBy({left:-step(),behavior:'smooth'})});
    nx.addEventListener('click',function(){t.scrollBy({left:step(),behavior:'smooth'})});
    t.addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd();
  });

  /* header: transparent over the hero, solid after it */
  var hd=document.querySelector('.page-header');if(hd){var u=function(){var s=scrollY>innerHeight*.75;hd.classList.toggle('is-solid',s);document.body.classList.toggle('pj-solid',s)};u();addEventListener('scroll',u,{passive:true})}

  /* always open on the hero unless coming back or linking to a section */
  if(!location.hash){var nav=(performance.getEntriesByType&&performance.getEntriesByType('navigation')[0])||{};
    if(nav.type!=='back_forward'){var touched=false;['touchstart','wheel','keydown','mousedown'].forEach(function(t){addEventListener(t,function(){touched=true},{once:true,passive:true})});
      var top=function(){if(!touched&&scrollY>0)scrollTo(0,0)};top();setTimeout(top,150);addEventListener('load',top)}}
})();
