# 🦎 Spanish Quest

A cozy Mexican-Spanish sprint for **absolute beginners** — people who know about ten Spanish words
and are flying to Mexico in two months. Order tacos, get a taxi, check in, find the bathroom,
make a friend, understand the slang. No conjugation tables.

The sister app of **Czech Quest** (`~/Dropbox/Czech_Quest`): same engine, cloned — separate repo,
separate storage, separate mascot. Meet **Lolo the axolotl** (un ajolote — found only in Mexico).

Single static web app. No backend, no build step, no accounts. Progress is saved on the device.

---

## What it does

- **Nivel 0 → 3 in eight weeks.** Cero (day 1) · Sobrevivir (weeks 1–2) · De viaje (weeks 3–5) · Platicar (weeks 6–8).
- **Tiny scenes → glossary → quiz.** Each lesson is a short dialogue where *you* say the useful lines.
  Tap any underlined word for the English, hear it in a Mexican voice, then take a short quiz.
- **Chunks, not conjugation.** `quiero…`, `¿me da…?`, `necesito…`, `¿dónde está…?`, `hay`, `me gusta`,
  `voy a…`, `fui a…` — learn the chunk, swap the noun.
- **Cognates first.** hotel, taxi, delicioso, aeropuerto — the words you already know carry the new ones.
- **Power lessons.** 4 per level (sounds, free words, magic words, prices, question words, slang…), 5 exercises each.
- **Spaced repetition, word match, weak-spot drills, boss checkpoints, streaks with freezes, badges** —
  everything Czech Quest has.

## Run it locally

```bash
cd Spanish_Quest
python3 -m http.server 8078
# open http://localhost:8078
```

(From SANDBOX_1 the preview config is `spanish-quest` in `SANDBOX_1/.claude/launch.json`, port 8078,
served through the `SANDBOX_1/Spanish_Quest` symlink.)

## Live

**https://orsag87.github.io/spanish-quest/** — deployed 2026-09-15 from `orsag87/spanish-quest` (public,
GitHub Pages, branch `main`). Send that link; open it once and **Share ▸ Add to Home Screen** to install it.
Each person types their own name on first open, and their progress lives on their own phone.

**Pushing an update:** bump `CACHE` in `sw.js` **and** the matching `?v=` on the two `<script>` tags in
`index.html` (and the `ASSETS` list), commit, `git push`. Pages redeploys in ~1 minute; the service worker
is network-first, so a returning learner gets the new build on their next online open.

⚠️ It shares the `orsag87.github.io` origin with Czech Quest. That's safe because storage keys and
cache names are separate (see `_DECISION_RECORD.md` ADR-S01) — keep it that way.

## Adding or fixing lessons

**All content lives in `content.js`.** The schema and the house rules are documented at the top of that file.

```js
{ id:"l1-tacos", level:"L1", diff:1, titleEs:"Tacos al pastor", titleEn:"Pastor tacos",
  text:"— ¿[Me da|can I have] [tres tacos|three tacos], [por favor|please]?\n— ¡[Órale|OK / wow / come on]!",
  quiz:[ { q:"How many tacos?", opts:["two","three","five"], a:1, skill:"vocab-numbers" } ] }
```

- Wrap tappable items as `[spanish|english]`; punctuation outside the brackets; nouns with their article.
- Every glossed item automatically becomes a spaced-repetition flashcard.
- `skill` must be a key in `SKILLS` at the top of `content.js`.
- Content is **AI-draft until a Mexican Spanish speaker reads it** — the list of lines to check is in `_PIPELINE_FIXES.md`.

## Backing up / moving progress

Automatic on the device. **⚙ Ajustes → Respaldar** gives a code; **Restaurar** on another device brings it back.

## Read-aloud voices

**⚙ Ajustes → 🔊 Voz** lists every Spanish voice on the device (♀/♂ marked, **HD** = downloaded
high-quality), with a ▶ Probar button and a speed setting. The app ranks real Mexican voices first and
pushes Apple's novelty voices (Eddy, Rocko, Grandma…) to the bottom — those are the lofi robots.

For a properly human voice, download one:
- **iPhone:** Settings ▸ Accessibility ▸ Spoken Content ▸ Voices ▸ **Spanish (Mexico)** → Paulina or Juan,
  tap the download arrow (Enhanced/Premium). It appears in the picker right away, tagged HD.
- **Mac:** System Settings ▸ Accessibility ▸ Spoken Content ▸ System Voice ▸ Manage Voices.

## Files

| File | What |
|------|------|
| `index.html` | App shell, styles, Lolo mascot, PWA wiring |
| `app.js` | All the learning logic (engine, SRS, placement, boss, badges) |
| `content.js` | **The lessons** — edit this to add/fix content |
| `manifest.json`, `sw.js`, `icons/` | PWA (home-screen install + offline + updates) |
| `_DECISION_RECORD.md`, `_ARCHITECTURE.md`, `_MISTAKES_MADE.md`, `_PIPELINE_FIXES.md` | Why it's built this way / what's left |
