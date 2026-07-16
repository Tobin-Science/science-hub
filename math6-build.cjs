/* math6-build.cjs — transform a copy of physical_science.html into the Grade-6 Math Hub shell.
   Run:  cp physical_science.html math_6.html && node math6-build.cjs
   Same recipe as math7-build.cjs but 9 units for Grade 6. */
const fs = require('fs');
const FILE = __dirname + '/math_6.html';
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
  sym:"${sym}", num:${num}, name:"${name}", std:"${std}", color:"${hex}", soft:"${soft}", hex:"${hex}", lessonurl:"lessons/math6/${file}.html",
  blurb:"${blurb}",
  soon:true, lessons:[], quiz:[], vocab:[], videos:[], pretest:[]
}`;

const mathUNITS = `const UNITS = {
${UNIT('½','1','Fractions & Decimals','6.NR.1','#5B67E0','#EDEFFD','6.NR.1',
  'Add, subtract, multiply, and divide fractions, mixed numbers, and multi-digit decimals fluently, and use them to solve real problems.')},
${UNIT('📊','2','Statistics & Data','6.NR.2','#E08F0E','#FDF3E2','6.NR.2',
  'Describe a set of data by its center, spread, and shape; build dot plots, histograms, and box plots; and answer statistical questions.')},
${UNIT('±','3','Integers & the Number Line','6.NR.3','#E25555','#FDECEC','6.NR.3',
  'Understand positive and negative numbers, plot them on a number line and in the coordinate plane, compare them, and make sense of absolute value.')},
${UNIT('%','4','Ratios, Rates & Percent','6.NR.4','#159E96','#E2F6F4','6.NR.4',
  'Use ratio language, equivalent ratios, unit rates, and percents to solve everyday problems, including measurement conversions.')},
${UNIT('△','5','Area, Surface Area & Volume','6.GSR.5','#9C4DC4','#F6EBFA','6.GSR.5',
  'Find the area of triangles and polygons by composing and decomposing, the surface area of solids from their nets, and the volume of right rectangular prisms.')},
${UNIT('xⁿ','6','Expressions & Exponents','6.PAR.6','#0E80C4','#E3F1FA','6.PAR.6',
  'Write, read, and evaluate numerical and algebraic expressions with whole-number exponents, find GCF and LCM, and generate equivalent expressions.')},
${UNIT('=','7','Equations & Inequalities','6.PAR.7','#C43D7A','#FBE9F1','6.PAR.7',
  'Write and solve one-step equations and inequalities to model real situations, and graph inequality solutions on a number line.')},
${UNIT('⊞','8','The Coordinate Plane','6.PAR.8','#5E8A2E','#EFF6E6','6.PAR.8',
  'Plot rational numbers in all four quadrants, use coordinates to find distances, and draw polygons from their vertices.')},
${UNIT('★','9','Mathematical Practices','6.MP','#6B7280','#EEF0F2','6.MP',
  'The eight habits of strong mathematicians — making sense of problems, reasoning, modeling, precision, and persevering — that run through every other unit.')}
};
`;

const mathSTDLIST = `const STD_LIST = {
 NR1:{unit:'u1', name:"6.NR.1 · Fractions & Decimals", subs:{
   a:"Add and subtract fractions to solve problems",
   b:"Multiply and divide fractions and mixed numbers",
   c:"Compute with multi-digit decimals"}},
 NR2:{unit:'u2', name:"6.NR.2 · Statistics & Data", subs:{
   a:"Describe the center of a data set with the mean",
   b:"Display data in dot plots, histograms, and box plots",
   c:"Describe a distribution's center, spread, and shape",
   d:"Measure variability with range and interquartile range"}},
 NR3:{unit:'u3', name:"6.NR.3 · Integers & the Number Line", subs:{
   a:"Understand integers and their opposites",
   b:"Order and plot rational numbers on a number line",
   c:"Interpret absolute value as distance from zero",
   d:"Compare and order rational numbers"}},
 NR4:{unit:'u4', name:"6.NR.4 · Ratios, Rates & Percent", subs:{
   a:"Understand and describe ratios with ratio language",
   b:"Make and use tables of equivalent ratios",
   c:"Find and use unit rates",
   d:"Find a percent of a quantity",
   e:"Convert within measurement systems"}},
 GSR5:{unit:'u5', name:"6.GSR.5 · Area, Surface Area & Volume", subs:{
   a:"Find the area of triangles, quadrilaterals, and other polygons",
   b:"Find surface area using nets",
   c:"Find the volume of right rectangular prisms with fractional edges"}},
 PAR6:{unit:'u6', name:"6.PAR.6 · Expressions & Exponents", subs:{
   a:"Write and evaluate expressions with whole-number exponents",
   b:"Find greatest common factors and least common multiples",
   c:"Write and read expressions with numbers and variables",
   d:"Evaluate expressions for given values",
   e:"Generate equivalent expressions using properties"}},
 PAR7:{unit:'u7', name:"6.PAR.7 · Equations & Inequalities", subs:{
   a:"Solve one-step equations and inequalities",
   b:"Write equations to represent and solve problems",
   c:"Write and graph inequalities with many solutions"}},
 PAR8:{unit:'u8', name:"6.PAR.8 · The Coordinate Plane", subs:{
   a:"Plot rational numbers on a number line and coordinate plane",
   b:"Use signs of coordinates to identify quadrants",
   c:"Find distances using coordinates and absolute value",
   d:"Draw polygons in the coordinate plane from vertices"}}
};

`;

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

sub('UIDS', "const UIDS = ['u1','u2','u3','u4','u5'];", "const UIDS = ['u1','u2','u3','u4','u5','u6','u7','u8','u9'];");
sub('boot build loop', "['u1','u2','u3','u4','u5'].forEach(buildUnit);", "UIDS.forEach(buildUnit);");
sub('page sections', '<section class="page" id="page-u5"></section>',
  '<section class="page" id="page-u5"></section>\n<section class="page" id="page-u6"></section>\n<section class="page" id="page-u7"></section>\n<section class="page" id="page-u8"></section>\n<section class="page" id="page-u9"></section>');
sub('buildUnit guard',
  "function buildUnit(id){\n  const u = UNITS[id];\n  const page = document.getElementById('page-'+id);\n  page.style.setProperty('--ac', u.hex);",
  "function buildUnit(id){\n  const u = UNITS[id];\n  const page = document.getElementById('page-'+id);\n  if(!page) return;\n  page.style.setProperty('--ac', u.hex);");
sub('slam badge',
  "desc:'Best score 8+ on all five quizzes', check:()=> UIDS.every(u=>{const q=store.get('quiz_'+u); return q && q.score>=8;})",
  "desc:'Best score 8+ on every unit quiz', check:()=> UIDS.filter(u=>UNITS[u].quiz.length).every(u=>{const q=store.get('quiz_'+u); return q && q.score>=8;})");

sub('HUB_SUBJECT', "const HUB_SUBJECT = 'physical';", "const HUB_SUBJECT = 'math';");
sub('HUB_NAME', "const HUB_NAME = 'Physical Science';", "const HUB_NAME = 'Math · Grade 6';");
sub('store prefix', "'psh_'+k", "'msh6_'+k");
src = src.replace(/<title>[^<]*<\/title>/, '<title>Tobin Math Hub — Grade 6</title>');
console.log('ok  <title>');
sub('nav brand', '      Physical Science Hub\n    </div>', '      Tobin Math Hub · Grade 6\n    </div>');
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
  '    <p class="startsub">Georgia Standards of Excellence · Grade 6 Mathematics</p>');
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
  'Grade 6 Mathematics · Georgia Standards of Excellence');
cut('printables', '  <p class="eyebrow">Printable Library · Free for classroom use</p>',
  '</section>\n\n<!-- teacher preview modal -->',
`  <p class="eyebrow">Printable Library</p>
  <h1>Printables are on the way.</h1>
  <p class="lead">Black-and-white, print-ready practice packets and review sheets for Grade 6 Math are being prepared and will appear here, unit by unit.</p>
  <div class="card" style="max-width:680px"><p>🚧 Check back soon.</p></div>
`);
sub('footer',
  '<div class="footer">Physical Science Hub · Aligned to Georgia Standards of Excellence S8P1–S8P5 · <a href="index.html">🏠 All classes</a> · <a href="earth_science.html">Earth &amp; Space Science</a> · <a href="life_science.html">Life Science</a></div>',
  '<div class="footer">Tobin Math Hub · Grade 6 · Aligned to the Georgia Standards of Excellence · <a href="index.html">🏠 All classes</a></div>');
sub('report footer', 'Generated by Physical Science Hub', 'Generated by Tobin Math Hub · Grade 6');
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
console.log('\nDONE → math_6.html written (' + src.length + ' bytes)');
