/* Carrara Design shop: products and cart live from Shopify (Storefront API) */
(function(){
  var DOMAIN='0pckjj-0n.myshopify.com',TOKEN='144f098cbeebbcf5bfd76c165cd6c09a',API='https://'+DOMAIN+'/api/2026-04/graphql.json',KEY='cd-cart-id';
  function gql(q,v){return fetch(API,{method:'POST',headers:{'Content-Type':'application/json','X-Shopify-Storefront-Access-Token':TOKEN},body:JSON.stringify({query:q,variables:v||{}})}).then(function(r){if(!r.ok)throw new Error(r.status);return r.json()}).then(function(j){if(j.errors)throw new Error(j.errors[0].message);return j.data})}
  function money(m){try{return new Intl.NumberFormat('en-US',{style:'currency',currency:m.currencyCode,minimumFractionDigits:(+m.amount%1)?2:0}).format(+m.amount)}catch(e){return '$'+m.amount}}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function img(u,w){return u?u+(u.indexOf('?')>-1?'&':'?')+'width='+w:''}

  var CART_FIELDS='id checkoutUrl totalQuantity cost{subtotalAmount{amount currencyCode}} lines(first:50){nodes{id quantity merchandise{...on ProductVariant{id title product{title} image{url altText} price{amount currencyCode}}}}}';
  var cart=null;
  function saveId(id){try{id?localStorage.setItem(KEY,id):localStorage.removeItem(KEY)}catch(e){}}
  function loadId(){try{return localStorage.getItem(KEY)}catch(e){return null}}
  function setCart(c){cart=c;saveId(c&&c.id);renderCart()}
  function fetchCart(){var id=loadId();if(!id){renderCart();return Promise.resolve()}return gql('query($id:ID!){cart(id:$id){'+CART_FIELDS+'}}',{id:id}).then(function(d){setCart(d.cart||null)}).catch(function(){renderCart()})}
  function add(variantId,qty){var line={merchandiseId:variantId,quantity:qty||1};
    var p=cart?gql('mutation($id:ID!,$l:[CartLineInput!]!){cartLinesAdd(cartId:$id,lines:$l){cart{'+CART_FIELDS+'} userErrors{message}}}',{id:cart.id,l:[line]}).then(function(d){return d.cartLinesAdd})
             :gql('mutation($l:[CartLineInput!]!){cartCreate(input:{lines:$l}){cart{'+CART_FIELDS+'} userErrors{message}}}',{l:[line]}).then(function(d){return d.cartCreate});
    return p.then(function(r){if(r.userErrors&&r.userErrors.length)throw new Error(r.userErrors[0].message);setCart(r.cart)})}
  function update(lineId,qty){var q=qty>0?gql('mutation($id:ID!,$l:[CartLineUpdateInput!]!){cartLinesUpdate(cartId:$id,lines:$l){cart{'+CART_FIELDS+'}}}',{id:cart.id,l:[{id:lineId,quantity:qty}]}).then(function(d){return d.cartLinesUpdate.cart})
                         :gql('mutation($id:ID!,$l:[ID!]!){cartLinesRemove(cartId:$id,lineIds:$l){cart{'+CART_FIELDS+'}}}',{id:cart.id,l:[lineId]}).then(function(d){return d.cartLinesRemove.cart});
    return q.then(setCart)}

  /* ---- cart drawer ---- */
  var drawer,list,sub,checkout,countEls=[];
  function buildDrawer(){
    drawer=document.createElement('div');drawer.className='cart';drawer.setAttribute('aria-hidden','true');
    drawer.innerHTML='<div class="cart-scrim" data-close></div><aside class="cart-panel" role="dialog" aria-modal="true" aria-label="Cart"><div class="cart-head"><h2>Cart</h2><button type="button" class="cart-x" data-close aria-label="Close cart">&times;</button></div><ul class="cart-lines"></ul><div class="cart-foot"><div class="cart-sub"><span>Subtotal</span><span class="cart-sub-v"></span></div><p class="cart-note">Shipping and taxes are calculated at checkout.</p><a class="btn btn-light cart-checkout" href="#">Checkout</a></div></aside>';
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

  /* ---- product grid (shop page) ---- */
  function card(p){
    var vs=p.variants.nodes,one=vs.length===1&&vs[0].title==='Default Title',min=p.priceRange.minVariantPrice,multi=!one&&vs.some(function(v){return v.price.amount!==vs[0].price.amount});
    var im=p.featuredImage,alt=im&&im.altText||p.title;
    var sel=one?'':'<label class="shop-opt"><span class="vh">Size</span><select data-variant>'+vs.map(function(v){return '<option value="'+esc(v.id)+'" data-price="'+esc(money(v.price))+'"'+(v.availableForSale?'':' disabled')+'>'+esc(v.title)+(v.availableForSale?'':' — sold out')+'</option>'}).join('')+'</select></label>';
    var first=vs.filter(function(v){return v.availableForSale})[0]||vs[0];
    return '<li class="print shop-item" data-id="'+esc(p.id)+'"><div class="print-media">'+(im?'<img src="'+esc(img(im.url,900))+'" srcset="'+esc(img(im.url,600))+' 600w, '+esc(img(im.url,900))+' 900w, '+esc(img(im.url,1400))+' 1400w" sizes="(max-width: 1000px) 50vw, 25vw" alt="'+esc(alt)+'" loading="lazy" decoding="async">':'')+'</div>'
      +'<div class="print-info"><h2 class="print-title">'+esc(p.title)+'</h2>'+(p.description?'<p class="print-meta">'+esc(p.description)+'</p>':'')+'<p class="print-price" data-price>'+(multi?'From '+money(min):money(first.price))+'</p></div>'
      +sel+'<button type="button" class="btn btn-ghost print-btn" data-add="'+esc(first.id)+'"'+(p.availableForSale?'':' disabled')+'>'+(p.availableForSale?'Add to cart':'Sold out')+'</button></li>';
  }
  function loadGrid(grid){
    grid.innerHTML=Array(4).join('<li class="print shop-skel"><div class="print-media"></div><div class="print-info"><span></span><span></span></div></li>')+'<li class="print shop-skel"><div class="print-media"></div><div class="print-info"><span></span><span></span></div></li>';
    gql('{products(first:50,sortKey:CREATED_AT){nodes{id title description availableForSale featuredImage{url altText} priceRange{minVariantPrice{amount currencyCode}} variants(first:30){nodes{id title availableForSale price{amount currencyCode}}}}}}').then(function(d){
      var ps=d.products.nodes;if(!ps.length){grid.innerHTML='<li class="shop-msg">New prints are coming soon.</li>';return}
      grid.innerHTML=ps.map(card).join('');
    }).catch(function(){grid.innerHTML='<li class="shop-msg">The shop is temporarily unavailable. Please <a href="/#inquire">send us an inquiry</a> to order.</li>'});
    grid.addEventListener('change',function(e){var s=e.target.closest('[data-variant]');if(!s)return;var li=s.closest('.shop-item'),o=s.options[s.selectedIndex];li.querySelector('[data-add]').dataset.add=s.value;li.querySelector('[data-price]').textContent=o.dataset.price});
    grid.addEventListener('click',function(e){var b=e.target.closest('[data-add]');if(!b||b.disabled)return;var t=b.textContent;b.disabled=true;b.textContent='Adding…';
      add(b.dataset.add,1).then(function(){b.textContent='Added';open();setTimeout(function(){b.textContent=t;b.disabled=false},1200)}).catch(function(){b.textContent='Try again';b.disabled=false})});
  }

  /* ---- init ---- */
  var grid=document.querySelector('[data-shop-grid]'),cartBtn=document.querySelector('[data-cart-open]');
  if(grid||cartBtn||loadId()){buildDrawer()}
  if(cartBtn){countEls.push(cartBtn.querySelector('[data-cart-count]'));cartBtn.addEventListener('click',function(e){e.preventDefault();open()})}
  if(grid)loadGrid(grid);
  if(drawer)fetchCart();
})();
