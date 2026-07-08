# VBall Practice

A volleyball practice planning app for coaches: build practice plans from a
drill library, save and reuse them, and run practice live with courtside
tools (timers, scoreboard, coach notes).

**Live site:** https://alwinray37.github.io/vball-practice

## Features

- **Plan Builder** — assemble a practice from the drill library, set minutes
  and notes per drill, reorder, and see the total practice time.
- **Drill Library** — browse drills by category (Warm-Up, Skill, Game) with
  images/videos, search, and add/edit/delete your own drills. Changes save
  globally on your device.
- **Saved Plans** — save plans and pull them up later; start, edit,
  duplicate, or delete any plan.
- **Live Practice Mode** — overall elapsed clock with pause, drill checklist
  with progress bar and a "NOW" marker, and per-drill coach notes that save
  back onto the plan. A practice session survives a page refresh.
- **Floating Tool Dock** — collapsible wrench button (bottom-right) with
  courtside tools that keep running even while collapsed or on another page:
  - **Countdown** — 30s / 1m / 5m / 10m presets plus custom minutes+seconds,
    beeps at zero.
  - **Stopwatch** — general count-up timer, resettable anytime.
  - **Scoreboard** — tap-to-score with a persistent serving indicator
    (highlights whoever scored last), swap sides, reset.
  - Expand the whole toolbox fullscreen for gym visibility.

## Tech

- **Frontend:** React (Create React App), React Router (hash routing),
  Font Awesome. All data persists in `localStorage` behind a single service
  layer (`frontend/src/data/`), ready to swap for a real API later.
- **Backend:** Express + MongoDB stub in `backend/` — not yet in use. See
  [SPECS.md](SPECS.md) for the planned build-out (accounts, teams,
  messaging, schedules).
- **Hosting:** GitHub Pages via `gh-pages`.

## Development

```bash
cd frontend
npm install
npm start        # dev server on http://localhost:3000
npm test         # unit tests
npm run build    # production build
npm run deploy   # build + publish to GitHub Pages
```

## Project docs

- [SPECS.md](SPECS.md) — future feature specs (login, teams, messaging,
  schedules).
- [TASKS.md](TASKS.md) — implementation backlog.
