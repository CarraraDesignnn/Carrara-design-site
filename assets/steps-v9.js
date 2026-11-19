/* "What a commission means" as one screen of cards: play the video while it's on screen,
   and roll the numbers in when the numbers screen arrives. */
(function(){
  var sec=document.getElementById('pricing');if(!sec||!('IntersectionObserver' in window))return;
  var A=sec.querySelector('.scene-a'),B=sec.querySelector('.scene-b'),vid=sec.querySelector('.steps-media video');
  if(vid)new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var p=vid.play();p&&p.catch&&p.catch(function(){})}else vid.pause()})},{threshold:.35}).observe(vid);
  if(B)new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){B.classList.add('is-vis');[].forEach.call(B.querySelectorAll('.stat'),function(s){s.classList.add('is-in')});var pr=B.querySelector('.steps-price');pr&&pr.classList.add('is-in')}})},{threshold:.35}).observe(B);
})();
