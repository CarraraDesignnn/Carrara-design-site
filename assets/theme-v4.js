/* Header light/dark switch: a small sun/moon icon between the menu and the CD logo, with a full-page crossfade. */
(function(){
  var root=document.documentElement,doc=document;
  var SUN='<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg>';
  var MOON='<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';
  var btn=doc.createElement('button');btn.type='button';btn.className='theme-ico';
  function light(){return root.classList.contains('theme-light')}
  btn.innerHTML='<span class="ti-knob" aria-hidden="true"></span><span class="ti-i ti-sun">'+SUN+'</span><span class="ti-i ti-moon">'+MOON+'</span>';
  function paint(){var l=light();btn.setAttribute('aria-label',l?'Switch to dark mode':'Switch to light mode');btn.setAttribute('aria-pressed',l?'true':'false')}
  function apply(){var l=!light();root.classList.toggle('theme-light',l);
    try{localStorage.setItem('cd-theme',l?'light':'dark')}catch(e){}
    var m=doc.querySelector('meta[name="theme-color"]');m&&m.setAttribute('content',l?'#f5f5f3':'#000000');paint()}
  btn.addEventListener('click',function(){
    var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(doc.startViewTransition&&!reduce){root.classList.add('theme-fading');var t=doc.startViewTransition(apply);
      t.finished.then(function(){root.classList.remove('theme-fading')},function(){root.classList.remove('theme-fading')})}
    else apply();
  });
  var raf=0;
  function place(){raf=0;var lg=doc.querySelector('.header-logo'),h=lg&&lg.closest('header');if(!lg||!h){btn.style.display='none';return}
    var r=lg.getBoundingClientRect(),left=h.querySelector('.header-menu,.header-back')||h.firstElementChild,lx=h.getBoundingClientRect().left;
    if(left&&left!==lg){var rg=doc.createRange();rg.selectNodeContents(left);var lr=rg.getBoundingClientRect();if(lr.width)lx=lr.right;else lx=left.getBoundingClientRect().right}
    btn.style.display='';btn.style.right='auto';btn.classList.toggle('ti-compact',r.left-lx<74);
    btn.style.top=Math.round(r.top+r.height/2-btn.offsetHeight/2)+'px';
    btn.style.left=Math.round((lx+r.left)/2-btn.offsetWidth/2)+'px'}
  function req(){if(!raf)raf=requestAnimationFrame(place)}
  function init(){paint();doc.body.appendChild(btn);place();
    addEventListener('resize',req);addEventListener('scroll',req,{passive:true});addEventListener('load',req);
    doc.fonts&&doc.fonts.ready.then(req);setTimeout(req,600);setTimeout(req,1500);
    var h=doc.querySelector('.header');h&&h.addEventListener('transitionend',req)}
  if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',init);else init();
})();
