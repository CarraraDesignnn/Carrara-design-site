/* Site menu for the static pages (projects, about): the same burger + full-screen menu as the home page. */
(function(){
  var doc=document,body=doc.body,btn=doc.querySelector('.header .header-menu');if(!btn)return;
  var header=btn.closest('.header'),burger=btn.querySelector('.burger');
  var items=[['/','Home'],['/about/','About'],['/work/','Projects'],['/#inquire','Contact']];
  var nav=doc.createElement('nav');nav.id='menu';nav.className='menu';nav.setAttribute('aria-hidden','true');nav.setAttribute('aria-label','Site');
  var here=location.pathname.replace(/index\.html$/,'');
  nav.innerHTML='<ol class="menu-list">'+items.map(function(it,i){
    var cur=it[0]===here?' aria-current="page"':'';
    return '<li><a href="'+it[0]+'" tabindex="-1"'+cur+'><span class="menu-num">0'+(i+1)+'</span>'+it[1]+'</a></li>'}).join('')+
    '</ol><div class="menu-foot"><a href="mailto:contact@carrara.design" tabindex="-1">contact@carrara.design</a>'+
    '<a href="https://www.instagram.com/carrara_design/" target="_blank" rel="noopener noreferrer" tabindex="-1">Instagram @carrara_design</a></div>';
  header.parentNode.insertBefore(nav,header.nextSibling);
  var links=nav.querySelectorAll('a'),open=false;
  function set(v){open=v;
    nav.classList.toggle('is-open',v);burger&&burger.classList.toggle('is-open',v);header.classList.toggle('is-menu',v);
    body.classList.toggle('no-scroll',v);body.classList.toggle('menu-open',v);
    btn.setAttribute('aria-expanded',v?'true':'false');nav.setAttribute('aria-hidden',v?'false':'true');
    for(var i=0;i<links.length;i++)links[i].tabIndex=v?0:-1;
    var lbl=btn.querySelector('.header-label');lbl&&(lbl.textContent=v?'Close':'Menu');
    btn.setAttribute('aria-label',v?'Close menu':'Open menu');
    if(v)setTimeout(function(){links[0]&&links[0].focus({preventScroll:true})},50)}
  btn.addEventListener('click',function(){set(!open)});
  nav.addEventListener('click',function(e){if(e.target.closest('a'))set(false)});
  doc.addEventListener('keydown',function(e){if(open&&e.key==='Escape'){set(false);btn.focus()}});
  addEventListener('pageshow',function(e){if(e.persisted&&open)set(false)});
})();
