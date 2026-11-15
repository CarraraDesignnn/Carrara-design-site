/* Sticky "Start a commission" button on phones: shows after the hero, hides at the contact form and footer */
(function(){
  var b=document.createElement('a');b.className='sticky-cta';b.href='#inquire';b.textContent='Start a commission';document.body.appendChild(b);
  var t=false;
  function upd(){t=false;var vh=window.innerHeight,top=document.getElementById('top'),inq=document.getElementById('inquire'),f=document.querySelector('.site-footer');
    var past=top?top.getBoundingClientRect().bottom<vh*.35:window.scrollY>vh;
    var atForm=inq&&inq.getBoundingClientRect().top<vh*.85;
    var busy=document.body.classList.contains('no-scroll')||document.documentElement.classList.contains('is-typing');
    b.classList.toggle('is-on',past&&!atForm&&!busy)}
  function req(){if(!t){t=true;requestAnimationFrame(upd)}}
  window.addEventListener('scroll',req,{passive:true});window.addEventListener('resize',req);
  new MutationObserver(req).observe(document.body,{attributes:true,attributeFilter:['class']});req();
})();
