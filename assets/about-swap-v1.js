/* about-swap-v1: hover (mouse) or a resting thumb swaps each Made by Hand photo to its studio clip */
(function(){
  var hover=matchMedia('(hover:hover)');
  [].forEach.call(document.querySelectorAll('.ab-sw'),function(el){
    var v=el.querySelector('video');if(!v)return;
    function on(){el.classList.add('is-on');try{v.currentTime=0}catch(e){}var p=v.play();p&&p.catch&&p.catch(function(){})}
    function off(){el.classList.remove('is-on');setTimeout(function(){if(!el.classList.contains('is-on'))v.pause()},500)}
    el.addEventListener('mouseenter',function(){if(hover.matches)on()});
    el.addEventListener('mouseleave',function(){if(hover.matches)off()});
    el.addEventListener('touchstart',on,{passive:true});
    el.addEventListener('touchend',function(){setTimeout(off,250)},{passive:true});
    el.addEventListener('touchcancel',off,{passive:true});
    el.addEventListener('contextmenu',function(e){e.preventDefault()});
    /* warm the clip once the photo is close to view so the swap starts quickly */
    if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){if(es[0].isIntersecting){v.preload='auto';io.disconnect()}},{rootMargin:'400px'});io.observe(el)}
  });
})();
