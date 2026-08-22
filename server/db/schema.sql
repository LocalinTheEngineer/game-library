CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      TEXT NOT NULL UNIQUE,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Oyunun kendisi: ismi, türü, platformu herkes için aynı.
CREATE TABLE IF NOT EXISTS games (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  genre        TEXT NOT NULL,
  platform     TEXT NOT NULL,
  cover_image  TEXT,
  release_year INTEGER,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS games_name_unique ON games (lower(name));

-- Kullanıcının o oyunla ilişkisi: kaç saat oynadığı, kaç puan verdiği.
-- Aynı oyun farklı kullanıcılarda farklı satırlar olarak durur.
CREATE TABLE IF NOT EXISTS user_games (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  game_id      INTEGER NOT NULL REFERENCES games (id) ON DELETE CASCADE,
  status       TEXT NOT NULL CHECK (status IN ('playing', 'completed', 'backlog', 'dropped')),
  hours_played INTEGER NOT NULL DEFAULT 0 CHECK (hours_played >= 0),
  rating       SMALLINT NOT NULL DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
  notes        TEXT NOT NULL DEFAULT '',
  added_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, game_id)
);

CREATE INDEX IF NOT EXISTS user_games_user_idx ON user_games (user_id);
