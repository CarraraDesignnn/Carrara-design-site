/* drop-swap-v1 (preview): on the homepage drop and the shop page, a resting thumb or the mouse swaps each print
   to its behind-the-scenes creative: the Blender build film for the framed prints, the half-rendered studio shot for the Family Portrait. */
(function(){
  var BTS=[
    {re:/manthey|gt3/i, video:'/img/p/manthey/blender-build.mp4'},
    {re:/chromaflair|gt2/i, video:'/img/p/gt2rs/blender-build.mp4'},
    {re:/family/i, image:'/img/p/family/duo-bts-1600.jpg'}
  ];
  var hover=matchMedia('(hover:hover)');
  function pick(s){for(var i=0;i<BTS.length;i++)if(BTS[i].re.test(s))return BTS[i];return null}
  function wire(host,img,key,cell){
    if(img.dataset.swap)return;var b=pick(key);if(!b)return;img.dataset.swap='1';
    var el;
    if(b.video){el=document.createElement('video');el.muted=true;el.loop=true;el.playsInline=true;el.setAttribute('playsinline','');el.preload='none';el.src=b.video;el.setAttribute('disablepictureinpicture','')}
    else{el=document.createElement('img');el.src=b.image;el.alt='';el.decoding='async'}
    el.className='drop-swap';el.setAttribute('aria-hidden','true');
    img.insertAdjacentElement('afterend',el);
    if(cell){el.classList.add('in-grid');var fit=function(){el.style.left=img.offsetLeft+'px';el.style.top=img.offsetTop+'px';el.style.width=img.offsetWidth+'px';el.style.height=img.offsetHeight+'px'};fit();img.addEventListener('load',fit);addEventListener('resize',fit);if('ResizeObserver' in window)new ResizeObserver(fit).observe(img)}
    function on(){el.classList.add('is-on');if(b.video){try{el.currentTime=0}catch(e){}var p=el.play();p&&p.catch&&p.catch(function(){})}}
    function off(){el.classList.remove('is-on');if(b.video)setTimeout(function(){if(!el.classList.contains('is-on'))el.pause()},500)}
    el.addEventListener('mouseenter',function(){if(hover.matches)on()});
    el.addEventListener('mouseleave',function(){if(hover.matches)off()});
    el.addEventListener('touchstart',on,{passive:true});
    el.addEventListener('touchend',function(){setTimeout(off,250)},{passive:true});
    el.addEventListener('touchcancel',off,{passive:true});
    el.addEventListener('contextmenu',function(e){e.preventDefault()});
    if(b.video&&'IntersectionObserver' in window){var io=new IntersectionObserver(function(es){if(es[0].isIntersecting){el.preload='auto';io.disconnect()}},{rootMargin:'300px'});io.observe(el)}
  }
  function scan(){
    [].forEach.call(document.querySelectorAll('#shop .shop-teaser-media'),function(a){
      var imgs=[].filter.call(a.children,function(c){return c.tagName==='IMG'&&!c.classList.contains('drop-swap')});
      imgs.forEach(function(im,i){wire(a,im,im.alt||'',imgs.length>1?i+1:0)});
    });
    [].forEach.call(document.querySelectorAll('.drop-media'),function(a){
      var im=a.querySelector('img:not(.drop-swap)');if(im)wire(a,im,(a.getAttribute('href')||'')+' '+(im.alt||''),0);
    });
  }
  var t=0;new MutationObserver(function(){clearTimeout(t);t=setTimeout(scan,120)}).observe(document.documentElement,{childList:true,subtree:true});
  scan();addEventListener('load',scan);
})();
