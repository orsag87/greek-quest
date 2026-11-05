# Decision Record — Spanish_Quest

Mexican-Spanish sprint PWA for absolute beginners (~10 words) flying to Mexico in ~2 months.
Cloned from Czech Quest (`~/Dropbox/Czech_Quest`, commit `b8e5c3b`). Static single-page app,
no backend. ADRs here are prefixed `S` so they never get confused with Czech Quest's numbers.

---

### ADR-S01: A clone in its own repo, not a shared engine
**Date:** 2026-09-15 · **Status:** Accepted
**Decision:** Copy the Czech Quest engine into a standalone repo at `~/Dropbox/Spanish_Quest`
(own git history, own GitHub repo when deployed). Nothing is shared at runtime:
- own `localStorage` key `esQuestV1`, and **no** migration from Czech Quest's `czQuest` / `czQuestV2`
- own service-worker cache prefix `spanish-quest-`; `activate` deletes only caches with that prefix
**Rationale:** Owner: "keep it separate… we want these to be related but not get everything mushed up."
Both apps will live on `orsag87.github.io`, and localStorage + Cache Storage are **per-origin**, so
a shared key or a delete-everything-else SW would make one app corrupt or wipe the other.
**Trade-offs:** Engine fixes must be ported by hand in either direction. That's the price of separation.
**Known gap on the Czech side:** Czech Quest's `sw.js` still deletes every cache that isn't its own
(`keys.filter(k => k !== CACHE)`), so a Czech update will wipe Spanish Quest's *offline* cache
(online use is unaffected — network-first; the cache refills on the next visit). One-line fix in
Czech Quest when someone is next in there; deliberately not touched from this project.

### ADR-S02: Four sprint levels (Nivel 0–3), not CEFR A1–C2
**Date:** 2026-09-15 · **Status:** Accepted
**Decision:** `LEVELS = L0 L1 L2 L3`, shown as "Nivel 0…3": Cero (day 1) · Sobrevivir (weeks 1–2) ·
De viaje (weeks 3–5) · Platicar (weeks 6–8). Level codes are internal; `lvlLabel()` is what's displayed.
**Rationale:** The goal is a 2-month trip, not a certificate. Czech Quest starts at A2 for a learner
leaving Duolingo; this learner starts from zero.
**Trade-offs:** Boss/auto-level/placement all keep their Czech semantics, just over 4 levels.

### ADR-S03: Native Mexican-Spanish review is the content gate
**Date:** 2026-09-15 · **Status:** Accepted (mirrors Czech ADR-003)
**Decision:** All Spanish in `content.js` is AI-DRAFT until a Mexican Spanish speaker reads it.
**Rationale:** Structural validation can't catch naturalness. Unlike Czech Quest, Jan is not the
native reviewer here. The drafting pass flagged its own uncertain lines (see `_PIPELINE_FIXES.md`).
**Trade-offs:** The app is usable now; "polished" waits on a native read.

### ADR-S04: Chunks, not conjugation · cognates first
**Date:** 2026-09-15 · **Status:** Accepted
**Decision:** Verbs appear only as memorised chunks (quiero, ¿me da…?, necesito, ¿puedo…?, me gusta,
hay, voy a…, fui a…). No question ever asks for a verb ending. Early scenes lean on cognates
(hotel, taxi, delicioso) and attach new words to them.
**Rationale:** Owner: no conjugation at this stage — "it's a sprint", and "choosing the words that are
in English too and attaching others to it." Chunks are what a traveller actually says.
**Trade-offs:** Past/future are taught as fixed phrases, not a system. Fine for the trip; a later
"real grammar" track would sit on top.
**Exception (added after the 2026-09-15 content audit):** a question may ask the learner to choose between
two chunks that the lesson just taught as a pair — `me gusta` vs `me gustan` in `l2L-gusta`. The learner
picks a whole phrase for a singular or plural thing; they are never asked to produce a verb ending.

### ADR-S05: Nouns are glossed with their article; article + noun counts as a WORD
**Date:** 2026-09-15 · **Status:** Accepted
**Decision:** Glosses read `[el baño|the bathroom]`. `isPhrase()` strips one leading article
(el/la/los/las/un/una/unos/unas) before testing for whitespace.
**Rationale:** Learning the article with the noun gives gender for free. Without the strip, every noun
would fall into the phrase lane (Czech ADR-010 splits words/phrases on whitespace).

### ADR-S06: Flashcard keys are case-normalised (`vkey`)
**Date:** 2026-09-15 · **Status:** Accepted
**Decision:** `VOCAB_INDEX`, `S.vocab` and every lookup use `vkey(es)` = the gloss with its leading
capital dropped (proper nouns in `PROPER` excepted).
**Rationale:** Czech Quest keys by raw text, so "Gracias" (sentence start) and "gracias" are two cards —
and could appear on the same match board. Display normalisation (Czech ADR-011) hid the capital but
not the duplicate.

### ADR-S07: Ask the learner's name; start from zero by default
**Date:** 2026-09-15 · **Status:** Accepted
**Decision:** The welcome screen asks "¿Cómo te llamas?" (stored `S.name`, editable in Settings,
always HTML-escaped) and offers **Start from zero** (Nivel 0) as the primary button; the 8-question
placement test is the secondary option.
**Rationale:** Czech Quest hard-codes one learner. This one is "for people", and they're beginners —
placement mostly confirms Nivel 0, so it shouldn't be the default path.

### ADR-S08: Mexican voice, dialogue line breaks, Lolo
**Date:** 2026-09-15 · **Status:** Accepted
- TTS prefers `es-MX` (iOS "Paulina"), then `es-US`/`es-419`, then any Spanish voice.
- Story text may contain `\n`; `.story-body` is `white-space:pre-line`, so scenes read as dialogue.
- Mascot: **Lolo the axolotl** (ajolote — endemic to Mexico). Same mood classes as Czech Quest's
  hedgehog, so `mascot()` is unchanged. Icons are rendered from the same geometry.

### ADR-S09: The learner picks the voice; novelty voices are ranked last
**Date:** 2026-09-15 · **Status:** Accepted
**Decision:** Settings has a **🔊 Voz** picker listing every `es-*` voice on the device (♀/♂ where the name
is known, **HD** for enhanced/premium), a ▶ Probar sample and a speed setting (`S.rate`). The chosen voice
(`S.voiceURI`) is used by every utterance through a single `utter()` builder. Ranking:
es-MX 100 / es-US·es-419 70 / other es 40, +30 enhanced, **−90 novelty**.
**Rationale:** Owner: "the voice sucks… way too lofi". Cause: "first es-MX voice" returned **Eddy**, one of
Apple's novelty voices. The device had 18 Spanish voices including Paulina — the app just never asked.
The −90 penalty has to outweigh the whole es-MX bonus, or a Mexican robot outranks a real Spain voice.
**Trade-offs:** Still device TTS (ADR-006) — quality depends on what's installed, so the picker also tells
the learner how to download an HD voice. Studio-quality narration would mean a paid TTS API + hosted audio.

### ADR-S10: `?v=` on the script tags, bumped with the SW cache
**Date:** 2026-09-15 · **Status:** Accepted
**Decision:** `index.html` loads `content.js?v=N` / `app.js?v=N`; bump N together with `CACHE` in `sw.js`
every release, and keep the SW `ASSETS` list in step.
**Rationale:** A stale `app.js` was served from the browser's HTTP cache during development even after the
service worker was unregistered. The SW is network-first, but the plain HTTP cache isn't.

### ADR-S11: Spanish terms inside lessons are tappable to hear
**Date:** 2026-09-15 · **Status:** Accepted
**Decision:** `speakify()` post-processes every lesson teaching card (both the Language Lab lessons and the
weak-spot mini-lessons), marking Spanish `<b>` terms as tappable (`b.say`, dotted underline like story
glosses, tap/Enter → `speakWord()`), and prepends a one-line tip when anything is tappable.
**Rationale:** Owner: "i want there to be also clickable words in magic words so i can hear them… so i can
say it along." Stories were already tappable; lessons — where the phrases actually get taught — were not.
Applied to all 16 lessons + 15 skill blurbs, not only Palabras mágicas: same component, same need.
**How a `<b>` is classified (`isSpanishish`):** permissive — Spanish unless something says otherwise.
Vetoes: an English marker word (`EN_MARKERS`, exempt if the word is also Spanish per `ES_TOKENS`, which is
built from the story text, glosses and fill answers), an arrow/affix pattern (`-tion → -ción`, `dieci-`),
digits only, letter drills (`a e i o u`) and lone letter names (`h j ll rr ñ`).
**Why not the reverse:** the first pass required a lexicon match and left *con permiso*, *taco*, *popote*
and *la cerveza* silent — defeating the point. A false positive merely speaks an English word in a Spanish
voice; a false negative silently withholds the feature. Measured: 251 of 289 bolds tappable, 0 wrong.
**Trade-offs:** heuristics on hand-written HTML. A new lesson that bolds an English phrase with no marker
word will be tappable; harmless, and fixable by rewording or extending `EN_MARKERS`.

---

## Inherited from Czech Quest (still in force — see `~/Dropbox/Czech_Quest/_DECISION_RECORD.md`)
| Czech ADR | What it means here |
|---|---|
| ADR-002 | All lessons live in `content.js`; the engine never needs touching to add content |
| ADR-004 | Placement = self-contained vocab questions, clear-ALL-to-advance (now over L0–L3, words only) |
| ADR-005 | Accent-insensitive fill matching (`manana` = `mañana`); also ignores ¿¡ here |
| ADR-006 | Device TTS, no pre-recorded audio |
| ADR-007 | PWA + network-first SW; bump `CACHE` in `sw.js` every release |
| ADR-008 | Streak counts any activity; banked freezes |
| ADR-009 | No backend; manual backup/restore code |
| ADR-010 | Word review and phrase review are separate lanes |
| ADR-011 | Capitals are display-normalised in match/review |
| ADR-012 | Weak-spot review draws from the Language Lab and never dead-ends |
