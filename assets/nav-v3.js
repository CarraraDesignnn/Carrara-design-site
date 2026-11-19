/* In-page links (#work, #inquire…): fade out, jump, fade back in; snapping paused while we move with section snapping paused,
   so Safari's snap points, the open menu's scroll lock, and the process section can't swallow the jump. */
(function(){
  var root=document.documentElement,DUR=700,anim=0;
  function ease(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}
  function target(id){
    if(id==='top')return 0;
    var el=document.getElementById(id);if(!el)return null;
    return Math.max(0,Math.round(el.getBoundingClientRect().top+scrollY));
  }
  function glide(id,instant){
    var to=target(id);if(to==null)return false;
    var id0=++anim;root.classList.add('js-gliding');
    var from=scrollY,start=null,dur=instant||Math.abs(to-from)<4?0:DUR;
    function done(){if(id0!==anim)return;scrollTo(0,to);setTimeout(function(){if(id0===anim)root.classList.remove('js-gliding')},120)}
    if(!dur){scrollTo(0,to);done();return true}
    function step(ts){if(id0!==anim)return;if(start==null)start=ts;var p=Math.min(1,(ts-start)/dur);
      scrollTo(0,from+(to-from)*ease(p));if(p<1)requestAnimationFrame(step);else done()}
    requestAnimationFrame(step);return true;
  }
  /* fade out, jump, fade in: no long scroll through the page */
  var fading=0;
  function fadeJump(id){
    var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce){setTimeout(function(){glide(id,true)},document.body.classList.contains('no-scroll')?60:0);return}
    var f=++fading;root.classList.add('nav-fade');
    setTimeout(function(){if(f!==fading)return;glide(id,true);
      requestAnimationFrame(function(){requestAnimationFrame(function(){if(f===fading)root.classList.remove('nav-fade')})})},240);
  }
  document.addEventListener('click',function(e){
    if(e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;
    var h=a.getAttribute('href'),m=/^\/?#([\w-]+)$/.exec(h);if(!m)return;
    if(h.charAt(0)==='/'&&location.pathname!=='/'&&location.pathname!=='/index.html')return;
    var id=m[1];if(id!=='top'&&!document.getElementById(id))return;
    e.preventDefault();
    try{history.pushState(null,'',id==='top'?location.pathname:'#'+id)}catch(err){}
    /* let the menu close and release its scroll lock first */
    fadeJump(id);
  },true);
  /* browser back/forward between in-page links */
  addEventListener('popstate',function(){var id=location.hash.slice(1);fadeJump(id&&/^[\w-]+$/.test(id)&&document.getElementById(id)?id:'top')});
  /* arriving from another page with /#inquire etc. */
  var h0=location.hash.slice(1);
  if(h0&&/^[\w-]+$/.test(h0)){
    var tries=0;(function wait(){
      if(document.getElementById(h0)&&(document.readyState==='complete'||tries>40)){glide(h0,true);setTimeout(function(){glide(h0,true)},400)}
      else if(tries++<80)setTimeout(wait,50);
    })();
  }
})();
