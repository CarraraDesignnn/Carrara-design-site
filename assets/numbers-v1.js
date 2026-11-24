/* numbers-v1 (preview): "$500" and a Start a commission button under the consultation price. Waits for the app to hydrate. */
(function(){
  function hydrated(){var s=document.getElementById('pricing');return s&&Object.keys(s).some(function(k){return k.indexOf('__react')===0})}
  function fix(){var p=document.querySelector('.steps-price');if(!p)return;
    var s=p.querySelector('strong');if(s&&s.textContent.trim()==='500 USD')s.textContent='$500';
    if(!p.parentNode.querySelector('.steps-cta')){var a=document.createElement('a');a.className='btn steps-cta';a.href='#inquire';a.textContent='Start a commission';p.insertAdjacentElement('afterend',a)}}
  var n=0;(function poll(){if(hydrated()||n>80){setTimeout(function(){fix();setTimeout(fix,1500)},150);return}n++;setTimeout(poll,100)})();
})();
