/* home-b2b-v4: "Who We Work With" scene before What a Commission Means, same card style. see home-b2b-v4.css. Everything is added after the app hydrates, and the
   form choice is put back if the form is rebuilt (e.g. after "Send another"). */
(function(){
  function hydrated(){var s=document.getElementById('pricing');return s&&Object.keys(s).some(function(k){return k.indexOf('__react')===0})}
  function hero(){
    var b=document.querySelector('#top .hero-btn');if(!b||document.querySelector('.hero-noai'))return;
    var p=document.createElement('p');p.className='hero-noai';p.innerHTML='<span>Rendered by hand. No AI.</span>';
    b.insertAdjacentElement('afterend',p);
  }
  function whoFor(){
    if(document.getElementById('who'))return;
    var before=document.querySelector('#pricing .scene-a');if(!before)return;
    var s=document.createElement('div');s.id='who';s.className='panel who steps-scene';s.setAttribute('aria-labelledby','who-title');
    s.innerHTML='<div class="who-in"><h2 id="who-title" class="h3 who-head">Who We Work With</h2><ul class="who-cards">'
      +'<li class="who-card"><img src="/img/who/owners-800.jpg" srcset="/img/who/owners-480.jpg 480w, /img/who/owners-800.jpg 800w" sizes="(max-width:800px) 46vw, 24vw" alt="A client Pagani Huayra BC" loading="lazy" decoding="async" draggable="false"><div class="who-cap"><p class="who-label">Owners &amp; Collectors</p><p class="who-line">Design the car you have been waiting for.</p></div></li>'
      +'<li class="who-card"><img src="/img/who/dealers-800.jpg" srcset="/img/who/dealers-480.jpg 480w, /img/who/dealers-800.jpg 800w" sizes="(max-width:800px) 46vw, 24vw" alt="A specified Porsche 911 interior" loading="lazy" decoding="async" draggable="false"><div class="who-cap"><p class="who-label">Dealers</p><p class="who-line">Help your clients commit to bespoke orders.</p></div></li>'
      +'<li class="who-card"><img src="/img/who/restomod-800.jpg" srcset="/img/who/restomod-480.jpg 480w, /img/who/restomod-800.jpg 800w" sizes="(max-width:800px) 46vw, 24vw" alt="A recommissioned Porsche Carrera GT" loading="lazy" decoding="async" draggable="false"><div class="who-cap"><p class="who-label">Restomodders</p><p class="who-line">Show the build before it begins.</p></div></li>'
      +'<li class="who-card"><img src="/img/who/oem-800.jpg" srcset="/img/who/oem-480.jpg 480w, /img/who/oem-800.jpg 800w" sizes="(max-width:800px) 46vw, 24vw" alt="The studio at work" loading="lazy" decoding="async" draggable="false"><div class="who-cap"><p class="who-label">Manufacturers</p><p class="who-line">Visuals for decks, unveils and launches.</p></div></li>'
      +'</ul></div>';
    before.parentNode.insertBefore(s,before);
  }
  var OPTS=['Owner','Dealer','Restomodder','Manufacturer','Other'];
  function who(){
    var f=document.querySelector('#inquire form');if(!f||f.querySelector('.who'))return;
    var msg=f.querySelector('#f-message');var at=msg?msg.closest('.field'):null;if(!at)return;
    var fs=document.createElement('fieldset');fs.className='who field-full';
    fs.innerHTML='<legend>I am</legend><div class="who-opts">'+OPTS.map(function(o){return '<label><input type="radio" name="client_type" value="'+o+'"><span>'+(o==='Owner'?'An owner':o==='Other'?'Something else':'A '+o.toLowerCase())+'</span></label>'}).join('')+'</div>';
    at.parentNode.insertBefore(fs,at);
  }
  function all(){hero();whoFor();who()}
  var n=0;(function poll(){if(hydrated()){setTimeout(function(){all();var inq=document.getElementById('inquire');if(inq&&window.MutationObserver)new MutationObserver(function(){who()}).observe(inq,{childList:true,subtree:true})},60);return}if(++n<200)setTimeout(poll,50)})();
})();
