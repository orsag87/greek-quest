# Architecture — Greek_Quest

Static single-page PWA, cloned from Spanish Quest. No backend, no build step. State in `localStorage`
key **`grQuestV1`** (ADR-G01).

## Load order
`greek.js` → `content.js` → `app.js` (all `?v=N`, see "Release"). greek.js has no DOM and also runs under node.

## Component map
```
index.html   Shell: HUD (level pill, Aa toggle, daily ring, streak, XP), views (home / reading / quiz /
             lesson / results / placement / match), settings sheet, Feta SVG (mood via [data-mood]),
             confetti canvas, all CSS incl. the pronunciation layer (.tri inline, .trb block, .trs stacked;
             body.notr hides all three), PWA links, SW registration.
greek.js     translit(s) · answerKey(s, xAs) · answerMatch(typed, answers) · hasGreek(s). OVERRIDE map for words the rules misread (συγγνώμη).
content.js   SKILLS, STORIES_L0…L4, LESSONS_L0…L4, PLACEMENT{L0…L4}, assembly. THE content/QC surface.
app.js       Same sections as Spanish Quest, plus:
               - GREEK ON SCREEN: grInline / grBlock / trInline / applyTr / toggleTr
               - renderReadingBody: each Greek token is a .ws stack (word + .trs)
               - quiz: grInline(q.q, q.notr), grBlock(opt, q.notr); fill uses answerKey + "show me"
               - speakify: <b> with Greek letters → b.say + pronunciation (isGreekish)
               - THE LEVEL CHECK: openPlacement / startPlaceBlock / placeAnswer / blockDone /
                 finishPlacement / acceptPlacement / placementBack
               - home "Jump to" level chips → pickLevel
sw.js        Network-first; CACHE = "greek-quest-vN"; deletes only its own prefix; offline fallback page.
tools/       validate_content.js · test_greek.js · make_icons.py
```

## Data model (`grQuestV1`)
`app:"greek-quest", level, name, xp, streak, lastDate, voiceURI, rate, showTr, placeResult, stars{id},
recent{level:[acc]}, miss{skill}, seen{skill}, vocab{vkey:{en,box,due,reps,correct,wrong,added}},
bossPassed{level}, badges{id}, placed, dayXp, dayKey, freezes, lessonsDone{id}`

## What differs from Spanish Quest
- 5 levels; `LEVEL_NAMES` in English; no boss at L4.
- First open: welcome → **level check** (ADR-G02) or start from zero. Placement uses the hand-written
  `PLACEMENT` bank, not generated vocab questions; `isFreebie` is gone.
- Pronunciation layer (ADR-G03) and Latin-letter typed answers (ADR-G05).
- `isGreekish` replaces the Spanish lexicon heuristic (`ES_TOKENS`, `EN_MARKERS`, `LETTER_DRILL` removed).
- Delegated tap-to-hear also on `#qExplain` and `#qFeedback`; tapping a Greek tile in word match speaks it.
- Backup import requires `app:"greek-quest"`.
- `show()` sets `body[data-view]`; the floating mascot is hidden on the placement/welcome view.
  `renderHome()` hides the footer only when home is the open view (Settings calls it behind results).
- Story questions are reused outside their story (weak spots, boss) only if `standalone(q)`: they quote
  the Greek or are typed. `comprehension` is never a weak-spot card.

## How to verify a change
1. `node tools/validate_content.js` and `node tools/test_greek.js` — both must exit 0.
2. `preview_start` the `greek-quest` config (port 8079). Bump `?v=` if a script edit doesn't show up.
3. Every engine function is a global — assert in bulk from the console: open every story + render every
   question, open every lesson (b.say count, notr never leaks), `practiceSet` per skill ≥3, 300 match boards
   (no duplicate English, no phrases), 600 `vocabQuestion`s (no capital tells), simulated placements,
   boss per level, `renderHome()` purity, backup round-trip + foreign code refused.
4. Click it for real at 375px: welcome → level check → result → home → story → quiz → results.
5. `read_console_messages onlyErrors` empty; clear `localStorage` when done.

## Release
Bump `CACHE` in `sw.js`, the `?v=` on the three script tags in `index.html`, and the `ASSETS` list — together.
