/* /work/ v7: Featured Commissions (large sideways row), then Selected Commissions in a random order. No filters.
   Each card: image, one tag, the title. */
(function(){
  var F=(window.WORK||[]).map(function(w){return {slug:w.slug,title:w.title,img:w.img,type:w.type,feat:true}});
  var A=(window.ARCHIVE||[]).map(function(w){return {slug:w.slug,title:w.title,img:w.img,type:w.type,label:w.label,feat:false}});
  function dragScroll(rail){var down=false,x0=0,s0=0,moved=false;
    rail.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||e.button!==0)return;down=true;moved=false;x0=e.clientX;s0=rail.scrollLeft;rail.classList.add('is-drag')});
    addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-x0;if(Math.abs(dx)>5)moved=true;if(moved)rail.scrollLeft=s0-dx});
    addEventListener('pointerup',function(){if(!down)return;down=false;rail.classList.remove('is-drag')});
    rail.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
    rail.addEventListener('dragstart',function(e){e.preventDefault()});}
  var root=document.getElementById('wk');if(!root)return;
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function card(w){return '<li class="wk-card'+(w.feat?' is-feat':'')+'"><a href="/work/'+esc(w.slug)+'/"><span class="wk-img"><img src="'+esc(w.img)+'" alt="'+esc(w.title)+'" loading="'+(w.feat?'eager':'lazy')+'" decoding="async"></span><span class="wk-tag">'+esc(tag(w))+'</span><span class="wk-name">'+esc(w.title)+'</span></a></li>'}
  function tag(w){return (w.label||w.type||'').replace(/ · .*$/,'').replace(/ Design$/,'')}
  var rest=A.slice();for(var k=rest.length-1;k>0;k--){var r=Math.floor(Math.random()*(k+1)),tmp=rest[k];rest[k]=rest[r];rest[r]=tmp}
  root.innerHTML='<h2 class="h3 wk-sh">Featured Commissions</h2><ul class="wk-frail">'+F.map(card).join('')+'</ul>'+
    '<h2 class="h3 wk-sh">Selected Commissions</h2><ul class="wk-grid">'+rest.map(card).join('')+'</ul>';
  dragScroll(root.querySelector('.wk-frail'));
})();
