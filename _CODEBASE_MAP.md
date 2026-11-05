# Codebase Map — Spanish_Quest

Navigation aid. Not a session log.

| Path | Purpose | Touch when… |
|------|---------|-------------|
| `index.html` | App shell, all CSS, view containers, Lolo SVG, confetti canvas, PWA wiring | layout, styles, mascot, new view |
| `app.js` | Learning engine (state, SRS, placement, boss, badges, streak/freezes, word match, name, backup) | behaviour/logic |
| `content.js` | `SKILLS` + per-level `STORIES_Lx` / `LESSONS_Lx` — **the lessons** | adding/fixing content (most common edit) |
| `manifest.json` | PWA metadata | rebranding / icons |
| `sw.js` | Service worker; `CACHE` constant, `spanish-quest-` prefix | **every release** — bump `CACHE` **and** the `?v=` on the script tags in `index.html` (+ `ASSETS`) |
| `icons/` | Lolo icons 192 / 512 / 512-maskable | new app icon |
| `tools/validate_content.js` | Node validator for `content.js` (`node tools/validate_content.js`) | after every content edit |
| `README.md` | Run, deploy, authoring guide | onboarding / deploy steps change |
| `_DECISION_RECORD.md` | ADR-S01…S08 + the Czech ADRs still in force | a design decision |
| `_ARCHITECTURE.md` | How it's wired; what differs from Czech Quest; how to verify | engine changes |
| `_MISTAKES_MADE.md` | Inherited traps + clone-time hazards | after a mistake |
| `_PIPELINE_FIXES.md` | Deferred TODOs, incl. the native-review list | when deferring work |
| `sessions/` | Per-session logs | end of a session |
| `.claude/launch.json` | Local preview config (python http.server 8078) | local preview setup |

Preview from SANDBOX_1: config `spanish-quest`, port 8078, via the `SANDBOX_1/Spanish_Quest` symlink.

## Deploy targets
- GitHub repo: `orsag87/spanish-quest` (public) — created 2026-09-15
- Live URL (Pages): https://orsag87.github.io/spanish-quest/ — verified serving `?v=4`
- Sister app: `~/Dropbox/Czech_Quest` → https://orsag87.github.io/czech-quest/ (same origin — ADR-S01)

## Content counts (2026-09-15, v1 + QC audit fixes)
23 stories — L0:6 L1:6 L2:6 L3:5 · 16 power lessons (4 per level, 5 exercises each)
172 questions (92 story quiz + 80 lesson practice) · ~630 glosses → 439 flashcards (words + phrases)
Boss bank: 20 language questions per level. Run `node tools/validate_content.js` after any content edit.
