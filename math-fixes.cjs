/* math-fixes.cjs — across math_6/7/8.html:
   1. point the "All classes" links at the MATH picker (math.html), relabel "All math grades"
   2. remove the Science Quest ad card from the Educator page
   3. drop the stale "Grade 6 & 7 coming soon" line (all grades are live now) */
const fs = require('fs');

const SQ_START = '  <div class="card" style="border:2px solid #b8862b;background:#FBF4E0;margin:0 0 24px;max-width:780px">';
const NEXT_CARD = '  <div class="card" style="border:2px solid var(--ac);background:#EDEFFD;margin:0 0 24px;max-width:780px">';

for (const file of ['math_6.html', 'math_7.html', 'math_8.html']) {
  const path = __dirname + '/' + file;
  let src = fs.readFileSync(path, 'utf8');

  // 1. All-classes links → math picker + clearer label
  const beforeLinks = (src.match(/href="index\.html"/g) || []).length;
  src = src.split('href="index.html"').join('href="math.html"');
  src = src.split('🏠 All classes').join('🏠 All math grades');

  // 2. remove the Science Quest ad card (from its opening to the next card)
  const i = src.indexOf(SQ_START);
  let removedSQ = false;
  if (i >= 0) {
    const j = src.indexOf(NEXT_CARD, i);
    if (j < 0) throw new Error(`[${file}] next card after SQ ad not found`);
    src = src.slice(0, i) + src.slice(j);
    removedSQ = true;
  }

  // 3. stale "coming soon" line (math_8 only had it)
  src = src.split('The Grade 6 &amp; 7 hubs are coming soon. ').join('');

  fs.writeFileSync(path, src);
  console.log(`ok  ${file} — index→math links: ${beforeLinks}, SQ ad removed: ${removedSQ}`);
}
console.log('DONE');
