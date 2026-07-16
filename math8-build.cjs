/* math8-build.js — transform a copy of physical_science.html into the Grade-8 Math Hub shell.
   Run:  node math8-build.js
   It rewrites math_8.html in place (which must already be a copy of physical_science.html). */
const fs = require('fs');
const FILE = __dirname + '/math_8.html';
let src = fs.readFileSync(FILE, 'utf8').replace(/\r\n/g, '\n'); // normalize CRLF→LF so multi-line anchors match

/* helper: replace text from `start` anchor up to (but not including) `end` anchor */
function cut(label, start, end, replacement){
  const i = src.indexOf(start);
  if(i < 0) throw new Error(`[${label}] start anchor not found: ${start.slice(0,40)}`);
  const j = src.indexOf(end, i + start.length);
  if(j < 0) throw new Error(`[${label}] end anchor not found: ${end.slice(0,40)}`);
  src = src.slice(0, i) + replacement + src.slice(j);
  console.log(`ok  ${label} (${j - i} chars replaced)`);
}
function sub(label, find, replacement){
  if(!src.includes(find)) throw new Error(`[${label}] not found: ${find.slice(0,50)}`);
  src = src.split(find).join(replacement);
  console.log(`ok  ${label}`);
}

/* ---------------- math content ---------------- */
const UNIT = (sym,num,name,std,hex,soft,file,blurb)=>
`u${num}:{
  sym:"${sym}", num:${num}, name:"${name}", std:"${std}", color:"${hex}", soft:"${soft}", hex:"${hex}", lessonurl:"lessons/math8/${file}.html",
  blurb:"${blurb}",
  soon:true, lessons:[], quiz:[], vocab:[], videos:[], pretest:[]
}`;

const mathUNITS = `const UNITS = {
${UNIT('ℚ','1','Rational & Irrational Numbers','8.NR.1','#5B67E0','#EDEFFD','8.NR.1',
  'Sort numbers into rational and irrational, turn repeating decimals back into fractions, and pin down where an irrational number like √2 lands on the number line.')},
${UNIT('xⁿ','2','Exponents, Roots & Scientific Notation','8.NR.2','#E08F0E','#FDF3E2','8.NR.2',
  'The laws of integer exponents, square and cube roots, and how scientists use scientific notation to write — and compute with — the very big and the very small.')},
${UNIT('=','3','Linear Equations & Inequalities','8.PAR.3','#E25555','#FDECEC','8.PAR.3',
  'Build, solve, and justify linear equations and inequalities in one variable — including the ones with one solution, no solution, or infinitely many.')},
${UNIT('∝','4','Proportional & Non-Proportional Lines','8.PAR.4','#159E96','#E2F6F4','8.PAR.4',
  'Connect the proportional line y = mx to the full line y = mx + b, and see why a graph is just the picture of every solution to its equation.')},
${UNIT('ƒ','5','Functions','8.FGR.5','#9C4DC4','#F6EBFA','8.FGR.5',
  'What makes a relationship a function, linear vs. nonlinear, and how to read slope and starting value from an equation, a table, a graph, or a description.')},
${UNIT('📈','6','Scatter Plots & Lines of Best Fit','8.FGR.6','#0E80C4','#E3F1FA','8.FGR.6',
  'Plot two-variable data, fit a straight line by eye, and use that line — its slope and intercepts — to describe the data and make predictions.')},
${UNIT('⊕','7','Systems of Linear Equations','8.FGR.7','#C43D7A','#FBE9F1','8.FGR.7',
  'Two lines, one question: where do they meet? Solve systems by graphing, by inspection, and algebraically, and tell parallel, perpendicular, and intersecting lines apart.')},
${UNIT('△','8','Pythagorean Theorem & Volume','8.GSR.8','#5E8A2E','#EFF6E6','8.GSR.8',
  'Prove and apply the Pythagorean Theorem in two and three dimensions and on the coordinate plane, then find the volume of cones, cylinders, and spheres.')},
${UNIT('★','9','Mathematical Practices','8.MP','#6B7280','#EEF0F2','8.MP',
  'The eight habits of strong mathematicians — making sense of problems, reasoning, modeling, precision, and persevering — that run through every other unit.')}
};
`;

const mathSTDLIST = `const STD_LIST = {
 NR1:{unit:'u1', name:"8.NR.1 · Rational & Irrational Numbers", subs:{
   a:"Rational vs. irrational numbers; convert a repeating decimal to a fraction",
   b:"Approximate irrational numbers and locate them on a number line"}},
 NR2:{unit:'u2', name:"8.NR.2 · Exponents, Roots & Scientific Notation", subs:{
   a:"Apply the properties of integer exponents",
   b:"Square roots and cube roots; perfect squares and cubes",
   c:"Use scientific notation to estimate very large or very small quantities",
   d:"Add, subtract, multiply and divide in scientific notation"}},
 PAR3:{unit:'u3', name:"8.PAR.3 · Linear Equations & Inequalities in One Variable", subs:{
   a:"Interpret expressions and their parts in context",
   b:"Solve equations with one solution, infinitely many, or none",
   c:"Create and solve linear equations and inequalities in context",
   d:"Justify solution steps using properties of operations",
   e:"Solve equations whose coefficients are letters",
   f:"Rearrange linear and literal equations"}},
 PAR4:{unit:'u4', name:"8.PAR.4 · Proportional & Non-Proportional Relationships", subs:{
   a:"Derive y = mx + b from the proportional line y = mx",
   b:"A graph is the set of all the equation's solutions"}},
 FGR5:{unit:'u5', name:"8.FGR.5 · Functions", subs:{
   a:"A function assigns exactly one output to each input",
   b:"Linear vs. nonlinear; sketch a graph from a description",
   c:"Relate the domain of a linear function to its graph",
   d:"Compare rate of change and initial value across representations",
   e:"Slope-intercept, standard, and point-slope forms",
   f:"Write a linear function in equivalent forms",
   g:"Build a linear function from a relationship, table, or graph",
   h:"Interpret rate of change and initial value in context",
   i:"Graph and analyze linear functions"}},
 FGR6:{unit:'u6', name:"8.FGR.6 · Bivariate Data & Lines of Best Fit", subs:{
   a:"Scatter plots and fitting a straight line",
   b:"Use the linear model to solve problems (slope and intercepts)",
   c:"Interpret the slope and intercept of a model in context",
   d:"Use data displays and lines of best fit to draw inferences"}},
 FGR7:{unit:'u7', name:"8.FGR.7 · Systems of Linear Equations", subs:{
   a:"Set up two linear equations in two variables",
   b:"Solutions are the points where the graphs intersect",
   c:"Approximate solutions by graphing; simple cases by inspection",
   d:"Solve systems algebraically for exact solutions",
   e:"Compare lines: parallel, perpendicular, or neither"}},
 GSR8:{unit:'u8', name:"8.GSR.8 · Pythagorean Theorem & Volume", subs:{
   a:"Explain a proof of the Pythagorean Theorem and its converse",
   b:"Apply the Theorem to find unknown side lengths (2-D and 3-D)",
   c:"Find the distance between two points in the coordinate plane",
   d:"Find the volume of cones, cylinders, and spheres"}}
};

`;

/* ---------------- transforms ---------------- */
// 1. empty the SVG figure library
cut('FIG', 'const FIG = {};', 'const UNITS = {', 'const FIG = {};\n\n');
// 2. swap in the 5 math units (end before the STORAGE block so it is preserved)
cut('UNITS', 'const UNITS = {', 'STORAGE (gracefully degrades',
   mathUNITS + '\n/* =========================================================\n   STORAGE (gracefully degrades');
// 3. drop all Science minigames + Science practice activities in one clean cut
cut('GAMES+ACTIVITIES', 'const GAMES = {};', 'function stdUnit(',
   'const GAMES = {};\n\nconst ACTIVITIES = {};\n\n');
// 4. math standards list
cut('STD_LIST', 'const STD_LIST = {', '/* ---------- CONTENT TAGS', mathSTDLIST);
// 5-11. empty the per-standard content tables (filled unit-by-unit later)
cut('STD_TAGS', 'const STD_TAGS = {', 'const QUIZ_TAGS =', 'const STD_TAGS = {};\n\n');
cut('QUIZ_TAGS', 'const QUIZ_TAGS = {', '/* ---------- Resolver', 'const QUIZ_TAGS = {};\n\n');
cut('WARMUPS', 'const WARMUPS = {', '/* "many right answers"', 'const WARMUPS = {};\n');
cut('WARMUPS_MULTI', 'const WARMUPS_MULTI = {', 'let WU = null;', 'const WARMUPS_MULTI = {};\n');
cut('POSTTESTS', 'const POSTTESTS = {', 'PRINTABLE REPORT + VERIFICATION',
   'const POSTTESTS = {};\n\n/* =========================================================\n   PRINTABLE REPORT + VERIFICATION');
cut('STD_TEACH', 'const STD_TEACH = {', 'function stdDisplayName(', 'const STD_TEACH = {};\n');
cut('VOCAB_ES', 'const VOCAB_ES = {', 'function vocabES(', 'const VOCAB_ES = {};\n');
// remove the HS-physics boot patch block (FIG image overrides + posttest/quiz/activity pushes
// that reference the now-empty content tables and would throw, silently halting boot)
cut('HS boot patches', '/* Images carried over from the HS Physical Science hub */', 'renderTiles();', '');

/* ---------------- branding / config ---------------- */
sub('HUB_SUBJECT', "const HUB_SUBJECT = 'physical';", "const HUB_SUBJECT = 'math';");
sub('HUB_NAME', "const HUB_NAME = 'Physical Science';", "const HUB_NAME = 'Math · Grade 8';");
sub('store prefix', "'psh_'+k", "'msh8_'+k");
sub('title', '<title>', '<title>'); // no-op guard so build fails loudly if <title> ever disappears
// set the page title text
src = src.replace(/<title>[^<]*<\/title>/, '<title>Tobin Math Hub — Grade 8</title>');
console.log('ok  <title> text');

/* ---------------- visible UI branding ---------------- */
// nav brand
sub('nav brand', '      Physical Science Hub\n    </div>', '      Tobin Math Hub · Grade 8\n    </div>');
// nav unit tabs → removed (9 units would crowd the bar; units are reached from the Home tiles)
sub('nav tabs',
`    <button class="navbtn" data-go="u1">Matter</button>
    <button class="navbtn" data-go="u2">Energy</button>
    <button class="navbtn" data-go="u3">Motion</button>
    <button class="navbtn" data-go="u4">Waves</button>
    <button class="navbtn" data-go="u5">E&amp;M + Gravity</button>
`, '');
// units count: UIDS + boot build loop → all 9
sub('UIDS', "const UIDS = ['u1','u2','u3','u4','u5'];",
  "const UIDS = ['u1','u2','u3','u4','u5','u6','u7','u8','u9'];");
sub('boot build loop', "['u1','u2','u3','u4','u5'].forEach(buildUnit);", "UIDS.forEach(buildUnit);");
// Grand Slam badge: works for any number of units, ignores units without a quiz (e.g. Math Practices)
sub('slam badge',
  "desc:'Best score 8+ on all five quizzes', check:()=> UIDS.every(u=>{const q=store.get('quiz_'+u); return q && q.score>=8;})",
  "desc:'Best score 8+ on every unit quiz', check:()=> UIDS.filter(u=>UNITS[u].quiz.length).every(u=>{const q=store.get('quiz_'+u); return q && q.score>=8;})");
// start page cover image → drop
sub('start cover',
  '    <img src="ps-cover.jpg" alt="Physical Science textbook cover" style="height:90px;width:auto;border-radius:8px;box-shadow:0 4px 14px rgba(0,0,0,.2)">\n', '');
// start page H1 + subtitle
sub('start h1', '    <h1>Physical Science Hub</h1>', '    <h1>Tobin Math Hub</h1>');
sub('start subtitle',
  '    <p class="startsub">Georgia Standards of Excellence · S8P1–S8P5 · 8th Grade</p>',
  '    <p class="startsub">Georgia Standards of Excellence · Grade 8 Mathematics</p>');
// remove the Science Quest promo block from the start page
cut('SQ promo',
  '    <div style="background:linear-gradient(135deg,#e7c25b,#b8862b);',
  '    <p class="startnote">Students with an assignment link', '');
// printables start-note
sub('start printnote',
  '    <p class="startnote">Teachers: print-ready PDFs (textbook chapters in English, Spanish &amp; scaffolded editions, activities, and review sheets) live in the <a href="#print" onclick="go(\'print\');return false" style="font-weight:700">🖨 printable library</a>.</p>',
  '    <p class="startnote">Teachers: a printable library for this hub is on the way — practice packets and review sheets will live in the <a href="#print" onclick="go(\'print\');return false" style="font-weight:700">🖨 printable library</a>.</p>');
// remove the High-School switch note
sub('HS note',
  '    <p class="startnote" style="background:#F3EAFA;border-radius:10px;padding:10px 14px"><b>Also teach High School?</b> This is the <b>8th-grade</b> hub — switch to the <a href="physical_science_hs.html" style="font-weight:700">⚛️ High School Physical Science hub</a>. <b>One subscription covers both levels.</b></p>\n', '');
// cross-links → math grades
sub('cross-links',
  '    <p class="startnote"><a href="index.html" style="font-weight:700">🏠 All classes</a> &nbsp;·&nbsp; Teach another grade? <a href="earth_science.html" style="font-weight:700">🌍 Earth &amp; Space Science (6th)</a> &nbsp;·&nbsp; <a href="life_science.html" style="font-weight:700">🧬 Life Science (7th)</a></p>',
  '    <p class="startnote"><b>One subscription covers Grade 6, 7 &amp; 8 Math.</b> The Grade 6 &amp; 7 hubs are coming soon. &nbsp;·&nbsp; <a href="index.html" style="font-weight:700">🏠 All classes</a></p>');
// educator eyebrow
sub('eyebrow', '8th Grade Physical Science · Georgia Standards S8P1–S8P5',
  'Grade 8 Mathematics · Georgia Standards of Excellence');
// printables page → coming-soon
cut('printables', '  <p class="eyebrow">Printable Library · Free for classroom use</p>',
  '</section>\n\n<!-- teacher preview modal -->',
`  <p class="eyebrow">Printable Library</p>
  <h1>Printables are on the way.</h1>
  <p class="lead">Black-and-white, print-ready practice packets and review sheets for Grade 8 Math are being prepared and will appear here, unit by unit. (Grade 7 packets are already finished and will join the library as each grade's hub comes online.)</p>
  <div class="card" style="max-width:680px"><p>🚧 Check back soon.</p></div>
`);
// footer
sub('footer',
  '<div class="footer">Physical Science Hub · Aligned to Georgia Standards of Excellence S8P1–S8P5 · <a href="index.html">🏠 All classes</a> · <a href="earth_science.html">Earth &amp; Space Science</a> · <a href="life_science.html">Life Science</a></div>',
  '<div class="footer">Tobin Math Hub · Grade 8 · Aligned to the Georgia Standards of Excellence · <a href="index.html">🏠 All classes</a></div>');
// pretest report footer
sub('report footer', 'Generated by Physical Science Hub', 'Generated by Tobin Math Hub · Grade 8');
// store: dual-grade note → three grades
sub('store note',
  '<b>🔓 One subscription unlocks BOTH grade levels.</b> A Physical Science subscription unlocks your teacher tools on <b>both</b> the <b>8th-grade</b> and <b>High School</b> Physical Science hubs — at no extra cost.',
  '<b>🔓 One subscription unlocks all three grades.</b> Your subscription unlocks the teacher tools for <b>Grade 6, 7 &amp; 8 Math</b> — at no extra cost.');
sub('store sub',
  '<p class="storesub">Full teacher access — unlocks <b>both</b> the 8th-grade and High School Physical Science hubs.</p>',
  '<p class="storesub">Full teacher access — unlocks the Grade 6, 7 &amp; 8 Math hubs.</p>');
// store: remove the Science bundle card (math has no bundle — one price covers all grades)
sub('bundle card',
`\n      <div class="storecard storecard--bundle">
        <div class="storebadge">Best value</div>
        <h3>All three subjects</h3>
        <p class="storesub">Physical, Earth &amp; Space, and Life Science — one subscription.</p>
        <button class="genbtn" onclick="startCheckout('bundle','month')">$9.99 <span>/ month</span></button>
        <button class="storealt" onclick="startCheckout('bundle','year')">or $79.99 / year — save ~33%</button>
      </div>`, '');

fs.writeFileSync(FILE, src);
console.log('\nDONE → math_8.html written (' + src.length + ' bytes)');
