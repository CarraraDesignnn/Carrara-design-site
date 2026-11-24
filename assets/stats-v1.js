/* stats-v1: "By the Numbers" — "Happy customers" reads "Clients". */
(function(){
  var MAP={'Happy customers':'Clients'};
  function fix(){[].forEach.call(document.querySelectorAll('.stat-label, .stat .vh'),function(el){
    var t=el.textContent;Object.keys(MAP).forEach(function(k){if(t.indexOf(k)>-1)el.textContent=t.replace(k,MAP[k])})})}
  fix();addEventListener('load',function(){fix();setTimeout(fix,600);setTimeout(fix,2000)});
  if('MutationObserver' in window)new MutationObserver(fix).observe(document.documentElement,{subtree:true,childList:true,characterData:true});
})();
