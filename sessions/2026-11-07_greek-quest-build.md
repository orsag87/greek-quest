# 2026-11-05 → 11-09 — Greek Quest: build, level check, QC audit, ship

**Asked:** turn Czech/Spanish Quest into Greek; beginner-friendly, no dead ends; a level check at the start for a
friend continuing from Duolingo at an unknown level (never pigeonholed); test, /qc-audit, fix, /wrap; push to
GitHub (orsag87) so it can be sent right away.

**Built:** 5 levels (alphabet → beyond Duolingo), 28 stories, 21 power lessons, 30-question level-check bank,
generated pronunciation layer (Aa toggle), Latin-letter typed answers, Feta the Naxos cat. ADR-G01…G07.

**QC audit (two independent agents):**
- Content: no blockers. Fixed 9 should-fix (two defensible answers, rejected valid spellings δε/το λογαριασμό,
  wrong flashcard gloss for Εσύ, calque «Μπορώ να έχω», πρέπει never conjugates, Πέμπτη pronunciation, …) and most nits
  (ferry moved to 10:30 so the times make sense, toilet-paper claim softened, unglossed Greek wrapped, odd glosses).
- Engine: 1 blocker (results-screen dead end after Settings) + 7 should-fix (Settings sheet off-screen on phones,
  scene questions in weak spots/boss, greeklish oy/ks/exw/γ rejected, έξω accepted for έχω, «Lección» leftover,
  apostrophe pronunciation garbled, level-check timer race). All fixed; leftovers in `_PIPELINE_FIXES.md`.

**Verified:** validator OK (448 flashcards), test_greek OK (65/73/10); browser sweep at 375px — every story,
question, lesson and skill renders, notr never leaks, every fill accepts its pronunciation, boss pools 8 standalone
questions, 500 random guessers → L0 96% / L1 4% / L2 0.4%, no console errors. Release v4.
