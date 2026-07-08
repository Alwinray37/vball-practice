# VBall Practice — Frontend

React app (Create React App) for the VBall Practice planner. See the
[root README](../README.md) for the full feature overview and
[SPECS.md](../SPECS.md) for future plans.

## Scripts

```bash
npm install      # install dependencies
npm start        # dev server on http://localhost:3000
npm test         # unit tests (watch mode)
npm run build    # production build into build/
npm run deploy   # build + publish to GitHub Pages (gh-pages branch)
```

## Structure

```
src/
├── App.js              # routes (hash router) + nav + tool dock
├── index.css           # global styles (single stylesheet)
├── components/
│   ├── DrillCard.js    # drill display card (image/video)
│   ├── DrillForm.js    # add/edit drill modal
│   ├── FlexTimer.js    # countdown/stopwatch widget
│   ├── Scoreboard.js   # two-team scoreboard with serving indicator
│   └── ToolDock.js     # floating collapsible tool dock + fullscreen toolbox
├── data/
│   ├── seedDrills.js   # built-in drills loaded on first run
│   ├── storage.js      # localStorage service: drills, plans, session
│   ├── timerStore.js   # shared persistent timer state (runs while hidden)
│   └── scoreStore.js   # shared persistent scoreboard state
└── pages/
    ├── PlanBuilder.js  # build/edit a practice plan
    ├── DrillLibrary.js # browse + manage drills
    ├── SavedPlans.js   # saved plans list
    └── Practice.js     # live practice mode
```

All persistence goes through `src/data/` (localStorage), so swapping in the
backend API later is contained to that layer.

## Notes

- Routing uses `HashRouter` so the app works on GitHub Pages.
- Icons come from a Font Awesome kit loaded in `public/index.html`.
- `homepage` in `package.json` controls the GitHub Pages base path.
