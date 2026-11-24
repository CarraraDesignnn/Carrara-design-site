/* v53: framed prints read "30 × 40 Framed Fine Art Print". v52: product format line reads "30 × 40 Fine Art Print" (no "in"). v51: Family Portrait sits inside the pair grid, spanning both columns. v50: shop page framed prints side by side, Family Portrait beneath. v49: homepage hero restored to the two-up image layout, framed prints only; Family Portrait lives on the shop page. v48: shop stacks cards vertically; homepage shows a left-to-right row, framed prints first and the unframed print scrolls in. v47: shop page shows the Family Portrait in its own row beneath the framed prints. v46: homepage hero shows the two framed prints only, not the Family Portrait. v45: homepage hero back to the two-up image layout. v44: framed prints sit side by side; Family Portrait scrolls in as the third card. v42: homepage hero line names the limit and the December print. v41: homepage hero uses the framed prints, not the secondary print. v40: homepage: framed prints lead, secondary print sits beneath. v39: per-product fine print, format, edition text, commission grid, framed links. v38: print-specific Made by Hand, no films; "30 × 40 in Framed Print" under the title. v33: consent line under the waitlist. v32: drop waitlist adds the email to Shopify customers, subscribed to email marketing. */
/* Carrara Design monthly drops: products and cart live from Shopify (Storefront API)
   Shopify tags per product:  drop-01, drop-02 …  (which drop it belongs to)
                              (edition size is fixed at 10 below; edition-NN tags are ignored)
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
  var DEFAULT_EDITION=10,DEFAULT_DROP=1; /* every print is limited to 10 */
  var OLD_LISTINGS=['serafino-gt2rs','serafino-gt3rs-framed-print'],COLL='';
  function kind(p){var t=(p.title||'')+' '+(p.handle||'');return /gt\s?3/i.test(t)?'gt3':/gt\s?2/i.test(t)?'gt2':''}
  function organise(ps){
    /* outdated listings drop off the site as soon as the new ones are visible to it */
    var fresh=ps.filter(function(p){return OLD_LISTINGS.indexOf(p.handle)<0});if(fresh.length&&fresh.length<ps.length)ps=fresh;
    COLL='';ps.forEach(function(p){var m=/[-\u2013\u2014]\s*(?:the\s+)?([^-\u2013\u2014]+?\s+collection)\s*$/i.exec(p.title||'');if(m&&!COLL)COLL=m[1].replace(/\b\w/g,function(c){return c.toUpperCase()})});
    ps.forEach(function(p){p.drop=tagNum(p,'drop');p.edition=DEFAULT_EDITION});
    var max=ps.reduce(function(a,p){return p.drop!=null&&p.drop>a?p.drop:a},-1);
    var current=max<0?ps.slice():ps.filter(function(p){return p.drop===max});
    var archive=max<0?[]:ps.filter(function(p){return p.drop!==max});
    archive.sort(function(a,b){return (b.drop||0)-(a.drop||0)});
    return {number:max<0?DEFAULT_DROP:max,current:current,live:current.some(function(p){return p.availableForSale}),archive:archive};
  }
  function PX(p){return (window.PRINTS||{})[p.handle]||{}}
  function fineFor(p){return PX(p).fine||'Strictly limited. Never reprinted.'}
  function subFor(p){return PX(p).format||'Framed print'}
  function dropLabel(n){return n==null?'Current drop':'Drop '+pad(n)}
  function editionLine(p){if(PX(p).editionText)return PX(p).editionText;var l=left(p),e=p.edition;if(!p.availableForSale)return e?'Edition of '+e+' · Sold out':'Sold out';if(l!=null&&l>0&&e)return l+' of '+e+' left';if(l!=null&&l>0)return l+' left';return e?'Edition of '+e:'Limited edition'}

  var Q_PRODUCTS='products(first:100,sortKey:CREATED_AT,reverse:true){nodes{id handle title description descriptionHtml tags availableForSale featuredImage{url altText} images(first:12){nodes{url altText}} media(first:20){nodes{mediaContentType alt ...on MediaImage{image{url altText}} ...on Video{previewImage{url} sources{url mimeType width}} ...on ExternalVideo{embedUrl previewImage{url}}}} priceRange{minVariantPrice{amount currencyCode}} variants(first:30){nodes{id title availableForSale %Q% price{amount currencyCode}}}}}';
  var Q_NOMEDIA=Q_PRODUCTS.replace(/ media\(first:20\)\{.*?\}\}\}\}(?= priceRange)/,'');
  function loadProducts(){return gql('{'+Q_PRODUCTS.replace('%Q%','quantityAvailable')+'}').catch(function(){return gql('{'+Q_PRODUCTS.replace('%Q%','')+'}')}).catch(function(){return gql('{'+Q_NOMEDIA.replace('%Q%','')+'}')}).then(function(d){return organise(d.products.nodes)})}
  /* photos and videos exactly as ordered in Shopify (Products > Media) */
  function mediaList(p){var out=[];((p.media&&p.media.nodes)||[]).forEach(function(m){
    if(m.mediaContentType==='IMAGE'&&m.image)out.push({type:'image',url:m.image.url,altText:m.image.altText||m.alt});
    else if(m.mediaContentType==='VIDEO'){var src=(m.sources||[]).filter(function(x){return /mp4/i.test(x.mimeType)}).sort(function(a,b){return (b.width||0)-(a.width||0)})[0]||(m.sources||[])[0];if(src)out.push({type:'video',src:src.url,url:m.previewImage&&m.previewImage.url,altText:m.alt})}
    else if(m.mediaContentType==='EXTERNAL_VIDEO'&&m.embedUrl)out.push({type:'embed',src:m.embedUrl,url:m.previewImage&&m.previewImage.url,altText:m.alt})});
    return out.length?out:(p.images&&p.images.nodes.length?p.images.nodes:(p.featuredImage?[p.featuredImage]:[]))}
  function mainHTML(m,t){if(m.type==='video')return '<video data-main src="'+esc(m.src)+'"'+(m.url?' poster="'+esc(img(m.url,1600))+'"':'')+' autoplay muted loop playsinline disablepictureinpicture preload="auto"></video>';
    if(m.type==='embed')return '<iframe data-main src="'+esc(m.src)+'" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="'+esc(t)+'"></iframe>';
    return '<img data-main src="'+esc(img(m.url,1600))+'" srcset="'+esc(img(m.url,900))+' 900w, '+esc(img(m.url,1600))+' 1600w, '+esc(img(m.url,2400))+' 2400w" sizes="(max-width: 900px) 100vw, 55vw" alt="'+esc(m.altText||t)+'" decoding="async">'}

  /* ---- countdown ---- */
  var timers=[];
  function countdownHTML(){return '<span class="cd" data-cd><span><b data-d>00</b><i>Days</i></span><span><b data-h>00</b><i>Hrs</i></span><span><b data-m>00</b><i>Min</i></span><span><b data-s>00</b><i>Sec</i></span></span>'}
  function startCountdowns(root){var t=nextDrop().getTime();[].slice.call(root.querySelectorAll('[data-cd]')).forEach(function(el){timers.push(el)});
    function tick(){var s=Math.max(0,Math.floor((t-Date.now())/1000));timers.forEach(function(el){el.querySelector('[data-d]').textContent=pad(Math.floor(s/86400));el.querySelector('[data-h]').textContent=pad(Math.floor(s%86400/3600));el.querySelector('[data-m]').textContent=pad(Math.floor(s%3600/60));el.querySelector('[data-s]').textContent=pad(s%60)})}
    tick();if(!startCountdowns.on){startCountdowns.on=1;setInterval(tick,1000)}}
  function dateLabel(){try{return nextDrop().toLocaleDateString('en-US',{month:'long',day:'numeric'})}catch(e){return ''}}

  /* ---- cart ---- */
  var CART_FIELDS='id checkoutUrl totalQuantity cost{subtotalAmount{amount currencyCode}} lines(first:50){nodes{id quantity merchandise{...on ProductVariant{id title product{title} image{url altText} price{amount currencyCode}}}}}';
  var cart=null,drawer,list,sub,checkout,countEls=[],fab=null;
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
    var n=cart?cart.totalQuantity:0;countEls.forEach(function(el){el.textContent=n;el.parentNode.classList.toggle('has-items',n>0)});if(fab){fab.classList.toggle('is-on',n>0);fab.setAttribute('aria-label','Cart, '+n+' item'+(n===1?'':'s'))}
    if(!list)return;var lines=cart?cart.lines.nodes:[];
    if(!lines.length){list.innerHTML='<li class="cart-empty">Your cart is empty.</li>';sub.textContent=money({amount:0,currencyCode:'USD'});checkout.classList.add('is-disabled');checkout.removeAttribute('href');return}
    list.innerHTML=lines.map(function(l){var m=l.merchandise,v=m.title&&m.title!=='Default Title'?'<span class="cart-variant">'+esc(m.title)+'</span>':'';
      return '<li class="cart-line">'+(m.image?'<img src="'+esc(img(m.image.url,200))+'" alt="">':'<span class="cart-ph"></span>')+'<div class="cart-info"><span class="cart-title">'+esc(cleanTitle(m.product.title))+'</span>'+v+'<span class="cart-price">'+money(m.price)+'</span><div class="cart-qty"><button type="button" data-line="'+esc(l.id)+'" data-q="'+(l.quantity-1)+'" aria-label="Decrease">&minus;</button><span>'+l.quantity+'</span><button type="button" data-line="'+esc(l.id)+'" data-q="'+(l.quantity+1)+'" aria-label="Increase">+</button><button type="button" class="cart-rm" data-line="'+esc(l.id)+'" data-q="0">Remove</button></div></div></li>'}).join('');
    sub.textContent=money(cart.cost.subtotalAmount);checkout.classList.remove('is-disabled');checkout.href=cart.checkoutUrl;
  }

  /* ---- waitlist (Web3Forms) ---- */
  function bindWaitlist(root){[].slice.call(root.querySelectorAll('[data-waitlist]')).forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();var b=f.querySelector('button'),i=f.querySelector('input[type=email]'),msg=f.querySelector('[data-wl-msg]');if(f.querySelector('[name=botcheck]').checked)return;b.disabled=true;b.textContent='…';
    (function(em){var a=new Uint8Array(18);crypto.getRandomValues(a);var pw='Cd!'+Array.prototype.map.call(a,function(x){return ('0'+x.toString(16)).slice(-2)}).join('');return fetch(API,{method:'POST',headers:{'Content-Type':'application/json','X-Shopify-Storefront-Access-Token':TOKEN},body:JSON.stringify({query:'mutation($i:CustomerCreateInput!){customerCreate(input:$i){customer{id} customerUserErrors{code}}}',variables:{i:{email:em,password:pw,acceptsMarketing:true}}})}).then(function(r){return r.json()}).then(function(r){var d=r&&r.data&&r.data.customerCreate;if(!d)throw 0;if(d.customer)return {success:true};var taken=(d.customerUserErrors||[]).some(function(e){return e.code==='TAKEN'||e.code==='CUSTOMER_DISABLED'});if(!taken)throw 0;return fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({access_key:W3F,subject:'Drop waitlist signup (existing customer: tick email marketing in Shopify)',from_name:'Carrara Design website',email:em,list:'Monthly drop waitlist'})}).then(function(r){return r.json()})})})(i.value.trim()).then(function(r){if(!r.success)throw 0;f.classList.add('is-done');msg.textContent='You’re on the list. We’ll email you before the next drop.'}).catch(function(){b.disabled=false;b.textContent='Notify me';msg.textContent='Something went wrong. Please try again.'})})})}
  function waitlistHTML(){return '<form class="waitlist" data-waitlist novalidate><label class="vh" for="wl-email">Email</label><input id="wl-email" type="email" required placeholder="Email address" autocomplete="email" inputmode="email"><input type="checkbox" name="botcheck" class="hp" tabindex="-1" aria-hidden="true"><button type="submit" class="btn btn-light">Notify me</button><p class="waitlist-msg" data-wl-msg aria-live="polite"></p><p class="waitlist-legal">By joining, you agree to emails about drops and studio news. Unsubscribe anytime.</p></form>'}

  /* ---- shop page ---- */
  function variantSelect(p){var vs=p.variants.nodes;if(vs.length===1&&vs[0].title==='Default Title')return '';return '<label class="shop-opt"><span class="vh">Size</span><select data-variant>'+vs.map(function(v){return '<option value="'+esc(v.id)+'" data-price="'+esc(money(v.price))+'"'+(v.availableForSale?'':' disabled')+'>'+esc(v.title)+(v.availableForSale?'':' — sold out')+'</option>'}).join('')+'</select></label>'}
  function firstVariant(p){var vs=p.variants.nodes;return vs.filter(function(v){return v.availableForSale})[0]||vs[0]}
  function cleanTitle(t){return String(t||'').replace(/\s*[-\u2013\u2014]\s*(?:the\s+)?[^-\u2013\u2014]+?\s+collection\s*$/i,'').replace(/\s*framed print\s*$/i,'').replace(/GT(\d)RS/g,'GT$1 RS')}
  function featured(p,num){
    var im=p.featuredImage,v=firstVariant(p),ok=p.availableForSale;
    return '<article class="drop-feature'+(ok?'':' is-sold')+'"><div class="drop-media">'+(im?'<img src="'+esc(img(im.url,1400))+'" srcset="'+esc(img(im.url,800))+' 800w, '+esc(img(im.url,1400))+' 1400w, '+esc(img(im.url,2000))+' 2000w" sizes="(max-width: 900px) 100vw, 50vw" alt="'+esc(im.altText||p.title)+'" decoding="async">':'')+(ok?'<span class="drop-chip"><span class="drop-dot is-live"></span>Live now</span>':'<span class="drop-stamp">Sold out</span>')+'</div>'
      +'<div class="drop-info"><p class="drop-kicker">'+esc(dropLabel(num))+' · '+esc(new Date().toLocaleString('en-US',{month:'long'}))+'</p><h2 class="drop-title">'+esc(cleanTitle(p.title))+'</h2><p class="drop-sub">'+esc(subFor(p))+'</p>'+(p.description&&!/^\s*framed print\.?\s*$/i.test(p.description)?'<p class="drop-desc">'+esc(p.description)+'</p>':'')
      +'<p class="drop-meta"><span class="drop-price" data-price>'+money(v.price)+'</span><span class="drop-edition">'+esc(editionLine(p))+'</span></p>'
      +(ok?variantSelect(p)+'<button type="button" class="btn btn-light drop-add" data-add="'+esc(v.id)+'">Preorder</button><p class="drop-fine">'+esc(fineFor(p))+'</p>':'<p class="drop-fine">This edition is gone. Join the list to hear about the next drop first.</p>')+'</div></article>';
  }
  function joinTitles(ts){if(ts.length<2)return ts.join('');var w=ts.map(function(t){return t.split(' ')}),k=0;while(w.every(function(x){return x.length>k+1&&x[k]===w[0][k]}))k++;return ts.map(function(t,i){return (i&&k?w[i].slice(k).join(' '):t).replace(/(GT\d) (RS)/g,'$1\u00a0$2')}).join(' & ')}
  function collectionName(ts){if(COLL)return COLL;var w=ts.map(function(t){return t.split(' ')}),k=0;while(w.every(function(x){return x.length>k+1&&x[k]===w[0][k]}))k++;return k?w[0].slice(0,k).join(' ')+' Collection':joinTitles(ts)}
  function card(p){
    var im=p.featuredImage,v=firstVariant(p),ok=p.availableForSale;
    var href='/shop/print/?p='+encodeURIComponent(p.handle);
    return '<article class="drop-feature drop-card'+(PX(p).secondary?' is-wide':'')+(ok?'':' is-sold')+'"><a class="drop-media drop-link" href="'+esc(href)+'" aria-label="View '+esc(cleanTitle(p.title))+'">'+(im?'<img src="'+esc(img(im.url,1000))+'" srcset="'+esc(img(im.url,700))+' 700w, '+esc(img(im.url,1000))+' 1000w, '+esc(img(im.url,1500))+' 1500w" sizes="(max-width: 900px) 100vw, 40vw" alt="'+esc(im.altText||p.title)+'" decoding="async">':'')+(ok?'':'<span class="drop-stamp">Sold out</span>')+'<span class="drop-view">View details</span></a>'
      +'<div class="drop-info"><h3 class="drop-title"><a href="'+esc(href)+'">'+esc(cleanTitle(p.title))+'</a></h3>'
      +'<p class="drop-meta"><span class="drop-price" data-price>'+money(v.price)+'</span><span class="drop-edition">'+esc(editionLine(p))+'</span></p>'
      +(ok?variantSelect(p)+'<button type="button" class="btn btn-light drop-add" data-add="'+esc(v.id)+'">Preorder</button>':'<p class="drop-fine">This edition is gone.</p>')+'</div></article>';
  }
  function pairHead(d){var e=d.current[0].edition,same=d.current.every(function(p){return p.edition===e});
    return '<header class="drop-pair-head"><p class="drop-kicker">'+(d.live?'<span class="drop-dot is-live"></span>':'')+esc(dropLabel(d.number))+' · '+esc(new Date().toLocaleString('en-US',{month:'long'}))+(d.live?' · Live now':' · Sold out')+'</p><h2 class="drop-pair-title">'+esc(collectionName(d.current.map(function(p){return cleanTitle(p.title)})))+'</h2><p class="drop-pair-sub">'+(d.current.length===2?'Two':d.current.length)+' framed prints'+(same&&e?', '+e+' of each':'')+'. Strictly limited, never reprinted.</p></header>'}
  function archiveCard(p){p=Object.assign({},p,{title:cleanTitle(p.title)});var im=p.featuredImage;return '<li class="arch-item'+(p.availableForSale?'':' is-sold')+'"><div class="arch-media">'+(im?'<img src="'+esc(img(im.url,700))+'" alt="'+esc(im.altText||p.title)+'" loading="lazy" decoding="async">':'')+'</div><p class="arch-kicker">'+esc(dropLabel(p.drop))+'</p><h3 class="arch-title">'+esc(p.title)+'</h3><p class="arch-status">'+esc(p.edition?'Edition of '+p.edition+' · ':'')+(p.availableForSale?'Last few available':'Sold out')+'</p></li>'}
  function renderShop(root,d){
    var feat=root.querySelector('[data-drop-current]'),arch=root.querySelector('[data-drop-archive]'),next=root.querySelector('[data-drop-next]');
    if(!d.current.length){feat.innerHTML='<div class="drop-empty"><p class="drop-kicker">'+esc(dropLabel(d.number))+'</p><h2 class="drop-title">The first drop is coming.</h2></div>'}
    else if(d.current.length>1){var MAIN=d.current.filter(function(p){return !PX(p).secondary}),SIDE=d.current.filter(function(p){return PX(p).secondary});var dd=Object.assign({},d,{current:MAIN.length?MAIN:d.current});feat.classList.add('is-pair');feat.innerHTML=pairHead(dd)+'<div class="drop-pair">'+dd.current.concat(SIDE).map(card).join('')+'</div>'}
    else feat.innerHTML=d.current.map(function(p){return featured(p,d.number)}).join('');
    next.querySelector('[data-next-head]').textContent='Drop Launch Date — '+dateLabel();
    if(arch){var a=d.archive.concat(d.live?[]:[]);arch.closest('.drop-archive').hidden=!a.length;arch.innerHTML=a.map(archiveCard).join('')}
    startCountdowns(root);
  }
  function liveCheck(id){
    return gql('query($id:ID!){node(id:$id){...on ProductVariant{availableForSale quantityAvailable}}}',{id:id})
      .catch(function(){return gql('query($id:ID!){node(id:$id){...on ProductVariant{availableForSale}}}',{id:id})})
      .then(function(d){return d.node||{availableForSale:false}})}
  function wait(ms){return new Promise(function(r){setTimeout(r,ms)})}
  function markSold(box){var f=box.closest('.drop-feature');if(!f)return;f.classList.add('is-sold');var m=f.querySelector('.drop-media');var ch=m&&m.querySelector('.drop-chip');if(ch)ch.remove();if(m&&!m.querySelector('.drop-stamp'))m.insertAdjacentHTML('beforeend','<span class="drop-stamp">Sold out</span>');var k=f.querySelector('.drop-kicker');if(k)k.innerHTML=k.innerHTML.replace('Live now','Sold out').replace(' is-live','');var dot=f.querySelector('.drop-dot');if(dot)dot.classList.remove('is-live');var fine=f.querySelector('.drop-fine');if(fine)fine.innerHTML='This edition is gone. <a href="#notify">Join the list</a> to hear about the next drop first.'}
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


  /* ---- product page (/shop/print/?p=handle) ---- */
  /* gallery: every photo/video is a slide in a native scroll-snap track (smooth swipe, momentum, no re-rendering) */
  function slideHTML(m,t,i){var inner;
    if(m.type==='video'){inner='<video muted loop playsinline preload="none" disablepictureinpicture data-src="'+esc(m.src)+'"'+(m.url?' poster="'+esc(img(m.url,900))+'"':'')+'></video>'}
    else if(m.type==='embed'){inner='<iframe data-src="'+esc(m.src)+'" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="'+esc(t)+'"></iframe>'}
    else{var ss=esc(img(m.url,700))+' 700w, '+esc(img(m.url,1100))+' 1100w, '+esc(img(m.url,1600))+' 1600w, '+esc(img(m.url,2200))+' 2200w',sz='(max-width: 900px) 100vw, 55vw',al=esc(m.altText||t);
      inner=i<2?'<img src="'+esc(img(m.url,1100))+'" srcset="'+ss+'" sizes="'+sz+'" alt="'+al+'" decoding="async"'+(i===0?' fetchpriority="high"':'')+' draggable="false">'
              :'<img data-src="'+esc(img(m.url,1100))+'" data-srcset="'+ss+'" sizes="'+sz+'" alt="'+al+'" decoding="async" draggable="false">'}
    return '<div class="pp-slide">'+inner+'</div>'}
  function trackHTML(ims,t){return '<div class="pp-track" data-track>'+ims.map(function(m,i){return slideHTML(m,t,i)}).join('')+'</div>'}
  var FIRST={gt2:['shop-3','shop-1','shop-2'],gt3:['shop-1','shop-2','shop-3']},FIRST_DEFAULT=['shop-1','shop-2'];
  function craft(h,X){var M=X&&X.madeByHand;if(M){return '<div class="pj ab pp-craft">'+(M.image?'<figure class="pp-film"><img src="'+esc(M.image.src)+'" alt="'+esc(M.image.alt||'')+'" loading="lazy" decoding="async"></figure>':'')+(M.video?'<figure class="pp-film"><video src="'+esc(M.video.mp4)+'" poster="'+esc(M.video.poster)+'" autoplay muted loop playsinline preload="metadata" aria-label="'+esc(M.video.alt||'')+'"><source src="'+esc(M.video.mp4)+'" type="video/mp4"><source src="'+esc(M.video.mov)+'" type="video/quicktime"></video></figure>':'')+'<section class="pj-text"><p class="pj-eyebrow">Our craft</p><h2 class="pj-h2">Made by Hand</h2>'+M.paras.map(function(x){return '<p>'+esc(x)+'</p>'}).join('')+'</section></div>'}return '<div class="pj ab pp-craft">'+
    '<section class="pj-text"><p class="pj-eyebrow">Our craft</p><h2 class="pj-h2">Made by Hand</h2>'+
    '<p>Every print begins as a blank file. We model the car from scratch in 3D, then build each material by hand: the flake in the paint, the grain of the leather, every stitch and every weave of carbon fiber.</p></section>'+
    '<section class="pj-text"><p>It is then rendered at hyper resolution, so the detail holds at 30 × 40 inches. The closer you stand, the more there is to see.</p>'+
    '<p>Not a single pixel is generated by AI. This is fine automotive art, made the same way we design the real cars.</p></section></div>'}
  function renderProduct(root,d){
    var h=new URLSearchParams(location.search).get('p')||'',all=d.current.concat(d.archive),p=all.filter(function(x){return x.handle===h})[0];
    if(!p){root.innerHTML='<div class="pp-missing"><p class="drop-kicker">Not found</p><h1 class="pp-title">This Print Isn’t Available</h1><a class="btn btn-light" href="/shop/">Back to the shop</a></div>';return}
    var inCur=d.current.indexOf(p)>-1,group=inCur?d.current:all.filter(function(x){return x.drop===p.drop}),coll=COLL||group.length>1?collectionName(group.map(function(x){return cleanTitle(x.title)})):'';
    var PR=window.PRINTS||{},X=PR[p.handle]||PR[{gt3:'serafino-gt3rs-framed-print',gt2:'serafino-gt2rs'}[kind(p)]]||{},HL=X.highlights||window.PRINT_HIGHLIGHTS||[];
    var t=cleanTitle(p.title),v=firstVariant(p),ok=p.availableForSale,ims=mediaList(p);
    document.title=t+' — Carrara Design';
    var desc=p.descriptionHtml&&!/^\s*(<p>)?\s*framed print\.?\s*(<\/p>)?\s*$/i.test(p.descriptionHtml)?p.descriptionHtml:'';
    var others=group.filter(function(x){return x!==p});
    root.innerHTML='<a class="pp-back" href="/shop/">&larr; '+esc(coll||'Back to the shop')+'</a>'
      +'<article class="pp drop-feature'+(ok?'':' is-sold')+'">'
      +'<div class="pp-gallery"><div class="pp-main drop-media">'+trackHTML(ims,t)+(ok?(inCur?'<span class="drop-chip"><span class="drop-dot is-live"></span>Live now</span>':''):'<span class="drop-stamp">Sold out</span>')+'</div>'
      +(ims.length>1?'<div class="pp-thumbs">'+ims.map(function(m,i){return '<button type="button" class="pp-thumb'+(i?'':' is-on')+(m.type&&m.type!=='image'?' is-video':'')+'" data-i="'+i+'" aria-label="'+(m.type&&m.type!=='image'?'Video ':'Image ')+(i+1)+'">'+(m.url?'<img src="'+esc(img(m.url,240))+'" alt="" loading="lazy">':'')+'</button>'}).join('')+'</div>':'')+'</div>'
      +'<div class="pp-info drop-info"><p class="drop-kicker">'+esc(dropLabel(p.drop!=null?p.drop:d.number))+(coll?' · '+esc(coll):'')+'</p><h1 class="pp-title">'+esc(t)+'</h1><p class="drop-sub pp-format">'+(X.size?esc(X.size.replace(/\s*in\.?$/,''))+' ':'')+esc(PX(p).format||'Framed Fine Art Print')+'</p>'+(X.blurb?'<p class="pp-blurb">'+esc(X.blurb)+'</p>':'')
      +'<p class="drop-meta"><span class="drop-price" data-price>'+money(v.price)+'</span><span class="drop-edition">'+esc(editionLine(p))+'</span></p>'
      +(ok?variantSelect(p)+'<button type="button" class="btn btn-light drop-add" data-add="'+esc(v.id)+'">Preorder</button>':'<p class="drop-fine">This edition is gone. <a href="/shop/#notify">Join the list</a> to hear about the next drop first.</p>')
      +(desc?'<div class="pp-desc">'+desc+'</div>':'')
      +(HL.length?'<ul class="pp-highlights">'+HL.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul>':'')
      +'<dl class="pp-specs"><div><dt>Edition</dt><dd>'+(PX(p).editionSpec?esc(PX(p).editionSpec):(p.edition?'Limited to '+p.edition:'Limited')+', never reprinted')+'</dd></div><div><dt>Size</dt><dd>'+esc(X.size||'—')+'</dd></div><div><dt>Format</dt><dd>Framed, ready to display</dd></div>'+(coll?'<div><dt>Collection</dt><dd>'+esc(coll)+'</dd></div>':'')+'<div><dt>Shipping</dt><dd>Calculated at checkout</dd></div></dl>'
      +'</div></article>'
      +craft(kind(p),X)
      +(X.commissions?'<div class="pp-transition"><p class="drop-kicker">The commission</p><p>'+esc(X.transition)+'</p></div><div class="pp-commission-grid">'+X.commissions.map(function(c){return '<a class="pp-commission" href="'+esc(c.link)+'"><img src="'+esc(c.image)+'" alt="" loading="lazy" decoding="async"><span class="pp-commission-copy"><span class="pp-commission-kicker">'+esc(c.kicker)+'</span><span class="pp-commission-title">'+esc(c.title)+' &rarr;</span></span></a>'}).join('')+'</div>'+(X.framedLinks?'<div class="pp-framed-links">'+X.framedLinks.map(function(l){return '<a class="pp-framed-link" href="'+esc(l.href)+'">'+esc(l.label)+' &rarr;</a>'}).join('')+'</div>':''):(X.story&&X.story.link?(X.story.transition?'<div class="pp-transition"><p class="drop-kicker">The commission</p><p>'+esc(X.story.transition)+'</p></div>':'')+'<a class="pp-commission" href="'+esc(X.story.link)+'"><img src="'+esc(X.story.image)+'" alt="" loading="lazy" decoding="async"><span class="pp-commission-copy"><span class="pp-commission-kicker">The commission</span><span class="pp-commission-title">View the commission &rarr;</span></span></a>':''))
      +(others.length?'<section class="pp-more"><p class="drop-kicker">Also in '+esc(coll||'this drop')+'</p><div class="pp-more-grid">'+others.map(function(o){var oi=o.featuredImage;return '<a class="pp-more-card" href="/shop/print/?p='+esc(encodeURIComponent(o.handle))+'">'+(oi?'<img src="'+esc(img(oi.url,800))+'" alt="'+esc(oi.altText||o.title)+'" loading="lazy">':'')+'<span>'+esc(cleanTitle(o.title))+'</span></a>'}).join('')+'</div></section>':'');
    var cur=0,box=root.querySelector('.pp-main');
    /* Made by Hand: same section as the About page, nav arrows, shuffled films that play when in view */
    [].forEach.call(root.querySelectorAll('.pp-craft .pj-strip'),function(sp){var tr=sp.querySelector('.pj-track'),pv=sp.querySelector('.pv'),nx=sp.querySelector('.nx');function stp(){var f=tr.querySelector('figure');return f?f.getBoundingClientRect().width+14:300}function up(){pv.disabled=tr.scrollLeft<4;nx.disabled=tr.scrollLeft+tr.clientWidth>=tr.scrollWidth-4}pv.onclick=function(){tr.scrollBy({left:-stp(),behavior:'smooth'})};nx.onclick=function(){tr.scrollBy({left:stp(),behavior:'smooth'})};tr.addEventListener('scroll',up,{passive:true});up()});
    var ft=root.querySelector('.pp-craft .ab-films .pj-track');if(ft){var fa=[].slice.call(ft.children).slice((FIRST[kind(p)]||FIRST_DEFAULT).length);for(var fi=fa.length-1;fi>0;fi--){var fj=Math.floor(Math.random()*(fi+1)),fx=fa[fi];fa[fi]=fa[fj];fa[fj]=fx}fa.forEach(function(e){ft.appendChild(e)})}
    if('IntersectionObserver' in window){var fio=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;if(e.isIntersecting){v.preload='auto';var p=v.play();p&&p.catch&&p.catch(function(){})}else v.pause()})},{threshold:.4});[].forEach.call(root.querySelectorAll('.pp-craft .ab-films video'),function(v){fio.observe(v)})}

    var tr=root.querySelector('[data-track]'),slides=tr?[].slice.call(tr.children):[],thumbs=[].slice.call(root.querySelectorAll('.pp-thumb')),raf=0;
    function load(k){var sl=slides[k];if(!sl)return;[].forEach.call(sl.querySelectorAll('[data-src]'),function(el){if(el.tagName==='IMG'){if(el.dataset.srcset)el.srcset=el.dataset.srcset;el.src=el.dataset.src}else if(!el.getAttribute('src'))el.src=el.dataset.src;el.removeAttribute('data-src');el.removeAttribute('data-srcset')})}
    function active(k){slides.forEach(function(sl,n){var v=sl.querySelector('video');if(!v)return;if(n===k){load(n);v.muted=true;var pr=v.play();pr&&pr.catch&&pr.catch(function(){})}else{v.pause()}})}
    function show(k){if(k===cur&&show.done)return;cur=k;show.done=1;thumbs.forEach(function(x,n){x.classList.toggle('is-on',n===k);if(n===k&&x.scrollIntoView)x.scrollIntoView({block:'nearest',inline:'nearest'})});load(k-1);load(k);load(k+1);load(k+2);active(k)}
    if(tr&&slides.length){
      tr.addEventListener('scroll',function(){if(raf)return;raf=requestAnimationFrame(function(){raf=0;var w=tr.clientWidth||1,k=Math.max(0,Math.min(slides.length-1,Math.round(tr.scrollLeft/w)));show(k)})},{passive:true});
      root.addEventListener('click',function(e){var b=e.target.closest('.pp-thumb');if(!b)return;var k=+b.dataset.i;tr.scrollTo({left:k*tr.clientWidth,behavior:'smooth'})});
      addEventListener('resize',function(){tr.scrollLeft=cur*tr.clientWidth});
      show(0);
      /* quietly fetch the rest of the photos once the page has settled */
      (window.requestIdleCallback||function(f){setTimeout(f,1500)})(function(){slides.forEach(function(sl,n){var im=sl.querySelector('img[data-src]');if(im)load(n)})});
    }
  }
  /* ---- home teaser ---- */
  function renderHome(slot,media,d){
    var MAINH=d.current.filter(function(x){return !PX(x).secondary}),p=MAINH[0]||d.current[0],copy=slot.parentNode,q=function(a){return copy.querySelector('[data-drop-'+a+']')};
    var kick=q('kicker'),title=q('title'),sub=q('sub'),lft=q('left'),btn=q('cta');
    var month=new Date().toLocaleString('en-US',{month:'long'});
    var clean=cleanTitle;
    var multi=MAINH.length>1;
    if(multi&&media){media.classList.add('is-pair');media.innerHTML=MAINH.slice(0,2).map(function(x){return x.featuredImage?'<img src="'+esc(img(x.featuredImage.url,900))+'" alt="'+esc(x.featuredImage.altText||x.title)+'" decoding="async">':''}).join('')+(d.live?'<span class="drop-chip"><span class="drop-dot is-live"></span>Live now</span>':'<span class="drop-stamp">Sold out</span>')}
    else if(p&&p.featuredImage&&media){media.innerHTML='<img src="'+esc(img(p.featuredImage.url,1200))+'" alt="'+esc(p.featuredImage.altText||p.title)+'" decoding="async">'+(d.live?'<span class="drop-chip"><span class="drop-dot is-live"></span>Live now</span>':'<span class="drop-stamp">Sold out</span>')}
    if(d.live&&p){
      if(kick)kick.textContent=dropLabel(d.number)+' · '+month;
      if(title)title.textContent=multi?collectionName(MAINH.map(function(x){return clean(x.title)})):clean(p.title);
      if(sub)sub.textContent=multi?'Two framed prints, limited to 10 each. The Family Portrait is available through December.':subFor(p)+'. '+fineFor(p);
      if(lft)lft.textContent=multi?(function(){var e=MAINH[0].edition,same=MAINH.every(function(x){return x.edition===e});return same&&e?e+' of each':'Limited editions'})():editionLine(p);
      slot.innerHTML='';slot.classList.add('is-empty');
    }else{
      if(kick)kick.textContent=p?dropLabel(d.number)+' · Sold out':'Monthly drop';
      if(title)title.textContent='Drop Launch Date · '+dateLabel();
      if(lft)lft.textContent='';
      slot.classList.remove('is-empty');slot.innerHTML=countdownHTML();
    }
    if(btn){btn.textContent=d.live?'Shop the drop':'Get notified';if(!d.live)btn.setAttribute('href','/shop/#notify')}
    startCountdowns(slot);
  }

  /* ---- cart icon: appears in the top bar only once something is in the cart ---- */
  function buildFab(){
    fab=document.createElement('button');fab.type='button';fab.className='cart-fab';fab.setAttribute('aria-label','Cart');
    fab.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6 7h12l-1 13H7L6 7z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M9 7V6a3 3 0 0 1 6 0v1" fill="none" stroke="currentColor" stroke-width="1.4"/></svg><span class="cart-fab-n" data-cart-count>0</span>';
    document.body.appendChild(fab);countEls.push(fab.querySelector('[data-cart-count]'));
    fab.addEventListener('click',open);
    function place(){var c=document.querySelector('.header-cta');if(!c)return;var r=c.getBoundingClientRect();fab.style.top=Math.round(r.top+r.height/2-19)+'px';fab.style.left=Math.round(r.left-50)+'px'}
    place();addEventListener('resize',place);addEventListener('load',place);setTimeout(place,600);
  }

  /* ---- init ---- */
  var prodRoot=document.querySelector('[data-drop-product]'),shopRoot=document.querySelector('[data-drop-shop]'),homeSlot=document.querySelector('[data-drop-home]'),cartBtn=document.querySelector('[data-cart-open]');
  if(shopRoot||prodRoot||loadId()){buildDrawer();buildFab()}
  if(prodRoot){bindAdd(prodRoot);loadProducts().then(function(d){renderProduct(prodRoot,d)}).catch(function(){prodRoot.innerHTML='<p class="shop-msg">The shop is temporarily unavailable. Please <a href="/#inquire">send us an inquiry</a> to order.</p>'})}
  if(shopRoot){var nx=shopRoot.querySelector('[data-drop-next]');nx.querySelector('[data-cd-slot]').innerHTML=countdownHTML();nx.querySelector('[data-wl-slot]').innerHTML=waitlistHTML();bindWaitlist(shopRoot);bindAdd(shopRoot);startCountdowns(shopRoot)}
  if(shopRoot||homeSlot)loadProducts().then(function(d){if(shopRoot)renderShop(shopRoot,d);if(homeSlot)renderHome(homeSlot,document.querySelector('[data-drop-media]'),d)}).catch(function(){if(shopRoot)shopRoot.querySelector('[data-drop-current]').innerHTML='<p class="shop-msg">The shop is temporarily unavailable. Please <a href="/#inquire">send us an inquiry</a> to order.</p>';if(homeSlot)homeSlot.innerHTML=''});
  if(drawer)fetchCart();
})();
