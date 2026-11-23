/* Contact form: small "keep me posted" pill. If ticked when the inquiry is sent, the email is also added to the
   Shopify customer list as subscribed to email marketing (Storefront API customerCreate). The inquiry itself is
   unchanged; the tick also shows in the inquiry email as "marketing: Yes". */
(function(){
  var API='https://0pckjj-0n.myshopify.com/api/2026-04/graphql.json',TOKEN='5fb3738732300eaaf58e711ecfefec82';
  function pw(){var a=new Uint8Array(18);(self.crypto||{}).getRandomValues?crypto.getRandomValues(a):a.forEach(function(_,i){a[i]=Math.random()*256|0});return 'Cd!'+Array.prototype.map.call(a,function(b){return ('0'+b.toString(16)).slice(-2)}).join('')}
  function subscribe(email,name){
    var parts=(name||'').trim().split(/\s+/),first=parts.shift()||null,last=parts.join(' ')||null;
    var q='mutation($i:CustomerCreateInput!){customerCreate(input:$i){customer{id} customerUserErrors{code message}}}';
    return fetch(API,{method:'POST',keepalive:true,headers:{'Content-Type':'application/json','X-Shopify-Storefront-Access-Token':TOKEN},
      body:JSON.stringify({query:q,variables:{i:{email:email,password:pw(),acceptsMarketing:true,firstName:first,lastName:last}}})}).catch(function(){});
  }
  function add(form){
    if(form.querySelector('.optin'))return;
    var foot=form.querySelector('.form-foot');if(!foot)return;
    foot.insertAdjacentHTML('beforebegin','<label class="optin field-full"><input type="checkbox" name="marketing" value="Yes"><span class="optin-pill"><span class="optin-dot" aria-hidden="true"></span>Keep me posted on print drops and news</span></label>');
    form.addEventListener('submit',function(){
      var box=form.querySelector('.optin input'),em=form.querySelector('input[type=email]'),nm=form.querySelector('input[name=name]');
      if(box&&box.checked&&em&&em.checkValidity()&&em.value&&!(form.querySelector('[name="company-website"]')||{}).value)subscribe(em.value.trim(),nm&&nm.value);
    },true);
  }
  function scan(){var f=document.querySelector('form[name=inquire]');if(f)add(f)}
  /* wait until React has hydrated the inquiry section, so the pill never upsets hydration */
  function ready(){var sec=document.getElementById('inquire');return sec&&Object.keys(sec).some(function(k){return k.indexOf('__react')===0})}
  var t=0;(function poll(){if(ready()||t>80){setTimeout(function(){scan();new MutationObserver(scan).observe(document.getElementById('inquire')||document.body,{childList:true,subtree:true})},150);return}t++;setTimeout(poll,100)})();
})();
