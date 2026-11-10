# Mistakes Made — Greek_Quest

Read before touching this code. The Czech/Spanish traps still apply — see
`~/Dropbox/Spanish_Quest/_MISTAKES_MADE.md` (context-free questions, over-placing guessers, accent-sensitive
fills, AI language passing structural checks, a second content source nobody wired in, off-target padding,
side effects in render, duplicated thresholds, same-origin storage, case-variant duplicate cards).

---

### 1. A stale app.js from the HTTP cache (again)
**What happened:** After an edit, the browser kept running the old `app.js?v=1` — the change "didn't work".
**Fix:** bump `?v=` (now in step with `CACHE`). Spanish ADR-S10 already said so.
**Lesson:** When an edit seems to have no effect, check `document.scripts` for the version before debugging.

### 2. Never trust a generated image without looking at it
**What happened:** The first icon render "succeeded" — but the regex that stripped the mascot's other moods
left half an SVG tag, and the PNG was a WebKit XML-error page with the cat underneath.
**Fix:** match the whole element `<(path|ellipse) class="m-mouth …"[^>]*/>`; looked at both PNGs.
**Lesson:** Exit code 0 is not a check. Open the output.

### 3. Hidden browser pane = frozen screenshots and throttled timers
**What happened:** With the preview pane hidden, screenshots kept showing an old frame and a test that
awaited `setTimeout` timed out at 45 s.
**Fix:** drive the engine synchronously (call `nextMatchBoard()` instead of waiting for its timer) and verify
through DOM text; take screenshots only when the pane is visible.

### 4. Hazard caught at design time: a Spanish backup code would have imported
Spanish Quest uses the same level codes (L0–L3), so the inherited "is the level valid?" import check would have
accepted a Spanish code and mixed its vocab into Greek. Saves now carry `app:"greek-quest"` (ADR-G01).

### 5. A re-render from Settings removed the only exit from results (QC audit, caught before sending)
**What happened:** `pickLevel()` and the name Save call `renderHome()`, which hid `#footer` — while the learner
was still on the results screen, whose only way out is that footer. Dead end, kill-the-app in a PWA.
**Fix:** `renderHome()` hides the footer only when `body[data-view]` is home.
**Lesson:** A render function must not touch shared chrome for a view that isn't showing.

### 6. Scene questions reused without their scene
**What happened:** Weak spots and the boss pulled story questions ("How much does ONE ticket cost?") into drills
with no story on screen — unanswerable, and the weak-spot card could never clear.
**Fix:** `standalone(q)` filter; `comprehension` is not a weak-spot skill.

### 7. Rule order in answerKey
**What happened:** `x(?=vowel)→h` ran before `ks→x`, so "entaksi" ≠ εντάξει, and ξ collapsed into χ (έξω accepted
for έχω). **Fix:** ξ gets its own token, Latin x tried both ways (`answerMatch`), tests in `tools/test_greek.js`.
