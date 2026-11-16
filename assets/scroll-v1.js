/* Desktop / trackpad paging: one swipe or wheel gesture = one section, with a smooth glide.
   Replaces CSS scroll-snap on devices with a mouse or trackpad (macOS momentum fights snap). Phones keep native snap. */
(function(){
  if(!window.matchMedia||!matchMedia('(hover: hover) and (pointer: fine)').matches)return;
  var root=document.documentElement;root.classList.add('js-paging');
  var animating=false,lastT=0,lastAbs=0,acc=0,fired=false,DUR=850;

  function stops(){
    var s=[0];
    ['work','shop','inquire'].forEach(function(id){var el=document.getElementById(id);if(el)s.push(el.getBoundingClientRect().top+scrollY)});
    [].slice.call(document.querySelectorAll('.steps-snap')).forEach(function(el){s.push(parseFloat(el.style.top)||0)});
    s.push(root.scrollHeight-innerHeight);
    return s.map(Math.round).filter(function(v,i,a){return v>=0&&a.indexOf(v)===i}).sort(function(a,b){return a-b});
  }
  function blocked(t){return document.body.classList.contains('no-scroll')||document.body.classList.contains('cart-open')||root.classList.contains('is-typing')||(t&&t.closest&&t.closest('.cart,.menu,input,textarea,select'))}
  function ease(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}
  function go(dir){
    var s=stops(),y=scrollY,to=null;
    if(dir>0){for(var i=0;i<s.length;i++)if(s[i]>y+4){to=s[i];break}}
    else{for(var j=s.length-1;j>=0;j--)if(s[j]<y-4){to=s[j];break}}
    if(to==null)return;
    var from=y,start=null,d=Math.min(DUR,Math.max(500,Math.abs(to-from)*.9));animating=true;
    function step(ts){if(start==null)start=ts;var p=Math.min(1,(ts-start)/d);scrollTo(0,from+(to-from)*ease(p));if(p<1)requestAnimationFrame(step);else{animating=false}}
    requestAnimationFrame(step);
  }
  addEventListener('wheel',function(e){
    if(e.ctrlKey||blocked(e.target))return;
    if(Math.abs(e.deltaX)>Math.abs(e.deltaY))return;
    e.preventDefault();
    var now=performance.now(),abs=Math.abs(e.deltaY),gap=now-lastT;lastT=now;
    if(animating){fired=true;lastAbs=abs;acc=0;return}
    /* a new gesture: a pause, or a fresh push stronger than the fading momentum */
    if((gap>180&&abs>=4)||(abs>lastAbs*1.6&&abs>18&&gap>40)){fired=false;acc=0}
    lastAbs=abs;
    if(animating||fired)return;
    acc+=e.deltaY;
    if(Math.abs(acc)>=24){fired=true;go(acc>0?1:-1);acc=0}
  },{passive:false});
  addEventListener('keydown',function(e){
    if(blocked(document.activeElement)||e.metaKey||e.ctrlKey||e.altKey)return;
    var k=e.key,dir=(k==='ArrowDown'||k==='PageDown'||(k===' '&&!e.shiftKey))?1:(k==='ArrowUp'||k==='PageUp'||(k===' '&&e.shiftKey))?-1:0;
    if(!dir||animating)return;e.preventDefault();go(dir);
  });
})();
