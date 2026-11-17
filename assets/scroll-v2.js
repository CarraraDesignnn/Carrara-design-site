/* Mouse-wheel paging: a wheel scroll moves exactly one page (section or commission step),
   and further wheel input is ignored until it arrives. Trackpads and touch are left untouched. */
(function(){
  var root=document.documentElement,busy=false,acc=0,accT=0,until=0,DUR=750;
  function isMouseWheel(e){
    if(e.deltaMode===1||e.deltaMode===2)return true;            /* line/page based: always a wheel */
    var w=e.wheelDeltaY;if(typeof w!=='number'||!w)return false;
    if(e.deltaX!==0)return false;                                 /* sideways movement: trackpad */
    return Math.abs(w)%120===0&&w!==-3*e.deltaY;                 /* notched wheel, not trackpad pixels */
  }
  function stops(){
    var s=[0];
    ['work','shop','inquire'].forEach(function(id){var el=document.getElementById(id);if(el)s.push(el.getBoundingClientRect().top+scrollY)});
    [].slice.call(document.querySelectorAll('.steps-snap')).forEach(function(el){s.push(parseFloat(el.style.top)||0)});
    s.push(root.scrollHeight-innerHeight);
    return s.map(Math.round).filter(function(v,i,a){return v>=0&&a.indexOf(v)===i}).sort(function(a,b){return a-b});
  }
  function blocked(t){return document.body.classList.contains('no-scroll')||document.body.classList.contains('cart-open')||root.classList.contains('is-typing')||(t&&t.closest&&t.closest('.cart,.menu,textarea,select'))}
  function ease(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}
  function go(dir){
    var s=stops(),y=scrollY,to=null,i;
    if(dir>0){for(i=0;i<s.length;i++)if(s[i]>y+4){to=s[i];break}}
    else{for(i=s.length-1;i>=0;i--)if(s[i]<y-4){to=s[i];break}}
    if(to==null)return;
    busy=true;root.classList.add('js-gliding');
    var from=y,start=null;
    function step(ts){if(start==null)start=ts;var p=Math.min(1,(ts-start)/DUR);scrollTo(0,from+(to-from)*ease(p));
      if(p<1)requestAnimationFrame(step);else{scrollTo(0,to);root.classList.remove('js-gliding');busy=false;until=performance.now()+250}}
    requestAnimationFrame(step);
  }
  addEventListener('wheel',function(e){
    if(e.ctrlKey||blocked(e.target)||!isMouseWheel(e))return;
    e.preventDefault();
    var now=performance.now();
    if(busy||now<until){acc=0;return}
    if(now-accT>300)acc=0;accT=now;
    acc+=e.deltaMode?(e.deltaY>0?100:-100):e.deltaY;
    if(Math.abs(acc)>=40){var d=acc>0?1:-1;acc=0;go(d)}
  },{passive:false});
})();
