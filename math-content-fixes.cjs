/* math-content-fixes.cjs — across math_6/7/8.html:
   1. fix the Educator "Printable library" card text (no Spanish; describe the math packets)
   2. make Warmup of the Day always return content: if a standard+type combo is empty,
      fall back to a multiple-choice question on that same standard, then to a covered standard. */
const fs = require('fs');

const PRINT_OLD = '<p>All five textbook chapters in <b>English, Spanish, and scaffolded reading-support editions</b>, plus chapter activity &amp; lab sheets, unit review sheets, and the vocabulary list. Free to print for your classroom.</p>';
const PRINT_NEW = '<p>A print-ready <b>student packet and answer key for every standard</b>, plus a complete <b>review book</b> for the whole grade — black &amp; white and ready to copy. Free for your classroom.</p>';

const WARM_OLD = `  const allStds = Object.keys(WARMUPS);
  const std = stdSel==='random'? allStds[Math.floor(Math.random()*allStds.length)] : stdSel;
  let pool = warmupPool(type, std);
  if(!pool.length){ document.getElementById('wu-out').hidden=false; document.getElementById('wu-q').textContent='No questions for that combination yet.'; return; }`;
const WARM_NEW = `  const allStds = Object.keys(WARMUPS);
  let std = stdSel==='random'? allStds[Math.floor(Math.random()*allStds.length)] : stdSel;
  let servedType = type;
  let pool = warmupPool(type, std);
  if(!pool.length){ pool = warmupPool('mc', std); servedType = 'mc'; }                                            // every standard has practice questions
  if(!pool.length){ std = allStds[Math.floor(Math.random()*allStds.length)]; servedType = type; pool = warmupPool(type, std); }  // fall back to a covered standard
  if(!pool.length){ document.getElementById('wu-out').hidden=false; document.getElementById('wu-q').textContent='No questions for that combination yet.'; return; }`;

const TYPE_OLD = `  const typeName = {disc:'💬 Discussion', multi:'🌈 Many right answers', blank:'✏️ Fill in the blank', mc:'✅ Multiple choice'}[type];`;
const TYPE_NEW = `  const typeName = {disc:'💬 Discussion', multi:'🌈 Many right answers', blank:'✏️ Fill in the blank', mc:'✅ Multiple choice'}[servedType];`;

for (const file of ['math_6.html', 'math_7.html', 'math_8.html']) {
  const path = __dirname + '/' + file;
  let src = fs.readFileSync(path, 'utf8');
  for (const [label, oldS, newS] of [['printables', PRINT_OLD, PRINT_NEW], ['warmup-fallback', WARM_OLD, WARM_NEW], ['type-label', TYPE_OLD, TYPE_NEW]]) {
    if (!src.includes(oldS)) throw new Error(`[${file}] ${label} anchor not found`);
    src = src.replace(oldS, newS);
  }
  fs.writeFileSync(path, src);
  console.log(`ok  ${file}`);
}
console.log('DONE');
