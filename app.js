/* ============================================================================
   GREEK QUEST — ENGINE (app.js)
   Cloned from Spanish Quest (~/Dropbox/Spanish_Quest), itself cloned from Czech
   Quest — separate repo, separate storage. Related apps, never shared.
   All learning logic lives here. Content lives in content.js; Greek text helpers
   (translit / answerKey / hasGreek) live in greek.js.
   ========================================================================== */

/* Picks up where Duolingo leaves off — but the learner might be anywhere from
   "never seen the alphabet" to "finished the Duolingo tree", so five levels run
   from the alphabet to past Duolingo, and a placement test on first open finds
   the right one. Codes are internal; LEVEL_LABEL is what the learner sees. */
const LEVELS = ["L0","L1","L2","L3","L4"];
const LEVEL_LABEL = { L0:"Level 0", L1:"Level 1", L2:"Level 2", L3:"Level 3", L4:"Level 4" };
const LEVEL_NAMES = { L0:"alphabet & first words", L1:"first steps", L2:"on the road", L3:"chatting", L4:"beyond Duolingo" };
/* Aegean palette: sea blue, olive, terracotta, bougainvillea, deep night sea */
const LEVEL_COLOR = {
  L0:["#1F6FB2","#E1EDF8"], L1:["#5E7D2A","#EAF0DC"], L2:["#C25A2E","#F9E6DC"], L3:["#A23B84","#F5E1EF"], L4:["#16486E","#DCE6EF"]
};
const XP_PER_CORRECT = { L0:10, L1:15, L2:20, L3:25, L4:30 };
function lvlLabel(l){ return LEVEL_LABEL[l] || l; }
/* The learner's name comes from the welcome screen (S.name); this is the fallback. */
let LEARNER = "friend";
const DAILY_GOAL_XP = 60;
const LEITNER_DAYS = [0, 1, 3, 7, 16, 35]; // interval by box (days)

/* ===== STATE ===== */
const DEFAULTS = {
  app:"greek-quest",       // tells a Greek Quest backup code apart from a Czech/Spanish one
  level:"L0", name:"", xp:0, streak:0, lastDate:null,
  voiceURI:null, rate:1,   // chosen read-aloud voice + speaking speed
  showTr:true,             // show the Latin-letter pronunciation under Greek
  placeResult:null,        // last placement: {level, blocks:{L0:true,...}}
  stars:{}, recent:{}, miss:{}, seen:{},
  vocab:{},            // gr -> {en, box, due, reps, correct, wrong}
  bossPassed:{},       // level -> true
  badges:{},           // badgeId -> earned timestamp
  placed:false,        // has the learner done (or skipped) the welcome / placement
  dayXp:0, dayKey:null, // daily-goal tracking
  freezes:2,           // streak freezes banked (a missed day auto-consumes one)
  lessonsDone:{}       // grammar-lesson id -> true (practiced)
};
let S = clone(DEFAULTS);
function clone(o){ return JSON.parse(JSON.stringify(o)); }
/* Own storage key. Greek, Spanish and Czech Quest are all served from
   orsag87.github.io, and localStorage is per-origin — a shared key would mix
   the apps' progress. Never read esQuestV1 / czQuest / czQuestV2. */
const STORE_KEY = "grQuestV1";
function load(){
  try{
    const r = localStorage.getItem(STORE_KEY);
    if(r){ S = Object.assign(clone(DEFAULTS), JSON.parse(r)); }
  }catch(e){}
}
function save(){ try{ localStorage.setItem(STORE_KEY, JSON.stringify(S)); }catch(e){} }

/* ===== BADGES ===== */
const BADGES = {
  first:      { icon:"🌱", name:"First steps",   desc:"Finished your first lesson" },
  streak3:    { icon:"🔥", name:"On a roll",      desc:"3-day streak" },
  streak7:    { icon:"⚡", name:"Unstoppable",    desc:"7-day streak" },
  perfect:    { icon:"💯", name:"Flawless",       desc:"A perfect 100% round" },
  words25:    { icon:"📚", name:"Word collector", desc:"25 words learned" },
  words100:   { icon:"🦉", name:"Athena's owl",   desc:"100 words mastered" },
  boss:       { icon:"🏅", name:"Checkpoint!",    desc:"Passed a Boss checkpoint" },
  top:        { icon:"🫒", name:"Beyond Duolingo", desc:"Reached Level 4" }
};
function award(id){
  if(S.badges[id]) return null;
  S.badges[id] = Date.now(); save();
  return BADGES[id];
}

/* ===== GLOSS / VOCAB INDEX (built once from all stories) ===== */
const GLOSS_RE = /\[([^|\]]+)\|([^\]]+)\]/g;
const VOCAB_INDEX = {};        // gr -> {en, level, kind}
const VOCAB_BY_LEVEL = {};     // level -> [gr, ...]

/* A gloss is a WORD if the Greek side is a single token, otherwise a PHRASE
   ("μου αρέσει", "τον λογαριασμό, παρακαλώ"). Word review and word match are
   strictly words; phrases get their own review lane.
   Greek nouns are glossed WITH their article ("η τουαλέτα", "το νερό") so the
   gender comes for free — an article + one word still counts as a single WORD. */
const ARTICLE_RE = /^(ο|η|το|οι|τα|τον|την|τη|του|της|τους|τις|ένας|έναν|μία|μια|ένα)\s+/i;
function isPhrase(gr){ return /\s/.test((gr||"").trim().replace(ARTICLE_RE,"")); }
function isWord(gr){ return !isPhrase(gr); }

/* Sentence-initial capitals are an artifact of where the word appeared in the
   story, not real orthography — and in match/review they leak the answer
   (capital lines up with capital). Strip them for DISPLAY only, on both sides,
   keeping genuine proper nouns and the English pronoun "I". */
const PROPER = new Set(["Ελλάδα","Αθήνα","Ακρόπολη","Πλάκα","Μοναστηράκι","Πειραιάς","Νάξος",
  "Σαντορίνη","Πάρος","Κρήτη","Χώρα","Πορτάρα","Απείρανθος","Αγία Άννα","ΚΤΕΛ","Πάσχα",
  "Χριστός Ανέστη","Αληθώς Ανέστη","Μαρία","Νίκος","Γιώργος","Ελένη","Φέτα","Sam"]);
function deCap(s){ return s ? s.charAt(0).toLowerCase()+s.slice(1) : s; }
function showGr(gr){ return PROPER.has(gr) ? gr : deCap(gr); }
function showEn(gr, en){
  if(PROPER.has(gr)) return en;
  const first = (en||"").split(/\s+/)[0] || "";
  if(first === "I" || first === "I'm" || first === "I'd" || first === "I've") return en;
  if(first.length>1 && first.slice(1) !== first.slice(1).toLowerCase()) return en;  // acronym / inner caps
  return deCap(en);
}

/* One flashcard per item, whatever its position in the sentence. "Ευχαριστώ"
   (sentence start) and "ευχαριστώ" (mid-sentence) are the same word; keying the
   index by the raw text made them two cards that could land on the SAME match
   board. Every lookup goes through vkey(). Proper nouns keep their capital. */
function vkey(gr){ gr=(gr||"").trim(); return PROPER.has(gr) ? gr : deCap(gr); }

(function buildVocabIndex(){
  STORIES.forEach(s=>{
    let m; GLOSS_RE.lastIndex = 0;
    while((m = GLOSS_RE.exec(s.text))){
      const gr = vkey(m[1]), en = m[2].trim();
      if(!VOCAB_INDEX[gr]){ VOCAB_INDEX[gr] = { en, level:s.level, kind: isPhrase(gr)?"phrase":"word" }; (VOCAB_BY_LEVEL[s.level] ||= []).push(gr); }
    }
  });
})();

/* ===== HELPERS ===== */
function applyLevelColor(){
  const c = LEVEL_COLOR[S.level] || LEVEL_COLOR.L0;
  document.documentElement.style.setProperty("--lvl", c[0]);
  document.documentElement.style.setProperty("--lvl-tint", c[1]);
}
function plainText(t){ return t.replace(GLOSS_RE, "$1"); }
function buildGlossary(t){
  const out=[], seen=new Set(); let m; GLOSS_RE.lastIndex=0;
  while((m=GLOSS_RE.exec(t))){ const gr=m[1].trim(); if(!seen.has(gr.toLowerCase())){ seen.add(gr.toLowerCase()); out.push([gr, m[2].trim()]); } }
  return out;
}
function starString(n){ let s=""; for(let i=0;i<3;i++) s += i<n ? "★" : '<span class="off">★</span>'; return s; }
/* Accent-insensitive: strips diacritics (Greek tonos included) and punctuation
   (the Greek question mark is ";"). Used to compare English glosses and options.
   Typed fill-in answers go through answerKey() instead — see submitFill(). */
function norm(s){ return (s||"").toLowerCase().trim().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/ς/g,"σ").replace(/[.,!?;:„“”"«»·;·]/g,"").replace(/\s+/g," ").trim(); }

/* ===== GREEK ON SCREEN =====
   Every Greek word the learner sees can carry its pronunciation in Latin letters
   (translit() in greek.js). S.showTr switches it; the pronunciation always sits in
   .tri / .trb / .trs elements and body.notr hides them, so the "Aa" toggle never
   needs a re-render. A question flagged notr (alphabet reading drills) never shows
   it — there the pronunciation IS the answer. */
const GR_RUN = /[Ͱ-Ͽἀ-῿](?:[Ͱ-Ͽἀ-῿\s\-]*[Ͱ-Ͽἀ-῿])?/g;
function trInline(text){ return `<span class="tri">${escapeHtml(translit(text))}</span>`; }
/* plain text -> HTML, pronunciation after each run of Greek words (question text) */
function grInline(s, notr){
  const e=escapeHtml(s);
  return notr ? e : e.replace(GR_RUN, run => run + trInline(run));
}
/* plain text -> HTML, pronunciation of the whole line underneath (options, tiles) */
function grBlock(s, notr){
  const e=escapeHtml(s);
  return (!notr && hasGreek(s)) ? `${e}<span class="trb">${escapeHtml(translit(s))}</span>` : e;
}
function applyTr(){ document.body.classList.toggle("notr", !S.showTr); const b=document.getElementById("hudTr"); if(b){ b.classList.toggle("on", !!S.showTr); b.setAttribute("aria-pressed", S.showTr?"true":"false"); } }
function toggleTr(){ S.showTr=!S.showTr; save(); applyTr(); mascot("idle", S.showTr ? "Pronunciation on · Aa" : "Pronunciation off — Greek only 💪"); }
function todayKey(){ return new Date().toDateString(); }
function daysBetween(aStr,bStr){ const a=new Date(aStr); a.setHours(0,0,0,0); const b=new Date(bStr); b.setHours(0,0,0,0); return Math.round((b-a)/864e5); }
/* Advance the daily streak for ANY completed activity (story/review/match/boss/practice).
   A missed day auto-consumes a banked freeze instead of resetting; earns a freeze every 7 days. */
function markActivity(){
  const today=todayKey();
  if(S.lastDate===today){ S._streakEvent="same"; return; }   // already counted today
  if(!S.lastDate){ S.streak=1; S.lastDate=today; S._streakEvent="up"; return; }
  const gap=daysBetween(S.lastDate, today);
  if(gap<=0){ S._streakEvent="same"; return; }               // clock oddity
  if(gap===1){ S.streak++; S._streakEvent="up"; }
  else {
    const missed=gap-1;
    if((S.freezes||0)>=missed){ S.freezes-=missed; S.streak++; S._streakEvent="froze"; }
    else { S.streak=1; S._streakEvent="reset"; }
  }
  S.lastDate=today;
  if(S.streak>0 && S.streak%7===0) S.freezes=Math.min((S.freezes||0)+1, 3); // earn a freeze weekly (cap 3)
}
function levelIdx(l){ return LEVELS.indexOf(l); }
function storiesAt(l){ return STORIES.filter(s=>s.level===l).sort((a,b)=>(a.diff||0)-(b.diff||0)); }
function lessonsAt(l){ return (window.LESSONS||[]).filter(x=>x.level===l).sort((a,b)=>(a.diff||0)-(b.diff||0)); }
function langBank(l){ const out=[]; lessonsAt(l).forEach(x=>(x.practice||[]).forEach(q=>out.push(q))); return out; }
const VIEWS = ["home","reading","quiz","lesson","results","placement","match"];
/* The WINDOW is the scroller (the .scroll views grow with content), so setting a
   view's scrollTop does nothing. Without the scrollTo, tapping a story low in the
   list opened it mid-page on the glossary. (Same in Czech Quest.) */
function show(id){ VIEWS.forEach(v=>document.getElementById(v).classList.toggle("hidden", v!==id)); window.scrollTo(0,0); }

/* ===== VOCAB / SRS ===== */
function enrollWord(gr, box){
  gr = vkey(gr);
  const info = VOCAB_INDEX[gr]; if(!info) return;
  if(!S.vocab[gr]){ S.vocab[gr] = { en:info.en, box:box||0, due:Date.now()+LEITNER_DAYS[box||0]*864e5, reps:0, correct:0, wrong:0, added:Date.now() }; }
}
function reviewWord(gr, correct){
  const v = S.vocab[gr]; if(!v) return;
  v.reps++;
  if(correct){ v.correct++; v.box = Math.min(v.box+1, 5); }
  else { v.wrong++; v.box = Math.max(v.box-1, 0); }
  v.due = Date.now() + (correct ? LEITNER_DAYS[v.box]*864e5 : 6*36e5); // wrong -> ~6h
}
function dueAll(){ const now=Date.now(); return Object.keys(S.vocab).filter(gr=>S.vocab[gr] && S.vocab[gr].due<=now); }
/* Word review is strictly WORDS. Phrases live in their own review lane so a
   "word review" never quizzes a five-word sentence. */
function dueWords(){ return dueAll().filter(isWord); }
function duePhrases(){ return dueAll().filter(isPhrase); }
function vocabStats(){
  const keys=Object.keys(S.vocab).filter(gr=>S.vocab[gr]); let learning=0, mastered=0;
  keys.forEach(gr=>{ if(S.vocab[gr].box>=4) mastered++; else learning++; });
  return { total:keys.length, learning, mastered };
}
/* Build a multiple-choice question for a vocab item.
   - Distractors are drawn from the SAME kind (word vs phrase), so a one-word
     question never sits next to a five-word option that gives itself away.
   - Options render through showEn(), so capitalisation is not a matching clue.
   - Safe for words she hasn't enrolled yet (targeted practice generates these). */
function vocabQuestion(gr){
  const v = S.vocab[gr], info = VOCAB_INDEX[gr] || {};
  const rawEn = (v && v.en) || info.en || "";
  if(!rawEn) return null;
  const kind = isPhrase(gr) ? "phrase" : "word";
  const correct = showEn(gr, rawEn);
  const used = new Set([norm(correct)]);
  // Same kind AND same shape. 34 English glosses legitimately start with a capital
  // ("I want", "I'm from", "OK") — as the only capitalised option, the right
  // answer would give itself away. Prefer distractors that share its first-letter
  // case; fall back to the rest only if there aren't enough.
  const capital = s => /^[A-Z]/.test(s);
  const all = Object.keys(VOCAB_INDEX).filter(w => w!==gr && VOCAB_INDEX[w].kind===kind);
  const same = shuffle(all.filter(w => capital(showEn(w, VOCAB_INDEX[w].en)) === capital(correct)));
  const sameSet = new Set(same);
  const pool = same.concat(shuffle(all.filter(w => !sameSet.has(w))));
  const distractors=[];
  for(const w of pool){
    if(distractors.length>=2) break;
    const d = showEn(w, VOCAB_INDEX[w].en);
    if(!used.has(norm(d))){ distractors.push(d); used.add(norm(d)); }
  }
  if(!distractors.length) return null;
  const opts = shuffle([correct, ...distractors]);
  return { q:`What does «${showGr(gr)}» mean?`, opts, a:opts.indexOf(correct), skill:"vocab-daily", _vocab:gr };
}
function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

/* ===== MASCOT ===== */
let mascotTimer=null;
function mascot(mood, text, sticky){
  const el=document.getElementById("mascot"), bubble=document.getElementById("mascotBubble");
  if(!el) return;
  el.setAttribute("data-mood", mood||"idle");
  if(text){ bubble.textContent=text; bubble.classList.add("show"); }
  else bubble.classList.remove("show");
  el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop");
  clearTimeout(mascotTimer);
  if(text && !sticky) mascotTimer=setTimeout(()=>{ bubble.classList.remove("show"); el.setAttribute("data-mood","idle"); }, 3200);
}

/* ===== CONFETTI (no deps) ===== */
function confetti(){
  const c=document.getElementById("fx"); if(!c) return;
  const ctx=c.getContext("2d"); c.width=innerWidth; c.height=innerHeight;
  const cols=["#E0A93B","#5C7363","#C8443F","#7B4EA3","#3F9794","#2F9E5A"];
  const N=130, P=[];
  for(let i=0;i<N;i++) P.push({x:Math.random()*c.width, y:-20-Math.random()*c.height*0.3, r:5+Math.random()*7, c:cols[i%cols.length], vy:2+Math.random()*4, vx:-2+Math.random()*4, a:Math.random()*6.28, va:-0.2+Math.random()*0.4});
  let frames=0;
  c.classList.add("show");
  (function tick(){
    ctx.clearRect(0,0,c.width,c.height); frames++;
    P.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; p.a+=p.va; p.vy+=0.04;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.a); ctx.fillStyle=p.c;
      ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r*0.6); ctx.restore(); });
    if(frames<160) requestAnimationFrame(tick);
    else { ctx.clearRect(0,0,c.width,c.height); c.classList.remove("show"); }
  })();
}

/* ===== HUD + HOME ===== */
function rollDay(){ if(S.dayKey!==todayKey()){ S.dayKey=todayKey(); S.dayXp=0; } }
function dailyRing(){
  rollDay();
  const pct=Math.min(1, S.dayXp/DAILY_GOAL_XP);
  const r=13, circ=2*Math.PI*r, off=circ*(1-pct);
  return `<svg class="ring" viewBox="0 0 32 32" aria-hidden="true">
    <circle cx="16" cy="16" r="${r}" class="ring-bg"></circle>
    <circle cx="16" cy="16" r="${r}" class="ring-fg" style="stroke-dasharray:${circ};stroke-dashoffset:${off}"></circle>
    <text x="16" y="20" text-anchor="middle" class="ring-t">${pct>=1?"✓":Math.round(pct*100)}</text></svg>`;
}
function renderHud(){
  applyLevelColor();
  applyTr();
  document.getElementById("hudLevel").textContent = lvlLabel(S.level)+" ⚙";
  document.getElementById("hudStreak").innerHTML = `🔥 ${S.streak}<small>${S.streak===1?"day":"days"}</small>`;
  document.getElementById("hudXp").innerHTML = `★ ${S.xp}<small>XP</small>`;
  document.getElementById("hudGoal").innerHTML = dailyRing();
}
/* These three read keys that a CONTENT edit can invalidate: rename a key in SKILLS and
   every learner who already has it in S.miss would hit `undefined.name` and get a blank
   home screen, recoverable only by resetting their progress. Unknown keys are dropped. */
function strongRounds(){ const r=S.recent[S.level]; return (Array.isArray(r)?r:[]).filter(a=>a>=0.85).length; }
function weakSkills(){ return Object.keys(S.miss).filter(k=>SKILLS[k] && S.miss[k]>=2); }
function levelComplete(l){ const ss=storiesAt(l); return ss.length>0 && ss.every(s=>S.stars.hasOwnProperty(s.id)); }
function bossAvailable(){
  const l=S.level;
  if(S.bossPassed[l]) return false;
  if(levelIdx(l)>=LEVELS.length-1) return false;        // no boss past top
  const ss=storiesAt(l); if(ss.length<2) return false;
  const done=ss.filter(s=>S.stars.hasOwnProperty(s.id)).length;
  return done>=Math.min(3, ss.length);                  // unlock after 3 (or all) done
}

function renderHome(){
  renderHud();
  // Greeks say καλημέρα until early afternoon and καλησπέρα after that.
  const hour=new Date().getHours();
  const greet = hour>=4 && hour<14 ? ["Καλημέρα","good morning"] : ["Καλησπέρα","good evening"];
  const doneToday = S.lastDate===todayKey();
  let sub;
  if(doneToday) sub = S.streak>0 ? `Day ${S.streak} done today — nice work. 🔥` : "Nice work today!";
  else if(S.streak>0) sub = `Keep your ${S.streak}-day streak alive today, ${LEARNER}! 🔥`;
  else sub = S.xp>0 ? "Welcome back — let's keep the Greek rolling." : `Let's learn some Greek. ${grInline("Πάμε!")} — let's go! 🇬🇷`;
  const freezeLine = (S.freezes>0 && !doneToday && S.streak>0)
    ? `<div class="sub" style="margin-top:3px">🛡️ ${S.freezes} streak freeze${S.freezes>1?'s':''} banked — one missed day won't break it.</div>` : "";
  document.getElementById("welcome").innerHTML = `<div class="hi">${greet[0]}, ${LEARNER} 👋</div><div class="sub"><span class="trq">${escapeHtml(translit(greet[0]))} = ${greet[1]}.</span> ${sub}</div>${freezeLine}`;

  // dynamic cards: SRS review, weak spots, boss
  let cards="";
  // Gate on the COMBINED due count, then show each lane that has anything in it.
  // Gating each lane at 4 independently would hide BOTH cards for splits like
  // 3 words + 3 phrases — 6 items due and no way to review any of them, which is
  // a regression on the single-pool behaviour this replaced.
  const due=dueWords(), duePh=duePhrases();
  if(due.length + duePh.length >= 4){
    if(due.length){
      cards += `<div class="review srs"><h3>🧠 Word review</h3><div class="desc">${due.length} single word${due.length>1?"s are":" is"} due — a quick spaced-repetition round keeps them locked in.</div><button class="btn small" style="background:var(--sage)" onclick="startSrs()">Review (${Math.min(due.length,8)})</button></div>`;
    }
    if(duePh.length){
      cards += `<div class="review srs"><h3>🗣️ Phrase review</h3><div class="desc">${duePh.length} phrase${duePh.length>1?"s and set expressions are":" is"} due — these are learned as whole units, not word by word.</div><button class="btn small" style="background:var(--sage)" onclick="startPhraseReview()">Review (${Math.min(duePh.length,8)})</button></div>`;
    }
  }
  if(bossAvailable()){
    const nxt=LEVELS[levelIdx(S.level)+1];
    cards += `<div class="review boss"><h3>🏆 Boss checkpoint · ${lvlLabel(S.level)}</h3><div class="desc">You've done the ${lvlLabel(S.level)} stories. Pass this mixed challenge (80%+) to certify it and unlock ${lvlLabel(nxt)}.</div><button class="btn small bossbtn" onclick="startBoss()">Take the challenge</button></div>`;
  }
  const weak=weakSkills();
  if(weak.length){
    cards += `<div class="review"><h3>🎯 Weak spots</h3><div class="desc">Things to shore up, based on what's been missed. Each one opens a lesson and then a real drill — get 70%+ and it clears off this list.</div>${
      weak.map(k=>{
        const cnt=practiceSet(k, PRACTICE_N).length;   // pure — enrollment happens in startPractice
        return `<div class="weakrow"><div class="wn">${SKILLS[k].name}<small>missed ${S.miss[k]}× · ${cnt} exercises ready</small></div><button class="btn small" style="background:var(--gold)" onclick="openLesson('${k}')">Practice</button></div>`;
      }).join("")
    }</div>`;
  }
  document.getElementById("reviewBox").innerHTML = cards;

  // always-available practice: word match
  document.getElementById("practiceBox").innerHTML = matchAvailable()
    ? `<div class="review practice"><h3>🃏 Word match</h3><div class="desc">Quick recap — match recent Greek words to their English. Jump in anytime.</div><button class="btn small" style="background:var(--lvl)" onclick="startMatch()">Play</button></div>`
    : "";

  // level card — with every level one tap away: placement suggests, it never locks
  document.getElementById("lvlTitle").textContent = `${lvlLabel(S.level)} · ${LEVEL_NAMES[S.level]}`;
  const idx=levelIdx(S.level), top=idx>=LEVELS.length-1;
  document.getElementById("lvlGoal").textContent = top ? "top level" : "boss or 3× 85% → up";
  const sr=Math.min(strongRounds(),3); let dots="";
  for(let i=0;i<3;i++) dots+=`<div class="dot ${i<sr?'on':''}"></div>`;
  document.getElementById("lvlDots").innerHTML = dots;
  document.getElementById("lvlHint").textContent = top
    ? "Top level — you're past where Duolingo stops. Reviews keep it all fresh."
    : `Strong rounds: ${sr}/3. Beat the boss or score 85%+ three times to reach ${lvlLabel(LEVELS[idx+1])}.`;
  document.getElementById("lvlChips").innerHTML = `<span class="chiplabel">Jump to:</span>` + LEVELS.map(l=>
    `<button class="lchip ${l===S.level?'sel':''}" onclick="pickLevel('${l}')" aria-label="${lvlLabel(l)}: ${LEVEL_NAMES[l]}">${l.slice(1)}</button>`).join("");

  // vocab mastery strip
  const vs=vocabStats();
  document.getElementById("vocabStrip").innerHTML = vs.total
    ? `<div class="vstrip"><span>📖 Words</span><b>${vs.total}</b> learned · <b>${vs.mastered}</b> mastered · <b>${vs.learning}</b> learning</div>` : "";

  // badges
  const earned=Object.keys(S.badges).filter(id=>BADGES[id]);
  document.getElementById("badgeStrip").innerHTML = earned.length
    ? `<div class="sechead" style="margin-top:6px">Badges</div><div class="badges">${earned.map(id=>`<div class="badge" title="${BADGES[id].desc}">${BADGES[id].icon}<span>${BADGES[id].name}</span></div>`).join("")}</div>` : "";

  // grammar lessons (Language Lab) — only where lessons exist for this level
  const lessons=lessonsAt(S.level);
  document.getElementById("lessonSec").innerHTML = lessons.length
    ? `<div class="sechead">Power lessons</div>` + lessons.map(l=>{
        const done=!!S.lessonsDone[l.id];
        return `<div class="story-card ${done?'done':''}" onclick="openGrammarLesson('${l.id}')"><div class="story-num">${done?'✓':'📘'}</div><div class="story-meta"><div class="t">${l.titleEn}</div><div class="e">${grInline(l.title)}</div></div></div>`;
      }).join("")
    : "";

  // story list
  const list=storiesAt(S.level);
  document.getElementById("storyList").innerHTML = list.map((s,i)=>{
    const st=S.stars[s.id]||0, done=S.stars.hasOwnProperty(s.id);
    return `<div class="story-card ${done?'done':''}" onclick="openStory('${s.id}')"><div class="story-num">${done?'✓':i+1}</div><div class="story-meta"><div class="t">${grInline(s.titleGr)}</div><div class="e">${s.titleEn}</div></div><div class="stars">${starString(st)}</div></div>`;
  }).join("");

  document.getElementById("footer").classList.add("hidden");
  mascot("idle","");
}
function goHome(){ if(window.speechSynthesis) speechSynthesis.cancel(); mode="story"; show("home"); renderHome(); window.scrollTo(0,0); }

/* ===== READING ===== */
let current=null, mode="story", practiceSkill=null;
function openStory(id){
  mode="story";
  current=STORIES.find(s=>s.id===id);
  document.getElementById("rTitle").innerHTML=grInline(current.titleGr);
  document.getElementById("rSub").textContent=current.titleEn;
  document.getElementById("rBody").innerHTML=renderReadingBody(current.text);
  document.getElementById("rGloss").innerHTML=buildGlossary(current.text).map(([gr,en])=>`<div class="gi" data-gr="${escapeHtml(gr)}"><span class="gr">${escapeHtml(gr)}<span class="trb">${escapeHtml(translit(gr))}</span></span><span class="en">${en}</span><button class="gsp" aria-label="Listen">🔊</button></div>`).join("");
  document.querySelectorAll("#rGloss .gi").forEach(row=>{ const gr=row.dataset.gr; row.onclick=()=>speakWord(gr); });
  bindGlosses(); show("reading"); resetPlayer();
  const f=document.getElementById("footer"); f.classList.remove("hidden");
  const b=document.getElementById("footerBtn"); b.textContent="Start quiz →"; b.onclick=startQuiz;
  mascot("read","Tap the words 👇");
}
function bindGlosses(){
  document.querySelectorAll("#rBody .gloss").forEach(g=>{
    g.onclick=(e)=>{
      const wasActive=g.classList.contains("active");
      document.querySelectorAll(".gloss.active").forEach(x=>x.classList.remove("active"));
      if(!wasActive){
        g.classList.add("active");
        const gr=g.dataset.gr; enrollWord(gr,1); save();
        if(g.dataset.i) wIndex=+g.dataset.i;   // tapping a word moves the player cursor there
        highlightWord(wIndex); speakWord(gr);
      }
      e.stopPropagation();
    };
  });
}
document.body.addEventListener("click",()=>document.querySelectorAll(".gloss.active").forEach(x=>x.classList.remove("active")));

/* ---- Read-aloud: word-by-word player (⏮ ▶/⏸ ⏭) ---- */
let words=[], wIndex=0, playing=false, playRate=1;
/* ---- Voice picking ----
   Rank the device's Greek voices (el-GR first, downloaded HD voices up), let the
   learner choose, remember it (S.voiceURI). The novelty filter is inherited from
   Spanish Quest, where "first voice in the list" turned out to be Apple's robot
   Eddy; harmless for Greek and it keeps any future novelty voice at the bottom. */
const NOVELTY = /^(eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley|bells|boing|bubbles|jester|organ|superstar|trinoids|whisper|wobble|zarvox|bahh|albert|bad news|good news|cellos)\b/i;
const VOICE_SEX = { melina:"♀", "μελίνα":"♀", nikos:"♂", "νίκος":"♂" };
function voiceName(v){ return (v.name||"").split(" (")[0].trim(); }
function voiceSex(v){ return VOICE_SEX[voiceName(v).toLowerCase()] || ""; }
function isEnhanced(v){ return /enhanced|premium|neural|siri/i.test((v.name||"")+" "+(v.voiceURI||"")); }
function voiceLang(v){ return (v.lang||"").toLowerCase().replace("_","-"); }
function voiceScore(v){
  const l=voiceLang(v);
  let s = l==="el-gr" ? 100 : l.startsWith("el") ? 80 : 0;
  if(isEnhanced(v)) s+=30;                 // downloaded HD voice — much better
  if(NOVELTY.test(v.name||"")) s-=90;
  return s;
}
function grVoices(){
  if(!("speechSynthesis" in window)) return [];
  return speechSynthesis.getVoices().filter(v=>voiceLang(v).startsWith("el"))
    .sort((a,b)=> voiceScore(b)-voiceScore(a) || voiceName(a).localeCompare(voiceName(b)));
}
function grVoice(){
  const all=grVoices(); if(!all.length) return null;
  return (S.voiceURI && all.find(v=>v.voiceURI===S.voiceURI)) || all[0];
}
/* One place that builds every utterance, so voice/volume/pitch can't drift apart.
   With no Greek voice found yet, lang alone still lets iOS pick its Greek voice. */
function utter(text){
  const u=new SpeechSynthesisUtterance(text);
  const v=grVoice();
  u.lang = v ? v.lang : "el-GR";
  if(v) u.voice=v;
  u.volume=1; u.pitch=1;
  return u;
}
/* Tokenize the story into words (glosses stay one tappable token) and build words[]
   for read-aloud. Each Greek token is a little two-line stack: the word, and its
   pronunciation underneath (.trs, hidden by body.notr). */
function stack(gr, extra){
  return `<span class="ws"><span class="wg">${gr}</span><span class="trs">${escapeHtml(translit(gr))}</span></span>${extra||""}`;
}
function renderReadingBody(text){
  words=[]; let html=""; const re=/(\[[^|\]]+\|[^\]]+\])|(\s+)|([^\s\[]+)/g; let m;
  while((m=re.exec(text))){
    if(m[1]){ const g=/\[([^|\]]+)\|([^\]]+)\]/.exec(m[1]); const i=words.length; words.push(g[1]);
      html+=`<span class="gloss wtok" data-i="${i}" data-gr="${escapeHtml(g[1])}">${stack(escapeHtml(g[1]), `<span class="pop">${g[2]}</span>`)}</span>`; }
    else if(m[2]){ html+=m[2]; }
    else { const i=words.length; words.push(m[3]);
      html+= hasGreek(m[3]) ? `<span class="wtok" data-i="${i}">${stack(escapeHtml(m[3]))}</span>` : `<span class="wtok" data-i="${i}">${escapeHtml(m[3])}</span>`; }
  }
  return html;
}
function playerText(w){ return (w||"").replace(/[„“”"»«()\[\]{}.,!?;:·;·—–…]/g," ").replace(/\s+/g," ").trim(); }
function highlightWord(i){
  document.querySelectorAll("#rBody .wtok.speaking").forEach(x=>x.classList.remove("speaking"));
  const el=document.querySelector(`#rBody .wtok[data-i="${i}"]`);
  if(el){ el.classList.add("speaking"); el.scrollIntoView({block:"center"}); }
}
function updatePlayerUI(){ const b=document.getElementById("ppBtn"); if(b) b.textContent = playing ? "⏸" : "▶"; }
function speakIndex(i, auto){
  if(i<0 || i>=words.length){ playing=false; updatePlayerUI(); return; }
  wIndex=i; highlightWord(i);
  if(!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const t=playerText(words[i]);
  if(!t){ if(auto && playing && i<words.length-1) speakIndex(i+1, true); return; }
  const u=utter(t); u.rate=playRate;
  u.onend=()=>{ if(auto && playing){ if(wIndex<words.length-1) speakIndex(wIndex+1, true); else { playing=false; updatePlayerUI(); } } };
  speechSynthesis.speak(u);
}
function playPause(){
  const tip=document.getElementById("rTip");
  if(!("speechSynthesis" in window)){ if(tip) tip.textContent="Read-aloud isn't supported here."; return; }
  if(!grVoice() && tip) tip.textContent="No Spanish voice on this device yet — on iPhone add “Spanish (Mexico)” in Settings ▸ Accessibility ▸ Spoken Content ▸ Voices.";
  if(!words.length) return;
  if(playing){ playing=false; speechSynthesis.cancel(); updatePlayerUI(); }
  else { playing=true; updatePlayerUI(); speakIndex(wIndex, true); }
}
function stepWord(d){
  if(!words.length) return;
  const wasPlaying=playing;
  if(window.speechSynthesis) speechSynthesis.cancel();
  const i=Math.max(0, Math.min(words.length-1, wIndex + d));
  playing=wasPlaying; updatePlayerUI();
  speakIndex(i, wasPlaying);   // if it was playing, keep rolling from the new word
}
function toggleSlow(){
  const normal = S.rate || 1;               // the learner's chosen speed, from Settings
  playRate = (playRate===normal) ? 0.6 : normal;
  const b=document.getElementById("slowBtn"); if(b) b.textContent = (playRate===normal) ? "🐢 Lento" : "🐇 Normal";
  if(playing) speakIndex(wIndex, true);
}
function resetPlayer(){
  playing=false; wIndex=0;
  if(window.speechSynthesis) speechSynthesis.cancel();
  document.querySelectorAll("#rBody .wtok.speaking").forEach(x=>x.classList.remove("speaking"));
  updatePlayerUI();
}
function speakWord(w){
  if(!("speechSynthesis" in window) || !w) return;
  playing=false; updatePlayerUI(); speechSynthesis.cancel();
  // a single word reads a touch slower than running text, whatever the chosen speed
  const u=utter(playerText(w)); u.rate=Math.min(playRate, S.rate||1) * 0.9;
  speechSynthesis.speak(u);
}
/* Voices load asynchronously (and late on iOS) — repaint the picker if it's open. */
if("speechSynthesis" in window) speechSynthesis.onvoiceschanged=()=>{
  if(document.getElementById("scrim").classList.contains("show")) renderVoiceBox();
};

/* ===== QUIZ ENGINE (shared by story / practice / srs / placement / boss) ===== */
let qIndex=0, qCorrect=0, qLocked=false, qResults=[];
function startQuiz(){ if(window.speechSynthesis) speechSynthesis.cancel(); qIndex=0; qCorrect=0; qResults=[]; show("quiz"); document.getElementById("footer").classList.add("hidden"); renderQuestion(); }
function renderQuestion(){
  qLocked=false;
  const item=current.quiz[qIndex], total=current.quiz.length;
  let bars=""; for(let i=0;i<total;i++) bars+=`<div class="qbar ${i<=qIndex?'on':''}"></div>`;
  document.getElementById("qProgress").innerHTML=bars;
  document.getElementById("qCount").textContent=`QUESTION ${qIndex+1} / ${total}`;
  document.getElementById("qText").innerHTML=grInline(item.q, item.notr);
  const fb=document.getElementById("qFeedback"); fb.textContent=""; fb.className="qfeedback";
  document.getElementById("qExplain").innerHTML="";
  if(item.type==="fill"){
    /* Nobody should need a Greek keyboard: Latin letters are accepted (answerKey).
       "Show me" is the way out for a learner with no idea — it never dead-ends. */
    document.getElementById("qOpts").innerHTML=`<input id="fillIn" class="fill" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="Greek or Latin letters…">
      <div class="fillhint">Latin letters are fine — e.g. <i>efharisto</i> for ευχαριστώ. Accents don't matter.</div>
      <button class="btn" style="margin-top:12px" onclick="submitFill()">Check</button>
      <button class="btn ghost" style="margin-top:10px" onclick="submitFill(true)">I don't know — show me</button>`;
    const inp=document.getElementById("fillIn"); inp.addEventListener("keydown",e=>{ if(e.key==="Enter") submitFill(); }); setTimeout(()=>inp.focus(),100);
  } else {
    document.getElementById("qOpts").innerHTML=item.opts.map((o,i)=>`<button class="opt" onclick="answer(${i})">${grBlock(o, item.notr)}</button>`).join("");
  }
  window.scrollTo(0,0);
}
function record(item, correct){
  qResults.push({ skill:item.skill||"comprehension", correct, vocab:item._vocab||null });
  if(correct) qCorrect++;
  if(item._vocab) reviewWord(item._vocab, correct);
}
function afterAnswer(item, correct){
  const ex=document.getElementById("qExplain");
  if(item.explain && (item.trick || !correct)) ex.innerHTML=`<div class="explain-box">💡 ${speakify(item.explain, false)}</div>`;
  else if(item.trick) ex.innerHTML=`<div class="explain-box">💡 Trick question — nicely handled.</div>`;
  const f=document.getElementById("footer"); f.classList.remove("hidden");
  const b=document.getElementById("footerBtn");
  if(qIndex<current.quiz.length-1){ b.textContent="Next →"; b.onclick=nextQuestion; }
  else { b.textContent="Finish"; b.onclick=finishQuiz; }
}
const YAY = ["Μπράβο! · bravo","Τέλεια! · perfect","Σωστά! · correct","Ωραία! · nice","Πολύ καλά! · very good"];
const OOPS = ["Δεν πειράζει · never mind 💪","Σιγά σιγά · step by step 💪"];
function answer(i){
  if(qLocked) return; qLocked=true;
  const item=current.quiz[qIndex];
  document.querySelectorAll("#qOpts .opt").forEach((b,bi)=>{ b.disabled=true; if(bi===item.a) b.classList.add("correct"); if(bi===i&&i!==item.a) b.classList.add("wrong"); });
  const ok=i===item.a, fb=document.getElementById("qFeedback");
  if(ok){ fb.textContent="Σωστά! ✓ Correct"; fb.className="qfeedback ok"; mascot("happy", pick(YAY)); }
  else { fb.textContent="Not quite — the green one is right."; fb.className="qfeedback no"; mascot("sad", pick(OOPS)); }
  record(item,ok); afterAnswer(item,ok); save();
}
/* giveUp: the "I don't know — show me" button. Counts as a miss, shows the answer. */
function submitFill(giveUp){
  if(qLocked) return;
  const item=current.quiz[qIndex], inp=document.getElementById("fillIn");
  if(!giveUp && !inp.value.trim()){ inp.focus(); inp.classList.add("nudge"); setTimeout(()=>inp.classList.remove("nudge"),400); return; }
  qLocked=true;
  // Greek or Latin, any accents, any common spelling: efharisto = ευχαριστώ
  const ok=!giveUp && item.a.map(answerKey).includes(answerKey(inp.value));
  inp.disabled=true; inp.classList.add(ok?"ok":"bad");
  document.querySelectorAll("#qOpts .btn").forEach(x=>x.disabled=true);
  const fb=document.getElementById("qFeedback"), want=item.a[0];
  const say=`<div class="fillans"><b class="say" role="button" tabindex="0" aria-label="Listen to ${escapeHtml(want)}">${escapeHtml(want)}</b> ${trInline(want)} <button class="gsp" onclick="speakWord('${escapeHtml(want).replace(/'/g,"&#39;")}')" aria-label="Listen">🔊</button></div>`;
  if(ok){ fb.innerHTML=`Σωστά! ✓ Correct${norm(inp.value)===norm(want)?"":say}`; fb.className="qfeedback ok"; mascot("happy", pick(YAY)); }
  else { fb.innerHTML=`${giveUp?"Here it is":"Not quite"} — the answer:${say}`; fb.className="qfeedback no"; mascot("sad", pick(OOPS)); }
  record(item,ok); afterAnswer(item,ok); save();
}
function nextQuestion(){ qIndex++; document.getElementById("footer").classList.add("hidden"); renderQuestion(); }
function pick(a){ return a[Math.floor(Math.random()*a.length)]; }

/* ===== FINISH / RESULTS ===== */
function finishQuiz(){
  const total=current.quiz.length, acc=qCorrect/total;
  qResults.forEach(r=>{ S.seen[r.skill]=(S.seen[r.skill]||0)+1; if(!r.correct) S.miss[r.skill]=(S.miss[r.skill]||0)+1; });

  if(mode==="srs"){
    S.xp+=qCorrect*10; bumpDay(qCorrect*10); markActivity(); save();
    renderResults({ acc, stars:acc>=1?3:acc>=0.66?2:acc>=0.33?1:0, gained:qCorrect*10, special:"srs" });
    return;
  }
  if(mode==="grammar"){
    const gained=qCorrect*12; S.xp+=gained; bumpDay(gained); markActivity();
    if(currentLessonId) S.lessonsDone[currentLessonId]=true;
    save();
    renderResults({ acc, stars:acc>=1?3:acc>=0.66?2:acc>=0.33?1:0, gained, special:"grammar" });
    return;
  }
  if(mode==="practice"){
    S.xp+=qCorrect*10; bumpDay(qCorrect*10); markActivity();
    /* 70% of a SHORT drill demands perfection: a grammar skill with only 3 tagged
       questions needs 3/3 (2/3 = 0.67). One miss would re-pin the weak spot forever. */
    if(acc>=0.7 || qCorrect>=current.quiz.length-1) delete S.miss[practiceSkill]; else S.miss[practiceSkill]=2;
    save();
    renderResults({ acc, stars:acc>=1?3:acc>=0.66?2:acc>=0.33?1:0, gained:qCorrect*10, special:"practice" });
    return;
  }
  if(mode==="boss"){
    const passed=acc>=0.8;
    let gained=qCorrect*XP_PER_CORRECT[S.level]+ (passed?100:0); S.xp+=gained; bumpDay(gained); markActivity();
    let move=null, prev=S.level;
    if(passed){
      S.bossPassed[S.level]=true;
      const idx=levelIdx(S.level);
      if(idx<LEVELS.length-1){ S.level=LEVELS[idx+1]; S.recent[S.level]=[]; move="up"; }
      award("boss");
    }
    save();
    renderResults({ acc, stars:passed?3:1, gained, move, prevLevel:prev, special:passed?"boss-pass":"boss-fail" });
    return;
  }

  // ---- normal story round ----
  const stars=acc>=1?3:acc>=0.66?2:acc>=0.33?1:0;
  let gained=qCorrect*XP_PER_CORRECT[S.level]; if(acc>=1) gained+=25; S.xp+=gained; bumpDay(gained);
  const firstEver=!Object.keys(S.stars).length;
  S.stars[current.id]=Math.max(S.stars[current.id]||0, stars);
  // enroll this story's words into SRS (she has now studied them)
  buildGlossary(current.text).forEach(([gr])=>enrollWord(gr,1));
  // streak
  markActivity();
  // rolling avg + gentle auto-level
  const lvl=S.level; (S.recent[lvl] ||= []).push(acc); if(S.recent[lvl].length>3) S.recent[lvl].shift();
  let move=null; const idx=levelIdx(lvl);
  if(S.recent[lvl].length>=3){
    const avg=S.recent[lvl].reduce((a,b)=>a+b,0)/S.recent[lvl].length;
    if(avg>=0.85 && idx<LEVELS.length-1){ S.level=LEVELS[idx+1]; S.recent[S.level]=[]; move="up"; }
    else if(avg<0.45 && idx>0){ S.level=LEVELS[idx-1]; S.recent[S.level]=[]; move="down"; }
  }
  // badges
  const newBadges=[];
  if(firstEver){ const b=award("first"); if(b) newBadges.push(b); }
  if(acc>=1){ const b=award("perfect"); if(b) newBadges.push(b); }
  if(S.streak>=3){ const b=award("streak3"); if(b) newBadges.push(b); }
  if(S.streak>=7){ const b=award("streak7"); if(b) newBadges.push(b); }
  const vs=vocabStats();
  if(vs.total>=25){ const b=award("words25"); if(b) newBadges.push(b); }
  if(vs.mastered>=100){ const b=award("words100"); if(b) newBadges.push(b); }
  if(levelIdx(S.level)>=LEVELS.length-1){ const b=award("top"); if(b) newBadges.push(b); }

  const missedNow=qResults.filter(r=>!r.correct).map(r=>r.skill);
  const topMissed=missedNow.length?missedNow[0]:null;
  save();
  renderResults({ acc, stars, gained, move, prevLevel:lvl, topMissed, newBadges });
}
function bumpDay(x){ rollDay(); S.dayXp+=x; }

function renderResults({acc,stars,gained,move,prevLevel,topMissed,newBadges,special}){
  applyLevelColor(); renderHud();
  const pct=Math.round(acc*100);
  const ring=stars===3?"🏆":stars===2?"🎉":stars===1?"👍":"📖";
  let banner="";
  if(special==="boss-pass") banner=`<div class="banner up">🏅 You beat the boss, ${LEARNER}! ${lvlLabel(prevLevel)} is certified — welcome to ${lvlLabel(S.level)}.</div>`;
  if(special==="boss-fail") banner=`<div class="banner down">So close! You need 80% to clear the checkpoint. Review a little and try again — you've got this.</div>`;
  if(move==="up" && special!=="boss-pass") banner=`<div class="banner up">⬆ ¡Subiste de nivel, ${LEARNER}! Moving from ${lvlLabel(prevLevel)} to ${lvlLabel(S.level)}.</div>`;
  if(move==="down") banner=`<div class="banner down">↺ No pasa nada, ${LEARNER} — easing back to ${lvlLabel(S.level)} to lock in the basics.</div>`;

  let lesson="";
  if(topMissed && SKILLS[topMissed]) lesson=`<div class="lessoncall"><h4>📘 Quick lesson · ${SKILLS[topMissed].name}</h4><p>${speakify(SKILLS[topMissed].lesson, false)}</p><button class="btn small" style="background:var(--gold)" onclick="openLesson('${topMissed}')">Practicar · Practice this</button></div>`;

  let badgeHtml="";
  if(newBadges && newBadges.length) badgeHtml=`<div class="newbadges">${newBadges.map(b=>`<div class="nb">${b.icon}<span>${b.name}</span></div>`).join("")}</div>`;

  const msgs=[`Otra vez, ${LEARNER} — every read makes the next one click.`,`¡Buen comienzo, ${LEARNER}! Check the glossary and run it again.`,`¡Muy bien, ${LEARNER}! You got the gist.`,`¡Perfecto, ${LEARNER}! Flawless round. 🎉`];
  let headline = special==="srs" ? `¡Repaso listo, ${LEARNER}!`
              : special==="practice" ? `¡Práctica lista, ${LEARNER}!`
              : special==="match" ? `¡Parejas listas, ${LEARNER}!`
              : special==="grammar" ? `¡Lección lista, ${LEARNER}!`
              : msgs[stars];
  const freezeBanner = S._streakEvent==="froze" ? `<div class="banner up">🛡️ Streak saved, ${LEARNER}! A banked freeze covered a missed day — you're still on a ${S.streak}-day streak 🔥.</div>` : "";

  document.getElementById("results").innerHTML=`<div class="result"><div class="ring">${ring}</div><h1>${pct}%</h1><div class="bigstars">${starString(stars)}</div><p>${headline}</p>${banner}${freezeBanner}${badgeHtml}${lesson}<div class="rewards"><div class="reward"><div class="v" style="color:var(--gold)">+${gained}</div><div class="l">XP</div></div><div class="reward"><div class="v">🔥 ${S.streak}</div><div class="l">streak</div></div></div></div>`;
  show("results");
  const f=document.getElementById("footer"); f.classList.remove("hidden");
  const b=document.getElementById("footerBtn"); b.textContent="Inicio · Home"; b.onclick=goHome;

  if(stars===3 || special==="boss-pass" || move==="up"){ confetti(); mascot("celebrate", special==="boss-pass"?"¡Eres un crack! 🏅":"¡Buen trabajo! 🎉", true); }
  else if(stars>=2){ mascot("happy","¡Bien! 👏", true); }
  else mascot("idle","");
}

/* ===== SKILL LESSON + TARGETED PRACTICE =====
   The weak-spot ("Slabá místa") review used to dead-end: it showed an
   explanation and then, for any skill with no story questions tagged to it,
   offered nothing to actually DO. Seven of the eighteen skills (translation,
   prepositions, aspect, future, comparatives, reflexives, relative) were in
   exactly that state — their exercises live in the Language Lab, which this
   screen never looked at. practiceSet() now guarantees a real drill for every
   skill, from three sources in order of preference. */
const PRACTICE_N = 6;

/* Source 1: every question in the app tagged with this skill — story quizzes
   AND Language Lab practice banks. */
function skillPool(skill){
  const pool=[];
  STORIES.forEach(s=>s.quiz.forEach(q=>{ if((q.skill||"comprehension")===skill) pool.push(q); }));
  (window.LESSONS||[]).forEach(l=>(l.practice||[]).forEach(q=>{ if((q.skill||"")===skill) pool.push(q); }));
  return pool;
}
/* Language Lab lessons that actually teach this skill — used to show the full
   teaching card under the mini-lesson instead of just a one-line blurb. */
function lessonsForSkill(skill){
  return (window.LESSONS||[]).filter(l=>(l.practice||[]).some(q=>(q.skill||"")===skill));
}
/* Source 2 (vocab-* skills): the words from the stories that carry this skill's
   questions — so "Food vocabulary" drills food words, not random ones. */
function skillWords(skill){
  const out=[], seen=new Set();
  STORIES.forEach(s=>{
    if(!s.quiz.some(q=>(q.skill||"comprehension")===skill)) return;
    buildGlossary(s.text).forEach(([gr])=>{
      const k=vkey(gr);
      if(isWord(k) && VOCAB_INDEX[k] && !seen.has(k)){ seen.add(k); out.push(k); }
    });
  });
  return out;
}
/* Build the actual drill. Never returns an empty set for a skill that has any
   content behind it at all. */
function practiceSet(skill, n){
  n = n || PRACTICE_N;
  const pool = shuffle(skillPool(skill)).slice(0, n);
  // PURE: generates questions only. Enrollment is a side effect and must not
  // happen here — renderHome() calls this just to show a count, and enrolling
  // there would grow her vocabulary every time the home screen painted.
  const addWords = list => {
    for(const w of list){
      if(pool.length>=n) break;
      const q = vocabQuestion(w);
      if(q) pool.push(q);
    }
  };
  // Only vocabulary skills get topped up with generated word questions — padding a
  // grammar drill with a random vocab item would take it off-target.
  if(pool.length<n && skill.indexOf("vocab")===0) addWords(shuffle(skillWords(skill)));
  if(!pool.length) addWords(shuffle(Object.keys(S.vocab).filter(isWord)));   // last resort: never dead-end
  return shuffle(pool);
}

/* ===== TAP-TO-HEAR INSIDE LESSONS =====
   Story words are tappable; lesson teaching cards weren't, so "por favor" could be
   read but never heard. Every Spanish term in a lesson (the <b> bits) becomes
   tappable, using the same dotted underline the stories use.
   Which <b> is Spanish? The stories ARE Spanish, so their words make a reliable
   lexicon — plus every gloss and every fill-in answer. A bold whose words are
   mostly in that lexicon is Spanish; "Mac:", "11–15" and "-tion → -ción" are not. */
const ES_TOKENS = (function(){
  const set=new Set(), add=s=>norm(s).split(/[^a-z0-9]+/).forEach(w=>{ if(w) set.add(w); });
  STORIES.forEach(s=>{ add(plainText(s.text)); (s.quiz||[]).forEach(q=>{ if(q.type==="fill") (q.a||[]).forEach(add); }); });
  Object.keys(VOCAB_INDEX).forEach(add);
  (window.LESSONS||[]).forEach(l=>(l.practice||[]).forEach(q=>{ if(q.type==="fill") (q.a||[]).forEach(add); }));
  return set;
})();
/* Words that give away an English label ("Pro tip:", "Vowels never change:").
   A word that is ALSO Spanish (me, no, a, son, van…) is exempt via ES_TOKENS,
   which is why the lexicon is still built. */
const EN_MARKERS = new Set(("the and or is are was were you your yours im going gonna my we our they them this that these those "+
  "with without for from of to in on at by about into over under again very just only also not dont cant wont "+
  "what when where which who how why tip pro friend friends day days vowel vowels never change changes false "+
  "hello good morning night thing things word words say says said speak speaks hear hears people time times "+
  "use uses using like likes make makes get gets take takes there here its be been being do does did have has had "+
  "will would should could may might must let lets each any some all most more less than then so if but because "+
  "while during before after own same other another such few many much every both either neither").split(" "));
/* Letter names as they appear in the sounds lesson ("<b>ll</b> and <b>y</b> sound like…").
   norm() strips accents, so ñ arrives as n. */
const LETTER_DRILL = new Set(["h","j","y","ll","rr","n","c","g","v","b","z","x","qu","gu"]);
/* Bolds in a lesson are Spanish unless something says otherwise — being too strict
   left "con permiso", "taco" and "popote" silent, which is the whole point of this. */
function isSpanishish(text){
  const raw=(text||"").trim();
  if(!/[a-záéíóúñü]/i.test(raw)) return false;            // numbers, arrows, symbols only
  if(/[→➜]/.test(raw)) return false;                      // pattern rows: "-tion → -ción"
  if(/^[-–]|[-–]$/.test(raw)) return false;               // affixes: "-ce", "dieci-"
  if(raw.replace(/[^a-záéíóúñü]/gi,"").length<2) return false;
  const toks=norm(raw).split(/[^a-z0-9]+/).filter(Boolean);
  if(!toks.length) return false;
  if(toks.every(w=>w.length===1)) return false;           // letter drills: "a e i o u"
  // A lone letter NAME from the pronunciation lesson (h, j, ll, rr, ñ) is not a word —
  // but two-letter WORDS are (vi, yo, va, un, no), and they must stay tappable.
  if(toks.length===1 && LETTER_DRILL.has(toks[0])) return false;
  return !toks.some(w=>EN_MARKERS.has(w) && !ES_TOKENS.has(w));
}
function speakify(html, withTip){
  const d=document.createElement("div"); d.innerHTML=html;
  d.querySelectorAll("b").forEach(b=>{
    if(!isSpanishish(b.textContent)) return;
    b.classList.add("say");
    b.setAttribute("role","button"); b.setAttribute("tabindex","0");
    b.setAttribute("aria-label","Escuchar "+b.textContent.trim());
  });
  const tip = (withTip!==false && d.querySelector("b.say"))
    ? `<div class="saytip">🔊 Toca las palabras subrayadas para escucharlas · Tap any underlined Spanish word to hear it — then say it out loud.</div>`
    : "";
  return tip + d.innerHTML;
}
function sayBold(b){
  if(!b) return;
  const t=b.textContent.trim().replace(/[:.]+$/,"");
  b.classList.add("saying"); setTimeout(()=>b.classList.remove("saying"), 700);
  speakWord(t);
}
/* Delegated once per container, so they survive every innerHTML replacement.
   #results carries the same mini-lesson after a round — it must be tappable there too. */
["lessonBody","results"].forEach(id=>{
  const el=document.getElementById(id); if(!el) return;
  el.addEventListener("click", e=>{ sayBold(e.target.closest && e.target.closest("b.say")); });
  el.addEventListener("keydown", e=>{
    if(e.key==="Enter" || e.key===" "){ const b=e.target.closest && e.target.closest("b.say"); if(b){ e.preventDefault(); sayBold(b); } }
  });
});

function openLesson(skill){
  practiceSkill=skill;
  document.getElementById("lessonTitle").textContent=SKILLS[skill].name;
  document.getElementById("lessonSub").textContent="Mini-lección · Mini-lesson";
  let body = SKILLS[skill].lesson;
  const full = lessonsForSkill(skill);
  if(full.length){
    body += full.map(l=>`<div class="fulllesson"><h4>📗 Lección completa · ${l.title} <small>${l.titleEn} · ${l.level}</small></h4>${l.body}</div>`).join("");
  }
  document.getElementById("lessonBody").innerHTML = speakify(body);
  show("lesson");
  const f=document.getElementById("footer"); f.classList.remove("hidden");
  const b=document.getElementById("footerBtn");
  const pool=practiceSet(skill, PRACTICE_N);
  if(pool.length){
    b.textContent=`Practicar (${pool.length} preguntas) · Practice`;
    b.onclick=()=>startPractice(skill, pool);
  } else {
    b.textContent="Inicio · Home"; b.onclick=goHome;
  }
  document.getElementById("lesson").scrollTop=0;
  mascot("idle","");
}
function startPractice(skill, pool){
  mode="practice"; practiceSkill=skill;
  const quiz = (pool && pool.length) ? pool : practiceSet(skill, PRACTICE_N);
  if(!quiz.length){ goHome(); return; }
  // Enrol any generated word she hasn't met yet, at box 1 — same as reading a
  // story does. Box 0 would make it due immediately and flood her word review.
  quiz.forEach(q=>{ if(q._vocab) enrollWord(q._vocab, 1); });
  save();
  current={ titleGr:"Práctica", titleEn:SKILLS[skill].name, quiz };
  startQuiz();
}

/* ===== SRS REVIEW SESSIONS (words and phrases kept separate) ===== */
function startVocabSession(keys, titleGr, titleEn){
  const quiz = shuffle(keys).slice(0,8).map(vocabQuestion).filter(Boolean);
  if(!quiz.length){ goHome(); return; }
  mode="srs";
  current={ titleGr, titleEn, quiz };
  startQuiz();
}
function startSrs(){ startVocabSession(dueWords(), "Repaso de palabras", "Word review"); }
function startPhraseReview(){ startVocabSession(duePhrases(), "Repaso de frases", "Phrase review"); }

/* ===== WORD MATCH (tap-to-match vocab recap) =====
   6 Spanish buttons on the left, 6 English on the right (each column independently
   shuffled). Tap a Spanish word then its English match. Correct = both lock green and
   the word gets a spaced-repetition credit. Pulls her most-recently-learned words first. */
let matchBoards=[], matchBoardIdx=0, matchPairs=[], matchLeft=[], matchRight=[],
    selL=null, selR=null, matchLock=false, matchedThisBoard=0,
    matchClean=0, matchTotal=0, matchDirty=new Set();

function matchEnFor(gr){ return (S.vocab[gr]&&S.vocab[gr].en) || (VOCAB_INDEX[gr]&&VOCAB_INDEX[gr].en) || ""; }
function recentVocab(limit){
  // WORDS ONLY (phrases have their own review lane), most-recently-learned first;
  // top up from the current level's stories if she's new
  let keys=Object.keys(S.vocab).filter(gr=>isWord(gr) && matchEnFor(gr));
  keys.sort((a,b)=>(S.vocab[b].added||0)-(S.vocab[a].added||0) || (S.vocab[a].due-S.vocab[b].due));
  let pool=keys.slice(0,limit);
  if(pool.length<6){
    const seen=new Set(pool);
    storiesAt(S.level).forEach(s=>buildGlossary(s.text).forEach(([gr])=>{ const k=vkey(gr); if(isWord(k)&&!seen.has(k)&&VOCAB_INDEX[k]){ seen.add(k); pool.push(k); } }));
    pool=pool.slice(0,Math.max(6,limit));
  }
  return pool;
}
function matchAvailable(){ return recentVocab(18).length>=4; }

function startMatch(){
  if(window.speechSynthesis) speechSynthesis.cancel();
  mode="match";
  // Two different words can share an English gloss ("el menú" / "la carta" = the menu).
  // On one board that renders as two identical buttons — either tap validates, so it
  // doesn't mis-grade, it just looks broken. Keep the first of each meaning.
  const seenEn=new Set();
  const pool=shuffle(recentVocab(18)).filter(gr=>{
    const en=norm(showEn(gr, matchEnFor(gr)));
    if(!en || seenEn.has(en)) return false;
    seenEn.add(en); return true;
  });
  if(pool.length<4){ goHome(); return; }
  /* Enrol what's on the boards (box 1, exactly as reading a story does). On a new account
     recentVocab() tops up from the current level's stories, so the tiles can be words that
     were never enrolled — and reviewWord() silently bails on those, meaning a full round
     credited nothing to the review system. */
  pool.forEach(gr=>enrollWord(gr,1)); save();
  matchBoards=[]; for(let i=0;i<pool.length;i+=6) matchBoards.push(pool.slice(i,i+6));
  // don't leave a lonely 1-word final board
  if(matchBoards.length>1 && matchBoards[matchBoards.length-1].length===1){
    matchBoards[matchBoards.length-2]=matchBoards[matchBoards.length-2].concat(matchBoards.pop());
  }
  matchBoardIdx=0; matchClean=0; matchTotal=0;
  show("match"); document.getElementById("footer").classList.add("hidden");
  renderMatchBoard();
  mascot("idle","");
}
function renderMatchBoard(){
  matchLock=false; selL=null; selR=null; matchedThisBoard=0; matchDirty=new Set();
  // Display through showGr/showEn so a capital on one side never lines up with a
  // capital on the other — matching has to be done on meaning, not on shape.
  matchPairs=matchBoards[matchBoardIdx].map(gr=>({gr, en:showEn(gr, matchEnFor(gr))}));
  matchLeft=shuffle(matchPairs.map(p=>p.gr));
  matchRight=shuffle(matchPairs.map(p=>p.en));
  document.getElementById("match").innerHTML=`
    <div class="topnav"><button class="back" onclick="goHome()">‹ Atrás</button></div>
    <div class="qcount" id="mCount"></div>
    <div class="mtip">Une las parejas · Tap a Spanish word, then its English match.</div>
    <div class="cols">
      <div class="mcol gr">${matchLeft.map((gr,i)=>`<button class="mbtn" id="L${i}" onclick="matchTap('L',${i})">${showGr(gr)}</button>`).join("")}</div>
      <div class="mcol en">${matchRight.map((en,i)=>`<button class="mbtn" id="R${i}" onclick="matchTap('R',${i})">${en}</button>`).join("")}</div>
    </div>`;
  updateMatchCount();
  document.getElementById("match").scrollTop=0;
}
function updateMatchCount(){
  document.getElementById("mCount").textContent=`RONDA ${matchBoardIdx+1}/${matchBoards.length} · ${matchedThisBoard}/${matchPairs.length}`;
}
function matchTap(side,i){
  if(matchLock) return;
  const btn=document.getElementById(side+i);
  if(!btn || btn.classList.contains("matched")) return;
  if(side==="L"){ if(selL!=null) document.getElementById("L"+selL).classList.remove("sel"); selL=i; }
  else { if(selR!=null) document.getElementById("R"+selR).classList.remove("sel"); selR=i; }
  btn.classList.add("sel");
  if(selL!=null && selR!=null) evalMatch();
}
function evalMatch(){
  const gr=matchLeft[selL], en=matchRight[selR];
  const lb=document.getElementById("L"+selL), rb=document.getElementById("R"+selR);
  if(showEn(gr, matchEnFor(gr))===en){
    lb.classList.remove("sel"); rb.classList.remove("sel");
    lb.classList.add("matched"); rb.classList.add("matched");
    const wasDirty=matchDirty.has(gr);
    reviewWord(gr, !wasDirty);            // clean match advances SRS; messy one re-queues sooner
    matchTotal++; if(!wasDirty) matchClean++;
    matchedThisBoard++; selL=null; selR=null;
    save(); updateMatchCount();
    mascot("happy", pick(["✓","¡Eso!","¡Exacto!","¡Bravo!"]));
    if(matchedThisBoard>=matchPairs.length){ matchLock=true; setTimeout(nextMatchBoard,650); }
  } else {
    matchLock=true; matchDirty.add(gr);
    lb.classList.add("bad"); rb.classList.add("bad");
    mascot("sad","Otra vez");
    const sl=selL, sr=selR;
    setTimeout(()=>{
      const a=document.getElementById("L"+sl), b=document.getElementById("R"+sr);
      if(a) a.classList.remove("bad","sel"); if(b) b.classList.remove("bad","sel");
      selL=null; selR=null; matchLock=false;
    },600);
  }
}
function nextMatchBoard(){
  matchBoardIdx++;
  if(matchBoardIdx>=matchBoards.length){ finishMatch(); return; }
  renderMatchBoard();
}
function finishMatch(){
  const acc = matchTotal ? matchClean/matchTotal : 1;
  const stars = acc>=1?3:acc>=0.66?2:acc>=0.33?1:0;
  const gained = matchTotal*8;
  S.xp+=gained; bumpDay(gained); markActivity(); save();
  renderResults({ acc, stars, gained, special:"match" });
}

/* ===== BOSS CHECKPOINT ===== */
function startBoss(){
  mode="boss";
  const lvl=S.level;
  // Prefer real LANGUAGE questions (grammar/usage/translation) from the level's
  // lessons — this is what makes a boss test comprehension, not story recall.
  let lang=shuffle(langBank(lvl));
  let story=[]; storiesAt(lvl).forEach(s=>s.quiz.forEach(q=>story.push(q))); story=shuffle(story);
  let pool;
  if(lang.length>=5){
    // mostly language questions + a couple story items for variety
    pool=lang.slice(0,6).concat(story.slice(0,2));
  } else {
    // no lessons at this level yet → fall back to stories (+ a taste of next level)
    pool=story.slice();
    const nxt=LEVELS[levelIdx(lvl)+1];
    if(nxt) storiesAt(nxt).forEach(s=>s.quiz.slice(0,1).forEach(q=>pool.push(q)));
    pool=pool.concat(lang);
  }
  pool=shuffle(pool).slice(0, Math.min(8, pool.length));
  current={ titleGr:"El jefe", titleEn:`${lvlLabel(lvl)} boss challenge`, quiz:pool };
  mascot("think","¡A ver qué sabes! 💪", true);
  startQuiz();
}

/* ===== GRAMMAR LESSONS (Language Lab) ===== */
let currentLessonId=null;
function openGrammarLesson(id){
  const l=(window.LESSONS||[]).find(x=>x.id===id); if(!l) return;
  document.getElementById("lessonTitle").textContent=l.title;
  document.getElementById("lessonSub").textContent=`${l.titleEn} · Lección`;
  document.getElementById("lessonBody").innerHTML=speakify(l.body);
  show("lesson");
  const f=document.getElementById("footer"); f.classList.remove("hidden");
  const b=document.getElementById("footerBtn");
  const n=(l.practice||[]).length;
  b.textContent = n ? `Practicar (${Math.min(n,6)}) · Practice` : "Inicio · Home";
  b.onclick = n ? ()=>startGrammarPractice(id) : goHome;
  document.getElementById("lesson").scrollTop=0;
  mascot("idle","");
}
function startGrammarPractice(id){
  const l=(window.LESSONS||[]).find(x=>x.id===id); if(!l) return;
  mode="grammar"; currentLessonId=id;
  current={ titleGr:l.title, titleEn:l.titleEn, quiz:shuffle((l.practice||[]).slice()).slice(0,6) };
  startQuiz();
}

/* ===== PLACEMENT TEST ===== */
/* Rough cognate detector: the Spanish core (article stripped, accents dropped)
   shares its first 4 letters with an English word in the gloss. Catches
   tour/taxi/hotel/papaya/concierto; a false positive only shrinks the pool. */
function isFreebie(k){
  const gr=norm(k.replace(ARTICLE_RE,"")), en=norm((VOCAB_INDEX[k]||{}).en||"");
  return gr.length>=4 && en.split(" ").some(w=>w.startsWith(gr.slice(0,4)));
}
let placeIdx=0, placeScore={}, placeQs=[];
function buildPlacement(){
  // Self-contained vocabulary questions of increasing level. Comprehension
  // questions can't be used here (they'd reference an unread story), so we test
  // "what does this word mean?" with level-graded vocab — a clean difficulty signal.
  // Built by vocabQuestion(), so it is WORDS only, distractors are the same kind,
  // and capitals are display-normalised (the Czech Quest placement still mixes
  // phrases in and leaks capitals — fixed here from day one).
  // Cognates are skipped: "un tour" = "a tour" is a free point — great for
  // confidence in a story, useless for placement (two freebies at Nivel 3 would
  // put a total beginner there).
  const order=["L0","L0","L1","L1","L2","L2","L3","L3"];
  const qs=[], used=new Set();
  order.forEach(l=>{
    const chosen=shuffle((VOCAB_BY_LEVEL[l]||[]).filter(w=>!used.has(w) && isWord(w) && !isFreebie(w) && (VOCAB_INDEX[w].en||"").length))[0];
    if(!chosen) return;
    const q=vocabQuestion(chosen); if(!q) return;
    used.add(chosen);
    q._level=l; delete q._vocab;   // placement never touches the SRS
    qs.push(q);
  });
  return qs;
}
function openPlacement(){
  placeQs=buildPlacement(); placeIdx=0; placeScore={};
  show("placement"); document.getElementById("footer").classList.add("hidden");
  renderPlacement();
}
function renderPlacement(){
  const wrap=document.getElementById("placement");
  if(placeIdx>=placeQs.length){ finishPlacement(); return; }
  const q=placeQs[placeIdx], total=placeQs.length;
  wrap.innerHTML=`
    <div class="placeintro ${placeIdx===0?'':'hidden'}"></div>
    <div class="qcount">PRUEBA RÁPIDA · ${placeIdx+1} / ${total}</div>
    <div class="qtext">${q.q}</div>
    <div id="pOpts">${q.opts.map((o,i)=>`<button class="opt" onclick="placeAnswer(${i})">${o}</button>`).join("")}</div>
    <div class="qfeedback" id="pFb"></div>`;
  wrap.scrollTop=0;
}
function placeAnswer(i){
  const q=placeQs[placeIdx]; const ok=i===q.a;
  placeScore[q._level]=(placeScore[q._level]||0); if(ok) placeScore[q._level]++;
  document.querySelectorAll("#pOpts .opt").forEach((b,bi)=>{ b.disabled=true; if(bi===q.a) b.classList.add("correct"); if(bi===i&&i!==q.a) b.classList.add("wrong"); });
  setTimeout(()=>{ placeIdx++; renderPlacement(); }, 650);
}
function finishPlacement(){
  // Walk levels upward; she "clears" a level only by getting ALL its questions
  // right. Stop at the first level she doesn't fully clear, and place her there.
  // This avoids over-placing a lucky guesser (one fluked C1 answer no longer
  // vaults her to C1). The adaptive engine bumps her up quickly if under-placed.
  const total={}; placeQs.forEach(q=>{ total[q._level]=(total[q._level]||0)+1; });
  let best=LEVELS[0];
  for(const l of LEVELS){
    if(!total[l]) continue;
    if((placeScore[l]||0) >= total[l]) best=l;  // cleared every question at this level
    else break;                                  // first stumble → stop here
  }
  S.level=best; S.placed=true; save();
  mascot("celebrate",`¡Empezamos en ${lvlLabel(best)}! 🎯`, true);
  confetti();
  goHome();
}
function skipPlacement(){ S.placed=true; save(); closeSettings(); goHome(); }

/* ===== SETTINGS ===== */
function openSettings(){
  document.getElementById("lvlPicker").innerHTML=LEVELS.map(l=>`<div class="lvlbtn ${l===S.level?'sel':''}" data-l="${l}" onclick="pickLevel('${l}')">${lvlLabel(l)}</div>`).join("");
  renderVoiceBox();
  renderNameBox();
  renderBackupBox();
  document.getElementById("scrim").classList.add("show");
}
function closeSettings(){ document.getElementById("scrim").classList.remove("show"); }
function pickLevel(l){ S.level=l; save(); document.querySelectorAll(".lvlbtn").forEach(b=>b.classList.toggle("sel",b.dataset.l===l)); renderHome(); }
function startPlacementFromSettings(){ closeSettings(); openPlacement(); }
function resetAll(){ if(!confirm("Reset ALL your Spanish Quest progress? This can't be undone.")) return; S=clone(DEFAULTS); save(); closeSettings(); location.reload(); }

/* ===== NAME (asked on the welcome screen, editable in Settings) =====
   The name lands in innerHTML templates, so it is always escaped. */
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function setName(v){
  v=(v||"").trim().slice(0,24);
  S.name=v; LEARNER = v ? escapeHtml(v) : "friend"; save();
}
/* ===== VOICE PICKER (Settings) =====
   Which Spanish voice reads the stories, and how fast. Everything is the device's
   own offline voice — no audio to host (ADR-006). */
const VOICE_SAMPLE = "¡Hola! ¿Me da tres tacos, por favor?";
function renderVoiceBox(){
  const box=document.getElementById("voiceBox"); if(!box) return;
  const all=grVoices(), cur=grVoice();
  if(!("speechSynthesis" in window)){ box.innerHTML=`<div class="rem-h">🔊 Voz · Voice</div><p class="rem-note">This browser can't do read-aloud.</p>`; return; }
  const tip = `<p class="rem-note">Want it to sound properly human? Download an HD voice — <b>iPhone:</b> Settings ▸ Accessibility ▸ Spoken Content ▸ Voices ▸ Spanish (Mexico) → pick <b>Paulina</b> or <b>Juan</b> and tap the download arrow (Enhanced/Premium). <b>Mac:</b> System Settings ▸ Accessibility ▸ Spoken Content ▸ System Voice ▸ Manage Voices. It shows up here right after.</p>`;
  if(!all.length){
    box.innerHTML=`<div class="rem-h">🔊 Voz · Voice</div><p class="rem-note">No Spanish voice on this device yet.</p>${tip}`;
    return;
  }
  const opts=all.map(v=>{
    const sex=voiceSex(v), hd=isEnhanced(v)?" · HD":"", joke=NOVELTY.test(v.name||"")?" · robot":"";
    const label=`${voiceName(v)}${sex?" "+sex:""} · ${v.lang}${hd}${joke}`;
    return `<option value="${escapeHtml(v.voiceURI)}" ${cur&&v.voiceURI===cur.voiceURI?"selected":""}>${escapeHtml(label)}</option>`;
  }).join("");
  const rate=S.rate||1;
  box.innerHTML=`
    <div class="rem-h">🔊 Voz · Voice</div>
    <p class="rem-note">Who reads the stories out loud. ♀ / ♂ and <b>HD</b> = a downloaded high-quality voice.</p>
    <div class="vrow"><select id="voiceSel" class="vsel" onchange="setVoice(this.value)">${opts}</select>
    <button class="btn small" style="background:var(--lvl)" onclick="testVoice()">▶ Probar</button></div>
    <div class="vrow" style="margin-top:8px"><span class="vlabel">Velocidad · Speed</span>
    <select id="rateSel" class="vsel" onchange="setRate(this.value)">
      ${[["0.8","🐢 Lenta · slow"],["0.9","Tranquila · relaxed"],["1","Normal"],["1.15","🐇 Rápida · fast"]]
        .map(([v,l])=>`<option value="${v}" ${Math.abs(rate-parseFloat(v))<0.001?"selected":""}>${l}</option>`).join("")}
    </select></div>
    ${tip}`;
}
function setVoice(uri){ S.voiceURI=uri; save(); testVoice(); }
function setRate(r){
  S.rate=parseFloat(r)||1; playRate=S.rate; save();
  const b=document.getElementById("slowBtn"); if(b) b.textContent="🐢 Lento";   // keep the reading-view toggle in step
  testVoice();
}
function testVoice(){
  if(!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u=utter(VOICE_SAMPLE); u.rate=S.rate||1;
  speechSynthesis.speak(u);
}

function renderNameBox(){
  const box=document.getElementById("nameBox"); if(!box) return;
  box.innerHTML=`
    <div class="rem-h">👋 Tu nombre · Your name</div>
    <div class="namerow"><input id="nameInput" class="fill slim" maxlength="24" value="${escapeHtml(S.name||"")}" placeholder="Your name" autocomplete="given-name">
    <button class="btn small" style="background:var(--lvl)" onclick="setName(document.getElementById('nameInput').value); renderHome(); document.getElementById('nameSaved').textContent=' ✓ guardado'">Guardar · Save</button></div>
    <span id="nameSaved" class="rem-copied"></span>`;
}
document.getElementById("scrim").addEventListener("click",e=>{ if(e.target.id==="scrim") closeSettings(); });

/* ===== BACKUP / RESTORE PROGRESS =====
   Progress already saves automatically to this device (localStorage). This adds a
   manual backup code she can save/move to another device — insurance, no backend. */
function b64encodeUTF8(str){ return btoa(unescape(encodeURIComponent(str))); }
function b64decodeUTF8(b64){ return decodeURIComponent(escape(atob(b64))); }

function renderBackupBox(){
  const box=document.getElementById("backupBox"); if(!box) return;
  box.innerHTML=`
    <div class="rem-h">💾 Tu progreso · Save &amp; restore progress</div>
    <p class="rem-note">Your progress saves automatically on this device. Use this to back it up, or move it to another phone or computer.</p>
    <button class="btn ghost small" onclick="exportProgress()">⬆︎ Respaldar · Back up (get code)</button>
    <div id="backupCodeWrap" style="margin-top:8px"></div>
    <details class="rem-restore">
      <summary>⬇︎ Restaurar · Restore from a code</summary>
      <textarea class="rem-code" id="restoreInput" placeholder="Paste a backup code here…"></textarea>
      <button class="btn small" style="background:var(--lvl)" onclick="importProgress()">Restaurar · Restore</button>
      <span id="restoreMsg" class="rem-copied"></span>
    </details>`;
}
function exportProgress(){
  const code=b64encodeUTF8(JSON.stringify(S));
  document.getElementById("backupCodeWrap").innerHTML=`
    <textarea class="rem-code" id="backupCode" readonly>${code}</textarea>
    <button class="btn small" style="background:var(--lvl)" onclick="copyBackupCode()">📋 Copiar · Copy</button>
    <span id="backupCopied" class="rem-copied"></span>
    <p class="rem-note" style="margin-top:8px">Keep this safe — email it to yourself or save it in Notes. Paste it under “Restore” on any device to bring this progress back.</p>`;
}
function copyBackupCode(){
  const t=document.getElementById("backupCode"); t.select();
  const done=()=>{ document.getElementById("backupCopied").textContent=" ✓ copiado"; };
  if(navigator.clipboard) navigator.clipboard.writeText(t.value).then(done, ()=>{ try{document.execCommand("copy");}catch(_){}; done(); });
  else { try{document.execCommand("copy");}catch(_){}; done(); }
}
function importProgress(){
  const msg=document.getElementById("restoreMsg");
  const v=(document.getElementById("restoreInput").value||"").trim();
  if(!v){ msg.style.color="var(--red)"; msg.textContent=" paste a code first"; return; }
  try{
    const obj=JSON.parse(b64decodeUTF8(v));
    if(!obj || typeof obj!=="object" || !("xp" in obj) || !("level" in obj)) throw new Error("invalid");
    /* A Czech Quest backup code decodes perfectly here — same engine, same origin, same
       looking box, and the codes are opaque base64 so nothing tells them apart. Its CEFR
       level has no XP table in this app, so the next round does xp += NaN and sticks:
       "★ NaN XP", an empty story list, no boss, no way back but the level picker. */
    if(LEVELS.indexOf(obj.level)<0) throw new Error("foreign");
    if(typeof obj.xp!=="number" || !isFinite(obj.xp)) throw new Error("invalid");
    S=Object.assign(clone(DEFAULTS), obj); save();
    msg.style.color="var(--green)"; msg.textContent=" ✓ restored — reloading…";
    setTimeout(()=>location.reload(), 800);
  }catch(e){
    msg.style.color="var(--red)";
    msg.textContent = e.message==="foreign"
      ? " that code is from another app (Czech Quest?) — not this one"
      : " that code didn't work — copy the whole thing";
  }
}

/* ===== BOOT ===== */
load();
LEARNER = S.name ? escapeHtml(S.name) : "friend";
playRate = S.rate || 1;
if(!S.placed){
  // first-ever open: offer placement
  document.getElementById("welcome").innerHTML="";
  openPlacementWelcome();
} else {
  renderHome();
}
function openPlacementWelcome(){
  renderHud();          // otherwise the daily-goal ring is blank until the first goHome()
  show("placement");
  document.getElementById("footer").classList.add("hidden");
  // A big, happy copy of the mascot — the mood CSS works on any [data-mood] ancestor.
  const lolo=`<svg class="lolo-big" data-mood="happy" viewBox="0 0 100 100" aria-hidden="true">${document.getElementById("mascot").innerHTML}</svg>`;
  document.getElementById("placement").innerHTML=`
    <div class="welcomebig">
      <div class="mole-hi">${lolo}</div>
      <h1>¡Hola! Soy Lolo.</h1>
      <p>I'm an axolotl — un <b>ajolote</b> — and I only live in Mexico. Let's get your Spanish trip-ready: tiny stories, real phrases, zero conjugation tables.</p>
      <label class="namelabel" for="welcomeName">¿Cómo te llamas? · What's your name?</label>
      <input id="welcomeName" class="fill" maxlength="24" placeholder="Your name" autocomplete="given-name">
      <button class="btn" style="margin-top:16px" onclick="startFromZero()">Empezar desde cero · Start from zero</button>
      <button class="btn ghost" style="margin-top:10px" onclick="welcomeTest()">I know a little — quick 8-question test</button>
    </div>`;
}
function takeWelcomeName(){ const el=document.getElementById("welcomeName"); if(el && el.value.trim()) setName(el.value); }
function startFromZero(){ takeWelcomeName(); S.level=LEVELS[0]; S.placed=true; save(); goHome(); mascot("celebrate",`¡Vámonos, ${S.name||"amigo"}! 🎉`, true); }
function welcomeTest(){ takeWelcomeName(); openPlacement(); }
