/* home-b2b-v1: see home-b2b-v1.css. Everything is added after the app hydrates, and the
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
    s.innerHTML='<div class="wrap b2b-in"><div class="b2b-copy">'
      +'<p class="b2b-kick">For dealers, restomodders and manufacturers</p>'
      +'<h2 id="b2b-title" class="h3">Fine automotive CGI for you and your clients</h2>'
      +'<p class="body">We help you turn the spec process into part of the sale. Your clients design special and bespoke options with us and see exactly what they are ordering, which raises the value of each car and keeps your timelines on track.</p>'
      +'<a class="work-all b2b-link" href="#inquire" data-who="business">Work with us</a></div>'
      +'<ul class="b2b-list">'
      +'<li><span>01</span>Spec sessions with your clients</li>'
      +'<li><span>02</span>Presentation decks and unveils</li>'
      +'<li><span>03</span>Social content</li>'
      +'<li><span>04</span>Fine art</li>'
      +'</ul></div>';
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
