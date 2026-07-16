/* math-dragify-fix.cjs — restore the dragify() helper (deleted with the physics
   games block) so the practice-activity "drag to sort" round works again. */
const fs = require('fs');

const DRAGIFY = `function dragify(el, h){
  el.style.touchAction='none';
  el.addEventListener('pointerdown', e=>{
    e.preventDefault();
    try{ el.setPointerCapture(e.pointerId); }catch(err){}
    const ctx={sx:e.clientX, sy:e.clientY, x:e.clientX, y:e.clientY, dx:0, dy:0};
    h.onStart && h.onStart(e,ctx);
    const mv=ev=>{ ctx.x=ev.clientX; ctx.y=ev.clientY; ctx.dx=ctx.x-ctx.sx; ctx.dy=ctx.y-ctx.sy; h.onMove && h.onMove(ev,ctx); };
    const up=ev=>{ el.removeEventListener('pointermove',mv); el.removeEventListener('pointerup',up); el.removeEventListener('pointercancel',up); h.onEnd && h.onEnd(ev,ctx); };
    el.addEventListener('pointermove',mv);
    el.addEventListener('pointerup',up);
    el.addEventListener('pointercancel',up);
  });
}
/* round 3 — drag cards into buckets */
function actSort(st){`;

for (const file of ['math_6.html', 'math_7.html', 'math_8.html']) {
  const path = __dirname + '/' + file;
  let src = fs.readFileSync(path, 'utf8');
  if (src.includes('function dragify')) { console.log(`--  ${file}: dragify already present, skipped`); continue; }
  const anchor = '/* round 3 — drag cards into buckets */\nfunction actSort(st){';
  if (!src.includes(anchor)) throw new Error(`[${file}] actSort anchor not found`);
  src = src.replace(anchor, DRAGIFY);
  fs.writeFileSync(path, src);
  console.log(`ok  ${file}: dragify restored`);
}
console.log('DONE');
