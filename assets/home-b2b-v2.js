/* home-b2b-v2: dealer section rebuilt with image cards. see home-b2b-v2.css. Everything is added after the app hydrates, and the
   form choice is put back if the form is rebuilt (e.g. after "Send another"). */
(function(){
  function hydrated(){var s=document.getElementById('pricing');return s&&Object.keys(s).some(function(k){return k.indexOf('__react')===0})}
  function hero(){
    var b=document.querySelector('#top .hero-btn');if(!b||document.querySelector('.hero-noai'))return;
    var p=document.createElement('p');p.className='hero-noai';p.innerHTML='<span>Rendered by hand. No AI.</span>';
    b.insertAdjacentElement('afterend',p);
  }
  function b2b(){
    if(document.getElementById('b2b'))return;
    var inq=document.getElementById('inquire');if(!inq)return;
    var s=document.createElement('section');s.id='b2b';s.className='panel b2b steps-scene';s.setAttribute('aria-labelledby','b2b-title');
    s.innerHTML='<div class="wrap"><div class="b2b-head">'
      +'<h2 id="b2b-title" class="h3">For Dealers, Restomodders &amp; Manufacturers</h2>'
      +'<p class="body">Fine automotive CGI that helps you sell bespoke cars. Your clients see exactly what they are ordering, and you get visuals for every stage, from the spec to the unveil.</p>'
      +'</div><ul class="b2b-cards">'
      +'<li class="b2b-card"><div class="b2b-media"><img src="/img/b2b/spec-800.jpg" srcset="/img/b2b/spec-480.jpg 480w, /img/b2b/spec-800.jpg 800w" sizes="(max-width:800px) 46vw, 23vw" alt="Your client&rsquo;s car, designed live in 3D" loading="lazy" decoding="async" draggable="false"></div><p class="b2b-num">01</p><h3 class="b2b-name">Live spec sessions</h3></li>'
      +'<li class="b2b-card"><div class="b2b-media"><img src="/img/b2b/unveil-800.jpg" srcset="/img/b2b/unveil-480.jpg 480w, /img/b2b/unveil-800.jpg 800w" sizes="(max-width:800px) 46vw, 23vw" alt="A studio render for a presentation" loading="lazy" decoding="async" draggable="false"></div><p class="b2b-num">02</p><h3 class="b2b-name">Decks and unveils</h3></li>'
      +'<li class="b2b-card"><div class="b2b-media"><img src="/img/b2b/social-800.jpg" srcset="/img/b2b/social-480.jpg 480w, /img/b2b/social-800.jpg 800w" sizes="(max-width:800px) 46vw, 23vw" alt="A launch image for social media" loading="lazy" decoding="async" draggable="false"></div><p class="b2b-num">03</p><h3 class="b2b-name">Social content</h3></li>'
      +'<li class="b2b-card"><div class="b2b-media"><img src="/img/b2b/art-800.jpg" srcset="/img/b2b/art-480.jpg 480w, /img/b2b/art-800.jpg 800w" sizes="(max-width:800px) 46vw, 23vw" alt="A framed print of a client car" loading="lazy" decoding="async" draggable="false"></div><p class="b2b-num">04</p><h3 class="b2b-name">Fine art</h3></li>'
      +'</ul><a class="work-all b2b-link" href="#inquire">Work with us</a></div>';
    inq.parentNode.insertBefore(s,inq);
    s.querySelector('.b2b-link').addEventListener('click',function(){setTimeout(function(){var r=document.querySelector('.who input[value="Dealer"]');if(r&&!document.querySelector('.who input:checked'))r.checked=true},50)});
  }
  var OPTS=['Owner','Dealer','Restomodder','Manufacturer','Other'];
  function who(){
    var f=document.querySelector('#inquire form');if(!f||f.querySelector('.who'))return;
    var msg=f.querySelector('#f-message');var at=msg?msg.closest('.field'):null;if(!at)return;
    var fs=document.createElement('fieldset');fs.className='who field-full';
    fs.innerHTML='<legend>I am</legend><div class="who-opts">'+OPTS.map(function(o){return '<label><input type="radio" name="client_type" value="'+o+'"><span>'+(o==='Owner'?'An owner':o==='Other'?'Something else':'A '+o.toLowerCase())+'</span></label>'}).join('')+'</div>';
    at.parentNode.insertBefore(fs,at);
  }
  function all(){hero();b2b();who()}
  var n=0;(function poll(){if(hydrated()){setTimeout(function(){all();var inq=document.getElementById('inquire');if(inq&&window.MutationObserver)new MutationObserver(function(){who()}).observe(inq,{childList:true,subtree:true})},60);return}if(++n<200)setTimeout(poll,50)})();
})();
