/* Pinned "what a commission means" section: items fade in one after another as you scroll */
(function(){
  var sec=document.getElementById('pricing');if(!sec)return;
  var root=document.documentElement,items=[].slice.call(sec.querySelectorAll('.step')),price=sec.querySelector('.steps-price'),head=[].slice.call(sec.querySelectorAll('.eyebrow,.steps-head')),big=[].slice.call(sec.querySelectorAll('.steps-big span')),tick=false;
  var all=items.concat([price]);
  var alt=document.createElement('div');alt.className='pager pager-alt';alt.setAttribute('aria-hidden','true');
  alt.innerHTML='<span class="pager-thumb"></span>'+all.map(function(){return '<span class="pager-dot"></span>'}).join('');
  document.body.appendChild(alt);
  /* one snap stop per stage, placed exactly where that stage is fully faded in */
  var stopP=[0,1/3,2/3,1];
  var stops=stopP.map(function(){var d=document.createElement('div');d.className='steps-snap';d.setAttribute('aria-hidden','true');document.body.appendChild(d);return d});
  function place(){var total=sec.offsetHeight-window.innerHeight,t=sec.getBoundingClientRect().top+window.scrollY;stops.forEach(function(d,i){d.style.top=Math.round(t+stopP[i]*total)+'px'})}
  place();window.addEventListener('resize',place);window.addEventListener('load',place);setTimeout(place,1500);
  function upd(){tick=false;var vh=window.innerHeight,r=sec.getBoundingClientRect(),total=sec.offsetHeight-vh,p=Math.min(1,Math.max(0,-r.top/total)),s=.6+p*(all.length-1);
    
    sec.style.setProperty('--p',p.toFixed(4));
    sec.style.setProperty('--r',Math.min(1,Math.max(0,(s-.15)/items.length)).toFixed(4));
    var hp=Math.min(1,Math.max(0,(vh-r.top)/(vh*.6)));head.forEach(function(h){h.style.opacity=hp;h.style.transform='translateY('+((1-hp)*18)+'px)'});
    var cur=-1;
    all.forEach(function(el,k){var rise=Math.min(1,Math.max(0,(s-k-.15)/.45)),o=rise;if(rise>.5&&k<items.length)cur=k;
      if(k<items.length&&s<items.length+.2){var after=s-k-1.15;if(after>0)o=Math.max(.38,1-after*1.6)*rise}
      el.style.opacity=o.toFixed(3);el.style.transform='translateY('+((1-rise)*26).toFixed(1)+'px)'});
    if(s>=items.length+.2)cur=-1;
    big.forEach(function(b,k){b.classList.toggle('is-on',k===cur)});
    price.classList.toggle('is-in',s>items.length+.5);
    /* hand the left dot bar over to the steps while this section fills the screen */
    var inMode=r.top<vh*.25&&r.bottom>vh*.75;root.classList.toggle('steps-mode',inMode);
    if(alt){alt.style.setProperty('--sp',Math.min(all.length-1,Math.max(0,s-.6)).toFixed(3))}}
  function req(){if(!tick){tick=true;requestAnimationFrame(upd)}}
  window.addEventListener('scroll',req,{passive:true});window.addEventListener('resize',req);req();
})();
