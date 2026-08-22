# Game Library

A personal game management platform for tracking what you play, how long you've played it, and how you'd rate it.

**Live demo (frontend only):** https://localintheengineer.github.io/game-library/

## Current stage: v3 — Express API

The app is now split into a React client and a Node/Express server. Games are stored on the server as JSON instead of in browser storage, which means the same library is available from any browser that can reach the API.

### Features
- Dashboard with library-wide stats
- Searchable, filterable, sortable library view
- Add / edit / delete games with genre, platform, status, hours, star rating, and notes
- Stats view with genre and status breakdown charts
- Dark / light theme, persisted locally
- REST API with server-side validation
- Responsive layout

## Project structure

```
client/                React app (Vite)
├── src/components/    Reusable UI pieces
├── src/pages/         Dashboard, Library, Stats
├── src/hooks/         useGames, useTheme, useLocalStorage
├── src/api.js         Fetch wrapper for the REST API
└── src/styles/        global.css

server/                Express API
├── routes/games.js    Route handlers
├── store.js           JSON file persistence
├── validate.js        Request validation
├── seed.js            Starter data
└── index.js           App setup and error handling
```

## API

Base path: `/api`

| Method | Path           | Description                     |
| ------ | -------------- | ------------------------------- |
| GET    | `/games`       | List all games                  |
| GET    | `/games/:id`   | Fetch one game                  |
| POST   | `/games`       | Create a game                   |
| PUT    | `/games/:id`   | Replace a game's editable fields |
| DELETE | `/games/:id`   | Remove a game                   |
| GET    | `/health`      | Liveness check                  |

Invalid payloads return `400` with an `errors` array. Unknown ids return `404`.

Example:

```bash
curl -X POST http://localhost:4000/api/games \
  -H "Content-Type: application/json" \
  -d '{"name":"Hades","genre":"Action","platform":"PC","status":"playing","hours":14,"rating":5,"notes":""}'
```

## Running locally

Install both packages:

```bash
npm run install:all
npm install
```

Start the API and the client together:

```bash
npm run dev
```

- API: http://localhost:4000
- Client: http://localhost:5173

Vite proxies `/api` to port 4000 in development, so no extra configuration is needed.

To run them separately, use `npm run dev:api` and `npm run dev:web`.

## Data

Games live in `server/data/games.json`, which is created with sample data on first run and is git-ignored. Delete the file to reset the library.

## Deploying

GitHub Pages only serves static files, so the live demo runs the client alone and will show a connection error until an API is reachable. Deploying the server (Render, Railway, Fly.io, or any Node host) and setting `VITE_API_URL` to its public URL at build time reconnects the two.

## Roadmap

- [x] v1 — HTML / CSS / JS / LocalStorage
- [x] v2 — React frontend (Vite)
- [x] v3 — Node.js + Express backend
- [ ] v4 — PostgreSQL database
- [ ] v5 — REST API + JWT authentication (multi-user)
- [ ] v6 — External game data API integration
- [ ] v7 — Polish: richer charts, responsive pass, dark mode refinements

## Tech stack

`React` · `Vite` · `Node.js` · `Express` · `CSS`
