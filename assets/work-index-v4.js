/* /work/ v4: one "Selected Commissions" grid. Features (full article, new renders) lead, then every other project.
   Each card: image, one tag, the title. Filter by category; no search. */
(function(){
  var F=(window.WORK||[]).map(function(w){return {slug:w.slug,title:w.title,img:w.img,type:w.type,feat:true}});
  var A=(window.ARCHIVE||[]).map(function(w){return {slug:w.slug,title:w.title,img:w.img,type:w.type,label:w.label,feat:false}});
  var ALL=F.concat(A),root=document.getElementById('wk');if(!root)return;
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  var CATS=[['','All'],['feature','Features'],['Specification Design','Specification'],['Recommission','Recommission'],['Livery Design','Livery']];
  var cat='';try{cat=new URLSearchParams(location.search).get('category')||''}catch(e){}
  function tag(w){var t=(w.label||w.type||'').replace(/ · .*$/,'').replace(/ Design$/,'').replace('Specification & Livery','Specification & Livery');return w.feat?'Feature · '+t:t}
  function card(w){return '<li class="wk-card'+(w.feat?' is-feat':'')+'"><a href="/work/'+esc(w.slug)+'/"><span class="wk-img"><img src="'+esc(w.img)+'" alt="'+esc(w.title)+'" loading="'+(w.feat?'eager':'lazy')+'" decoding="async"></span><span class="wk-tag">'+esc(tag(w))+'</span><span class="wk-name">'+esc(w.title)+'</span></a></li>'}
  function render(){
    var list=ALL.filter(function(w){return !cat||(cat==='feature'?w.feat:w.type===cat)});
    root.querySelector('.wk-grid').innerHTML=list.map(card).join('');
    [].forEach.call(root.querySelectorAll('.wk-chip'),function(b){b.classList.toggle('is-on',cat===b.dataset.v)});
  }
  root.innerHTML='<div class="wk-chips" role="group" aria-label="Category">'+CATS.map(function(c){return '<button type="button" class="wk-chip" data-v="'+esc(c[0])+'">'+esc(c[1])+'</button>'}).join('')+'</div><ul class="wk-grid"></ul>';
  root.addEventListener('click',function(e){var b=e.target.closest('.wk-chip');if(b){cat=b.dataset.v;render()}});
  render();
})();
