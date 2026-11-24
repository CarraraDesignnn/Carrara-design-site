/* links-v1: on the homepage, the menu and footer "Projects" and "Shop" open the real pages instead of scrolling to sections. */
(function(){
  var MAP={'#work':'/work/','#shop':'/shop/'};
  function fix(){
    [].forEach.call(document.querySelectorAll('nav.menu a[href], .site-footer a[href]'),function(a){
      var h=a.getAttribute('href');if(MAP[h])a.setAttribute('href',MAP[h]);
    });
  }
  fix();
  document.addEventListener('DOMContentLoaded',fix);
  window.addEventListener('load',function(){fix();setTimeout(fix,500);setTimeout(fix,2000)});
  /* the menu and footer are rendered by the app, so catch any re-render */
  if('MutationObserver' in window)new MutationObserver(fix).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['href']});
  /* if a click lands before the rewrite, route it anyway */
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('nav.menu a, .site-footer a');if(!a)return;
    var h=a.getAttribute('href');if(MAP[h]){e.preventDefault();e.stopPropagation();location.href=MAP[h]}
  },true);
})();
