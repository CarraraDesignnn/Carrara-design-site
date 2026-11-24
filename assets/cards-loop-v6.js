/* v6: also shows every other project from the Projects page after the featured four. v2: phones and desktop. Make the featured rail loop endlessly (clone the set before and after, then wrap silently). */
(function(){
  function dragScroll(rail){var down=false,x0=0,s0=0,moved=false;
    rail.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||e.button!==0)return;down=true;moved=false;x0=e.clientX;s0=rail.scrollLeft;rail.classList.add('is-drag')});
    addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-x0;if(Math.abs(dx)>5)moved=true;if(moved)rail.scrollLeft=s0-dx});
    addEventListener('pointerup',function(){if(!down)return;down=false;rail.classList.remove('is-drag');if(moved){var l=rail.scrollLeft;rail.scrollLeft=l}});
    rail.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
    rail.addEventListener('dragstart',function(e){e.preventDefault()});
  }
  
  var EXTRA=[{"href": "/work/momo-f40-lm/", "name": "Andy’s MOMO F40 LM", "type": "Livery", "img": "/img/archive/momo-f40-lm-card.jpg"}, {"href": "/work/sonderwunsch-dakar/", "name": "Sonderwunsch Dakar", "type": "Specification", "img": "/img/archive/sonderwunsch-dakar-card.jpg"}, {"href": "/work/maritime-blue-rs-40/", "name": "Chuck’s Maritime Blue RS 4.0", "type": "Specification", "img": "/img/archive/maritime-blue-rs-40-card.jpg"}, {"href": "/work/993-livery-design/", "name": "John’s 993 Supercup Tribute", "type": "Livery", "img": "/img/archive/993-livery-design-card.jpg"}, {"href": "/work/sonderwunsch-gt4-rs/", "name": "Sonderwunsch GT4 RS", "type": "Specification", "img": "/img/archive/sonderwunsch-gt4-rs-card.jpg"}, {"href": "/work/718-spyder-stripe-design/", "name": "Brett’s 718 Spyder", "type": "Specification & Livery", "img": "/img/archive/718-spyder-stripe-design-card.jpg"}, {"href": "/work/martini-racing-gt2-rs/", "name": "Martini Racing GT2 RS", "type": "Livery", "img": "/img/archive/martini-racing-gt2-rs-card.jpg"}, {"href": "/work/jaegermeister-935/", "name": "Tenner Racing’s Jägermeister 935", "type": "Livery", "img": "/img/archive/jaegermeister-935-card.jpg"}, {"href": "/work/sepia-brown-gt3-touring/", "name": "Sepia Brown GT3 Touring", "type": "Specification", "img": "/img/archive/sepia-brown-gt3-touring-card.jpg"}, {"href": "/work/gt3-rs-livery-design/", "name": "Prymora Skincare’s GT3 RS", "type": "Livery", "img": "/img/archive/gt3-rs-livery-design-card.jpg"}, {"href": "/work/jg-wentworth-nsx/", "name": "Gradient Racing’s JG Wentworth NSX", "type": "Livery", "img": "/img/archive/jg-wentworth-nsx-card.jpg"}, {"href": "/work/efrin-castro-gt3-cup/", "name": "Efrin Castro’s GT3 Cup", "type": "Livery", "img": "/img/archive/castro-23-card.jpg"}, {"href": "/work/huayra-roadster/", "name": "Huayra Roadster", "type": "Specification", "img": "/img/archive/huayra-roadster-card.jpg"}, {"href": "/work/sonderwunsch-spyder/", "name": "Shashi’s Sonderwunsch Spyder", "type": "Specification", "img": "/img/archive/sonderwunsch-spyder-card.jpg"}, {"href": "/work/dark-olive-metallic-gt3-rs/", "name": "Ryan’s Dark Olive GT3 RS", "type": "Specification", "img": "/img/archive/dark-olive-metallic-gt3-rs-card.jpg"}, {"href": "/work/albert-blue-gt3-rs/", "name": "Albert Blue GT3 RS", "type": "Specification", "img": "/img/archive/albert-blue-gt3-rs-card.jpg"}, {"href": "/work/bandit-911/", "name": "Philip’s Bandit 911", "type": "Livery", "img": "/img/archive/bandit-911-card.jpg"}, {"href": "/work/sonderwunsch-speedster/", "name": "Jason’s Sonderwunsch Speedster", "type": "Specification", "img": "/img/archive/sonderwunsch-speedster-card.jpg"}];
  function esc(t){return String(t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function addExtra(rail){var have={};[].forEach.call(rail.querySelectorAll('a.card-hit'),function(a){have[a.getAttribute('href')]=1});
    EXTRA.forEach(function(p){if(have[p.href])return;var li=document.createElement('li');li.className='card is-extra';
      li.innerHTML='<a class="card-hit" data-name="'+esc(p.name)+'" href="'+esc(p.href)+'" aria-label="'+esc(p.name)+' — '+esc(p.type)+'"><div class="card-media"><img sizes="(max-width: 700px) 46vw, 20vw" alt="'+esc(p.name)+' — '+esc(p.type)+' by Carrara Design" loading="lazy" decoding="async" draggable="false" src="'+esc(p.img)+'"></div><div class="card-overlay" aria-hidden="true"><div class="card-top"><p class="card-type">'+esc(p.type)+'</p><h3 class="card-name">'+esc(p.name)+'</h3></div></div></a>';
      rail.appendChild(li)})}
  var mq=matchMedia('(max-width:700px)');
  function init(){
    var rail=document.querySelector('.work .rail');if(!rail||rail.dataset.loop)return;
    addExtra(rail);
    var items=[].slice.call(rail.children);if(items.length<2)return;
    rail.dataset.loop='1';dragScroll(rail);
    function clone(li){var c=li.cloneNode(true);c.setAttribute('aria-hidden','true');c.classList.add('is-clone');[].forEach.call(c.querySelectorAll('a'),function(a){a.tabIndex=-1});return c}
    items.forEach(function(li){rail.appendChild(clone(li))});
    items.slice().reverse().forEach(function(li){rail.insertBefore(clone(li),rail.firstChild)});
    var setW=0;function measure(){setW=items[0].offsetLeft-rail.children[0].offsetLeft}
    measure();rail.scrollLeft=setW;
    var t=0;rail.addEventListener('scroll',function(){clearTimeout(t);t=setTimeout(function(){
      if(rail.classList.contains('is-drag'))return;
      if(!setW)measure();
      if(rail.scrollLeft<setW*0.5)rail.scrollLeft+=setW;
      else if(rail.scrollLeft>setW*1.5)rail.scrollLeft-=setW;
    },120)},{passive:true});
    addEventListener('resize',function(){var r=(rail.scrollLeft%setW)||0;measure();rail.scrollLeft=setW+r});
  }
  function go(){setTimeout(init,400)}
  if(document.readyState==='complete')go();else addEventListener('load',go);
  mq.addEventListener&&mq.addEventListener('change',go);
})();
