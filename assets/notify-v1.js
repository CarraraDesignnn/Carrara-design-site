/* notify-v1: adds the email to the Shopify customer list as subscribed to email marketing (Storefront API customerCreate).
   If the email is already a customer, Shopify won't re-add it, so the studio gets an email to tick marketing on them by hand. */
(function(){
  var API='https://0pckjj-0n.myshopify.com/api/2026-04/graphql.json',TOKEN='5fb3738732300eaaf58e711ecfefec82';
  function pw(){var a=new Uint8Array(18);crypto.getRandomValues(a);return 'Cd!'+Array.prototype.map.call(a,function(b){return ('0'+b.toString(16)).slice(-2)}).join('')}
  var f=document.querySelector('.nt-form');if(!f)return;
  var i=f.querySelector('input'),b=f.querySelector('button'),m=f.querySelector('.nt-msg');
  f.addEventListener('submit',function(e){e.preventDefault();
    var email=(i.value||'').trim();
    if(!email||!i.checkValidity()){m.textContent='Please enter a valid email.';return}
    b.disabled=true;m.textContent='';
    var q='mutation($i:CustomerCreateInput!){customerCreate(input:$i){customer{id} customerUserErrors{code message}}}';
    fetch(API,{method:'POST',headers:{'Content-Type':'application/json','X-Shopify-Storefront-Access-Token':TOKEN},body:JSON.stringify({query:q,variables:{i:{email:email,password:pw(),acceptsMarketing:true}}})})
    .then(function(r){return r.json()}).then(function(r){
      var d=r&&r.data&&r.data.customerCreate;if(!d)throw 0;
      if(!d.customer){
        var taken=(d.customerUserErrors||[]).some(function(x){return x.code==='TAKEN'||x.code==='CUSTOMER_DISABLED'});if(!taken)throw 0;
        return fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({access_key:'29d94e8d-339a-47d5-9e29-dfc8736775ab',subject:'Print drop signup (existing customer: tick email marketing in Shopify)',from_name:'Carrara Design website',email:email})});
      }
    }).then(function(){f.classList.add('is-done');m.textContent='You’re on the list. We’ll email you the moment the drop opens.'})
    .catch(function(){b.disabled=false;m.textContent='Something went wrong. Please try again, or email contact@carrara.design.'});
  });
})();
