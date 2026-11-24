/* edgescroll-v1: on desktop, sideways strips scroll by mouse position. Near the left edge they glide left,
   near the right edge they glide right, faster the closer to the edge. The middle stays still. */
(function(){
  var fine=matchMedia('(hover:hover) and (pointer:fine)');
  function attach(el){
    if(el.dataset.edge)return;el.dataset.edge='1';
    var v=0,raf=0,inside=false,snap='';
    function step(){if(!inside||!v){raf=0;return}el.scrollLeft+=v;raf=requestAnimationFrame(step)}
    el.addEventListener('mouseenter',function(){if(!fine.matches)return;inside=true;snap=el.style.scrollSnapType;el.style.scrollSnapType='none';el.style.scrollBehavior='auto'});
    el.addEventListener('mousemove',function(e){
      if(!fine.matches)return;
      var r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,zone=0.28,s=0;
      if(x<zone)s=-(1-x/zone);else if(x>1-zone)s=(x-(1-zone))/zone;
      v=Math.sign(s)*Math.pow(Math.abs(s),1.6)*16;
      if(v&&!raf)raf=requestAnimationFrame(step);
    });
    el.addEventListener('mouseleave',function(){inside=false;v=0;el.style.scrollSnapType=snap;el.style.scrollBehavior=''});
  }
  function scan(){[].forEach.call(document.querySelectorAll('.work .rail, .pj-strip .pj-track'),attach)}
  function go(){scan();setTimeout(scan,1200);setTimeout(scan,3000)}
  if(document.readyState==='complete')go();else addEventListener('load',go);
})();
