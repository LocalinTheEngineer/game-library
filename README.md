# Game Library

A personal game management platform for tracking what you play, how long you've played it, and how you'd rate it.

## Current stage: v5 — Cover art and game search

Adding a game now starts with a search against the RAWG database. Pick a result and the title, genre, platform, release year, and cover art fill themselves in; the manual form is still there for anything the search misses. Covers are stored alongside the game so the library reads as a shelf rather than a spreadsheet.

The RAWG key lives on the server. The browser only ever talks to this API, so the key is never shipped to the client.

### Features
- Dashboard with library-wide stats
- Searchable, filterable, sortable library view
- Add / edit / delete games with genre, platform, status, hours, star rating, and notes
- Stats view with genre and status breakdown charts
- Dark / light theme, persisted locally
- Game search with cover art, release year, and Metacritic score from RAWG
- Generated placeholder art for anything without a cover
- REST API with request validation and database constraints
- Responsive layout

## Schema

```
users              games                 user_games
-----              -----                 ----------
id                 id                    id
username           name (unique)         user_id  -> users.id
email              genre                 game_id  -> games.id
password_hash      platform              status
created_at         cover_image           hours_played
                   release_year          rating
                   created_at            notes
                                         added_at
                                         updated_at
```

`games` is a shared catalogue: one row per game, regardless of how many people own it. `user_games` holds everything that differs per person. Removing a game from your library deletes the `user_games` row and leaves the catalogue entry alone.

Constraints are enforced in the database as well as in the API: status must be one of the four known values, rating stays between 0 and 5, hours cannot go negative, and a user cannot add the same game twice.

## Project structure

```
client/                React app (Vite)
├── src/components/    Reusable UI pieces
├── src/pages/         Dashboard, Library, Stats
├── src/hooks/         useGames, useTheme, useLocalStorage
├── src/api.js         Fetch wrapper for the REST API
└── src/styles/        global.css

server/                Express API
├── db/schema.sql      Table definitions
├── db/pool.js         Connection pool and transaction helper
├── db/migrate.js      Applies the schema and inserts demo data
├── rawg.js            RAWG client, genre/platform mapping, cache
├── routes/games.js    Route handlers
├── routes/search.js   Game search endpoint
├── store.js           SQL queries behind the API
├── validate.js        Request validation
└── index.js           App setup and error handling
```

## API

Base path: `/api`

| Method | Path         | Description                      |
| ------ | ------------ | -------------------------------- |
| GET    | `/games`     | List the current library         |
| GET    | `/games/:id` | Fetch one entry                  |
| POST   | `/games`     | Add a game to the library        |
| PUT    | `/games/:id` | Update an entry                  |
| DELETE | `/games/:id` | Remove an entry                  |
| GET    | `/search?q=` | Search the RAWG catalogue        |
| GET    | `/health`    | Liveness check, includes database |

`400` for invalid payloads, `404` for unknown ids, `409` when a game is already in the library, `502` when the upstream search is unreachable.

Search responses are cached in memory for six hours, which keeps the app well inside the free tier's monthly request budget.

## Setup

PostgreSQL 14 or newer is required.

Create the database:

```bash
createdb game_library
```

Copy the environment template, then fill in your database password and a RAWG API key (free, from rawg.io/apidocs):

```bash
cd server
cp .env.example .env
```

The app runs without a RAWG key — search returns an error and you add games manually — but covers are the point of this version.

Install everything and create the tables:

```bash
npm run install:all
npm run db:migrate
```

Start both processes:

```bash
npm run dev
```

- API: http://localhost:4000
- Client: http://localhost:5173

To reset the library, drop and recreate the database, then run the migration again.

## Roadmap

- [x] v1 — HTML / CSS / JS / LocalStorage
- [x] v2 — React frontend (Vite)
- [x] v3 — Node.js + Express backend
- [x] v4 — PostgreSQL database
- [x] v5 — RAWG integration and cover art
- [ ] v6 — JWT authentication and real accounts
- [ ] v7 — Polish: richer charts, responsive pass, dark mode refinements

## Tech stack

`React` · `Vite` · `Node.js` · `Express` · `PostgreSQL` · `RAWG API`

## Attribution

Game data and cover images come from [RAWG](https://rawg.io). Their free tier requires a visible link back, which sits in the app footer.
