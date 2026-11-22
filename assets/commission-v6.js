/* Home: "What a Commission Means" v6 (films play on their own, no play button). Four cards, one still each; hovering (mouse) or pressing (touch) a card
   fades it to a film. Replaces only the old first screen of #pricing; the "By the Numbers" screen stays as it was. */
(function(){
  var IMG='/img/commission/';
  var STAGES=[
    {n:'01',name:'The Conversation',img:'c1-stitch',vid:'c3-film2',copy:'Where your ideas meet ours.'},
    {n:'02',name:'Creative Direction',img:'c3-ice',vid:'c3-film',copy:'Every option considered. Only the right ones chosen.'},
    {n:'03',name:'The Studio',img:'c2-huayra',vid:'c2-clay',copy:'Your car, rendered in OEM-standard 3D.'},
    {n:'04',name:'The Factory',img:'c4-manthey',vid:'c4-delivery',copy:'Every decision certain before it’s built.'}
  ];

  var sec=document.getElementById('pricing');if(!sec)return;
  function hydrated(){return Object.keys(sec).some(function(k){return k.indexOf('__react')===0})}
  function whenReady(fn){var t=0;(function poll(){if(hydrated()||t>60)return setTimeout(fn,120);t++;setTimeout(poll,100)})()}

  function build(){
    var h='<div class="cm"><div class="cm-scene cm-a"><div class="cm-head">'+
      '<p class="eyebrow">The commission</p>'+
      '<h2 id="cm-title" class="h3">What a Commission Means</h2>'+
      '<p class="cm-lead">Your car, designed together.</p>'+
      '</div><ol class="cm-rail">'+
      STAGES.map(function(s){return '<li class="cm-card"><div class="cm-media" aria-label="'+s.name+'">'+
        '<img alt="" decoding="async" data-src="'+IMG+s.img+'-600.jpg" data-srcset="'+IMG+s.img+'-600.jpg 600w, '+IMG+s.img+'-1050.jpg 1050w" sizes="(max-width:700px) 74vw, 24vw">'+
        '<video muted playsinline loop preload="none" data-src="'+IMG+s.vid+'.mp4" disablepictureinpicture></video>'+
        '<span class="cm-over"><span class="cm-num">'+s.n+'</span><span class="cm-name">'+s.name+'</span></span>'+
        '</div><p class="cm-copy">'+s.copy+'</p></li>'}).join('')+
      '</ol></div></div>';
    sec.insertAdjacentHTML('afterbegin',h);
    sec.classList.add('cm-ready');sec.setAttribute('aria-labelledby','cm-title');
    return sec.querySelector('.cm');
  }

  whenReady(function(){
    if(sec.querySelector('.cm'))return;
    var root=build(),loaded=false;
    function loadAll(){if(loaded)return;loaded=true;
      [].forEach.call(root.querySelectorAll('img[data-src]'),function(im){im.srcset=im.dataset.srcset;im.src=im.dataset.src});}
    if('IntersectionObserver' in window)new IntersectionObserver(function(es,o){es.forEach(function(e){if(e.isIntersecting){loadAll();o.disconnect()}})},{rootMargin:'900px 0px'}).observe(sec);else loadAll();

    /* Films play on their own, no button: on phones the card centred in the row plays; on desktop the cards
       take turns, and hovering a card jumps to it. Only while the section is on screen. */
    var media=[].slice.call(root.querySelectorAll('.cm-media')),rail=root.querySelector('.cm-rail');
    var phone=matchMedia('(max-width:700px)'),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    var cur=-1,inView=false,hover=false,timer=null;
    function vid(i){var v=media[i].querySelector('video');if(!v.src){v.src=v.dataset.src;v.preload='auto'}return v}
    function off(i){var m=media[i];if(!m)return;m.classList.remove('is-film');var v=m.querySelector('video');setTimeout(function(){if(!m.classList.contains('is-film'))v.pause()},600)}
    function play(i){
      clearTimeout(timer);
      if(cur!==i)off(cur);cur=i;
      if(reduce||!inView)return;
      var m=media[i],v=vid(i);
      try{v.currentTime=0}catch(e){}
      var p=v.play();if(p&&p.catch)p.catch(function(){});
      var show=function(){if(cur===i&&inView)m.classList.add('is-film')};
      if(v.readyState>=3)show();else v.addEventListener('playing',function once(){v.removeEventListener('playing',once);show()});
      if(!phone.matches){
        var len=(v.duration&&isFinite(v.duration))?v.duration*1000:6000;
        timer=setTimeout(function(){if(!hover){off(i);timer=setTimeout(function(){play((i+1)%media.length)},1400)}},Math.min(len,8000));
      }
    }
    function centred(){var r=rail.getBoundingClientRect(),mid=r.left+r.width*.4,best=0,bd=1e9;
      media.forEach(function(m,i){var b=m.getBoundingClientRect(),d=Math.abs(b.left+b.width/2-mid);if(d<bd){bd=d;best=i}});return best}
    var st=0;rail.addEventListener('scroll',function(){if(!phone.matches)return;clearTimeout(st);st=setTimeout(function(){var i=centred();if(i!==cur)play(i)},140)},{passive:true});
    media.forEach(function(m,i){
      m.addEventListener('mouseenter',function(){if(phone.matches)return;hover=true;if(cur!==i)play(i)});
      m.addEventListener('mouseleave',function(){if(phone.matches)return;hover=false;clearTimeout(timer);timer=setTimeout(function(){off(cur);timer=setTimeout(function(){play((cur+1)%media.length)},1400)},2500)});
      m.addEventListener('contextmenu',function(e){if(phone.matches)e.preventDefault()});
    });
    if('IntersectionObserver' in window)new IntersectionObserver(function(es){es.forEach(function(e){
      var was=inView;inView=e.isIntersecting&&e.intersectionRatio>.35;
      if(inView&&!was){vid(0);setTimeout(function(){play(phone.matches?centred():Math.max(cur,0))},600)}
      else if(!inView&&was){clearTimeout(timer);media.forEach(function(m,i){off(i)})}
    })},{threshold:[0,.35,.6]}).observe(rail);
    document.addEventListener('visibilitychange',function(){if(document.hidden){clearTimeout(timer);media.forEach(function(m,i){off(i)})}else if(inView)play(Math.max(cur,0))});
  });
})();
