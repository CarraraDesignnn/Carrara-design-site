/* Archive commission page: a lighter page (title, caption, photos) for projects from the old portfolio. */
(function(){
  var root=document.getElementById('arc'),slug=root&&root.getAttribute('data-slug');if(!root)return;
  var A=window.ARCHIVE||[],P=A.filter(function(a){return a.slug===slug})[0];if(!P)return;
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  var i=A.indexOf(P),next=A[(i+1)%A.length],ph=(P.photos||[]).slice(),base=ph.length;
  document.title=P.title+' — Carrara Design';
  root.innerHTML='<header class="arc-head"><p class="eyebrow">'+esc(P.label||P.type)+'</p><h1 class="h2">'+esc(P.title)+'</h1>'+(P.caption?'<p class="arc-cap">'+esc(P.caption)+'</p>':'')
    +((P.story||[]).map(function(t){return '<p class="arc-story">'+esc(t)+'</p>'}).join(''))+(P.photoCredit?'<p class="arc-credit">Photography '+esc(P.photoCredit)+'</p>':'')+'</header>'
    +(P.seasons?'<div class="arc-cmp arc-cmp-'+P.seasons.length+'">'+P.seasons.map(function(se){return '<figure class="arc-cmp-f"><img src="'+esc(se.photos[0])+'" alt="'+esc(P.title+' '+se.year)+'" loading="eager" decoding="async"><figcaption><strong>'+esc(se.year)+'</strong>'+esc(se.name)+'</figcaption></figure>'}).join('')+'</div>'+P.seasons.map(function(se){var off=ph.length;se.photos.forEach(function(p){ph.push(p)});return '<section class="arc-season"><h2 class="arc-season-h"><span>'+esc(se.year)+'</span>'+esc(se.name)+'</h2><div class="arc-grid arc-grid-s">'+se.photos.slice(1).map(function(src,k){return '<figure class="arc-f" data-k="'+(off+k+1)+'"><img src="'+esc(src)+'" alt="'+esc(P.title+' '+se.year)+'" loading="lazy" decoding="async"></figure>'}).join('')+'</div></section>'}).join(''):'')+'<div class="arc-grid">'+ph.slice(0,base).map(function(src,k){return '<figure class="arc-f'+(k===0?' is-lead':'')+'" data-k="'+k+'"><img src="'+esc(src)+'" alt="'+esc(P.title)+'" loading="'+(k<2?'eager':'lazy')+'" decoding="async"></figure>'}).join('')+'</div>'
    +'<nav class="arc-nav"><a href="/work/">← All commissions</a><a href="/work/'+esc(next.slug)+'/">Next: '+esc(next.title)+' →</a></nav>'
    +'<section class="art-cta"><h2 class="h3">Have a Car in Mind? Let’s Specify It Together.</h2><a class="btn btn-light" href="/#inquire">Start a commission</a></section>';
  /* lightbox */
  var lb=document.createElement('div');lb.className='art-lb';lb.innerHTML='<img alt=""><button class="art-lb-x" aria-label="Close">&times;</button><button class="art-lb-p" aria-label="Previous">&larr;</button><button class="art-lb-n" aria-label="Next">&rarr;</button>';document.body.appendChild(lb);
  var im=lb.querySelector('img'),cur=0;function show(k){cur=(k+ph.length)%ph.length;im.src=ph[cur]}
  root.addEventListener('click',function(e){var f=e.target.closest('.arc-f');if(!f)return;show(+f.dataset.k);lb.classList.add('is-open');document.body.classList.add('lb-open')});
  lb.addEventListener('click',function(e){if(e.target===lb||e.target.closest('.art-lb-x')){lb.classList.remove('is-open');document.body.classList.remove('lb-open')}else if(e.target.closest('.art-lb-p'))show(cur-1);else if(e.target.closest('.art-lb-n'))show(cur+1)});
  document.addEventListener('keydown',function(e){if(!lb.classList.contains('is-open'))return;if(e.key==='Escape'){lb.classList.remove('is-open');document.body.classList.remove('lb-open')}if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1)});
})();
