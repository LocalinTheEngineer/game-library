# 🎮 Game Library

A personal game management platform for tracking what you play, how long you've played it, and how you'd rate it.

**Live demo:** https://localintheengineer.github.io/game-library/

## Current stage: v2 — React

The interface is now a React single-page app built with Vite, split into reusable components and custom hooks. Data still lives in the browser via `localStorage` — the backend arrives in v3.

### Features
- Dashboard with library-wide stats (total games, playing, completed, backlog, hours played)
- Searchable, filterable, sortable library view
- Add / edit / delete games with genre, platform, status, hours, star rating, and notes
- Stats view with genre and status breakdown charts
- Dark / light theme, persisted across sessions
- Fully responsive layout

## Project structure

```
src/
├── components/     Reusable UI pieces (GameCard, Topbar, BarChart, modal…)
├── pages/          Dashboard, Library, Stats
├── hooks/          useGames, useTheme, useLocalStorage
├── styles/         global.css
├── constants.js    Genres, platforms, status metadata
├── seed.js         Starter data for a fresh library
├── App.jsx         Routing between views + shared state
└── main.jsx        React entry point
```

## Roadmap

- [x] v1 — HTML / CSS / JS / LocalStorage
- [x] v2 — React frontend (Vite)
- [ ] v3 — Node.js + Express backend
- [ ] v4 — PostgreSQL database
- [ ] v5 — REST API + JWT authentication (multi-user)
- [ ] v6 — External game data API integration
- [ ] v7 — Polish: richer charts, responsive pass, dark mode refinements

## Tech stack (v2)

`React` · `Vite` · `CSS` · `LocalStorage`

## Running locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To build for production:

```bash
npm run build      # output goes to dist/
npm run preview    # serve the built files locally
```

## Deploying

```bash
npm run deploy
```

This builds the app and pushes `dist/` to the `gh-pages` branch. In the repository's **Settings → Pages**, set the source branch to `gh-pages` / `(root)`.

The `base` option in `vite.config.js` must match the repository name for asset paths to resolve on GitHub Pages.
