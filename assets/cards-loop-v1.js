/* Phones: make the featured rail loop endlessly (clone the set before and after, then wrap silently). */
(function(){
  var mq=matchMedia('(max-width:700px)');
  function init(){
    var rail=document.querySelector('.work .rail');if(!rail||rail.dataset.loop)return;
    var items=[].slice.call(rail.children);if(items.length<2)return;
    rail.dataset.loop='1';
    function clone(li){var c=li.cloneNode(true);c.setAttribute('aria-hidden','true');c.classList.add('is-clone');[].forEach.call(c.querySelectorAll('a'),function(a){a.tabIndex=-1});return c}
    items.forEach(function(li){rail.appendChild(clone(li))});
    items.slice().reverse().forEach(function(li){rail.insertBefore(clone(li),rail.firstChild)});
    var setW=0;function measure(){setW=items[0].offsetLeft-rail.children[0].offsetLeft}
    measure();rail.scrollLeft=setW;
    var t=0;rail.addEventListener('scroll',function(){clearTimeout(t);t=setTimeout(function(){
      if(!setW)measure();
      if(rail.scrollLeft<setW*0.5)rail.scrollLeft+=setW;
      else if(rail.scrollLeft>setW*1.5)rail.scrollLeft-=setW;
    },120)},{passive:true});
    addEventListener('resize',function(){var r=(rail.scrollLeft%setW)||0;measure();rail.scrollLeft=setW+r});
  }
  function go(){if(mq.matches)setTimeout(init,400)}
  if(document.readyState==='complete')go();else addEventListener('load',go);
  mq.addEventListener&&mq.addEventListener('change',go);
})();
