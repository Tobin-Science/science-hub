/* math-printables.cjs — build the #print page for each math hub.
   Student packets link to public pdfs/mathN/<std>-Student.pdf;
   answer keys use the gated openPrintable('math', '<std>-AnswerKey.pdf'). */
const fs = require('fs');

const GRADES = {
  math_8: { n: 8, label: 'Grade 8', units: [
    ['8.NR.1', 'Irrational Numbers'],
    ['8.NR.2', 'Exponents, Roots & Scientific Notation'],
    ['8.PAR.3', 'Linear Equations & Inequalities'],
    ['8.PAR.4', 'Proportional & Non-Proportional Lines'],
    ['8.FGR.5', 'Functions'],
    ['8.FGR.6', 'Scatter Plots & Lines of Best Fit'],
    ['8.FGR.7', 'Systems of Linear Equations'],
    ['8.GSR.8', 'Pythagorean Theorem & Volume'],
  ]},
  math_7: { n: 7, label: 'Grade 7', units: [
    ['7.NR.1', 'Operations with Rational Numbers'],
    ['7.PAR.2', 'Algebraic Expressions'],
    ['7.PAR.3', 'Equations & Inequalities'],
    ['7.PAR.4', 'Proportional Relationships & Sampling'],
    ['7.GSR.5', 'Geometry & Volume'],
    ['7.PR.6', 'Probability'],
  ]},
  math_6: { n: 6, label: 'Grade 6', units: [
    ['6.NR.1', 'Fractions & Decimals'],
    ['6.NR.2', 'Statistics & Data'],
    ['6.NR.3', 'Integers & the Number Line'],
    ['6.NR.4', 'Ratios, Rates & Percent'],
    ['6.GSR.5', 'Area, Surface Area & Volume'],
    ['6.PAR.6', 'Expressions & Exponents'],
    ['6.PAR.7', 'Equations & Inequalities'],
    ['6.PAR.8', 'The Coordinate Plane'],
  ]},
};

function card(g, std, name){
  return `    <div class="card"><h3>${std} · ${name}</h3>
      <p style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">
        <a class="pdfbtn" href="#" onclick="openPrintable('math','${std}-Student.pdf');return false">📄 Student Packet</a>
        <a class="pdfbtn" style="background:#5A6480" href="#" onclick="openPrintable('math','${std}-AnswerKey.pdf');return false">📑 Answer Key</a>
      </p></div>`;
}

function section(cfg){
  const cards = cfg.units.map(([std, name]) => card(cfg.n, std, name)).join('\n');
  return `  <p class="eyebrow">Printable Library</p>
  <h1>Print it, copy it, teach with it.</h1>
  <p class="lead">Black-and-white, print-ready practice packets for every ${cfg.label} math standard, plus a complete review book — each with a <b>student packet</b> and a matching <b>answer key</b>. Open to signed-in teachers with a subscription (Cherokee County teachers are free).</p>

  <h2>📦 Practice packets by standard</h2>
  <div class="cardgrid">
${cards}
  </div>

  <h2>📘 Complete Review Book</h2>
  <div class="cardgrid">
    <div class="card"><h3>${cfg.label} Mathematics · Complete Review</h3>
      <p style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">
        <a class="pdfbtn" href="#" onclick="openPrintable('math','ReviewBook-${cfg.n}-Student.pdf');return false">📄 Student Review Book</a>
        <a class="pdfbtn" style="background:#5A6480" href="#" onclick="openPrintable('math','ReviewBook-${cfg.n}-AnswerKey.pdf');return false">📑 Answer Key</a>
      </p></div>
  </div>

  <h2>🖨 Printing tips</h2>
  <div class="card"><p>Every file opens as a PDF in a new tab — use your browser's print button (Ctrl+P) and "Save as PDF" to keep a copy. Formatted for standard letter paper in black &amp; white.</p></div>
`;
}

for (const [file, cfg] of Object.entries(GRADES)) {
  const path = __dirname + '/' + file + '.html';
  let src = fs.readFileSync(path, 'utf8');
  const startMark = '<section class="page" id="page-print">';
  const i = src.indexOf(startMark);
  if (i < 0) throw new Error(`[${file}] page-print not found`);
  const closeIdx = src.indexOf('</section>', i);
  if (closeIdx < 0) throw new Error(`[${file}] closing </section> not found`);
  const newInner = '\n' + section(cfg);
  src = src.slice(0, i + startMark.length) + newInner + src.slice(closeIdx);
  fs.writeFileSync(path, src);
  console.log(`ok  ${file} — ${cfg.units.length} standard cards + review book`);
}
console.log('DONE');
