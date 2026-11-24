/* Hover swap for the "What a Commission Means" cards (mouse hover or a thumb resting on the card).
   Card numbers: 1 = Live Spec Sessions (wide), 2 = Real Design Expertise, 3 = Investment Protection.
   mode 'cover':  this photo is the card's normal face; hover fades it to show the card's own film/photo underneath.
   mode 'reveal': the card's own photo stays as the normal face; hover fades this photo in on top.
   To add a swap, add one line below. */
(function(){
  var SWAPS={
    1:{mode:'cover', src:'/img/step-sessions-still.jpg', pos:'40% 62%'},
    2:{mode:'reveal',src:'/img/step-expertise-hover-2.jpg',pos:'50% 55%'},
    3:{mode:'reveal',src:'/img/step-investment-hover-2.jpg',pos:'50% 58%'}
  };
  var sec=document.getElementById('pricing');if(!sec)return;
  function hydrated(){return Object.keys(sec).some(function(k){return k.indexOf('__react')===0})}
  function ready(fn){var t=0;(function poll(){if(hydrated()||t>60)return setTimeout(fn,150);t++;setTimeout(poll,100)})()}
  ready(function(){
    var media=sec.querySelector('.steps-media');if(!media||media.querySelector('.swap-face'))return;
    var hover=matchMedia('(hover:hover)');
    Object.keys(SWAPS).forEach(function(n){
      var s=SWAPS[n],im=document.createElement('img');
      im.className='swap-face swap-'+n+' is-'+s.mode;im.alt='';im.decoding='async';im.src=s.src;
      if(s.pos)im.style.objectPosition=s.pos;
      media.appendChild(im);
      function on(){im.classList.add('is-on');var v=media.children[n-1];if(s.mode==='cover'&&v&&v.tagName==='VIDEO'){var p=v.play();p&&p.catch&&p.catch(function(){})}}
      function off(){im.classList.remove('is-on')}
      im.addEventListener('mouseenter',function(){if(hover.matches)on()});
      im.addEventListener('mouseleave',function(){if(hover.matches)off()});
      im.addEventListener('touchstart',on,{passive:true});
      im.addEventListener('touchend',function(){setTimeout(off,250)},{passive:true});
      im.addEventListener('touchcancel',off,{passive:true});
      im.addEventListener('contextmenu',function(e){e.preventDefault()});
    });
  });
})();
