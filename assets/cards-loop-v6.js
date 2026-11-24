/* v6: shuffles the cards on each visit. v2: phones and desktop. Make the featured rail loop endlessly (clone the set before and after, then wrap silently). */
(function(){
  function dragScroll(rail){var down=false,x0=0,s0=0,moved=false;
    rail.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||e.button!==0)return;down=true;moved=false;x0=e.clientX;s0=rail.scrollLeft;rail.classList.add('is-drag')});
    addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-x0;if(Math.abs(dx)>5)moved=true;if(moved)rail.scrollLeft=s0-dx});
    addEventListener('pointerup',function(){if(!down)return;down=false;rail.classList.remove('is-drag');if(moved){var l=rail.scrollLeft;rail.scrollLeft=l}});
    rail.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
    rail.addEventListener('dragstart',function(e){e.preventDefault()});
  }
  
  var mq=matchMedia('(max-width:700px)');
  function init(){
    var rail=document.querySelector('.work .rail');if(!rail||rail.dataset.loop)return;
    var items=[].slice.call(rail.children);if(items.length<2)return;/* v6: random order on each visit, keeping look-alike cards apart */var apart=[['Sparky’s Huayra BC','Tenner Racing’s Jägermeister 935'],['Sparky’s Huayra BC','Huayra Roadster']];function nm(li){var a=li.querySelector('[data-name]');return a?a.getAttribute('data-name'):''}function ok(o){for(var k=0;k<o.length;k++){var x=nm(o[k]),y=nm(o[(k+1)%o.length]);for(var p=0;p<apart.length;p++){var q=apart[p];if((x===q[0]&&y===q[1])||(x===q[1]&&y===q[0]))return false}}return true}var order=items.slice();for(var t=0;t<60;t++){var o=items.slice();for(var i=o.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),z=o[i];o[i]=o[j];o[j]=z}if(ok(o)){order=o;break}}order.forEach(function(li){rail.appendChild(li)});items=order;
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
