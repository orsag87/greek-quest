# Architecture — Spanish_Quest

A static, single-page PWA cloned from Czech Quest. No backend, no build step. State persists in
`localStorage` key **`esQuestV1`** (never Czech Quest's keys — same origin on GitHub Pages, ADR-S01).

## Component map
```
index.html      Shell: HUD, views (home/reading/quiz/lesson/results/placement/match), settings sheet
                (level picker, name, backup), Lolo mascot SVG (mood via [data-mood]), confetti <canvas>,
                all CSS (Mexican palette), PWA <link>s, SW registration.
app.js          Engine — same sections as Czech Quest:
                  - constants (LEVELS L0–L3, LEVEL_LABEL, LEVEL_COLOR, XP, LEITNER_DAYS, DAILY_GOAL_XP)
                  - state (DEFAULTS incl. name, load/save on esQuestV1)
                  - BADGES + award()
                  - isPhrase (article-aware) · PROPER · showEs/showEn · vkey · VOCAB_INDEX / VOCAB_BY_LEVEL
                  - SRS: enrollWord / reviewWord / dueWords / duePhrases / vocabQuestion (shape-matched distractors)
                  - mascot() + confetti() · HUD + home · reading (glosses, es-MX TTS) · quiz engine · results
                  - skill lesson + practice · SRS sessions · word match · boss · Language Lab
                  - placement (isFreebie filter) · settings (name, backup/restore) · welcome
content.js      Header doc + SKILLS, then per level: STORIES_Lx + LESSONS_Lx, then the assembly
                (STORIES = [...], LESSONS = [...]). THE content/QC surface.
manifest.json   PWA metadata.  sw.js  Network-first SW; CACHE = "spanish-quest-vN"; deletes only its own prefix.
icons/          Lolo icons (192, 512, 512-maskable).
```

## Data model (localStorage `esQuestV1`)
`level, name, xp, streak, lastDate, stars{id:0-3}, recent{level:[acc...]}, miss{skill:n}, seen{skill:n},
vocab{vkey:{en,box,due,reps,correct,wrong,added}}, bossPassed{level}, badges{id:ts}, placed, dayXp, dayKey,
freezes, lessonsDone{id}`

## What differs from Czech Quest (everything else is identical — see Czech `_ARCHITECTURE.md`)
- **Levels:** `L0 L1 L2 L3` shown as "Nivel 0–3" via `lvlLabel()`. Placement walks all four.
- **Words vs phrases (ADR-S05):** `isPhrase()` strips one leading article, so `el baño` is a WORD.
- **Flashcard identity (ADR-S06):** `vkey()` drops the leading capital (except `PROPER`) — one card per item.
  Every `VOCAB_INDEX` / `S.vocab` access goes through it (`enrollWord`, `skillWords`, `recentVocab`, index build).
- **Review distractors:** same kind (word/phrase) **and** same first-letter case as the right answer,
  because "I want" / "OK" legitimately start with capitals.
- **Placement:** words only, built by `vocabQuestion()`, cognates excluded (`isFreebie`).
- **Welcome (ADR-S07):** name + "Start from zero" (primary) or the 8-question test.
- **Reading:** `\n` in story text renders as line breaks (`white-space:pre-line`) for dialogue.
- **TTS (ADR-S09):** `esVoices()` ranks the device's Spanish voices (es-MX 100 / es-US·es-419 70 / es 40,
  +30 enhanced, −90 Apple novelty voices); `esVoice()` returns the learner's pick (`S.voiceURI`) or the top
  ranked one; **every** utterance is built by `utter()` (voice, lang, volume, pitch) with the rate applied
  by the caller (`S.rate`, or 0.6 for the 🐢 Lento toggle). Settings renders the picker (`renderVoiceBox`),
  and `onvoiceschanged` repaints it because iOS loads voices late.
- **Tap-to-hear in lessons (ADR-S11):** `speakify(html)` runs over every lesson body before it is injected
  (`openGrammarLesson`, `openLesson`); `isSpanishish()` decides which `<b>` is a Spanish term (permissive,
  vetoed by `EN_MARKERS` / affix patterns / `LETTER_DRILL`); delegated click+keydown listeners on
  `#lessonBody` call `speakWord()`. `ES_TOKENS` (story text + glosses + fill answers) only exempts
  English-looking words that are genuinely Spanish.
- **Cache busting (ADR-S10):** `index.html` loads `app.js?v=N` / `content.js?v=N`; bump N **and** `CACHE`
  in `sw.js` (and its `ASSETS`) on every release.
- **norm():** also ignores ¿ ¡ « » ” — `¿Dónde está?` = `donde esta`.

## How to verify a change (no test framework — same method as Czech Quest)
1. `preview_start` the `spanish-quest` config (SANDBOX_1 launch.json, port 8078).
2. Seed state in the console — every engine function is a global. Rebuild `S.vocab` from `VOCAB_INDEX`.
3. Assert in bulk: 300 match rounds (capital pairs, duplicate tiles, phrase tiles), 300 review questions
   (capital leaks), `practiceSet` for every skill, 50 placements, boss per level, `renderHome()` purity.
4. Then click it for real — welcome → home → story → quiz → results.
5. `read_console_messages onlyErrors` must be empty. Clear `localStorage` when done.
6. Content changes: `node tools/validate_content.js` (ids, answer indices, options, skills, gloss format,
   stray quotes/brackets; warns on one Spanish item glossed two ways). Exit code 1 on errors — fix the
   content, never the validator.
