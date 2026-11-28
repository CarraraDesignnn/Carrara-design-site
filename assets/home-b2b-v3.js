/* home-b2b-v3: short note for businesses inside the inquiry section (replaces the dealer section). see home-b2b-v3.css. Everything is added after the app hydrates, and the
   form choice is put back if the form is rebuilt (e.g. after "Send another"). */
(function(){
  function hydrated(){var s=document.getElementById('pricing');return s&&Object.keys(s).some(function(k){return k.indexOf('__react')===0})}
  function hero(){
    var b=document.querySelector('#top .hero-btn');if(!b||document.querySelector('.hero-noai'))return;
    var p=document.createElement('p');p.className='hero-noai';p.innerHTML='<span>Rendered by hand. No AI.</span>';
    b.insertAdjacentElement('afterend',p);
  }
  function trade(){
    if(document.querySelector('.trade-note'))return;
    var at=document.querySelector('#inquire .team-reply');if(!at)return;
    var d=document.createElement('div');d.className='trade-note';
    d.innerHTML='<p class="trade-label">For businesses</p><p class="trade-text">We also create custom CGI for dealers, restomodders and manufacturers, from client spec sessions to unveils. Pick your role in the form and tell us what you need.</p>';
    at.insertAdjacentElement('afterend',d);
  }
  var OPTS=['Owner','Dealer','Restomodder','Manufacturer','Other'];
  function who(){
    var f=document.querySelector('#inquire form');if(!f||f.querySelector('.who'))return;
    var msg=f.querySelector('#f-message');var at=msg?msg.closest('.field'):null;if(!at)return;
    var fs=document.createElement('fieldset');fs.className='who field-full';
    fs.innerHTML='<legend>I am</legend><div class="who-opts">'+OPTS.map(function(o){return '<label><input type="radio" name="client_type" value="'+o+'"><span>'+(o==='Owner'?'An owner':o==='Other'?'Something else':'A '+o.toLowerCase())+'</span></label>'}).join('')+'</div>';
    at.parentNode.insertBefore(fs,at);
  }
  function all(){hero();trade();who()}
  var n=0;(function poll(){if(hydrated()){setTimeout(function(){all();var inq=document.getElementById('inquire');if(inq&&window.MutationObserver)new MutationObserver(function(){who();trade()}).observe(inq,{childList:true,subtree:true})},60);return}if(++n<200)setTimeout(poll,50)})();
})();
