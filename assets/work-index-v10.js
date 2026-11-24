/* /work/ v10: "Specification Design" heading. v9: two sections, Specification and Livery, each one even grid of same-size cards.
   The four featured commissions lead the Specification section; the rest follow in a random order each visit.
   Each card: image, the title, and a tag only when it differs from its section (Recommission, Specification & Livery). */
(function(){
  var F=(window.WORK||[]).map(function(w){return {slug:w.slug,title:w.title,img:w.img,type:w.type,feat:true}});
  var A=(window.ARCHIVE||[]).map(function(w){return {slug:w.slug,title:w.title,img:w.img,type:w.type,label:w.label,feat:false}});
  var root=document.getElementById('wk');if(!root)return;
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function tag(w){return (w.label||w.type||'').replace(/ · .*$/,'').replace(/ Design$/,'')}
  function card(w,sec){var t=tag(w);return '<li class="wk-card"><a href="/work/'+esc(w.slug)+'/"><span class="wk-img"><img src="'+esc(w.img)+'" alt="'+esc(w.title)+'" loading="'+(w.feat?'eager':'lazy')+'" decoding="async"></span>'+(t&&t!==sec?'<span class="wk-tag">'+esc(t)+'</span>':'')+'<span class="wk-name">'+esc(w.title)+'</span></a></li>'}
  function shuffle(a){a=a.slice();for(var k=a.length-1;k>0;k--){var r=Math.floor(Math.random()*(k+1)),t=a[k];a[k]=a[r];a[r]=t}return a}
  var isLivery=function(w){return /livery/i.test(w.type||'')&&!/specification/i.test(w.label||'')};
  var spec=F.concat(shuffle(A.filter(function(w){return !isLivery(w)})));
  var liv=shuffle(A.filter(isLivery));
  function section(id,title,list,tagName){return '<section class="wk-sec" id="'+id+'"><div class="wk-sec-head"><h2 class="h3">'+title+'</h2><span class="wk-count">'+list.length+' cars</span></div><ul class="wk-grid">'+list.map(function(w){return card(w,tagName)}).join('')+'</ul></section>'}
  root.innerHTML=section('specification','Specification Design',spec,'Specification')+section('livery','Livery Design',liv,'Livery');
})();
