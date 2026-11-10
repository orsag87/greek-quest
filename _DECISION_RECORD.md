# Decision Record — Greek_Quest

Greek learning PWA that continues where Duolingo leaves off, for a learner of unknown level.
Cloned from Spanish Quest (`~/Dropbox/Spanish_Quest`, commit `039f988`), which was cloned from Czech Quest.
ADRs here are prefixed `G`.

---

### ADR-G01: A clone in its own repo, nothing shared at runtime
**Date:** 2026-11-05 · **Status:** Accepted
**Decision:** Own repo `~/Dropbox/Greek_Quest`, own GitHub repo. localStorage key `grQuestV1` (never
`esQuestV1` / `czQuest*`), SW cache prefix `greek-quest-` (deletes only its own), and saves carry
`app:"greek-quest"` so a Czech/Spanish backup code is refused on import.
**Rationale:** Same as Spanish ADR-S01 — all three apps share the `orsag87.github.io` origin. Spanish Quest even
uses the same level codes (L0–L3), so the Spanish import check (level code valid?) would have let a Spanish
code through; the `app` field closes that.

### ADR-G02: Five levels, alphabet → beyond Duolingo, with a level check first
**Date:** 2026-11-05 · **Status:** Accepted
**Decision:** `L0–L4` shown as "Level 0…4". The first screen offers **Find my level** (primary) or
**I'm brand new**. The check: one block per level, 3 questions drawn from `PLACEMENT`, four options +
"I don't know"; a block passes with 2 right; stop at the first failed block and place the learner AT it
(the first level not yet mastered). Passing Level 3 already means "start at Level 4", so the L4 block is never
asked (the check has 4 parts). A block ends early once decided. A retake keeps the learner's own Aa choice.
The result screen shows ✓ per level, explains the level, and offers **Start at Level X** or **Start from the
very beginning**; home shows "Jump to: 0 1 2 3 4" chips; Settings has the full picker and "Retake".
**Rationale:** Owner: the learner is continuing from Duolingo at an unknown point — "devise a test… point them
to the right level without pigeonholing them… if they want to actually start from the beginning."
"I don't know" + 4 options keeps guessers low: simulated pure guessers land at L0/L1 98% of the time.
**Trade-offs:** 3 questions per level is a coarse signal; the adaptive auto-level (3× 85%) and the boss
correct it quickly, and nothing is locked.

### ADR-G03: Latin-letter pronunciation is generated, shown under every Greek word, switchable
**Date:** 2026-11-05 · **Status:** Accepted
**Decision:** `translit()` (greek.js) generates a beginner-readable pronunciation with the stress mark
(δ=dh, θ=th, χ=h, γ=g/y, η/ι/υ/ει/οι=i, αι=e, μπ=b/mb, ντ=d/nd, doubled consonants once). Stories stack it
under each word; questions/options/lessons/explanations add it inline. `S.showTr` (the **Aa** button,
also in Settings) hides it via `body.notr`; it starts off when placed at Level 3+. Questions flagged
`notr:true` (alphabet reading) never show it. Content never contains hand-typed pronunciations.
**Rationale:** A Level-0 learner can't read the script; a Duolingo learner can and shouldn't be babied.
Generating it means one consistent system and no drift between Greek and its pronunciation.

### ADR-G04: Native Greek review is the content gate
**Date:** 2026-11-05 · **Status:** Accepted (mirrors Czech ADR-003 / Spanish ADR-S03)
**Decision:** All Greek in `content.js` is AI-DRAFT until a Greek speaker reads it. The owner doesn't speak
Greek; an independent adversarial language pass was run before sending (see sessions/).

### ADR-G05: Typed answers accept Greek or Latin letters (`answerKey`)
**Date:** 2026-11-05 · **Status:** Accepted
**Decision:** Fill answers are stored in Greek; both sides are reduced to a loose phonetic key
(transliterate, drop accents, collapse ch/kh/x→h, th/8, dh→d, mp/mb→b, nt/nd→d, ei/oi/y/h→i, v→f, ou→u,
word gaps ignored; ξ is its own token so έξω ≠ έχω; a typed Latin x is tried as both χ and ξ via `answerMatch`;
greeklish ey/ay→ef/af only on typed input). Every fill question also has **I don't know — show me**; an empty Check just nudges.
**Rationale:** Most learners have no Greek keyboard; a fill question you can't type is a dead end.
**Trade-offs:** The key is deliberately loose, so near-homophones collide; it's only ever compared with the
expected answer, and `tools/test_greek.js` guards that common word pairs stay distinct.

### ADR-G06: Questions in English at every level
**Decision:** Unlike Spanish Quest (simple Spanish questions at higher levels), every question is English
with the Greek quoted. A learner never gets stuck on the question itself.

### ADR-G07: Feta the island cat; Aegean palette; Literata + Inter fonts
**Decision:** Mascot is a white-and-ginger Naxos cat with a Greek-blue collar, same mood classes as the other
mascots. Newsreader (no Greek glyphs) was replaced by Literata, which has a Greek subset; Inter has one too.
Icons are rendered from the mascot SVG by `tools/make_icons.py`.

---

## Inherited (still in force)
| From | What it means here |
|---|---|
| Czech ADR-002 | All content in `content.js`; the engine never needs touching to add lessons |
| Czech ADR-006 / Spanish S09 | Device TTS, ranked voice picker (el-GR first), one `utter()` builder |
| Czech ADR-007 / Spanish S10 | Network-first SW; bump `CACHE` **and** `?v=` together every release |
| Czech ADR-008/009/010/012 | Streak freezes · manual backup code · word/phrase review lanes · weak spots never dead-end |
| Spanish S05/S06 | Article + noun counts as a word · case-normalised flashcard keys (`vkey`) |
| Spanish S11 | Greek `<b>` terms in lessons are tappable — here detected simply by Greek letters (`isGreekish`) |
