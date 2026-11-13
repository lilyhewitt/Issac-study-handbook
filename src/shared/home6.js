/* Home tiles shared by every app: word cards open from their tile; try again shows how many are left.
   The small note on a tile only says what is due today, nothing otherwise. */
function homeTiles(){const dn=dueWords().length;$('wtNote').textContent=dn?`今天复习 ${dn} 个`:'';
  const n=S.misses.length;$('redoNote').textContent=n?n+' 题':'';$('tRedo').classList.toggle('empty',!n);}
HOOK.tile.cards=wordsView;HOOK.tile.redo=()=>{if(S.misses.length)startRound('redo');};
HOOK.home.push(homeTiles);
/* iPhone Safari keeps the old row heights of square tiles after turning the phone; redraw the tiles after a turn */
(function(){let t;function relayout(){clearTimeout(t);t=setTimeout(()=>{document.querySelectorAll('.tiles6').forEach(g=>{g.style.display='none';void g.offsetHeight;g.style.display='';});},250);}
addEventListener('resize',relayout);addEventListener('orientationchange',relayout);if(screen.orientation)screen.orientation.addEventListener('change',relayout);})();
