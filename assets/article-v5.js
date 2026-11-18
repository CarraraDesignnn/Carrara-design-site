/* Commission article: renders window.PROJECT into <main id="art">.
   Fill in each project's page: title, kicker, meta, lead, story, quote, specs, photos (8–10). */
(function(){
  var P=window.PROJECT,root=document.getElementById('art');if(!P||!root)return;
  var ALL=[
    {slug:'carrera-gt',title:'Carrera GT',type:'Recommission',img:'https://lh3.googleusercontent.com/d/1DYEPebzTFXNFtJFGMkUjbvGwKPdH26LK=w2000'},
    {slug:'gt2-rs-weissach',title:'GT2 RS Weissach',type:'Specification',img:'/img/work-gt2rs-1400.jpg'},
    {slug:'manthey-gt3-rs',title:'Manthey GT3 RS',type:'Specification',img:'/img/work-manthey-gt3rs-1400.jpg'},
    {slug:'huayra-bc',title:'Huayra BC',type:'Specification',img:'/img/work-huayra-bc-1400.jpg'}
  ];
  var DEFAULT_LAYOUT=['bleed','half','half','inset','third','third','third','wide','narrow','full'];
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  var me=ALL.filter(function(p){return p.slug===P.slug})[0]||{},next=ALL[(ALL.indexOf(me)+1)%ALL.length];
  var hero=P.hero||me.img,title=P.title||me.title,kicker=P.kicker||me.type;

  var meta=(P.meta||[]).map(function(m){return '<div><dt>'+esc(m[0])+'</dt><dd>'+esc(m[1]||'—')+'</dd></div>'}).join('');
  var story=(P.story||[]).map(function(t){return '<p class="art-p art-r">'+esc(t)+'</p>'}).join('');
  var photos=P.flow?[]:(P.photos||[]).slice(0,12);if(!P.flow)while(photos.length<(P.slots||10))photos.push({});
  var lbList=[];
  var gallery=photos.map(function(ph,i){
    var l=ph.layout||DEFAULT_LAYOUT[i%DEFAULT_LAYOUT.length],cls='art-ph art-r l-'+l,out='';
    if(ph.src){lbList.push(ph);out='<figure class="'+cls+'" data-lb="'+(lbList.length-1)+'"><img src="'+esc(ph.src)+'" alt="'+esc(ph.alt||title)+'" loading="lazy" decoding="async"'+(ph.pos?' style="object-position:'+esc(ph.pos)+'"':'')+'>'+(ph.caption?'<figcaption>'+esc(ph.caption)+'</figcaption>':'')+'</figure>'}
    else out='<figure class="'+cls+' is-empty"><span>Photo '+(i+1)+'<br>'+({bleed:'Full width',full:'Wide',half:'Portrait',third:'Portrait',inset:'Landscape',wide:'Landscape',narrow:'Portrait'}[l]||'')+'</span></figure>';
    if(i===2&&P.quote)out+='<figure class="art-quote art-r"><blockquote>'+esc(P.quote[0])+'</blockquote>'+(P.quote[1]?'<figcaption>'+esc(P.quote[1])+'</figcaption>':'')+'</figure>';
    if(i===0)out+='<div class="art-gap"></div>';
    return out}).join('');

  function fig(ph,cls){if(!ph||!ph.src)return'';lbList.push(ph);return '<figure class="art-f '+(cls||'')+'" data-lb="'+(lbList.length-1)+'"><div class="art-fi"'+(ph.ratio?' style="aspect-ratio:'+esc(ph.ratio)+'"':'')+'><img src="'+esc(ph.src)+'" alt="'+esc(ph.alt||title)+'" loading="lazy" decoding="async"'+(ph.pos?' style="object-position:'+esc(ph.pos)+'"':'')+'></div>'+(ph.caption?'<figcaption>'+esc(ph.caption)+'</figcaption>':'')+'</figure>'}
  function head(b){return '<header class="art-ch-h">'+(b.n||b.eyebrow?'<p class="art-ch-n">'+esc(b.n||'')+(b.n&&b.eyebrow?' · ':'')+esc(b.eyebrow||'')+'</p>':'')+(b.title?'<h2 class="art-ch-t">'+esc(b.title)+'</h2>':'')+'</header>'}
  function paras(b){return (b.body||[]).map(function(t){return '<p>'+esc(t)+'</p>'}).join('')}
  function block(b){
    switch(b.t){
      case 'text':return '<section class="art-b art-ch art-r">'+head(b)+'<div class="art-ch-b">'+paras(b)+'</div></section>';
      case 'split':return '<section class="art-b art-split art-r'+(b.flip?' is-flip':'')+'"><div class="art-split-c">'+head(b)+'<div class="art-ch-b">'+paras(b)+'</div></div>'+fig(b.photo,'art-split-f')+'</section>';
      case 'pair':return '<div class="art-b art-pair art-r">'+b.photos.map(function(p){return fig(p)}).join('')+'</div>';
      case 'trio':return '<div class="art-b art-trio art-r">'+b.photos.map(function(p){return fig(p)}).join('')+'</div>';
      case 'quote':return P.quote?'<figure class="art-b art-quote art-r"><blockquote>'+esc(P.quote[0])+'</blockquote>'+(P.quote[1]?'<figcaption>'+esc(P.quote[1])+'</figcaption>':'')+'</figure>':'';
      default:return '<div class="art-b art-one art-r is-'+(b.layout||'wide')+'">'+fig(b)+'</div>';
    }
  }
  var flowHTML=P.flow?'<div class="art-flow">'+P.flow.map(block).join('')+'</div>':'';
  var specs=(P.specs||[]).map(function(s){return '<div><dt>'+esc(s[0])+'</dt><dd>'+esc(s[1]||'—')+'</dd></div>'}).join('');

  root.innerHTML=
    '<section class="art-hero'+(P.heroCopy==='top'?' copy-top':'')+'">'+(P.heroMobile?'<picture><source media="(max-width:700px)" srcset="'+esc(P.heroMobile)+'">':'')+'<img src="'+esc(hero)+'" alt="'+esc(title)+' by Carrara Design" fetchpriority="high"'+(P.heroPos?' style="object-position:'+esc(P.heroPos)+'"':'')+'>'
      +(P.heroMobile?'</picture>':'')+'<div class="art-hero-copy"><p class="art-kicker">'+esc(kicker)+(P.year?' · '+esc(P.year):'')+'</p><h1 class="art-title">'+esc(title)+'</h1></div><span class="art-cue">Scroll</span></section>'
    +(meta?'<dl class="art-meta">'+meta+'</dl>':'')
    +'<section class="art-story"><p class="art-lead art-r">'+esc(P.lead||'')+'</p>'+story+'</section>'
    +(P.flow?flowHTML:'<section class="art-gallery" aria-label="Photos">'+gallery+'</section>')
    +(specs?'<section class="art-spec art-r"><div><p class="eyebrow">The specification</p><h2 class="h3">Details</h2></div><dl>'+specs+'</dl></section>':'')
    +'<a class="art-next" href="/work/'+next.slug+'/"><img src="'+esc(next.img)+'" alt="" loading="lazy" decoding="async"><div class="art-next-copy"><p>Next commission · '+esc(next.type)+'</p><strong>'+esc(next.title)+'</strong></div></a>'
    +'<section class="art-cta"><h2 class="h3">Have a Car in Mind? Let’s Specify It Together.</h2><a class="btn btn-light" href="/#pricing">Start a commission</a></section>';
  document.title=title+' — Carrara Design';

  /* reveal on scroll */
  var els=[].slice.call(root.querySelectorAll('.art-r'));
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});els.forEach(function(e){io.observe(e)})}
  else els.forEach(function(e){e.classList.add('is-in')});

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
