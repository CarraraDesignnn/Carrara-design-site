/* Home: "What a Commission Means" v24 (Consultation hover: tartan; Review: film plays first, seat on hover/thumb; Consultation: two photos; small corner stage number; Legacy: still, with a second photo on hover/thumb). Five stages: Consultation, Configuration, Review, Render to Reality, Legacy.
   Title and line under each card; a big stage number fades onto the card on hover (mouse) or while a thumb rests on it.
   Films play in turn on desktop and under the thumb on phones. Replaces only the old first screen of #pricing. */
(function(){
  function dragScroll(rail){var down=false,x0=0,s0=0,moved=false;
    rail.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||e.button!==0)return;down=true;moved=false;x0=e.clientX;s0=rail.scrollLeft;rail.classList.add('is-drag')});
    addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-x0;if(Math.abs(dx)>5)moved=true;if(moved)rail.scrollLeft=s0-dx});
    addEventListener('pointerup',function(){if(!down)return;down=false;rail.classList.remove('is-drag');if(moved){var l=rail.scrollLeft;rail.scrollLeft=l}});
    rail.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
    rail.addEventListener('dragstart',function(e){e.preventDefault()});
  }
  
  var IMG='/img/commission/';
  var STAGES=[
    {n:'01',name:'Consultation',img:'c1-swatch3',vid:'',alt:'c1-tartan2',copy:'We start with your goals, then set the creative direction together.'},
    {n:'02',name:'Configuration',img:'c2-huayra',vid:'c2-clay',copy:'Your exact car, built in CGI to OEM standard.'},
    {n:'03',name:'Review',img:'c3-filmposter',vid:'',loop:'c3-film',alt:'c3-seat',copy:'Designed with you in real time, through dealer meetings to factory submission.'},
    {n:'04',name:'Render to Reality',img:'c4-manthey',vid:'c4-delivery',copy:'The car you designed becomes the car you drive.'},
    {n:'05',name:'Legacy',img:'c5-cgt-top',vid:'',alt:'c5-cgt-poster',copy:'Poster cars, auction records, icons of their chassis.'}
  ];

  var sec=document.getElementById('pricing');if(!sec)return;
  function hydrated(){return Object.keys(sec).some(function(k){return k.indexOf('__react')===0})}
  function whenReady(fn){var t=0;(function poll(){if(hydrated()||t>60)return setTimeout(fn,120);t++;setTimeout(poll,100)})()}

  function build(){
    var h='<div class="cm"><div class="cm-scene cm-a"><div class="cm-head">'+
      '<p class="eyebrow">The commission</p>'+
      '<h2 id="cm-title" class="h3">What a Commission Means</h2>'+
      
      '</div><ol class="cm-rail">'+
      STAGES.map(function(s){return '<li class="cm-card"><div class="cm-media" aria-label="'+s.name+'">'+
        '<img alt="" decoding="async" data-src="'+IMG+s.img+'-600.jpg" data-srcset="'+IMG+s.img+'-600.jpg 600w, '+IMG+s.img+'-1050.jpg 1050w" sizes="(max-width:700px) 74vw, 24vw">'+
        (s.vid?'<video muted playsinline loop preload="none" data-src="'+IMG+s.vid+'.mp4" disablepictureinpicture></video>':'')+
        (s.loop?'<video class="cm-loop" muted playsinline loop preload="none" data-src="'+IMG+s.loop+'.mp4" disablepictureinpicture></video>':'')+
        (s.alt?'<img class="cm-alt" alt="" decoding="async" data-src="'+IMG+s.alt+'-600.jpg" data-srcset="'+IMG+s.alt+'-600.jpg 600w, '+IMG+s.alt+'-1050.jpg 1050w" sizes="(max-width:700px) 74vw, 24vw">':'')+'<span class="cm-big" aria-hidden="true">'+s.n+' / 0'+STAGES.length+'</span>'+
        
        '</div><div class="cm-cap"><h3 class="cm-name">'+s.name+'</h3><p class="cm-copy">'+s.copy+'</p></div></li>'}).join('')+
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
    var loops=[].slice.call(root.querySelectorAll('video.cm-loop'));
    function loopsOn(on){loops.forEach(function(v){if(on&&!reduce){if(!v.src){v.src=v.dataset.src;v.preload='auto'}var p=v.play();if(p&&p.catch)p.catch(function(){})}else v.pause()})}dragScroll(rail);
    function seen(i){var r=rail.getBoundingClientRect(),b=media[i].getBoundingClientRect();return b.left>=r.left-4&&b.right<=r.right+4}
    function nxt(i){for(var k=1;k<=media.length;k++){var j=(i+k)%media.length;if(seen(j))return j}return (i+1)%media.length}
    function vid(i){var v=media[i].querySelector('video:not(.cm-loop)');if(!v)return null;if(!v.src){v.src=v.dataset.src;v.preload='auto'}return v}
    function off(i){var m=media[i];if(!m)return;m.classList.remove('is-film');var v=m.querySelector('video:not(.cm-loop)');if(v)setTimeout(function(){if(!m.classList.contains('is-film'))v.pause()},600)}
    function play(i){
      clearTimeout(timer);
      if(cur!==i)off(cur);cur=i;
      if(reduce||!inView)return;
      var m=media[i],v=vid(i);
      if(!v){if(m.querySelector('.cm-alt'))m.classList.add('is-film');if(!phone.matches)timer=setTimeout(function(){if(!hover){off(i);timer=setTimeout(function(){play(nxt(i))},1400)}},4500);return}
      try{v.currentTime=0}catch(e){}
      var p=v.play();if(p&&p.catch)p.catch(function(){});
      var show=function(){if(cur===i&&inView)m.classList.add('is-film')};
      if(v.readyState>=3)show();else v.addEventListener('playing',function once(){v.removeEventListener('playing',once);show()});
      if(!phone.matches){
        var len=(v.duration&&isFinite(v.duration))?v.duration*1000:6000;
        timer=setTimeout(function(){if(!hover){off(i);timer=setTimeout(function(){play(nxt(i))},1400)}},Math.min(len,8000));
      }
    }
    function centred(){var r=rail.getBoundingClientRect(),mid=r.left+r.width*.4,best=0,bd=1e9;
      media.forEach(function(m,i){var b=m.getBoundingClientRect(),d=Math.abs(b.left+b.width/2-mid);if(d<bd){bd=d;best=i}});return best}
        media.forEach(function(m,i){
      m.addEventListener('mouseenter',function(){if(phone.matches)return;hover=true;if(cur!==i)play(i)});
      m.addEventListener('mouseleave',function(){if(phone.matches)return;hover=false;clearTimeout(timer);timer=setTimeout(function(){off(cur);timer=setTimeout(function(){play(nxt(cur))},1400)},2500)});
      m.addEventListener('contextmenu',function(e){if(phone.matches)e.preventDefault()});
      m.addEventListener('touchstart',function(){if(phone.matches){m.classList.add('is-held');play(i)}},{passive:true});
      m.addEventListener('touchend',function(){m.classList.remove('is-held');if(phone.matches&&cur===i){off(i);cur=-1}});
      m.addEventListener('touchcancel',function(){m.classList.remove('is-held');if(phone.matches&&cur===i){off(i);cur=-1}});
    });
    if('IntersectionObserver' in window)new IntersectionObserver(function(es){es.forEach(function(e){
      var was=inView;inView=e.isIntersecting&&e.intersectionRatio>.35;if(inView!==was)loopsOn(inView);
      if(inView&&!was){if(phone.matches){media.forEach(function(m,i){vid(i)})}else{vid(0);setTimeout(function(){play(Math.max(cur,0))},600)}}
      else if(!inView&&was){clearTimeout(timer);media.forEach(function(m,i){off(i)})}
    })},{threshold:[0,.35,.6]}).observe(rail);
    document.addEventListener('visibilitychange',function(){loopsOn(!document.hidden&&inView);if(document.hidden){clearTimeout(timer);media.forEach(function(m,i){off(i)})}else if(inView&&!phone.matches)play(Math.max(cur,0))});
  });
})();
