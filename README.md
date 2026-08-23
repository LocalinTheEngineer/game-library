# Game Library

A personal game management platform for tracking what you play, how long you've played it, and how you'd rate it.

**[Live demo](https://localintheengineer.github.io/game-library/)** · React · Node.js · Express · PostgreSQL

> The API sleeps when idle, so the first request after a quiet spell takes about a minute.

![Library](docs/library.png)

<details>
<summary>More screenshots</summary>

![Dashboard](docs/dashboard.png)

![Stats](docs/stats.png)

</details>

## What it does

Everyone gets their own library. Registration and sign-in issue a JWT that the client stores and sends with every request; the API resolves the token to a user id and scopes every query to it. Passwords are hashed with scrypt and a per-user salt, so the database never holds anything reversible.

Two people can track the same game independently — same catalogue row, separate hours, ratings, and notes.

Adding a game starts with a search against the RAWG database. Pick a result and the title, genre, platform, release year, and cover art fill themselves in; the manual form is still there for anything the search misses.

The RAWG key lives on the server. The browser only ever talks to this API, so the key is never shipped to the client.

- Registration, sign-in, and per-user libraries
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
├── src/hooks/         useAuth, useGames, useTheme, useLocalStorage
├── src/api.js         Fetch wrapper for the REST API
└── src/styles/        global.css

server/                Express API
├── db/schema.sql      Table definitions
├── db/pool.js         Connection pool and transaction helper
├── db/migrate.js      Applies the schema and inserts demo data
├── auth.js            Password hashing, token signing, route guard
├── users.js           Account queries
├── rawg.js            RAWG client, genre/platform mapping, cache
├── routes/games.js    Route handlers
├── routes/search.js   Game search endpoint
├── routes/auth.js     Register, login, current user
├── store.js           SQL queries behind the API
├── validate.js        Request validation
└── index.js           App setup and error handling
```

## API

Base path: `/api`

| Method | Path             | Description                      |
| ------ | ---------------- | -------------------------------- |
| POST   | `/auth/register` | Create an account, returns a token |
| POST   | `/auth/login`    | Sign in, returns a token         |
| GET    | `/auth/me`       | Current user for a valid token   |
| GET    | `/games`         | List the current library         |
| GET    | `/games/:id` | Fetch one entry                  |
| POST   | `/games`     | Add a game to the library        |
| PUT    | `/games/:id` | Update an entry                  |
| DELETE | `/games/:id` | Remove an entry                  |
| GET    | `/search?q=` | Search the RAWG catalogue        |
| GET    | `/health`    | Liveness check, includes database |

Everything except the two auth endpoints requires an `Authorization: Bearer <token>` header.

`400` for invalid payloads, `401` for a missing or expired token, `404` for unknown ids, `409` for duplicate emails, usernames, or library entries, `502` when the upstream search is unreachable.

Requests for another user's entry return `404` rather than `403`, so the API never confirms that a given id exists.

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

`JWT_SECRET` signs session tokens and must be long and random:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

The app runs without a RAWG key — search returns an error and you add games manually — but covers are worth the minute it takes to get one.

Install everything and create the tables:

```bash
npm run install:all
npm run db:migrate
```

The database starts empty. Register an account in the app and build your library from there.

Start both processes:

```bash
npm run dev
```

- API: http://localhost:4000
- Client: http://localhost:5173

To reset everything, drop and recreate the database, then run the migration again.

## Deploying

The app runs as three pieces: a Postgres database, the API, and the static client.

**Database — Neon.** Create a project and copy the pooled connection string. The free plan is permanent and scales to zero when idle.

**API — Render.** Create a Web Service from this repository with root directory `server`, build command `npm install`, and start command `npm start` (which applies the schema before booting). Set these environment variables:

| Variable       | Value                                        |
| -------------- | -------------------------------------------- |
| `DATABASE_URL` | The Neon connection string                   |
| `JWT_SECRET`   | A long random string                         |
| `RAWG_API_KEY` | Your RAWG key                                |
| `CORS_ORIGINS` | `https://<username>.github.io`               |

Free web services sleep after fifteen minutes of inactivity, so the first request after a quiet spell takes about a minute. The sign-in screen says as much while it waits.

**Client — GitHub Pages.** Build with the API address baked in, then publish:

```bash
cd client
VITE_API_URL=https://<your-service>.onrender.com/api npm run build
npx gh-pages -d dist
```

On Windows, set the variable first with `set VITE_API_URL=...` and then run the build.

Point the repository's Pages setting at the `gh-pages` branch. Rebuild and republish whenever the client changes; the API redeploys itself on every push.

## How it was built

Each version added one layer, and the git history follows that order.

## Roadmap

- [x] v1 — HTML / CSS / JS / LocalStorage
- [x] v2 — React frontend (Vite)
- [x] v3 — Node.js + Express backend
- [x] v4 — PostgreSQL database
- [x] v5 — RAWG integration and cover art
- [x] v6 — JWT authentication and real accounts
- [x] v7 — Richer charts, responsive pass, loading states

## Tech stack

`React` · `Vite` · `Node.js` · `Express` · `PostgreSQL` · `JWT` · `RAWG API`

## Attribution

Game data and cover images come from [RAWG](https://rawg.io). Their free tier requires a visible link back, which sits in the app footer.
