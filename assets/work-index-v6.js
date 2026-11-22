/* /work/ v6: features in a large sideways-scrolling row; filters and every other project below. one "Selected Commissions" grid. Features (full article, new renders) lead, then every other project.
   Each card: image, one tag, the title. Filter by category; no search. */
(function(){
  var F=(window.WORK||[]).map(function(w){return {slug:w.slug,title:w.title,img:w.img,type:w.type,feat:true}});
  var A=(window.ARCHIVE||[]).map(function(w){return {slug:w.slug,title:w.title,img:w.img,type:w.type,label:w.label,feat:false}});
  function dragScroll(rail){var down=false,x0=0,s0=0,moved=false;
    rail.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||e.button!==0)return;down=true;moved=false;x0=e.clientX;s0=rail.scrollLeft;rail.classList.add('is-drag')});
    addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-x0;if(Math.abs(dx)>5)moved=true;if(moved)rail.scrollLeft=s0-dx});
    addEventListener('pointerup',function(){if(!down)return;down=false;rail.classList.remove('is-drag')});
    rail.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
    rail.addEventListener('dragstart',function(e){e.preventDefault()});}
  var ALL=F.concat(A),root=document.getElementById('wk');if(!root)return;
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  var CATS=[['','All'],['Specification Design','Specification'],['Recommission','Recommission'],['Livery Design','Livery']];
  var cat='';try{cat=new URLSearchParams(location.search).get('category')||''}catch(e){}
  function tag(w){var t=(w.label||w.type||'').replace(/ · .*$/,'').replace(/ Design$/,'').replace('Specification & Livery','Specification & Livery');return t}
  function card(w){return '<li class="wk-card'+(w.feat?' is-feat':'')+'"><a href="/work/'+esc(w.slug)+'/"><span class="wk-img"><img src="'+esc(w.img)+'" alt="'+esc(w.title)+'" loading="'+(w.feat?'eager':'lazy')+'" decoding="async"></span><span class="wk-tag">'+esc(tag(w))+'</span><span class="wk-name">'+esc(w.title)+'</span></a></li>'}
  function render(){
    var rl=ALL.filter(function(w){return !w.feat&&(!cat||w.type===cat)});
    root.querySelector('.wk-grid').innerHTML=rl.map(card).join('');
    [].forEach.call(root.querySelectorAll('.wk-chip'),function(b){b.classList.toggle('is-on',cat===b.dataset.v)});
  }
  root.innerHTML='<ul class="wk-frail">'+F.map(card).join('')+'</ul><div class="wk-chips" role="group" aria-label="Category">'+CATS.map(function(c){return '<button type="button" class="wk-chip" data-v="'+esc(c[0])+'">'+esc(c[1])+'</button>'}).join('')+'</div><ul class="wk-grid"></ul>';
  dragScroll(root.querySelector('.wk-frail'));
  root.addEventListener('click',function(e){var b=e.target.closest('.wk-chip');if(b){cat=b.dataset.v;render()}});
  render();
})();
