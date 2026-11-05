// Validate content.js after any edit:   node tools/validate_content.js
// Checks ids, answer indices, options, skills, gloss format, stray brackets/quotes,
// and warns on the same Spanish item glossed two different ways. Exit code 1 on errors.
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "..", "content.js"), "utf8");
const window = {};
const { SKILLS, STORIES, LESSONS } = new Function("window", src + "; return {SKILLS, STORIES, LESSONS};")(window);

const LV = ["L0", "L1", "L2", "L3"];
const GLOSS = /\[([^|\]]+)\|([^\]]+)\]/g;
const ARTICLE = /^(el|la|los|las|un|una|unos|unas)\s+/i;
const errors = [], warns = [], ids = new Set(), glossMap = {};
const key = es => es.charAt(0).toLowerCase() + es.slice(1);   // mirrors vkey() minus PROPER

function checkQ(q, where) {
  if (!SKILLS[q.skill]) errors.push(`${where}: unknown skill "${q.skill}"`);
  if (q.type === "fill") {
    if (!Array.isArray(q.a) || !q.a.length) errors.push(`${where}: fill without accepted answers`);
  } else if (!Array.isArray(q.opts) || q.opts.length < 2) {
    errors.push(`${where}: needs at least 2 options`);
  } else {
    if (typeof q.a !== "number" || q.a < 0 || q.a >= q.opts.length) errors.push(`${where}: answer index ${q.a} out of range`);
    if (new Set(q.opts.map(o => o.toLowerCase().trim())).size !== q.opts.length) errors.push(`${where}: duplicate options`);
  }
  if (q.trick && !q.explain) warns.push(`${where}: trick question without explain`);
}

STORIES.forEach(s => {
  if (ids.has(s.id)) errors.push(`duplicate id ${s.id}`); ids.add(s.id);
  if (!LV.includes(s.level)) errors.push(`${s.id}: level must be one of ${LV.join(" ")}`);
  if (/"/.test(s.text)) errors.push(`${s.id}: plain " inside text — use « » or “ ”`);
  if (/[\[\]|]/.test(s.text.replace(GLOSS, ""))) errors.push(`${s.id}: stray [ ] or | outside a gloss`);
  let m; GLOSS.lastIndex = 0;
  while ((m = GLOSS.exec(s.text))) {
    const es = m[1].trim(), en = m[2].trim();
    if (/[¿¡?!.,]/.test(es)) errors.push(`${s.id}: punctuation inside gloss "${es}" — move it outside the brackets`);
    (glossMap[key(es)] ||= new Set()).add(en);
  }
  if (!(s.quiz || []).length) errors.push(`${s.id}: no quiz`);
  (s.quiz || []).forEach((q, i) => checkQ(q, `${s.id} q${i + 1}`));
});
LESSONS.forEach(l => {
  if (ids.has(l.id)) errors.push(`duplicate id ${l.id}`); ids.add(l.id);
  if (!LV.includes(l.level)) errors.push(`${l.id}: bad level`);
  (l.practice || []).forEach((q, i) => checkQ(q, `${l.id} p${i + 1}`));
});
Object.entries(glossMap).filter(([, s]) => s.size > 1)
  .forEach(([es, s]) => warns.push(`"${es}" glossed ${s.size} ways (first one wins as the flashcard): ${[...s].join(" / ")}`));

const cards = Object.keys(glossMap);
const words = cards.filter(k => !/\s/.test(k.replace(ARTICLE, ""))).length;
LV.forEach(l => {
  const bank = LESSONS.filter(x => x.level === l).reduce((a, x) => a + (x.practice || []).length, 0);
  console.log(`${l}: ${STORIES.filter(s => s.level === l).length} stories · ${LESSONS.filter(x => x.level === l).length} lessons · boss bank ${bank}`);
});
console.log(`${cards.length} flashcards (${words} words / ${cards.length - words} phrases)`);
if (warns.length) console.log(`\nwarnings (${warns.length}):\n  ` + warns.join("\n  "));
if (errors.length) { console.log(`\nERRORS (${errors.length}):\n  ` + errors.join("\n  ")); process.exit(1); }
console.log("\nOK — no errors");
