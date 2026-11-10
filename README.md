# 🐈 Greek Quest

Pick up Greek where Duolingo leaves off — or start from the very first letter. Tiny scenes from a trip
(Athens → Naxos → a day on Santorini), a glossary you can tap and hear, quizzes, power lessons, and a
**level check** on first open that puts you in the right place.

The third app on the same engine as **Czech Quest** and **Spanish Quest** (`~/Dropbox/Spanish_Quest`):
cloned, separate repo, separate storage, separate mascot. Meet **Feta**, a white-and-ginger island cat from Naxos.

Single static web app. No backend, no build step, no accounts. Progress is saved on the device.

---

## What it does

- **Five levels, alphabet → beyond Duolingo.** Level 0 alphabet & first words · 1 first steps · 2 on the road ·
  3 chatting (past + future) · 4 beyond Duolingo (να-forms, opinions, "used to", slang, culture).
- **Level check first.** 3 questions per level, four options + "I don't know", stops as soon as it finds the
  level. The result is a suggestion: "Start from the very beginning" is one tap, and every level is one tap
  away on the home screen ("Jump to") forever.
- **Pronunciation under every Greek word** (`ευχαριστώ` → *efharistó*), generated — never typed by hand.
  The **Aa** button hides it once you can read Greek (off by default from Level 3).
- **No Greek keyboard needed.** Typed answers accept Greek or Latin letters, any accents, common greeklish
  (`efharisto`, `efcharisto`, `eyxaristw` all = ευχαριστώ). "I don't know — show me" on every typed question.
- **Tap any underlined Greek** in stories, lessons and explanations to hear it in a Greek voice.
- Spaced repetition, word match, weak-spot drills, boss checkpoints, streaks with freezes, badges.

## Run it locally

```bash
cd ~/Dropbox/Greek_Quest
python3 -m http.server 8079
# open http://localhost:8079
```

(From SANDBOX_1 the preview config is `greek-quest` in `SANDBOX_1/.claude/launch.json`, port 8079.)

## Live

**https://orsag87.github.io/greek-quest/** — repo `orsag87/greek-quest` (public, GitHub Pages, branch `main`).
Open it once and **Share ▸ Add to Home Screen** to install it. Each person's progress lives on their own phone.

**Pushing an update:** bump `CACHE` in `sw.js` **and** the matching `?v=` on the three `<script>` tags in
`index.html` (and the `ASSETS` list), commit, `git push`. Pages redeploys in ~1 minute.

⚠️ It shares the `orsag87.github.io` origin with Czech and Spanish Quest. Storage keys and cache names are
separate (`_DECISION_RECORD.md` ADR-G01) — keep it that way.

## Adding or fixing lessons

**All content lives in `content.js`.** The format and house rules are at the top of that file.

```js
{ id:"l1-taverna", level:"L1", diff:1, titleGr:"Στην ταβέρνα", titleEn:"At the taverna",
  text:"— [Καλησπέρα|good evening]! [Ο κατάλογος|the menu].\n— [Γεια μας|cheers]!",
  quiz:[ { q:"What does «Καλή όρεξη!» mean?", opts:["cheers!","enjoy your meal!","good night!"], a:1, skill:"vocab-food" } ] }
```

- Wrap tappable items as `[greek|english]`; punctuation (`; ! . , ·`) outside the brackets; nouns with their article.
- The same Greek item always gets the same English gloss.
- Never type pronunciations — the engine adds them. Alphabet-reading questions need `notr:true`.
- After any edit: `node tools/validate_content.js` (and `node tools/test_greek.js` after touching `greek.js`).
- Content is **AI-draft until a Greek speaker reads it** — what to check is in `_PIPELINE_FIXES.md`.

## Voices

**⚙ Settings ▸ 🔊 Voice** lists the device's Greek voices with a ▶ Test button and a speed setting.
iPhone: Settings ▸ Accessibility ▸ Spoken Content ▸ Voices ▸ Greek ▸ **Melina** (download the Enhanced version
if offered). Android: Settings ▸ Text-to-speech ▸ install Greek. Mac: System Settings ▸ Accessibility ▸
Spoken Content ▸ System Voice ▸ Manage Voices.

## Backing up / moving progress

**⚙ Settings ▸ Back up** gives a code; **Restore** on another device brings it back. Codes from Czech/Spanish
Quest are refused.

## Files

| File | What |
|------|------|
| `index.html` | App shell, styles, Feta mascot, PWA wiring |
| `greek.js` | `translit()` pronunciation, `answerKey()` typed-answer matching, `hasGreek()` |
| `app.js` | The engine (level check, SRS, quiz, match, boss, badges, settings) |
| `content.js` | **The lessons** + the level-check bank — edit this to add/fix content |
| `manifest.json`, `sw.js`, `icons/` | PWA (home-screen install + offline + updates) |
| `tools/` | `validate_content.js`, `test_greek.js`, `make_icons.py` |
| `_DECISION_RECORD.md`, `_ARCHITECTURE.md`, `_MISTAKES_MADE.md`, `_PIPELINE_FIXES.md` | Why / how / traps / what's left |
