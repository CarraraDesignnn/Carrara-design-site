/* feature-v2: "Featured in The Serafino Collection" block on the GT2 RS and GT3 RS project pages.
   Renders a complete block straight away (local photo, copy, link), then asks Shopify for the
   print's status and updates the tag/line: Live now · N of 10 left, Sold out, or a plain
   "Visit the shop" fallback if the product no longer exists. Looks finished in every state. */
(function(){
  var P=window.PJ||{},root=document.getElementById('pj');if(!root)return;
  var FEATURES={
    'manthey-gt3-rs':{handle:'manthey-gt3-rs-the-serafino-collection',model:'GT3 RS',img:'/img/p/feature/serafino-gt3-print'},
    'urban-bamboo-gt2-rs':{handle:'chromaflair-gt2-rs-the-serafino-collection',model:'GT2 RS',img:'/img/p/feature/serafino-gt2-print'}
  };
  var F=FEATURES[P.slug];if(!F)return;
  var EDITION=10,DOMAIN='0pckjj-0n.myshopify.com',TOKEN='5fb3738732300eaaf58e711ecfefec82';
  var printUrl='/shop/print/?p='+F.handle;
  var s=document.createElement('section');s.className='pj-feature';s.setAttribute('aria-labelledby','pj-feature-title');
  s.innerHTML=
    '<header class="pj-feature-head"><p class="pj-eyebrow">As seen in</p><h2 class="pj-h2" id="pj-feature-title">The Serafino Collection</h2></header>'
    +'<a class="pj-feature-media" href="'+printUrl+'" aria-label="View the '+F.model+' print">'
      +'<img src="'+F.img+'-1200.jpg" srcset="'+F.img+'-700.jpg 700w, '+F.img+'-1200.jpg 1200w" sizes="(max-width: 800px) 90vw, 440px" alt="Framed print of James’ '+F.model+'" loading="lazy" decoding="async" draggable="false">'
      +'<span class="drop-chip pj-feature-chip" hidden></span>'
    +'</a>'
    +'<div class="pj-feature-copy">'
      +'<p class="pj-feature-body">This '+F.model+' was built from our render file. That same render is now a 30 × 40 framed fine art print, limited to '+EDITION+'.</p>'
      +'<div class="pj-feature-actions"><a class="btn btn-light pj-feature-btn" href="'+printUrl+'">View the print</a>'
      +'<span class="pj-feature-status">Drop 01 · Edition of '+EDITION+'</span></div>'
    +'</div>';
  /* high on the page: straight after the car's details */
  var anchor=root.querySelector('.pj-facts')||root.querySelector('.pj-intro');anchor?anchor.insertAdjacentElement('afterend',s):root.appendChild(s);

  var chip=s.querySelector('.pj-feature-chip'),status=s.querySelector('.pj-feature-status'),btn=s.querySelector('.pj-feature-btn'),media=s.querySelector('.pj-feature-media');
  function setChip(html){chip.innerHTML=html;chip.hidden=false}
  function load(){
    var q='query($h:String!){product(handle:$h){availableForSale variants(first:1){nodes{availableForSale quantityAvailable}}}}';
    fetch('https://'+DOMAIN+'/api/2026-04/graphql.json',{method:'POST',headers:{'Content-Type':'application/json','X-Shopify-Storefront-Access-Token':TOKEN},body:JSON.stringify({query:q,variables:{h:F.handle}})})
      .then(function(r){return r.json()}).then(function(d){
        var p=d&&d.data&&d.data.product;
        if(!p){ /* print no longer in the shop: keep the block, point at the shop */
          btn.textContent='Visit the shop';btn.href='/shop/';media.href='/shop/';status.textContent='Drop 01 · Edition of '+EDITION;return}
        var v=p.variants&&p.variants.nodes&&p.variants.nodes[0],left=v&&typeof v.quantityAvailable==='number'?v.quantityAvailable:null;
        if(p.availableForSale){
          setChip('<span class="drop-dot is-live"></span>Live now');
          status.textContent=left!=null&&left>0&&left<=EDITION?left+' of '+EDITION+' left':'Edition of '+EDITION;
        }else{
          setChip('<span class="drop-dot"></span>Sold out');s.classList.add('is-sold');
          status.textContent='Sold out · Edition of '+EDITION;
        }
      }).catch(function(){/* offline or Shopify down: static block already reads fine */});
  }
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){if(es[0].isIntersecting){io.disconnect();load()}},{rootMargin:'600px 0px'});io.observe(s)}else load();
})();
