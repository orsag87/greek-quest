# Pipeline Fixes — Greek_Quest

Deferred work and the native-review list. Newest first.

## 1. Native Greek review (the content gate, ADR-G04)
All Greek in `content.js` is AI-DRAFT. An adversarial AI language audit ran on 2026-11-07 (no blockers; fixes applied —
see `sessions/`). A Greek speaker should still read:
- [ ] Every story text for naturalness (especially L3/L4 dialogue and the slang lesson `l4L-dopios`)
- [ ] Lesson claims about culture (kerasma, toilet paper, μούντζα, nodding "no", Easter)
- [ ] Glosses that double as flashcards (`[Εσύ|you? (= and you?)]`, `[Τίποτα άλλο|nothing else? (= anything else?)]`)
- [ ] Optional: «Τουρισμός;» at passport control → «Για διακοπές;» (kept: a quiz question depends on it)
- [ ] Translit of one-syllable glides (μια/ποια/πιω read "mia/pia/pio"); only πιείτε is overridden

## 2. Engine — known, low priority (from the 2026-11-07 engine audit)
- [ ] Changing level mid-boss certifies the new level (`finishQuiz` reads `S.level`) — capture it in `startBoss`
- [ ] HUD shows a broken streak until the next activity
- [ ] Unescaped English from content in innerHTML (gloss pops are escaped now; glossary/match/titles aren't) — safe while content has no `<`
- [ ] `load()`/import don't type-check every field
- [ ] Viewport blocks pinch zoom (`user-scalable=no`)
- [ ] Dead code: `skipPlacement`, `levelComplete`, `plainText`; stale Czech comment above `skillPool`
- [ ] Typing "b" for β is rejected (mapping b→v would merge β with μπ)
- [ ] One-week trip timeline is loose (3 hotel nights vs everything that happens) — nobody will notice
