/* stats-v2: "By the Numbers" — "Happy customers" reads "Clients". Waits for the app to hydrate so React's markup check passes. */
(function(){
  var MAP={'Happy customers':'Clients'};
  var root=document.getElementById('root')||document.body;
  function hydrated(){var s=document.getElementById('pricing')||root;return Object.keys(s).some(function(k){return k.indexOf('__react')===0})}
  function fix(){[].forEach.call(document.querySelectorAll('.stat-label, .stat .vh'),function(el){
    var t=el.textContent;Object.keys(MAP).forEach(function(k){if(t.indexOf(k)>-1)el.textContent=t.replace(k,MAP[k])})})}
  var n=0;(function poll(){if(hydrated()||n>80){setTimeout(function(){fix();
      if('MutationObserver' in window)new MutationObserver(fix).observe(root,{subtree:true,childList:true,characterData:true})},150);return}
    n++;setTimeout(poll,100)})();
})();
