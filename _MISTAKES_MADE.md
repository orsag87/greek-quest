# Mistakes Made — Spanish_Quest

Lessons learned the hard way. Read before touching this code.

---

## Inherited from Czech Quest (same engine — same traps)
Full write-ups: `~/Dropbox/Czech_Quest/_MISTAKES_MADE.md`. The ones that apply to this engine:

- **Czech #1 — context-dependent questions where the source isn't shown.** A quiz item must be
  answerable from what's on screen. Placement has no story → vocab questions only.
- **Czech #2 — "≥1 correct" placement over-places guessers.** Clear the whole level's set to advance.
- **Czech #3 — accent-sensitive fills.** Match accent-insensitively, always *show* the accented form.
- **Czech #4 — AI-generated language passes every structural check and can still be wrong.**
  Native review is the gate (ADR-S03).
- **Czech #6 — a second content source nobody rewired the first consumer to see.** Adding a new source
  of questions? Enumerate every consumer (`skillPool`, `startBoss`, `practiceSet`, placement).
- **Czech #7 — padding a targeted drill with off-target filler.** Only `vocab-*` skills get topped up.
- **Czech #8 — write side effects inside a render function.** `renderHome()` must stay pure;
  `practiceSet()` builds, it never enrols.
- **Czech #9 — splitting one queue in two and duplicating its threshold.** The review card gates on the
  COMBINED due count.

## Hazards caught at clone time (not bugs yet — because they were caught)

### 1. Same origin, shared browser storage
**What would have happened:** Czech Quest and Spanish Quest both deploy to `orsag87.github.io`.
localStorage and Cache Storage are per-origin, not per-path. A copied `czQuestV2` key (or the copied
v1 migration reading `czQuest`) would have loaded Natasha's Czech progress into the Spanish app, and
the copied SW `activate` handler deletes *every* cache that isn't its own.
**Fix:** own key `esQuestV1`, migration removed, SW deletes only `spanish-quest-*` caches (ADR-S01).
**Lesson:** When cloning a web app to the same host, list every per-origin resource — localStorage
keys, IndexedDB names, Cache Storage names, SW scope, cookies — and rename or scope each one.

### 2. Case-variant duplicate flashcards
**What would have happened:** keying vocab by raw gloss text makes "Gracias" and "gracias" two cards
that can sit on the same match board. Czech Quest has this; it's masked by display normalisation.
**Fix:** `vkey()` (ADR-S06).
**Lesson:** Normalising for display is not the same as normalising the identity. If two things
should be one, fix the key, not just the label.
