# Codebase Map — Greek_Quest

| Path | Purpose | Touch when… |
|------|---------|-------------|
| `index.html` | Shell, all CSS, views, Feta SVG, script tags | layout, styles, mascot, **every release** (`?v=`) |
| `greek.js` | `translit`, `answerKey`, `hasGreek` | a pronunciation is wrong / a typed answer is wrongly rejected |
| `app.js` | Engine incl. the level check | behaviour |
| `content.js` | SKILLS, stories, lessons, PLACEMENT | adding/fixing content (most common) |
| `sw.js` | Service worker, `CACHE`, `ASSETS` | **every release** |
| `manifest.json`, `icons/` | PWA metadata, Feta icons | rebranding |
| `tools/validate_content.js` | Content validator | after every content edit |
| `tools/test_greek.js` | translit / answerKey tests | after touching greek.js |
| `tools/make_icons.py` | Renders icons/ from the mascot SVG (macOS) | mascot changes |
| `_DECISION_RECORD.md` | ADR-G01… | a design decision |
| `_ARCHITECTURE.md` | Wiring + how to verify | engine changes |
| `_MISTAKES_MADE.md` | Traps | after a mistake |
| `_PIPELINE_FIXES.md` | Deferred work, native-review list | when deferring |
| `sessions/` | Session logs | end of a session |

Preview: `greek-quest`, port 8079 (SANDBOX_1/.claude/launch.json, absolute `--directory`).

## Deploy targets
- GitHub repo `orsag87/greek-quest` (public) → https://orsag87.github.io/greek-quest/
- Sister apps on the same origin: `/spanish-quest/`, `/czech-quest/` (ADR-G01)

## Content counts (2026-11-07)
28 stories (L0:6 L1:6 L2:6 L3:5 L4:5) · 21 power lessons · 112 story questions + 105 lesson questions ·
30 level-check questions · 448 flashcards · 22 skills.
