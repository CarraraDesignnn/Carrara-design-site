/* "What a commission means": 3 points -> studio numbers -> price, one fully-revealed stage per swipe */
(function(){
  var sec=document.getElementById('pricing');if(!sec)return;
  var root=document.documentElement,tick=false;
  var A=sec.querySelector('.scene-a'),B=sec.querySelector('.scene-b');
  var items=[].slice.call(A.querySelectorAll('.step')),headA=[].slice.call(A.querySelectorAll('.eyebrow,.steps-head'));
  var stats=[].slice.call(B.querySelectorAll('.stat')),headB=[].slice.call(B.querySelectorAll('.eyebrow,.steps-head')),price=B.querySelector('.steps-price');
  var big=[].slice.call(sec.querySelectorAll('.steps-big span'));var media=[].slice.call(sec.querySelectorAll('.steps-media img')),mbox=sec.querySelector('.steps-media');
  var N=items.length+2; /* stages: 3 points, numbers, price */
  var alt=document.createElement('div');alt.className='pager pager-alt';alt.setAttribute('aria-hidden','true');
  var dots='';for(var i=0;i<N;i++)dots+='<span class="pager-dot"></span>';alt.innerHTML='<span class="pager-thumb"></span>'+dots;document.body.appendChild(alt);
  var stopP=[];for(var j=0;j<N;j++)stopP.push(j/(N-1));
  var stops=stopP.map(function(){var d=document.createElement('div');d.className='steps-snap';d.setAttribute('aria-hidden','true');document.body.appendChild(d);return d});
  function place(){var total=sec.offsetHeight-window.innerHeight,t=sec.getBoundingClientRect().top+window.scrollY;stops.forEach(function(d,i){d.style.top=Math.round(t+stopP[i]*total)+'px'})}
  function cl(x){return Math.min(1,Math.max(0,x))}
  function set(el,o,y){el.style.opacity=o.toFixed(3);el.style.transform='translateY('+y.toFixed(1)+'px)'}
  function upd(){tick=false;var vh=window.innerHeight,r=sec.getBoundingClientRect(),total=sec.offsetHeight-vh,p=cl(-r.top/total),s=.6+p*(N-1),n=items.length;
    sec.style.setProperty('--p',p.toFixed(4));
    /* scene A: heading + three points */
    var hp=cl((vh-r.top)/(vh*.6)),outA=cl((s-n-.05)/.35);
    headA.forEach(function(h){set(h,hp*(1-outA),(1-hp)*18-outA*24)});
    var cur=-1;
    items.forEach(function(el,k){var rise=cl((s-k-.15)/.45),leave=k<n-1?cl((s-k-1.15)/.45):0;if(rise>.5&&leave<.5)cur=k;set(el,rise*(1-leave)*(1-outA),(1-rise)*26-leave*26-outA*24)});
    var mi=Math.max(0,Math.min(n-1,Math.round(s-.65)));media.forEach(function(im,k){im.classList.toggle('is-on',k===mi)});mbox&&(mbox.style.opacity=(cl((s-.1)/.45)*(1-outA)).toFixed(3));
    A.style.pointerEvents=outA>.5?'none':'';
    /* scene B: studio numbers, then price */
    var inB=cl((s-n-.2)/.4);
    headB.forEach(function(h){set(h,inB,(1-inB)*24)});
    stats.forEach(function(el,k){var o=cl((s-n-.2-k*.06)/.4);set(el,o,(1-o)*24)});
    var on=s>n+.3;stats.forEach(function(el){el.classList.toggle('is-in',on)});
    var pr=cl((s-n-1-.15)/.45);set(price,pr,(1-pr)*26);price.classList.toggle('is-in',pr>.5);
    B.style.pointerEvents=inB<.5?'none':'';
    if(s>n-.1)cur=-1;big.forEach(function(b,k){b.classList.toggle('is-on',k===cur)});
    /* left dot bar hand-off */
    root.classList.toggle('steps-mode',r.top<vh*.25&&r.bottom>vh*.75);
    alt.style.setProperty('--sp',Math.min(N-1,Math.max(0,s-.6)).toFixed(3))}
  function req(){if(!tick){tick=true;requestAnimationFrame(upd)}}
  place();window.addEventListener('resize',function(){place();req()});window.addEventListener('load',place);setTimeout(place,1500);
  window.addEventListener('scroll',req,{passive:true});req();
})();
