/* math7-build.cjs — transform a copy of physical_science.html into the Grade-7 Math Hub shell.
   Run:  cp physical_science.html math_7.html && node math7-build.cjs
   Mirrors math8-build.cjs but for Grade 7 (7 units) and bakes in the page-section + buildUnit fixes. */
const fs = require('fs');
const FILE = __dirname + '/math_7.html';
let src = fs.readFileSync(FILE, 'utf8').replace(/\r\n/g, '\n');

function cut(label, start, end, replacement){
  const i = src.indexOf(start);
  if(i < 0) throw new Error(`[${label}] start not found: ${start.slice(0,40)}`);
  const j = src.indexOf(end, i + start.length);
  if(j < 0) throw new Error(`[${label}] end not found: ${end.slice(0,40)}`);
  src = src.slice(0, i) + replacement + src.slice(j);
  console.log(`ok  ${label}`);
}
function sub(label, find, replacement){
  if(!src.includes(find)) throw new Error(`[${label}] not found: ${find.slice(0,50)}`);
  src = src.split(find).join(replacement);
  console.log(`ok  ${label}`);
}

const UNIT = (sym,num,name,std,hex,soft,file,blurb)=>
`u${num}:{
  sym:"${sym}", num:${num}, name:"${name}", std:"${std}", color:"${hex}", soft:"${soft}", hex:"${hex}", lessonurl:"lessons/math7/${file}.html",
  blurb:"${blurb}",
  soon:true, lessons:[], quiz:[], vocab:[], videos:[], pretest:[]
}`;

const mathUNITS = `const UNITS = {
${UNIT('±','1','Operations with Rational Numbers','7.NR.1','#5B67E0','#EDEFFD','7.NR.1',
  'Add, subtract, multiply, and divide positive and negative rational numbers in every form — integers, fractions, decimals, and percents — and solve multi-step problems with them.')},
${UNIT('+','2','Algebraic Expressions','7.PAR.2','#E08F0E','#FDF3E2','7.PAR.2',
  'Use the properties of operations to add, subtract, factor, and expand linear expressions, and rewrite expressions to reveal how the quantities in a problem are related.')},
${UNIT('=','3','Equations & Inequalities','7.PAR.3','#E25555','#FDECEC','7.PAR.3',
  'Build and solve two-step equations and inequalities to model real situations, and graph and interpret the solutions on a number line.')},
${UNIT('∝','4','Proportional Relationships & Sampling','7.PAR.4','#159E96','#E2F6F4','7.PAR.4',
  'Recognize and represent proportional relationships with tables, graphs, and equations; work with unit rates, scale drawings, and percent; and use random samples to make inferences.')},
${UNIT('△','5','Geometry & Volume','7.GSR.5','#9C4DC4','#F6EBFA','7.GSR.5',
  'Angle relationships, circles (circumference and area), surface area and cross-sections of 3-D figures, and the volume of prisms and cylinders.')},
${UNIT('🎲','6','Probability','7.PR.6','#0E80C4','#E3F1FA','7.PR.6',
  'Measure the chance of events from 0 to 1, compare experimental and theoretical probability, and build probability models for simple and compound events.')},
${UNIT('★','7','Mathematical Practices','7.MP','#6B7280','#EEF0F2','7.MP',
  'The eight habits of strong mathematicians — making sense of problems, reasoning, modeling, precision, and persevering — that run through every other unit.')}
};
`;

const mathSTDLIST = `const STD_LIST = {
 NR1:{unit:'u1', name:"7.NR.1 · Operations with Rational Numbers", subs:{
   a:"Add and subtract rational numbers, including additive inverses, on a number line",
   b:"Multiply and divide rational numbers and interpret the results",
   c:"Convert between fractions, decimals, and percents",
   d:"Solve multi-step problems with rational numbers in any form"}},
 PAR2:{unit:'u2', name:"7.PAR.2 · Algebraic Expressions", subs:{
   a:"Add, subtract, factor, and expand linear expressions with rational coefficients",
   b:"Rewrite an expression to show how the quantities in a problem relate"}},
 PAR3:{unit:'u3', name:"7.PAR.3 · Equations & Inequalities", subs:{
   a:"Build and solve equations of the form px + q = r and p(x + q) = r",
   b:"Build, solve, and graph inequalities to model real situations"}},
 PAR4:{unit:'u4', name:"7.PAR.4 · Proportional Relationships & Sampling", subs:{
   a:"Compute unit rates, including with fractions",
   b:"Identify and represent proportional relationships (tables, graphs, equations, constant of proportionality)",
   c:"Use scale drawings to find lengths and areas",
   d:"Solve multi-step ratio and percent problems",
   e:"Use random samples to make inferences about a population"}},
 GSR5:{unit:'u5', name:"7.GSR.5 · Geometry & Volume", subs:{
   a:"Find unknown angles using supplementary, complementary, vertical, and adjacent angles",
   b:"Find the circumference and area of circles",
   c:"Find the surface area of prisms and cylinders",
   d:"Describe the cross-sections of three-dimensional figures",
   e:"Find the volume of prisms and cylinders"}},
 PR6:{unit:'u6', name:"7.PR.6 · Probability", subs:{
   a:"Express the probability of an event as a number from 0 to 1",
   b:"Compare experimental and theoretical probability",
   c:"Develop and use probability models",
   d:"Find probabilities of compound events using simulations"}}
};

`;

/* ---- structural transforms (same recipe as math8-build, proven) ---- */
cut('FIG', 'const FIG = {};', 'const UNITS = {', 'const FIG = {};\n\n');
cut('UNITS', 'const UNITS = {', 'STORAGE (gracefully degrades',
   mathUNITS + '\n/* =========================================================\n   STORAGE (gracefully degrades');
cut('GAMES+ACTIVITIES', 'const GAMES = {};', 'function stdUnit(',
   'const GAMES = {};\n\nconst ACTIVITIES = {};\n\n');
cut('STD_LIST', 'const STD_LIST = {', '/* ---------- CONTENT TAGS', mathSTDLIST);
cut('STD_TAGS', 'const STD_TAGS = {', 'const QUIZ_TAGS =', 'const STD_TAGS = {};\n\n');
cut('QUIZ_TAGS', 'const QUIZ_TAGS = {', '/* ---------- Resolver', 'const QUIZ_TAGS = {};\n\n');
cut('WARMUPS', 'const WARMUPS = {', '/* "many right answers"', 'const WARMUPS = {};\n');
cut('WARMUPS_MULTI', 'const WARMUPS_MULTI = {', 'let WU = null;', 'const WARMUPS_MULTI = {};\n');
cut('POSTTESTS', 'const POSTTESTS = {', 'PRINTABLE REPORT + VERIFICATION',
   'const POSTTESTS = {};\n\n/* =========================================================\n   PRINTABLE REPORT + VERIFICATION');
cut('STD_TEACH', 'const STD_TEACH = {', 'function stdDisplayName(', 'const STD_TEACH = {};\n');
cut('VOCAB_ES', 'const VOCAB_ES = {', 'function vocabES(', 'const VOCAB_ES = {};\n');
cut('HS boot patches', '/* Images carried over from the HS Physical Science hub */', 'renderTiles();', '');

/* ---- units count: 7 units, with page sections + boot fixes baked in ---- */
sub('UIDS', "const UIDS = ['u1','u2','u3','u4','u5'];", "const UIDS = ['u1','u2','u3','u4','u5','u6','u7'];");
sub('boot build loop', "['u1','u2','u3','u4','u5'].forEach(buildUnit);", "UIDS.forEach(buildUnit);");
sub('page sections', '<section class="page" id="page-u5"></section>',
  '<section class="page" id="page-u5"></section>\n<section class="page" id="page-u6"></section>\n<section class="page" id="page-u7"></section>');
sub('buildUnit guard',
  "function buildUnit(id){\n  const u = UNITS[id];\n  const page = document.getElementById('page-'+id);\n  page.style.setProperty('--ac', u.hex);",
  "function buildUnit(id){\n  const u = UNITS[id];\n  const page = document.getElementById('page-'+id);\n  if(!page) return;\n  page.style.setProperty('--ac', u.hex);");
sub('slam badge',
  "desc:'Best score 8+ on all five quizzes', check:()=> UIDS.every(u=>{const q=store.get('quiz_'+u); return q && q.score>=8;})",
  "desc:'Best score 8+ on every unit quiz', check:()=> UIDS.filter(u=>UNITS[u].quiz.length).every(u=>{const q=store.get('quiz_'+u); return q && q.score>=8;})");

/* ---- branding / config ---- */
sub('HUB_SUBJECT', "const HUB_SUBJECT = 'physical';", "const HUB_SUBJECT = 'math';");
sub('HUB_NAME', "const HUB_NAME = 'Physical Science';", "const HUB_NAME = 'Math · Grade 7';");
sub('store prefix', "'psh_'+k", "'msh7_'+k");
src = src.replace(/<title>[^<]*<\/title>/, '<title>Tobin Math Hub — Grade 7</title>');
console.log('ok  <title>');
sub('nav brand', '      Physical Science Hub\n    </div>', '      Tobin Math Hub · Grade 7\n    </div>');
sub('nav tabs',
`    <button class="navbtn" data-go="u1">Matter</button>
    <button class="navbtn" data-go="u2">Energy</button>
    <button class="navbtn" data-go="u3">Motion</button>
    <button class="navbtn" data-go="u4">Waves</button>
    <button class="navbtn" data-go="u5">E&amp;M + Gravity</button>
`, '');
sub('start cover',
  '    <img src="ps-cover.jpg" alt="Physical Science textbook cover" style="height:90px;width:auto;border-radius:8px;box-shadow:0 4px 14px rgba(0,0,0,.2)">\n', '');
sub('start h1', '    <h1>Physical Science Hub</h1>', '    <h1>Tobin Math Hub</h1>');
sub('start subtitle',
  '    <p class="startsub">Georgia Standards of Excellence · S8P1–S8P5 · 8th Grade</p>',
  '    <p class="startsub">Georgia Standards of Excellence · Grade 7 Mathematics</p>');
cut('SQ promo',
  '    <div style="background:linear-gradient(135deg,#e7c25b,#b8862b);',
  '    <p class="startnote">Students with an assignment link', '');
sub('start printnote',
  '    <p class="startnote">Teachers: print-ready PDFs (textbook chapters in English, Spanish &amp; scaffolded editions, activities, and review sheets) live in the <a href="#print" onclick="go(\'print\');return false" style="font-weight:700">🖨 printable library</a>.</p>',
  '    <p class="startnote">Teachers: a printable library for this hub is on the way — practice packets and review sheets will live in the <a href="#print" onclick="go(\'print\');return false" style="font-weight:700">🖨 printable library</a>.</p>');
sub('HS note',
  '    <p class="startnote" style="background:#F3EAFA;border-radius:10px;padding:10px 14px"><b>Also teach High School?</b> This is the <b>8th-grade</b> hub — switch to the <a href="physical_science_hs.html" style="font-weight:700">⚛️ High School Physical Science hub</a>. <b>One subscription covers both levels.</b></p>\n', '');
sub('cross-links',
  '    <p class="startnote"><a href="index.html" style="font-weight:700">🏠 All classes</a> &nbsp;·&nbsp; Teach another grade? <a href="earth_science.html" style="font-weight:700">🌍 Earth &amp; Space Science (6th)</a> &nbsp;·&nbsp; <a href="life_science.html" style="font-weight:700">🧬 Life Science (7th)</a></p>',
  '    <p class="startnote"><b>One subscription covers Grade 6, 7 &amp; 8 Math.</b> &nbsp;·&nbsp; <a href="index.html" style="font-weight:700">🏠 All classes</a></p>');
sub('eyebrow', '8th Grade Physical Science · Georgia Standards S8P1–S8P5',
  'Grade 7 Mathematics · Georgia Standards of Excellence');
cut('printables', '  <p class="eyebrow">Printable Library · Free for classroom use</p>',
  '</section>\n\n<!-- teacher preview modal -->',
`  <p class="eyebrow">Printable Library</p>
  <h1>Printables are on the way.</h1>
  <p class="lead">Black-and-white, print-ready practice packets and review sheets for Grade 7 Math are being prepared and will appear here, unit by unit.</p>
  <div class="card" style="max-width:680px"><p>🚧 Check back soon.</p></div>
`);
sub('footer',
  '<div class="footer">Physical Science Hub · Aligned to Georgia Standards of Excellence S8P1–S8P5 · <a href="index.html">🏠 All classes</a> · <a href="earth_science.html">Earth &amp; Space Science</a> · <a href="life_science.html">Life Science</a></div>',
  '<div class="footer">Tobin Math Hub · Grade 7 · Aligned to the Georgia Standards of Excellence · <a href="index.html">🏠 All classes</a></div>');
sub('report footer', 'Generated by Physical Science Hub', 'Generated by Tobin Math Hub · Grade 7');
sub('store note',
  '<b>🔓 One subscription unlocks BOTH grade levels.</b> A Physical Science subscription unlocks your teacher tools on <b>both</b> the <b>8th-grade</b> and <b>High School</b> Physical Science hubs — at no extra cost.',
  '<b>🔓 One subscription unlocks all three grades.</b> Your subscription unlocks the teacher tools for <b>Grade 6, 7 &amp; 8 Math</b> — at no extra cost.');
sub('store sub',
  '<p class="storesub">Full teacher access — unlocks <b>both</b> the 8th-grade and High School Physical Science hubs.</p>',
  '<p class="storesub">Full teacher access — unlocks the Grade 6, 7 &amp; 8 Math hubs.</p>');
sub('bundle card',
`\n      <div class="storecard storecard--bundle">
        <div class="storebadge">Best value</div>
        <h3>All three subjects</h3>
        <p class="storesub">Physical, Earth &amp; Space, and Life Science — one subscription.</p>
        <button class="genbtn" onclick="startCheckout('bundle','month')">$9.99 <span>/ month</span></button>
        <button class="storealt" onclick="startCheckout('bundle','year')">or $79.99 / year — save ~33%</button>
      </div>`, '');

fs.writeFileSync(FILE, src);
console.log('\nDONE → math_7.html written (' + src.length + ' bytes)');
