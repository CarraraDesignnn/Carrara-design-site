/* "What a commission means" as one screen of cards: play the video while it's on screen,
   and roll the numbers in when the numbers screen arrives. */
(function(){
  var sec=document.getElementById('pricing');if(!sec||!('IntersectionObserver' in window))return;
  var A=sec.querySelector('.scene-a'),B=sec.querySelector('.scene-b'),vid=sec.querySelector('.steps-media video');
  if(vid)new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var p=vid.play();p&&p.catch&&p.catch(function(){})}else vid.pause()})},{threshold:.35}).observe(vid);
  if(B)new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){B.classList.add('is-vis');[].forEach.call(B.querySelectorAll('.stat'),function(s){s.classList.add('is-in')});var pr=B.querySelector('.steps-price');pr&&pr.classList.add('is-in')}})},{threshold:.35}).observe(B);
})();
/* scroll cue: shows a moment after a screen settles, hides once you move on */
(function(){
  if(!('IntersectionObserver' in window))return;
  var scenes=[].slice.call(document.querySelectorAll('#pricing .steps-scene'));
  /* centre the cue in the empty space under each screen's content; skip it if there's no room */
  function place(){scenes.forEach(function(sc){var r=sc.getBoundingClientRect(),low=0;
    [].forEach.call(sc.querySelectorAll('.eyebrow,.steps-head,.stats-grid,.steps-price,.steps-media>*'),function(el){var b=el.getBoundingClientRect().bottom;if(b>low)low=b});
    var vis=Math.min(r.bottom,innerHeight+Math.max(0,r.top)),gap=vis-low,cueH=78;sc.classList.toggle('no-cue',gap<cueH+36);sc.style.setProperty('--cue-b',Math.max(16,Math.round(r.bottom-vis+(gap-cueH)/2))+'px')})}
  place();addEventListener('resize',place);addEventListener('load',place);
  scenes.forEach(function(sc){
    var t;new IntersectionObserver(function(es){es.forEach(function(e){clearTimeout(t);if(e.intersectionRatio>.85){place();t=setTimeout(function(){sc.classList.add('cue-on')},700)}else sc.classList.remove('cue-on')})},{threshold:[0,.5,.85,1]}).observe(sc);
  });
})();
