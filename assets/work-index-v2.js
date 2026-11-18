/* /work/: every commission in one grid, filtered by category, with a search box. */
(function(){
  var W=window.WORK||[],root=document.getElementById('wk');if(!root)return;
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function uniq(a){return a.filter(function(v,i){return v&&a.indexOf(v)===i})}
  var CATS=['Specification Design','Recommission','Livery Design'];
  var st={cat:'',q:''};
  try{st.cat=new URLSearchParams(location.search).get('category')||''}catch(e){}
  function chips(){return '<div class="wk-chips" role="group" aria-label="Category"><button type="button" data-v="" class="wk-chip">All</button>'+CATS.map(function(v){return '<button type="button" data-v="'+esc(v)+'" class="wk-chip">'+esc(v)+'</button>'}).join('')+'</div>'}
  function card(w){return '<li class="wk-card"><a href="/work/'+esc(w.slug)+'/"><span class="wk-img"><img src="'+esc(w.img)+'" alt="'+esc(w.title)+'" loading="lazy" decoding="async"></span><span class="wk-meta">'+esc([w.type,w.year].filter(Boolean).join(' · '))+'</span><span class="wk-name">'+esc(w.title)+'</span><span class="wk-tags">'+esc((w.programs||[]).join(' · '))+'</span></a></li>'}
  function render(){
    var q=st.q.toLowerCase().trim();
    var list=W.filter(function(w){return (!st.cat||w.type===st.cat)&&(!q||[w.title,w.make,w.model,(w.programs||[]).join(' '),w.year].join(' ').toLowerCase().indexOf(q)>-1)});
    root.querySelector('.wk-grid').innerHTML=list.length?list.map(card).join(''):'<li class="wk-empty">No commissions match. <button type="button" class="wk-reset">Clear filters</button></li>';
    root.querySelector('.wk-count').textContent=list.length+(list.length===1?' commission':' commissions');
    [].forEach.call(root.querySelectorAll('.wk-chip'),function(b){b.classList.toggle('is-on',st.cat===b.dataset.v)});
  }
  root.innerHTML='<div class="wk-bar">'+chips()+'<div class="wk-tools"><input class="wk-q" type="search" placeholder="Search model, program, year" aria-label="Search commissions"><span class="wk-count"></span></div></div><ul class="wk-grid"></ul>';
  root.addEventListener('click',function(e){var b=e.target.closest('.wk-chip');if(b){st.cat=b.dataset.v;render();return}if(e.target.closest('.wk-reset')){st={cat:'',q:''};root.querySelector('.wk-q').value='';render()}});
  root.querySelector('.wk-q').addEventListener('input',function(e){st.q=e.target.value;render()});
  render();
})();
