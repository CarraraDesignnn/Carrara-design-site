/* Carrara Design monthly drops: products and cart live from Shopify (Storefront API)
   Shopify tags per product:  drop-01, drop-02 …  (which drop it belongs to)
                              edition-25           (edition size shown on the site)
   The newest drop number is "the current drop"; everything older is the archive. */
(function(){
  var DOMAIN='0pckjj-0n.myshopify.com',TOKEN='5fb3738732300eaaf58e711ecfefec82',API='https://'+DOMAIN+'/api/2026-04/graphql.json',KEY='cd-cart-id';
  var W3F='29d94e8d-339a-47d5-9e29-dfc8736775ab';
  var NEXT_DROP=null; /* e.g. '2026-12-01T12:00:00-05:00'; null = 1st of next month, 12:00 ET */

  function gql(q,v){return fetch(API,{method:'POST',headers:{'Content-Type':'application/json','X-Shopify-Storefront-Access-Token':TOKEN},body:JSON.stringify({query:q,variables:v||{}})}).then(function(r){if(!r.ok)throw new Error(r.status);return r.json()}).then(function(j){if(j.errors&&!j.data)throw new Error(j.errors[0].message);return j.data})}
  function money(m){try{return new Intl.NumberFormat('en-US',{style:'currency',currency:m.currencyCode,minimumFractionDigits:(+m.amount%1)?2:0}).format(+m.amount)}catch(e){return '$'+m.amount}}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function img(u,w){return u?u+(u.indexOf('?')>-1?'&':'?')+'width='+w:''}
  function pad(n){return (n<10?'0':'')+n}

  /* ---- drops ---- */
  function tagNum(p,prefix){for(var i=0;i<p.tags.length;i++){var m=new RegExp('^'+prefix+'-?(\\d+)$','i').exec(p.tags[i]);if(m)return +m[1]}return null}
  function nextDrop(){if(NEXT_DROP)return new Date(NEXT_DROP);var n=new Date(),y=n.getUTCFullYear(),m=n.getUTCMonth()+1;if(m>11){m=0;y++}var dst=m>=3&&m<=9;return new Date(Date.UTC(y,m,1,dst?16:17,0,0))}
  function left(p){var q=0,known=false;p.variants.nodes.forEach(function(v){if(typeof v.quantityAvailable==='number'){known=true;q+=Math.max(0,v.quantityAvailable)}});return known?q:null}
  function organise(ps){
    ps.forEach(function(p){p.drop=tagNum(p,'drop');p.edition=tagNum(p,'edition')});
    var max=ps.reduce(function(a,p){return p.drop!=null&&p.drop>a?p.drop:a},-1);
    var current=max<0?ps.slice():ps.filter(function(p){return p.drop===max});
    var archive=max<0?[]:ps.filter(function(p){return p.drop!==max});
    archive.sort(function(a,b){return (b.drop||0)-(a.drop||0)});
    return {number:max<0?null:max,current:current,live:current.some(function(p){return p.availableForSale}),archive:archive};
  }
  function dropLabel(n){return n==null?'Current drop':'Drop '+pad(n)}
  function editionLine(p){var l=left(p),e=p.edition;if(!p.availableForSale)return e?'Edition of '+e+' · Sold out':'Sold out';if(l!=null&&e)return l+' of '+e+' left';if(l!=null)return l+' left';return e?'Edition of '+e:'Limited edition'}

  var Q_PRODUCTS='products(first:100,sortKey:CREATED_AT,reverse:true){nodes{id title description tags availableForSale featuredImage{url altText} images(first:4){nodes{url altText}} priceRange{minVariantPrice{amount currencyCode}} variants(first:30){nodes{id title availableForSale %Q% price{amount currencyCode}}}}}';
  function loadProducts(){return gql('{'+Q_PRODUCTS.replace('%Q%','quantityAvailable')+'}').catch(function(){return gql('{'+Q_PRODUCTS.replace('%Q%','')+'}')}).then(function(d){return organise(d.products.nodes)})}

  /* ---- countdown ---- */
  var timers=[];
  function countdownHTML(){return '<span class="cd" data-cd><span><b data-d>00</b><i>Days</i></span><span><b data-h>00</b><i>Hrs</i></span><span><b data-m>00</b><i>Min</i></span><span><b data-s>00</b><i>Sec</i></span></span>'}
  function startCountdowns(root){var t=nextDrop().getTime();[].slice.call(root.querySelectorAll('[data-cd]')).forEach(function(el){timers.push(el)});
    function tick(){var s=Math.max(0,Math.floor((t-Date.now())/1000));timers.forEach(function(el){el.querySelector('[data-d]').textContent=pad(Math.floor(s/86400));el.querySelector('[data-h]').textContent=pad(Math.floor(s%86400/3600));el.querySelector('[data-m]').textContent=pad(Math.floor(s%3600/60));el.querySelector('[data-s]').textContent=pad(s%60)})}
    tick();if(!startCountdowns.on){startCountdowns.on=1;setInterval(tick,1000)}}
  function dateLabel(){try{return nextDrop().toLocaleDateString('en-US',{month:'long',day:'numeric'})}catch(e){return ''}}

  /* ---- cart ---- */
  var CART_FIELDS='id checkoutUrl totalQuantity cost{subtotalAmount{amount currencyCode}} lines(first:50){nodes{id quantity merchandise{...on ProductVariant{id title product{title} image{url altText} price{amount currencyCode}}}}}';
  var cart=null,drawer,list,sub,checkout,countEls=[];
  function saveId(id){try{id?localStorage.setItem(KEY,id):localStorage.removeItem(KEY)}catch(e){}}
  function loadId(){try{return localStorage.getItem(KEY)}catch(e){return null}}
  function setCart(c){cart=c;saveId(c&&c.id);renderCart()}
  function fetchCart(){var id=loadId();if(!id){renderCart();return}gql('query($id:ID!){cart(id:$id){'+CART_FIELDS+'}}',{id:id}).then(function(d){setCart(d.cart||null)}).catch(renderCart)}
  function add(id){var line={merchandiseId:id,quantity:1};
    var p=cart?gql('mutation($id:ID!,$l:[CartLineInput!]!){cartLinesAdd(cartId:$id,lines:$l){cart{'+CART_FIELDS+'} userErrors{message}}}',{id:cart.id,l:[line]}).then(function(d){return d.cartLinesAdd})
             :gql('mutation($l:[CartLineInput!]!){cartCreate(input:{lines:$l}){cart{'+CART_FIELDS+'} userErrors{message}}}',{l:[line]}).then(function(d){return d.cartCreate});
    return p.then(function(r){if(r.userErrors&&r.userErrors.length)throw new Error(r.userErrors[0].message);setCart(r.cart)})}
  function update(lineId,qty){return (qty>0?gql('mutation($id:ID!,$l:[CartLineUpdateInput!]!){cartLinesUpdate(cartId:$id,lines:$l){cart{'+CART_FIELDS+'}}}',{id:cart.id,l:[{id:lineId,quantity:qty}]}).then(function(d){return d.cartLinesUpdate.cart})
    :gql('mutation($id:ID!,$l:[ID!]!){cartLinesRemove(cartId:$id,lineIds:$l){cart{'+CART_FIELDS+'}}}',{id:cart.id,l:[lineId]}).then(function(d){return d.cartLinesRemove.cart})).then(setCart)}
  function buildDrawer(){
    drawer=document.createElement('div');drawer.className='cart';drawer.setAttribute('aria-hidden','true');
    drawer.innerHTML='<div class="cart-scrim" data-close></div><aside class="cart-panel" role="dialog" aria-modal="true" aria-label="Cart"><div class="cart-head"><h2>Cart</h2><button type="button" class="cart-x" data-close aria-label="Close cart">&times;</button></div><ul class="cart-lines"></ul><div class="cart-foot"><div class="cart-sub"><span>Subtotal</span><span class="cart-sub-v"></span></div><p class="cart-note">Limited editions are not held until checkout is complete. Shipping and taxes are calculated at checkout.</p><a class="btn btn-light cart-checkout" href="#">Checkout</a></div></aside>';
    document.body.appendChild(drawer);list=drawer.querySelector('.cart-lines');sub=drawer.querySelector('.cart-sub-v');checkout=drawer.querySelector('.cart-checkout');
    drawer.addEventListener('click',function(e){if(e.target.closest('[data-close]'))close();var b=e.target.closest('[data-q]');if(b){b.disabled=true;update(b.dataset.line,+b.dataset.q).catch(function(){}).then(function(){b.disabled=false})}});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
  }
  function open(){drawer.classList.add('is-open');drawer.setAttribute('aria-hidden','false');document.body.classList.add('cart-open')}
  function close(){drawer.classList.remove('is-open');drawer.setAttribute('aria-hidden','true');document.body.classList.remove('cart-open')}
  function renderCart(){
    var n=cart?cart.totalQuantity:0;countEls.forEach(function(el){el.textContent=n;el.parentNode.classList.toggle('has-items',n>0)});
    if(!list)return;var lines=cart?cart.lines.nodes:[];
    if(!lines.length){list.innerHTML='<li class="cart-empty">Your cart is empty.</li>';sub.textContent=money({amount:0,currencyCode:'USD'});checkout.classList.add('is-disabled');checkout.removeAttribute('href');return}
    list.innerHTML=lines.map(function(l){var m=l.merchandise,v=m.title&&m.title!=='Default Title'?'<span class="cart-variant">'+esc(m.title)+'</span>':'';
      return '<li class="cart-line">'+(m.image?'<img src="'+esc(img(m.image.url,200))+'" alt="">':'<span class="cart-ph"></span>')+'<div class="cart-info"><span class="cart-title">'+esc(m.product.title)+'</span>'+v+'<span class="cart-price">'+money(m.price)+'</span><div class="cart-qty"><button type="button" data-line="'+esc(l.id)+'" data-q="'+(l.quantity-1)+'" aria-label="Decrease">&minus;</button><span>'+l.quantity+'</span><button type="button" data-line="'+esc(l.id)+'" data-q="'+(l.quantity+1)+'" aria-label="Increase">+</button><button type="button" class="cart-rm" data-line="'+esc(l.id)+'" data-q="0">Remove</button></div></div></li>'}).join('');
    sub.textContent=money(cart.cost.subtotalAmount);checkout.classList.remove('is-disabled');checkout.href=cart.checkoutUrl;
  }

  /* ---- waitlist (Web3Forms) ---- */
  function bindWaitlist(root){[].slice.call(root.querySelectorAll('[data-waitlist]')).forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();var b=f.querySelector('button'),i=f.querySelector('input[type=email]'),msg=f.querySelector('[data-wl-msg]');if(f.querySelector('[name=botcheck]').checked)return;b.disabled=true;b.textContent='…';
    fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({access_key:W3F,subject:'Drop waitlist signup',from_name:'Carrara Design website',email:i.value,list:'Monthly drop waitlist'})}).then(function(r){return r.json()}).then(function(r){if(!r.success)throw 0;f.classList.add('is-done');msg.textContent='You’re on the list. We’ll email you before the next drop.'}).catch(function(){b.disabled=false;b.textContent='Notify me';msg.textContent='Something went wrong. Please try again.'})})})}
  function waitlistHTML(){return '<form class="waitlist" data-waitlist novalidate><label class="vh" for="wl-email">Email</label><input id="wl-email" type="email" required placeholder="Email address" autocomplete="email" inputmode="email"><input type="checkbox" name="botcheck" class="hp" tabindex="-1" aria-hidden="true"><button type="submit" class="btn btn-light">Notify me</button><p class="waitlist-msg" data-wl-msg aria-live="polite"></p></form>'}

  /* ---- shop page ---- */
  function variantSelect(p){var vs=p.variants.nodes;if(vs.length===1&&vs[0].title==='Default Title')return '';return '<label class="shop-opt"><span class="vh">Size</span><select data-variant>'+vs.map(function(v){return '<option value="'+esc(v.id)+'" data-price="'+esc(money(v.price))+'"'+(v.availableForSale?'':' disabled')+'>'+esc(v.title)+(v.availableForSale?'':' — sold out')+'</option>'}).join('')+'</select></label>'}
  function firstVariant(p){var vs=p.variants.nodes;return vs.filter(function(v){return v.availableForSale})[0]||vs[0]}
  function featured(p,num){
    var im=p.featuredImage,v=firstVariant(p),ok=p.availableForSale;
    return '<article class="drop-feature'+(ok?'':' is-sold')+'"><div class="drop-media">'+(im?'<img src="'+esc(img(im.url,1400))+'" srcset="'+esc(img(im.url,800))+' 800w, '+esc(img(im.url,1400))+' 1400w, '+esc(img(im.url,2000))+' 2000w" sizes="(max-width: 900px) 100vw, 50vw" alt="'+esc(im.altText||p.title)+'" decoding="async">':'')+(ok?'':'<span class="drop-stamp">Sold out</span>')+'</div>'
      +'<div class="drop-info"><p class="drop-kicker"><span class="drop-dot'+(ok?' is-live':'')+'"></span>'+esc(dropLabel(num))+(ok?' · Live now':' · Sold out')+'</p><h2 class="drop-title">'+esc(p.title)+'</h2>'+(p.description?'<p class="drop-desc">'+esc(p.description)+'</p>':'')
      +'<p class="drop-edition">'+esc(editionLine(p))+'</p><p class="drop-price" data-price>'+money(v.price)+'</p>'
      +(ok?variantSelect(p)+'<button type="button" class="btn btn-light drop-add" data-add="'+esc(v.id)+'">Add to cart</button><p class="drop-fine">Strictly limited. Never reprinted.</p>':'<p class="drop-fine">This edition is gone. Join the list to hear about the next drop first.</p>')+'</div></article>';
  }
  function archiveCard(p){var im=p.featuredImage;return '<li class="arch-item'+(p.availableForSale?'':' is-sold')+'"><div class="arch-media">'+(im?'<img src="'+esc(img(im.url,700))+'" alt="'+esc(im.altText||p.title)+'" loading="lazy" decoding="async">':'')+'</div><p class="arch-kicker">'+esc(dropLabel(p.drop))+'</p><h3 class="arch-title">'+esc(p.title)+'</h3><p class="arch-status">'+esc(p.edition?'Edition of '+p.edition+' · ':'')+(p.availableForSale?'Last few available':'Sold out')+'</p></li>'}
  function renderShop(root,d){
    var feat=root.querySelector('[data-drop-current]'),arch=root.querySelector('[data-drop-archive]'),next=root.querySelector('[data-drop-next]');
    if(!d.current.length){feat.innerHTML='<div class="drop-empty"><p class="drop-kicker">'+esc(dropLabel(d.number))+'</p><h2 class="drop-title">The first drop is coming.</h2></div>'}
    else feat.innerHTML=d.current.map(function(p){return featured(p,d.number)}).join('');
    next.querySelector('[data-next-head]').textContent=d.live?'Next drop':'Next drop — '+dateLabel();
    if(arch){var a=d.archive.concat(d.live?[]:[]);arch.closest('.drop-archive').hidden=!a.length;arch.innerHTML=a.map(archiveCard).join('')}
    startCountdowns(root);
  }
  function liveCheck(id){
    return gql('query($id:ID!){node(id:$id){...on ProductVariant{availableForSale quantityAvailable}}}',{id:id})
      .catch(function(){return gql('query($id:ID!){node(id:$id){...on ProductVariant{availableForSale}}}',{id:id})})
      .then(function(d){return d.node||{availableForSale:false}})}
  function wait(ms){return new Promise(function(r){setTimeout(r,ms)})}
  function markSold(box){var f=box.closest('.drop-feature');if(!f)return;f.classList.add('is-sold');var m=f.querySelector('.drop-media');if(m&&!m.querySelector('.drop-stamp'))m.insertAdjacentHTML('beforeend','<span class="drop-stamp">Sold out</span>');var k=f.querySelector('.drop-kicker');if(k)k.innerHTML=k.innerHTML.replace('Live now','Sold out').replace(' is-live','');var dot=f.querySelector('.drop-dot');if(dot)dot.classList.remove('is-live');var fine=f.querySelector('.drop-fine');if(fine)fine.innerHTML='This edition is gone. <a href="#notify">Join the list</a> to hear about the next drop first.'}
  function bindAdd(root){
    root.addEventListener('change',function(e){var s=e.target.closest('[data-variant]');if(!s)return;var box=s.closest('.drop-info'),o=s.options[s.selectedIndex];box.querySelector('[data-add]').dataset.add=s.value;box.querySelector('[data-price]').textContent=o.dataset.price});
    root.addEventListener('click',function(e){var b=e.target.closest('[data-add]');if(!b||b.disabled)return;var box=b.closest('.drop-info'),label=b.textContent,ed=box.querySelector('.drop-edition');
      b.disabled=true;b.classList.add('is-checking');b.innerHTML='<span class="chk-spin" aria-hidden="true"></span>Adding…';
      liveCheck(b.dataset.add).then(function(v){return [v]}).then(function(r){var v=r[0];
        if(!v.availableForSale){b.classList.remove('is-checking');b.classList.add('is-sold');b.textContent='Sold out';markSold(box);return}
        if(typeof v.quantityAvailable==='number'&&ed){var m=/of (\d+)/.exec(ed.textContent);ed.textContent=v.quantityAvailable+(m?' of '+m[1]:'')+' left'}
        return add(b.dataset.add).then(function(){b.classList.remove('is-checking');b.classList.add('is-ok');b.textContent='Added to cart';open();
          setTimeout(function(){b.classList.remove('is-ok');b.textContent=label;b.disabled=false},2600)});
      }).catch(function(){b.classList.remove('is-checking');b.textContent='Something went wrong. Try again';b.disabled=false;setTimeout(function(){if(!b.disabled)b.textContent=label},2500)})});
  }

  /* ---- home teaser ---- */
  function renderHome(slot,media,d){
    var p=d.current[0];
    if(p&&p.featuredImage&&media){media.innerHTML='<img src="'+esc(img(p.featuredImage.url,1200))+'" alt="'+esc(p.featuredImage.altText||p.title)+'" decoding="async">'+(d.live?'':'<span class="drop-stamp">Sold out</span>')}
    slot.innerHTML=d.live&&p
      ?'<p class="drop-kicker"><span class="drop-dot is-live"></span>'+esc(dropLabel(d.number))+' · Live now</p><p class="drop-home-title">'+esc(p.title)+'</p><p class="drop-edition">'+esc(editionLine(p))+'</p>'
      :'<p class="drop-kicker"><span class="drop-dot"></span>'+(p?esc(dropLabel(d.number))+' · Sold out':'Next drop')+'</p><p class="drop-home-title">Next drop · '+esc(dateLabel())+'</p>'+countdownHTML();
    var btn=slot.parentNode.querySelector('[data-drop-cta]');if(btn)btn.textContent=d.live?'Shop the drop':'Get notified';if(btn&&!d.live)btn.setAttribute('href','/shop/#notify');
    startCountdowns(slot);
  }

  /* ---- init ---- */
  var shopRoot=document.querySelector('[data-drop-shop]'),homeSlot=document.querySelector('[data-drop-home]'),cartBtn=document.querySelector('[data-cart-open]');
  if(shopRoot||cartBtn||loadId())buildDrawer();
  if(cartBtn){countEls.push(cartBtn.querySelector('[data-cart-count]'));cartBtn.addEventListener('click',function(e){e.preventDefault();open()})}
  if(shopRoot){var nx=shopRoot.querySelector('[data-drop-next]');nx.querySelector('[data-cd-slot]').innerHTML=countdownHTML();nx.querySelector('[data-wl-slot]').innerHTML=waitlistHTML();bindWaitlist(shopRoot);bindAdd(shopRoot);startCountdowns(shopRoot)}
  if(shopRoot||homeSlot)loadProducts().then(function(d){if(shopRoot)renderShop(shopRoot,d);if(homeSlot)renderHome(homeSlot,document.querySelector('[data-drop-media]'),d)}).catch(function(){if(shopRoot)shopRoot.querySelector('[data-drop-current]').innerHTML='<p class="shop-msg">The shop is temporarily unavailable. Please <a href="/#inquire">send us an inquiry</a> to order.</p>';if(homeSlot)homeSlot.innerHTML=''});
  if(drawer)fetchCart();
})();
