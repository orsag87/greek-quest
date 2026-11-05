# Pipeline Fixes — Spanish_Quest

Deferred TODOs only. If you fix it this session, log it in sessions/ — not here.
Last reviewed: 2026-09-15, after the pre-send QC audit (see `sessions/2026-09-15_clone-and-spanish-v1.md`).

---

## Gate before sharing widely
- [ ] **Native Mexican-Spanish read of `content.js`** (ADR-S03). An independent audit pass checked all 152
      quiz items against their scenes (0 wrong answer keys, 0 mistranslations in 626 glosses) — but
      naturalness still needs a Mexican speaker. Lines worth their attention:
  - **L0** `l0-aeropuerto`: «¡Bienvenido a México!» (a woman hears *bienvenida*) · «¿Turismo?» vs «¿Motivo de su viaje?»
  - **L0** `l0-bano`: «H»/«M» bathroom doors (vs *Damas/Caballeros*) — a trick question depends on it
  - **L0** `l0L-gratis`: «¡qué oso!» on day one · `l0L-magicas`: perdón vs disculpe simplified
  - **L1** `l1-oxxo`: «¿Gusta redondear?» · «cuarenta y nueve cincuenta» *(the audit judged both natural)*
  - **L1** `l1-taxi`: «Aquí, a la izquierda» (vs *da vuelta a la izquierda*)
  - **L1** `l1-tacos`: the red salsa being hotter (a quiz question depends on it)
  - **L1** `l1-farmacia`: *suero* framing · `l1-hotel`: «¡Que descanse!»
  - **L2** `l2-camion`: ADO ticket wording «¿Sencillo o redondo?» · prices/gate simplified
  - **L2** `l2-restaurante`: «Dos órdenes de cochinita» · «Ahorita se la traigo»
  - **L2** `l2-cenote`: «¿Hay lockers?» (vs *casilleros*) · «el agua está padre»
  - **L2** `l2-mercado`: «Se lo dejo en cien» · «¿Qué le damos?» · `l2-amigos`: «Te paso mi WhatsApp, ¿va?»
  - **L3** `l3-muertos`: cempasúchil «guían a las almas a casa» · `l3-manana`: «Voy a ir en un tour»
  - **L3** `l3-que-onda`: «Aprendo español con una app», «Poquito» · `l3-ayer`: seeing an axolotl at Xochimilco
  - **L3** `l3-emergencia`: «¿Vino en taxi?» · «Ahorita se lo llevo al hotel» (sets up the *ahorita* joke)
  - **L3** `l3L-soy-estoy`: the "could it change by tomorrow? → estoy" rule of thumb

## Content
- [ ] `l2L-horas` Q1 and Q3 are tagged `vocab-numbers`; the audit argued for `comprehension`. Kept as-is —
      that skill covers "numbers, prices **and time**", and its top-up pool (number/time stories) is on
      target. Revisit if a time drill ever comes out with unrelated words in it.
- [ ] Number sequencing: `l1-tacos` (diff 1) ends on «ochenta pesos» and `l1-taxi` (diff 2) on «cien pesos»,
      but the tens are taught in `l1L-pesos` (diff 3) and L0 stops at 20. Both are glossed, so it's
      survivable; moving the pesos lesson to diff 1 would be tidier.
- [ ] Personal detail: "you" say **Soy de Canadá** in `l2-amigos`, `l3-que-onda` and `l3L-soy-estoy`.
      Fine if the learners are Canadian; swap otherwise. (The "Soy DJ" line is gone — now *soy turista*.)
- [ ] Accepted by design (the validator warns about them every run): 7 items are glossed two ways because
      they genuinely differ by scene — `un café` (a coffee / a café), `tiene` (has / do you have),
      `aquí está` (here it is / here is), `poquito`, `buscas`, `la terraza` (the rooftop / the terrace),
      `va` (OK / deal). The flashcard keeps the first meaning seen; forcing one wording would make the
      other scene wrong. Only unify if a specific card reads oddly in review.
- [ ] More content to ~8 scenes per level; a "listening" question type (hear it, pick it) would suit a trip.
- [ ] `PROPER` in `app.js` is hand-built. A new proper noun in a gloss renders lowercased in match/review
      until it's added (inherited from Czech ADR-011).

## Engine / polish
- [ ] Google Fonts aren't in the SW `ASSETS` (they're cross-origin — `addAll` would fail the install), so
      an offline open renders in fallback fonts. Cosmetic; inherited from Czech Quest.
- [ ] `<div class="placeintro">` in the placement view is always empty — leftover markup.

## Deploy
- [x] **Done 2026-09-15** — `orsag87/spanish-quest` (public) + Pages live at
      https://orsag87.github.io/spanish-quest/. Update ritual is in the README.

## Czech Quest (separate app, separate repo)
- [x] **Fixed 2026-09-15, committed but NOT pushed** (`018a826` in `~/Dropbox/Czech_Quest`): its `sw.js`
      `activate` deleted every cache that wasn't its own, including Spanish Quest's on the shared
      `orsag87.github.io` origin. Now prefix-scoped. It ships whenever Czech Quest is next pushed.
- [ ] Czech Quest also has the case-variant duplicate-flashcard issue fixed here by `vkey()` (ADR-S06),
      and the same "view switch doesn't scroll to top" bug fixed here in `show()`.
