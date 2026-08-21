# 🎮 Game Library

A personal game management platform for tracking what you play, how long you've played it, and how you'd rate it.

**Live demo:** https://localintheengineer.github.io/game-library/

## Current stage: v1 — Local Edition

Single-page app built with vanilla HTML, CSS, and JavaScript. Data is stored in the browser via `localStorage` — no backend, no account, no setup required.

### Features
- Dashboard with library-wide stats (total games, playing, completed, backlog, hours played)
- Searchable, filterable, sortable library view
- Add / edit / delete games with genre, platform, status, hours, star rating, and notes
- Stats view with genre and status breakdown charts
- Dark / light theme, persisted across sessions
- Fully responsive layout

## Roadmap

- [x] v1 — HTML / CSS / JS / LocalStorage
- [ ] v2 — Rebuild frontend in React
- [ ] v3 — Node.js + Express backend
- [ ] v4 — PostgreSQL database
- [ ] v5 — REST API + JWT authentication (multi-user)
- [ ] v6 — External game data API integration
- [ ] v7 — Polish: richer charts, responsive pass, dark mode refinements

## Tech stack (v1)

`HTML` · `CSS` · `JavaScript` · `LocalStorage`

## Running locally

No build step needed — just open `index.html` in a browser, or serve the folder with any static server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
