/* Hover swap for the "What a Commission Means" cards: each listed card shows a photo,
   and hovering (mouse) or resting a thumb on it fades the photo to reveal the card's film or image underneath.
   To give another card a swap, add a line below: card number (1 = wide card, 2, 3), photo and crop. */
(function(){
  var SWAPS={
    1:{src:'/img/step-sessions-still.jpg',pos:'40% 62%'}
  };
  var sec=document.getElementById('pricing');if(!sec)return;
  function hydrated(){return Object.keys(sec).some(function(k){return k.indexOf('__react')===0})}
  function ready(fn){var t=0;(function poll(){if(hydrated()||t>60)return setTimeout(fn,150);t++;setTimeout(poll,100)})()}
  ready(function(){
    var media=sec.querySelector('.steps-media');if(!media||media.querySelector('.swap-face'))return;
    var hover=matchMedia('(hover:hover)');
    Object.keys(SWAPS).forEach(function(n){
      var s=SWAPS[n],im=document.createElement('img');
      im.className='swap-face swap-'+n;im.alt='';im.decoding='async';im.loading='lazy';im.src=s.src;
      if(s.pos)im.style.objectPosition=s.pos;
      media.appendChild(im);
      function on(){im.classList.add('is-off');var v=media.children[n-1];if(v&&v.tagName==='VIDEO'){var p=v.play();p&&p.catch&&p.catch(function(){})}}
      function off(){im.classList.remove('is-off')}
      im.addEventListener('mouseenter',function(){if(hover.matches)on()});
      im.addEventListener('mouseleave',function(){if(hover.matches)off()});
      im.addEventListener('touchstart',on,{passive:true});
      im.addEventListener('touchend',function(){setTimeout(off,250)},{passive:true});
      im.addEventListener('touchcancel',off,{passive:true});
      im.addEventListener('contextmenu',function(e){e.preventDefault()});
    });
  });
})();
