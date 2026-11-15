/* After the hero, the header "Inquire" link turns into a "Start a commission" pill; back to "Inquire" at the contact form */
(function(){
  var a=document.querySelector('.header-cta');if(!a)return;
  var root=document.documentElement,tk=false;
  function upd(){tk=false;var vh=window.innerHeight,top=document.getElementById('top'),inq=document.getElementById('inquire');
    var past=top?top.getBoundingClientRect().bottom<vh*.35:false,atForm=inq&&inq.getBoundingClientRect().top<vh*.85;
    root.classList.toggle('cta-pill',past&&!atForm)}
  function req(){if(!tk){tk=true;requestAnimationFrame(upd)}}
  window.addEventListener('scroll',req,{passive:true});window.addEventListener('resize',req);req();
})();
